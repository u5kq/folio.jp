const CACHE_PREFIX="folio-static-";
const CACHE_NAME=CACHE_PREFIX+"2026-11-26-responsive-ui1";
self.addEventListener("install",event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE_NAME);await cache.addAll(["./","./index.html","./projects.html","./project.html","./styles.css?v=20261126-ui1","./app.js?v=20261126-ui1","./folio-next-v2.js?v=20261126-ui1","./folio-next.css?v=20261126-ui1","./responsive.css?v=20261126-ui1","./folio.webmanifest","./play.html","./code-arena.html","./code-lab.html","./news.html"]);await self.skipWaiting()})())});
self.addEventListener("activate",event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE_NAME).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET")return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 if(req.mode==="navigate"){
  event.respondWith((async()=>{try{const fresh=await fetch(req,{cache:"no-cache"});const cache=await caches.open(CACHE_NAME);cache.put(req,fresh.clone());return fresh}catch(error){const cached=await caches.match(req);if(cached)return cached;return new Response("オフラインです。接続後に再読み込みしてください。",{status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}})}})());
  return;
 }
 if(["style","script"].includes(req.destination)){
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE_NAME);
   try{
    const fresh=await fetch(req,{cache:"no-cache"});
    if(fresh.ok)cache.put(req,fresh.clone());
    return fresh;
   }catch(error){
    const cached=await cache.match(req);
    if(cached)return cached;
    throw error;
   }
  })());
  return;
 }
 if(["image","font"].includes(req.destination)){
  event.respondWith((async()=>{const cache=await caches.open(CACHE_NAME);const cached=await cache.match(req);if(cached)return cached;const fresh=await fetch(req);if(fresh.ok)cache.put(req,fresh.clone());return fresh})());
 }
});
