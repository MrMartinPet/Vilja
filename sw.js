const CACHE = "viljas-laxa-cache-v11-democracy";
const ASSETS = ["./", "./index.html", "./manifest.json", "./demokrati.html", "./democracy-data.js", "./democracy.js", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", function(e){ e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })); self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); })); })); self.clients.claim(); });
self.addEventListener("fetch", function(e){
 if(e.request.mode === "navigate"){
  e.respondWith(fetch(e.request).then(function(r){ const copy = r.clone(); caches.open(CACHE).then(function(c){ c.put(e.request, copy); }); return r; }).catch(function(){ return caches.match(e.request).then(function(r){ return r || caches.match("./index.html"); }); })); return;
 }
 e.respondWith(caches.match(e.request).then(function(r){ return r || fetch(e.request); }));
});
