/* Service worker: makes the portfolio installable and usable offline.
   Own files: network first (you always see your latest edits), cache as backup.
   CDN scripts (React): cache first, so the page still works offline. */
const V = 'portfolio-v1';
const ASSETS = ['./', 'index.html', 'style.css', 'data.js', 'main.js', 'terminal.js', 'react-app.js', 'manifest.webmanifest', 'icon-192.png', 'photo.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const own = url.origin === location.origin, cdn = url.hostname === 'cdnjs.cloudflare.com';
  if (!own && !cdn) return;                       /* fonts, GitHub API and the contact form go straight to the network */
  const save = res => { if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(V).then(c => c.put(req, copy)); } return res; };
  if (cdn) { e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(save))); return; }
  e.respondWith(fetch(req).then(save).catch(() => caches.match(req).then(hit => hit || caches.match('index.html'))));
});
