importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({"apiKey": "AIzaSyDPg7UWyqOKYxP5qEelgqjcfTjXD3BXYQY", "authDomain": "fratello-c1765.firebaseapp.com", "projectId": "fratello-c1765", "storageBucket": "fratello-c1765.firebasestorage.app", "messagingSenderId": "897400694131", "appId": "1:897400694131:web:4262fca5934bcc56629106"});
const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const datos = payload?.data || {};
  const origen = String(
    datos.origen ||
    datos.tipoOrigen ||
    datos.tipo_pedido ||
    datos.tipoPedido ||
    ""
  ).toLowerCase().trim();

  const permitido = [
    "manual",
    "externo",
    "formulario_cliente",
    "pedido_manual",
    "pedido_externo"
  ].includes(origen);

  // Rechazar cualquier push sin origen válido, incluidos pedidos fijos.
  if (!permitido) return;

  const titulo = payload.notification?.title || "Fratello";
  const opciones = {
    body: payload.notification?.body || "Tenés un nuevo pedido.",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    tag: datos.tag || `fratello-pedido-${datos.pedidoId || Date.now()}`,
    renotify: false,
    data: datos
  };

  return self.registration.showNotification(titulo, opciones);
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const destino = event.notification?.data?.url || "./index.html?abrir=pedidos";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(ventanas => {
      for (const ventana of ventanas) {
        try {
          const urlActual = new URL(ventana.url);
          const urlDestino = new URL(destino, self.location.origin);

          if (urlActual.origin === urlDestino.origin) {
            return ventana.focus().then(() => {
              ventana.postMessage({
                type: "ABRIR_DESDE_NOTIFICACION",
                url: urlDestino.href,
                seccion: "seccionPedidos",
                fecha: urlDestino.searchParams.get("fecha"),
                pedidoId: urlDestino.searchParams.get("pedido")
              });
            });
          }
        } catch (_) {}
      }

      return clients.openWindow(destino);
    })
  );
});

const CACHE_NAME = "fratello-v393a3";
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

  if (!["http:", "https:"].includes(url.protocol)) return;
  if (url.origin !== self.location.origin) return;

  const archivoCritico =
    url.pathname.endsWith("/") ||
    url.pathname.endsWith("/index.html") ||
    url.pathname.endsWith("/app.js") ||
    url.pathname.endsWith("/service-worker.js") ||
    url.pathname.endsWith("/actualizar.html");

  if (archivoCritico) {
    event.respondWith(
      fetch(new Request(request, { cache: "no-store" }))
        .then(response => response)
        .catch(() => caches.match(request))
    );
    return;
  }

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
