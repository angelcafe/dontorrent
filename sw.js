const CACHE_NAME = 'dontorrent-v4';
const CDN_CACHE = 'dontorrent-cdn-v1';

const LOCAL_ASSETS = [
  './',
  './index.html',
  './front/app.js',
  './front/api-client.js',
  './front/icons/icon-192x192.png',
  './front/icons/icon-512x512.png',
  './manifest.json'
];

const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(LOCAL_ASSETS)),
      caches.open(CDN_CACHE).then(cache => cache.addAll(CDN_ASSETS))
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== CDN_CACHE)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== location.origin) {
    event.respondWith(
      caches.match(request).then(cached => 
        cached || fetch(request).then(response => {
          if (response?.status === 200) {
            caches.open(CDN_CACHE).then(cache => cache.put(request, response.clone()));
          }
          return response;
        }).catch(() => caches.match(request))
      )
    );
    return;
  }

  event.respondWith(
    fetch(request).then(response => {
      if (response?.status === 200) {
        caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
      }
      return response;
    }).catch(() => caches.match(request))
  );
});