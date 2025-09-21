const CACHE = "viljas-laxa-v6";
const ASSETS = [
  "./",
  "./index.html",
  "./words.html",
  "./words.json",
  "./manifest.json",
  "./sw.js",
  "./icon-192-v4.png",
  "./icon-512-v4.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
