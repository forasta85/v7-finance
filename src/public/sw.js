// Service Worker para V7 Finance
const CACHE_NAME = 'v7-finance-v1';
const ICON_CACHE_NAME = 'v7-finance-icons-v1';

// Recursos para cachear
const urlsToCache = [
  '/',
  '/manifest.json',
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== ICON_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Se for requisição de ícone PWA, servir do cache de ícones
  if (
    url.pathname.includes('icon-192.png') ||
    url.pathname.includes('icon-512.png') ||
    url.pathname.includes('apple-touch-icon.png') ||
    url.pathname.includes('favicon.png')
  ) {
    event.respondWith(
      caches.open(ICON_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // Se não estiver no cache ainda, buscar da rede
          return fetch(event.request).then((networkResponse) => {
            // Cachear para próxima vez
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Se falhar, retornar um ícone placeholder SVG
            return new Response(generatePlaceholderIcon(), {
              headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-cache',
              },
            });
          });
        });
      })
    );
    return;
  }

  // Para outras requisições, estratégia Network First
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta for válida, cachear
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Se falhar, tentar servir do cache
        return caches.match(event.request);
      })
  );
});

// Gerar ícone placeholder SVG caso os PNGs ainda não estejam prontos
function generatePlaceholderIcon() {
  return `
    <svg width="512" height="512" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="50%" stop-color="#dc2626" />
          <stop offset="100%" stop-color="#7f1d1d" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#grad)"/>
      <circle cx="50" cy="50" r="42" fill="none" stroke="white" stroke-width="0.5" opacity="0.2"/>
      <path d="M 28 30 L 50 70 L 72 30" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.95"/>
      <path d="M 38 35 L 62 35" stroke="white" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.95"/>
      <path d="M 58 35 L 46 55" stroke="white" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.95"/>
      <path d="M 50 72 L 50 78 M 47 75 L 50 78 L 53 75" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
      <circle cx="50" cy="50" r="46" fill="none" stroke="white" stroke-width="0.5" opacity="0.15"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/>
      <circle cx="50" cy="12" r="1.5" fill="white" opacity="0.5"/>
      <circle cx="88" cy="50" r="1.5" fill="white" opacity="0.5"/>
      <circle cx="12" cy="50" r="1.5" fill="white" opacity="0.5"/>
    </svg>
  `;
}
