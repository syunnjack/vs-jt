const CACHE = 'sugusuu-v1'
const CORE = ['/', '/index.html', '/manifest.webmanifest']
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE))))
self.addEventListener('fetch', (event) => event.respondWith(fetch(event.request).catch(() => caches.match(event.request))))
self.addEventListener('notificationclick', (event) => { event.notification.close(); event.waitUntil(clients.openWindow('/')) })
