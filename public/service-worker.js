const CACHE_NAME = "pwa-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/logo.png",
  "/google.png",
  "/iit-ropar-1.jpg",
  "/iit-ropar-2.jpg",
  "/iit-ropar-3.jpg",
  "/manifest.json"
];

// Install event - Cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Fetch event - Serve from cache when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If there's a cached response, return it
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, try to fetch from network
      return fetch(event.request)
        .then((response) => {
          // Cache the network response if it's successful
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // If the fetch fails (offline), return the cached fallback page
          return caches.match('/');
        });
    })
  );
});

// Activate event - Delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
