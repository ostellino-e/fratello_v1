const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {setGlobalOptions} = require("firebase-functions/v2");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {getMessaging} = require("firebase-admin/messaging");

initializeApp();

setGlobalOptions({
  region: "us-central1",
  maxInstances: 3,
  memory: "256MiB",
  timeoutSeconds: 60,
});

const db = getFirestore();

function idsPedidos(lista) {
  return new Set(
    (Array.isArray(lista) ? lista : [])
      .map((pedido) => String(pedido?.id ?? ""))
      .filter(Boolean)
  );
}

function pedidosAgregados(antes, despues) {
  const idsAnteriores = idsPedidos(antes);

  return (Array.isArray(despues) ? despues : []).filter((pedido) => {
    const id = String(pedido?.id ?? "");
    return id && !idsAnteriores.has(id);
  });
}

function resumenPedido(pedido) {
  const items = Array.isArray(pedido?.items)
    ? pedido.items.filter((item) => item?.estado !== "NO PEDIDO")
    : [];

  if (!items.length) {
    return "Pedido recibido sin productos detectados.";
  }

  const primerasLineas = items.slice(0, 3).map((item) => {
    const cantidad = Number(item?.cantidad || 0);
    const unidad = item?.unidad || "";
    const producto = item?.producto || "Producto";
    return `${cantidad} ${unidad} ${producto}`.trim();
  });

  const extra = items.length > 3 ? ` y ${items.length - 3} producto(s) más` : "";
  return primerasLineas.join(", ") + extra;
}

async function tokensActivos() {
  const snapshot = await db
    .collection("fratello_notificaciones")
    .where("activo", "==", true)
    .get();

  return snapshot.docs
    .map((doc) => ({
      ref: doc.ref,
      token: doc.data()?.token,
    }))
    .filter((item) => typeof item.token === "string" && item.token.length > 20);
}

async function enviarNotificacionPedido(pedido) {
  const dispositivos = await tokensActivos();

  if (!dispositivos.length) {
    console.log("No hay dispositivos activos para notificar.");
    return;
  }

  const cliente = String(pedido?.cliente || "Cliente");
  const fecha = String(pedido?.fecha || "");
  const cuerpo = resumenPedido(pedido);

  const message = {
    tokens: dispositivos.map((d) => d.token),
    data: {
      title: "📦 Nuevo pedido recibido",
      body: `${cliente}${fecha ? ` · ${fecha}` : ""}\n${cuerpo}`,
      url: "./index.html#pedidos",
      tag: `pedido-${String(pedido?.id || Date.now())}`,
      cliente,
      pedidoId: String(pedido?.id || ""),
    },
    webpush: {
      headers: {
        TTL: "86400",
        Urgency: "high",
      },
      fcmOptions: {
        link: "https://fratello-v1.vercel.app/#pedidos",
      },
    },
  };

  const respuesta = await getMessaging().sendEachForMulticast(message);

  console.log(
    `Notificación de ${cliente}: ${respuesta.successCount} enviada(s), ` +
      `${respuesta.failureCount} fallida(s).`
  );

  const borrados = [];

  respuesta.responses.forEach((resultado, index) => {
    if (resultado.success) return;

    const codigo = resultado.error?.code || "";

    if (
      codigo === "messaging/registration-token-not-registered" ||
      codigo === "messaging/invalid-registration-token"
    ) {
      borrados.push(
        dispositivos[index].ref.set(
          {
            activo: false,
            errorToken: codigo,
            desactivado: FieldValue.serverTimestamp(),
          },
          {merge: true}
        )
      );
    }
  });

  await Promise.all(borrados);
}

exports.notificarPedidoNuevo = onDocumentUpdated(
  {
    document: "fratello/estado",
    retry: false,
  },
  async (event) => {
    const antes = event.data?.before?.data() || {};
    const despues = event.data?.after?.data() || {};

    const nuevos = pedidosAgregados(antes.pedidos, despues.pedidos);

    if (!nuevos.length) {
      console.log("La actualización no agregó pedidos nuevos.");
      return;
    }

    // Enviar una notificación por cada pedido nuevo.
    for (const pedido of nuevos) {
      await enviarNotificacionPedido(pedido);
    }
  }
);
