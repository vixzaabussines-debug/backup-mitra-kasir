/* Service worker: membuat halaman kasir bisa dibuka tanpa internet.
   Ubah angka V kalau ingin memaksa semua perangkat memuat ulang file. */
const V = 'kasir-v1';
const CORE = ['index.html', 'firebase-config.js', 'manifest.json', 'icon-192.png', 'icon-512.png'];
const CDN = [
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(V);
    await Promise.allSettled(CORE.map(async u => {
      const res = await fetch(new Request(u, { cache: 'reload' }));
      if (res.ok) await c.put(new URL(u, self.registration.scope).href, res);
    }));
    await Promise.allSettled(CDN.map(async u => {
      const res = await fetch(u);
      if (res.ok) await c.put(u, res);
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const ks = await caches.keys();
    await Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const scope = new URL(self.registration.scope);
  const same = u.origin === location.origin;
  const isIdx = same && (u.pathname === scope.pathname || u.pathname.endsWith('/index.html'));
  const isAsset = same && /\/(firebase-config\.js|manifest\.json|icon-\d+\.png)$/.test(u.pathname);
  const isCdn = (u.hostname === 'www.gstatic.com' && u.pathname.startsWith('/firebasejs/')) ||
    u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';
  if (!(isIdx || isAsset || isCdn)) return; /* admin & Firebase API tidak disentuh */
  const key = isIdx ? new URL('index.html', scope).href : r.url;
  e.respondWith((async () => {
    const c = await caches.open(V);
    const hit = await c.match(key);
    const net = fetch(isIdx ? key : (isCdn ? r.url : r)).then(res => {
      if (res && res.ok) c.put(key, res.clone());
      return res;
    }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; } /* tampil cepat dari cache, diperbarui di belakang */
    const res = await net;
    return res || new Response('Offline dan belum tersimpan di perangkat.', { status: 503 });
  })());
});
