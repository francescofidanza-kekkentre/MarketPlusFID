// Service Worker for MarketPulse Pro - Zero-Cache, Ultra-Fast Mode
// Does NOT store any assets in CacheStorage: guarantees instant startup without stale cache files.

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          console.log('[SW Zero-Cache] Purging cache:', key);
          return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Direct network pass-through with browser cache bypass for local assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin === location.origin) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(() => fetch(event.request))
    );
    return;
  }
  event.respondWith(fetch(event.request));
});
