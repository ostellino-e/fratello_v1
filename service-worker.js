const CACHE_NAME="fratello-v071";
const ARCHIVOS=["./","./index.html","./pedido.html","./styles.css","./app.js","./manifest.json","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ARCHIVOS)))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE_NAME).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});
