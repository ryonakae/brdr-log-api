const CACHE_NAME = 'cache-v1'

self.addEventListener('install', event => {
  console.log('[Service Worker]', 'installed')
})

self.addEventListener('activate', event => {
  console.log('[Service Worker]', 'activated')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return cacheName.indexOf(CACHE_NAME) !== 0
          })
          .map(cacheName => {
            return caches.delete(cacheName).then(() => {
              console.log('[Service Worker]', 'cache deleted')
            })
          })
      )
    })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response
      }

      const fetchRequest = event.request.clone()
      return fetch(fetchRequest).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    })
  )
})
