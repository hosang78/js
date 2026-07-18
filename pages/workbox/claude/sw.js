importScripts('./workbox-core.prod.js');
importScripts('./workbox-cacheable-response.prod.js');
importScripts('./workbox-expiration.prod.js');
importScripts('./workbox-routing.prod.js');
importScripts('./workbox-strategies.prod.js');
importScripts('./workbox-precaching.prod.js');

workbox.core.setCacheNameDetails({ prefix: 'workbox-demo' });

self.addEventListener('install', () => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 설치 시점에 미리 캐시해둘 파일 목록 (precaching)
workbox.precaching.precacheAndRoute([
  { url: './precache-sample.txt', revision: '1' },
]);

// 런타임 캐싱: StaleWhileRevalidate — 캐시가 있으면 즉시 응답하고, 동시에 백그라운드로 최신 버전을 받아 캐시를 갱신
workbox.routing.registerRoute(
  ({ url }) => url.pathname.endsWith('/runtime-cached.json'),
  new workbox.strategies.StaleWhileRevalidate({ cacheName: 'workbox-demo-runtime' })
);
