const CACHE_NAME = "jr-shell-v1";
const OFFLINE_URLS = ["/", "/index.html", "/manifest.webmanifest", "/vite.svg"];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS)).then(() => self.skipWaiting()),
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(keys.map((key) => (key === CACHE_NAME ? null : caches.delete(key)))).then(() => self.clients.claim()),
		),
	);
});

self.addEventListener("fetch", (event) => {
	if (event.request.method !== "GET") return;
	event.respondWith(
		caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => caches.match("/index.html"))),
	);
});
