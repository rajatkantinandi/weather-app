importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  workbox.routing.registerRoute('/', new workbox.strategies.StaleWhileRevalidate());
  workbox.routing.registerRoute(new RegExp('/images/backgrounds/'), new workbox.strategies.StaleWhileRevalidate());
  workbox.routing.registerRoute(new RegExp('/favicon.png'), new workbox.strategies.StaleWhileRevalidate());
  workbox.routing.registerRoute(/\.(?:js|css|html)$/, new workbox.strategies.StaleWhileRevalidate());
  workbox.routing.registerRoute('/version.json', new workbox.strategies.NetworkFirst());
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
