const CACHE = 'recipex-v3'
const STATIC_CACHE = 'recipex-static-v2'
const API_CACHE = 'recipex-api-v1'

self.addEventListener('install', (e) => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE && k !== STATIC_CACHE && k !== API_CACHE).map(k => caches.delete(k))
    ))
  )
  clients.claim()
})

self.addEventListener('fetch', (e) => {
  const { method, destination, url } = e.request
  if (method !== 'GET') return

  const requestUrl = new URL(url)

  // API requests — NetworkFirst with long cache
  if (requestUrl.hostname === 'FaizBasha05.pythonanywhere.com') {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone()
        if (res.status === 200) {
          caches.open(API_CACHE).then(cache => cache.put(e.request, clone))
        }
        return res
      }).catch(() => caches.match(e.request))
    )
    return
  }

  // Navigation requests — NetworkFirst (fresh pages, cache fallback)
  if (destination === 'document' || e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone()
        if (res.status === 200) {
          caches.open(CACHE).then(cache => cache.put(e.request, clone))
        }
        return res
      }).catch(() => caches.match(e.request))
    )
    return
  }

  // Static assets — CacheFirst
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const clone = res.clone()
      if (res.status === 200) {
        caches.open(STATIC_CACHE).then(cache => cache.put(e.request, clone))
      }
      return res
    }))
  )
})
