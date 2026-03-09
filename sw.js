// Make Future Center — Service Worker v1
const CACHE = 'mf-v2';
const STATIC = [
  '/', '/login.html', '/student.html', '/course.html',
  '/payment.html', '/admin.html', '/change-password.html',
  '/styles.css', '/config.js', '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('supabase.co')) return; // don't cache API calls
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => {
        if (res.ok) { const c = res.clone(); caches.open(CACHE).then(cache => cache.put(e.request, c)); }
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
