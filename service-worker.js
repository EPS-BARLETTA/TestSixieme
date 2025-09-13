
const CACHE_NAME = 'testsixieme-v4-10';
const APP_SHELL = [
  'index.html','securite.html','identite.html','menu.html',
  'endu-saisie.html','saut-saisie.html','vitesse-saisie.html',
  'qr.html','prof-luc-leger.html','styles.css','manifest.webmanifest'
];
const CDN_QR = [
  'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js',
  'https://unpkg.com/qrcode-js-package@1.0.4/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)));
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
});

self.addEventListener('fetch', (e)=>{
  const url = e.request.url;
  if(CDN_QR.some(c=>url.startsWith(c))){
    e.respondWith(caches.open(CACHE_NAME).then(async cache=>{
      const m = await cache.match(e.request);
      if(m) return m;
      try{ const r = await fetch(e.request); cache.put(e.request, r.clone()); return r; }catch(err){ return m || Response.error(); }
    }));
    return;
  }
  e.respondWith(caches.match(e.request).then(res=> res || fetch(e.request)));
});
