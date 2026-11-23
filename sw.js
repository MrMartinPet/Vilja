const CACHE="vilja-portal-v36";
const ASSETS=[
 "./","./index.html","./viljas-appar.html","./engelska-skyltar.html","./begrepp.html",
 "./resa/","./resa/index.html","./resa/style.css","./resa/app.js","./resa/plan.json",
 "./klockan/","./klockan/index.html","./klockan/style.css","./klockan/time.js","./klockan/game.js",
 "./ponnyforsvaret/","./ponnyforsvaret/index.html","./ponnyforsvaret/game.css","./ponnyforsvaret/game.js",
 "./matteprov.html","./matteprov.css","./matteprov.js","./manifest.json",
 "./djur.html","./djur.css","./djur-data.js","./djur.js",
 "./mattespel.html","./mattespel.js",
 "./icon-192.png","./icon-512.png"
];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(path=>c.add(path).catch(()=>{})))));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
 const r=e.request;if(r.method!=="GET")return;
 const url=new URL(r.url);if(url.origin!==self.location.origin)return;
 const travelAsset=/\/resa\/(plan\.json|app\.js|style\.css)$/.test(url.pathname);
 if(r.mode==="navigate"||travelAsset){
  e.respondWith(fetch(r).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(r,copy)).catch(()=>{});}return response;})
   .catch(()=>caches.match(r).then(cached=>cached||caches.match("./index.html"))));
  return;
 }
 e.respondWith(caches.match(r).then(cached=>cached||fetch(r)));
});