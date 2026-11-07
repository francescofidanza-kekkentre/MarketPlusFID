// Service Worker for MarketPulse Pro - Zero-Cache, Ultra-Fast Mode
// Does NOT store any assets in CacheStorage: guarantees instant startup without stale cache files.

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', (event) => {
  // Activate immediately without pre-caching anything
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Purge ALL existing caches completely from the device
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

// Direct network pass-through: zero cache interception, zero cache writes
self.addEventListener('fetch', (event) => {
  // Direct native fetch without touching CacheStorage
  event.respondWith(fetch(event.request));
});
