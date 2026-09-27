/**
 * Service Worker mínimo — solo habilita "Agregar a pantalla de inicio" como
 * app instalable (requisito técnico de Chrome/Android).
 *
 * A propósito NO cachea absolutamente nada: cada solicitud va directo a la
 * red. Esto significa que la app instalada SIEMPRE muestra la última versión
 * publicada del sitio, sin riesgo de que alguien quede viendo contenido
 * desactualizado.
 */
self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  event.respondWith(fetch(event.request));
});
