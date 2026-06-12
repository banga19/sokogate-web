/* ==========================================================================
   Sokogate Web — Service Worker
   Provides offline caching for static assets and network-first for API calls
   ========================================================================== */

const CACHE_NAME = 'sokogate-v1';
const STATIC_CACHE = 'sokogate-static-v1';
const API_CACHE = 'sokogate-api-v1';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/offline.html',
];

// ---- Install: Pre-cache critical assets ----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
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
            return name.startsWith('sokogate-') && name !== STATIC_CACHE && name !== API_CACHE;
          })
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// ---- Fetch: Network-first for API, cache-first for static ----
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // API calls — network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithTimeout(request, API_CACHE, 5000));
    return;
  }

  // Static assets (JS, CSS, fonts, images) — cache first
  if (
    url.pathname.match(/\.(js|css|woff2?|ttf|png|jpg|jpeg|gif|svg|ico)$/) ||
    url.pathname.startsWith('/css/') ||
    url.pathname.startsWith('/js/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.startsWith('/img/')
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // HTML pages (including SPA) — network first
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithTimeout(request, STATIC_CACHE, 3000));
    return;
  }

  // Everything else — network first
  event.respondWith(networkFirst(request, STATIC_CACHE));
});

// ---- Cache Strategies ----

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return caches.match('/offline.html');
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
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
    return new Response('', { status: 408, statusText: 'Offline' });
  }
}

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
