const CACHE_NAME = 'wryter_v1';
const toCache = [
  "/",
  "/index.html",
  "/style.css",
  "/wryter.js",
  "/idb.js",
  "/favicon.ico"
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(toCache)
      })
      .then(self.skipWaiting())
  )
})

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.match(event.request)
          })
      })
  )
})

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key)
            return caches.delete(key)
          }
        }))
      })
      .then(() => self.clients.claim())
  )
})
// self.addEventListener('install', event => {
//   console.log("installing...");
//   event.waitUntil((async () => {
//     const cache = await caches.open(wryter);
//     await cache.addAll(assets);
//   })());
// });

// self.addEventListener('activate', event => {
//   return self.clients.claim();
// });

// self.addEventListener('fetch', event => {
//   console.log(event.request)
//   event.respondWith((async () => {
//       const cache = await caches.open(wryter);
//       const cachedResponse = await cache.match(event.request);
//       if (cachedResponse !== undefined) {
//           return cachedResponse;
//       } else {
//           return fetch(event.request)
//       }
//   }))
// })

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request).then(r => r || fetch(event.request))
//   );
// });