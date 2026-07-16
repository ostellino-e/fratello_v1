importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({"apiKey": "AIzaSyDPg7UWyqOKYxP5qEelgqjcfTjXD3BXYQY", "authDomain": "fratello-c1765.firebaseapp.com", "projectId": "fratello-c1765", "storageBucket": "fratello-c1765.firebasestorage.app", "messagingSenderId": "897400694131", "appId": "1:897400694131:web:4262fca5934bcc56629106"});
const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const titulo = payload.notification?.title || "Fratello";
  const opciones = {
    body: payload.notification?.body || "Tenés una nueva notificación.",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    tag: payload.data?.tag || "fratello-notificacion",
    data: payload.data || { url: "./index.html#notificaciones" }
  };

  self.registration.showNotification(titulo, opciones);
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const destino = event.notification.data?.url || "./index.html#notificaciones";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(lista => {
      for (const cliente of lista) {
        if ("focus" in cliente) {
          cliente.navigate(destino);
          return cliente.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(destino);
      }
    })
  );
});

const CACHE_NAME = "fratello-v081";
const ARCHIVOS = [
  "./",
  "./index.html",
  "./pedido.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ARCHIVOS)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  let url;
  try { url = new URL(request.url); } catch { return; }

  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        if (!response || !response.ok || response.type === "opaque") return response;
        const copia = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copia).catch(() => {}));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
