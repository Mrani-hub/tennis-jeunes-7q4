/* Service worker : l'appli s'ouvre même sans réseau ; la dernière version en ligne est toujours prioritaire */
const CACHE='frmt-champ-v3';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).catch(()=>{}));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('frmt-champ-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin!==location.origin)return;
  if(u.pathname.includes('/carnet'))return; /* géré par l'appli Carnet de match */
  e.respondWith(fetch(r).then(res=>{if(res.ok&&!u.searchParams.has('chk')){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}return res;})
    .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./index.html'))));});
/* notification d'un nouveau Live : ouvrir l'appli sur l'onglet Live */
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(L=>{
  for(const c of L){if('focus' in c){c.postMessage({tab:'live'});return c.focus();}}return self.clients.openWindow('./?tab=live');}));});
