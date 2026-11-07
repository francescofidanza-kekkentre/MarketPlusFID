// Service Worker for MarketPulse Pro (Desktop & Mobile Trading PWA)
const CACHE_NAME = 'marketpulse-cache-v21';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './style.css?v=21',
  './app.js',
  './app.js?v=21',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png'
];

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets v21');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Do not intercept external cross-origin API calls or local /api proxy calls in SW
  if (url.origin !== location.origin || url.pathname.startsWith('/api')) {
    return;
  }

  // Network-first strategy with cache bypass:
  // Using { cache: 'no-cache' } ensures the browser HTTP cache is bypassed and fresh assets are loaded
  let fetchReq = event.request;
  try {
    fetchReq = new Request(event.request, { cache: 'no-cache' });
  } catch (e) {
    fetchReq = event.request;
  }

  event.respondWith(
    fetch(fetchReq)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, resClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache only when offline / server unreachable
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return null;
        });
      })
  );
});
