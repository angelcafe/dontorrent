const CACHE_NAME = 'dontorrent-v1';
const CDN_CACHE = 'dontorrent-cdn-v1';

// Recursos locales críticos
const LOCAL_ASSETS = [
  './',
  './index.html',
  './front/app.js',
  './front/scraper.js',
  './front/icons/icon-192x192.png',
  './front/icons/icon-512x512.png',
  './manifest.json'
];

// Recursos de CDN a cachear
const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap'
];

// Instalar y cachear recursos
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Cachear recursos locales
      caches.open(CACHE_NAME).then(cache => cache.addAll(LOCAL_ASSETS)),
      // Cachear recursos de CDN
      caches.open(CDN_CACHE).then(cache => cache.addAll(CDN_ASSETS))
    ]).then(() => self.skipWaiting())
  );
});

// Limpiar cachés antiguas al activar
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== CDN_CACHE)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de caché: Cache First con Network Fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Para recursos de CDN: Cache First (offline primero)
  if (url.origin !== location.origin) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then(response => {
          // Solo cachear respuestas exitosas de CDN
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CDN_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      }).catch(() => {
        // Si falla, intentar servir desde caché
        return caches.match(request);
      })
    );
    return;
  }

  // Para recursos locales: Network First con Cache Fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        // Actualizar caché con la nueva versión
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, usar caché
        return caches.match(request);
      })
  );
});