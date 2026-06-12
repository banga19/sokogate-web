/* ==========================================================================
   Sokogate Web — Service Worker
   Provides offline caching for static assets, images, and API calls
   ========================================================================== */

const CACHE_VERSION = 'v2';
const CACHE_PREFIX = 'sokogate';

const CACHES = {
  static: `${CACHE_PREFIX}-static-${CACHE_VERSION}`,
  images: `${CACHE_PREFIX}-images-${CACHE_VERSION}`,
  api: `${CACHE_PREFIX}-api-${CACHE_VERSION}`,
};

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/offline.html',
];

// Image extensions to cache via cache-first strategy
const IMAGE_EXT_REGEX = /\.(png|jpg|jpeg|gif|svg|ico|webp|avif)$/;

// Static asset extensions
const STATIC_EXT_REGEX = /\.(js|css|woff2?|ttf|eot|otf)$/;

// ---- Install: Pre-cache critical assets ----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHES.static).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] Pre-cache failed for some URLs:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ---- Activate: Clean old caches ----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name.startsWith(CACHE_PREFIX) &&
              !Object.values(CACHES).includes(name)
            );
          })
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// ---- Fetch Strategy Router ----
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // API calls — network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithTimeout(request, CACHES.api, 5000));
    return;
  }

  // Images — cache first with stale-while-revalidate behavior
  if (IMAGE_EXT_REGEX.test(url.pathname) || url.pathname.startsWith('/img/')) {
    event.respondWith(cacheFirstWithRefresh(request, CACHES.images));
    return;
  }

  // Static assets (JS, CSS, fonts) — cache first
  if (
    STATIC_EXT_REGEX.test(url.pathname) ||
    url.pathname.startsWith('/css/') ||
    url.pathname.startsWith('/js/') ||
    url.pathname.startsWith('/fonts/')
  ) {
    event.respondWith(cacheFirst(request, CACHES.static));
    return;
  }

  // HTML pages (including SPA) — network first
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithTimeout(request, CACHES.static, 3000));
    return;
  }

  // Everything else — network first
  event.respondWith(cacheFirst(request, CACHES.static));
});

// ---- Cache Strategies ----

/**
 * Cache-first: return cached response if available, otherwise fetch and cache.
 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
      const cache = await caches.open(cacheName);
      // Don't block on cache put
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return caches.match('/offline.html');
  }
}

/**
 * Cache-first with background refresh (stale-while-revalidate).
 * Returns cached response immediately, then updates cache in background.
 * Good for images — user sees cached version instantly, and it updates silently.
 */
async function cacheFirstWithRefresh(request, cacheName) {
  const cached = await caches.match(request);
  
  // Fetch in background to update cache (don't await — fire and forget)
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok && response.type === 'basic') {
      caches.open(cacheName).then((cache) => {
        cache.put(request, response);
      });
    }
    return response;
  }).catch(() => {
    // Network failed, that's ok — we have cached version
  });

  // Return cached version immediately if available
  if (cached) {
    // Still trigger background refresh
    fetchPromise;
    return cached;
  }

  // No cache — wait for network
  try {
    const response = await fetchPromise;
    return response;
  } catch (err) {
    // Network failed and no cache
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    // For images, return a transparent placeholder
    return new Response('', { status: 204 });
  }
}

/**
 * Network first with timeout: try network, fall back to cache on failure/timeout.
 */
async function networkFirstWithTimeout(request, cacheName, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), timeoutMs)
  );

  try {
    const response = await Promise.race([fetch(request), timeoutPromise]);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;

    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    return new Response(JSON.stringify({ errcode: -1, errmsg: 'Offline' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
