/* Service worker du Carnet de match : s'ouvre même sans réseau, la version en ligne reste prioritaire */
const CACHE='frmt-carnet-v1';
const FILES=['./carnet.html','./carnet-manifest.json','./carnet-icon-192.png','./carnet-icon-512.png','./carnet-icon-maskable-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).catch(()=>{}));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('frmt-carnet-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(x=>x.put(r,cp));}return res;})
    .catch(()=>caches.match(r,{ignoreSearch:true}).then(x=>x||caches.match('./carnet.html'))));});
