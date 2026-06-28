const CACHE = 'nutrizen-v1'
const STATIC_CACHE = 'nutrizen-static-v1'
const API_CACHE = 'nutrizen-api-v1'

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
  const isApi = requestUrl.pathname.startsWith('/api/')

  // API requests — NetworkFirst with long cache
  if (isApi) {
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
