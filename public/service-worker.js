self.addEventListener('fetch', event => {
  console.log(event)
  event.respondWith(new Response('hello serviceWorker'))
})
