/**
 * Image Optimization Utilities
 * 
 * Handles OSS image URL processing for WebP, resizing, and lazy loading.
 * All images from oss.sokogate.com support server-side image processing
 * via URL parameters (x-oss-process).
 */

const OSS_REGEX = /^https?:\/\/oss\.sokogate\.com\//;
const FALLBACK_SVG =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0Ij5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';

/**
 * Check if a URL is hosted on the OSS server.
 * @param {string} url
 * @returns {boolean}
 */
export function isOSSImage(url) {
  if (!url || typeof url !== 'string') return false;
  return OSS_REGEX.test(url);
}

/** Cache for WebP support detection (checked once per session) */
let webpSupported = undefined;

/**
 * Detect whether the browser supports WebP image format.
 * Uses canvas toDataURL feature detection and caches the result.
 *
 * @returns {boolean}
 *
 * @example
 * supportsWebP()
 *   → true  (Chrome, Edge 18+, Firefox 65+, Safari 14+)
 *   → false (IE, old Safari, old Android browsers)
 */
export function supportsWebP() {
  if (webpSupported !== undefined) return webpSupported;
  if (typeof document === 'undefined') {
    webpSupported = false;
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    webpSupported = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    webpSupported = false;
  }
  return webpSupported;
}

/**
 * Append WebP format processing to an OSS image URL.
 * Uses OSS pipeline syntax to chain multiple image processing operations.
 *
 * @param {string} url - The original image URL
 * @returns {string} - URL with WebP processing appended (if OSS-hosted)
 *
 * @example
 * getWebPUrl('https://oss.sokogate.com/image/abc.jpg')
 *   → 'https://oss.sokogate.com/image/abc.jpg?x-oss-process=image/format,webp'
 *
 * getWebPUrl('https://oss.sokogate.com/image/abc.jpg?x-oss-process=style/w405h539')
 *   → 'https://oss.sokogate.com/image/abc.jpg?x-oss-process=style/w405h539'
 * (named styles cannot be combined with other operations)
 */
export function getWebPUrl(url) {
  if (!url || typeof url !== 'string') return url || '';
  if (!isOSSImage(url)) return url;

  try {
    const urlObj = new URL(url, 'https://oss.sokogate.com');
    const params = urlObj.searchParams;

    // If x-oss-process already exists, append WebP via pipeline
    if (params.has('x-oss-process')) {
      const existing = params.get('x-oss-process');
      // Avoid double-appending
      if (existing.includes('format,webp')) return url;
      // Named styles (style/...) cannot be combined with other operations
      // Return as-is to avoid breaking the URL
      if (existing.startsWith('style/')) return url;
      // Chain with '/' separator (OSS pipeline syntax)
      urlObj.searchParams.set('x-oss-process', `${existing}/image/format,webp`);
    } else {
      urlObj.searchParams.set('x-oss-process', 'image/format,webp');
    }
    return urlObj.toString();
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}

/**
 * Get optimized OSS image URL with optional resize and WebP.
 *
 * Uses separate x-oss-process query parameters for each operation
 * (resize, WebP) since chaining with '/' doesn't work with m_fixed
 * on this OSS bucket configuration.
 *
 * @param {string} url - Original image URL
 * @param {Object} [options]
 * @param {string|number} [options.width] - Resize width in px (OSS style prefix)
 * @param {string|number} [options.height] - Resize height in px
 * @param {boolean} [options.webp=true] - Whether to request WebP format
 * @returns {string} - Optimized URL
 *
 * @example
 * // Both resize and WebP
 * getOptimizedUrl('https://oss.sokogate.com/image/abc.jpg', { width: 200, height: 200 })
 *   → 'https://oss.sokogate.com/image/abc.jpg?x-oss-process=image/resize,m_fixed,w_200,h_200&x-oss-process=image/format,webp'
 *
 * // WebP only (no resize)
 * getOptimizedUrl('https://oss.sokogate.com/image/abc.jpg', { width: 0, height: 0 })
 *   → 'https://oss.sokogate.com/image/abc.jpg?x-oss-process=image/format,webp'
 */
export function getOptimizedUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return url || '';
  if (!isOSSImage(url)) return url;

  const { width, height, webp = true } = options;
  const hasResize = Boolean(width || height);

  if (!hasResize && !webp) return url;

  try {
    const urlObj = new URL(url, 'https://oss.sokogate.com');

    // Build query string manually — URLSearchParams encodes commas and slashes
    // which OSS requires as literal characters.
    const queryParts = [];

    if (hasResize) {
      const resize = ['image/resize'];
      if (width) resize.push(`w_${width}`);
      if (height) resize.push(`h_${height}`);
      resize.push('m_fixed');
      queryParts.push('x-oss-process=' + resize.join(','));
    }

    if (webp) {
      queryParts.push('x-oss-process=image/format,webp');
    }

    urlObj.search = queryParts.join('&');
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Generate a CSS aspect-ratio value and padding-bottom placeholder
 * to prevent Cumulative Layout Shift (CLS) for lazy-loaded images.
 *
 * @param {number} width - Image natural width
 * @param {number} height - Image natural height
 * @returns {Object} - { ratio: string, paddingBottom: string }
 *
 * @example
 * getAspectRatio(405, 539)
 *   → { ratio: '405/539', paddingBottom: '133.09%' }
 */
export function getAspectRatio(width, height) {
  if (!width || !height) return { ratio: '', paddingBottom: '' };
  const ratio = width / height;
  return {
    ratio: `${width}/${height}`,
    paddingBottom: `${(height / width) * 100}%`,
  };
}

/**
 * Create a blurred/low-quality image placeholder (LQIP) data URI.
 * This generates a tiny SVG used as a background while the real image loads.
 *
 * @param {string} color - Base background color (default '#f5f5f5')
 * @returns {string} - SVG data URI
 */
export function getPlaceholderSVG(color = '#f5f5f5') {
  const cleanColor = color.replace(/[^#\w]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="${cleanColor}"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export default {
  isOSSImage,
  supportsWebP,
  getWebPUrl,
  getOptimizedUrl,
  getAspectRatio,
  getPlaceholderSVG,
  FALLBACK_SVG,
};
