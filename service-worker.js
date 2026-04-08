const CACHE_NAME = "todo-app-v999";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png"
];

// INSTALL (cache files)
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// ACTIVATE (delete old caches)
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH (cache-first, then network)
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).then(networkRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, networkRes.clone());
          return networkRes;
        });
      });
    })
  );
});
