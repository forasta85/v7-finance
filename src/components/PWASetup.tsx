import { useEffect } from 'react';

export function PWASetup() {
  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registrado:', registration.scope);
          })
          .catch((error) => {
            console.error('❌ Erro ao registrar Service Worker:', error);
          });
      });
    }

    // Adicionar meta tags para PWA
    const addMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const addLinkTag = (rel: string, href: string, sizes?: string, type?: string) => {
      const selector = `link[rel="${rel}"]${sizes ? `[sizes="${sizes}"]` : ''}`;
      let link = document.querySelector(selector) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        if (sizes) link.setAttribute('sizes', sizes);
        if (type) link.setAttribute('type', type);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // Theme color
    addMetaTag('theme-color', '#dc2626');
    
    // Mobile web app
    addMetaTag('mobile-web-app-capable', 'yes');
    addMetaTag('apple-mobile-web-app-capable', 'yes');
    addMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    addMetaTag('apple-mobile-web-app-title', 'V7 Finance');
    
    // Application name
    addMetaTag('application-name', 'V7 Finance');

    // Apple Touch Icons - usando data URI com SVG convertido
    const appleIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="50%" stop-color="%23dc2626"/><stop offset="100%" stop-color="%237f1d1d"/></linearGradient></defs><rect width="100" height="100" fill="url(%23g)"/><circle cx="50" cy="50" r="48" fill="url(%23g)"/><path d="M28 30L50 70L72 30" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.95"/><path d="M38 35L62 35" stroke="white" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.95"/><path d="M58 35L46 55" stroke="white" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.95"/></svg>`;
    const appleIconDataURI = 'data:image/svg+xml,' + encodeURIComponent(appleIconSVG);
    
    addLinkTag('apple-touch-icon', appleIconDataURI);
    addLinkTag('apple-touch-icon', appleIconDataURI, '180x180');
    addLinkTag('apple-touch-icon-precomposed', appleIconDataURI);

    // Favicon - arquivos locais
    addLinkTag('icon', '/favicon.svg', undefined, 'image/svg+xml');
    addLinkTag('icon', '/icon-192.svg', '192x192', 'image/svg+xml');
    addLinkTag('shortcut icon', '/favicon.svg');

    // Manifest
    addLinkTag('manifest', '/manifest.json');

  }, []);

  return null;
}