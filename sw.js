// sw.js
const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/main.html',
  '/about.html',
  '/aboutweb.html',
  '/script.js',
  '/styles.css',
  '/styless.css',
  '/gradcap.jpg',
  '/graduationcap.jpeg',
  '/ExamVibe.ico',
  // Include other assets if needed
];

// Install event - caching files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serving files from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
