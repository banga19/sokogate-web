/**
 * Banner utility functions
 *
 * Shared logic for normalizing banner API responses across all banner components.
 * Handles the common task of extracting and normalizing banner data from the API
 * response format, including image_url → image field normalization.
 */

/**
 * Normalize a banner API response into a consistent array of banner objects.
 *
 * Handles:
 * - Response as a direct array:  { data: [...] }
 * - Response as { rows } object: { data: { rows: [...] } }
 * - Any falsy/missing data gracefully
 *
 * Each banner object gets an `image` field populated via:
 *   banner.image || banner.image_url || ''
 *
 * @param {Object} res - The API response object (with .data property)
 * @returns {Array} Normalized array of banner objects
 */
export function normalizeBannerList(res) {
  const rawData = res && res.data;
  const rawList = Array.isArray(rawData) ? rawData : (rawData && rawData.rows) || [];
  return rawList.map((banner) => ({
    ...banner,
    image: banner.image || banner.image_url || '',
  }));
}

/**
 * Get the store logo image URL, optionally resized for OSS.
 *
 * Returns an empty string when the store object or logo_url is missing,
 * so it can be used directly in v-if / computed properties.
 *
 * @param {Object|null|undefined} storeObj - Store object or item with a logo_url field
 * @param {number} [size=64] - Desired width in pixels (0 or null to skip resize)
 * @returns {string} Formatted logo URL, or empty string
 *
 * @example
 * getStoreLogoUrl({ logo_url: 'https://oss.example.com/logo.png' })
 *   → 'https://oss.example.com/logo.png?x-oss-process=style/w64'
 *
 * getStoreLogoUrl({ logo_url: 'https://oss.example.com/logo.png' }, 0)
 *   → 'https://oss.example.com/logo.png'
 *
 * getStoreLogoUrl(null)
 *   → ''
 */
export function getStoreLogoUrl(storeObj, size = 64) {
  const logoUrl = storeObj && storeObj.logo_url;
  if (!logoUrl) return '';
  return size ? `${logoUrl}?x-oss-process=style/w${size}` : logoUrl;
}
