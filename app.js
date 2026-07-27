
function nombreDiaProduccion(valor) {
  const nombres = {
    lunes_jueves: "Lunes a jueves",
    viernes: "Viernes",
    sabado: "Sábado",
    domingo: "Domingo"
  };
  return nombres[valor] || "Sin seleccionar";
}

function actualizarTarjetaDiaPedidos() {
  const selectorProduccion = $("diaProduccion");
  const selectorPedidos = $("diaProduccionPedidos");
  const selectorInicio = $("diaProduccionInicio");

  const checkProduccion = $("checkProduccionCompleta");
  const checkPedidos = $("checkDiaPedidos");
  const checkInicio = $("checkDiaInicio");

  const estadoPedidos = $("estadoDiaPedidos");
  const estadoInicio = $("estadoDiaInicio");

  const tarjetaPedidos = $("tarjetaDiaPedidos");
  const tarjetaInicio = $("tarjetaDiaInicio");

  if (!selectorProduccion || !checkProduccion) return;

  if (selectorPedidos) selectorPedidos.value = selectorProduccion.value;
  if (selectorInicio) selectorInicio.value = selectorProduccion.value;

  if (checkPedidos) checkPedidos.checked = checkProduccion.checked;
  if (checkInicio) checkInicio.checked = checkProduccion.checked;

  const textoEstado = checkProduccion.checked
    ? "Producción confirmada"
    : "Producción seleccionada";

  if (estadoPedidos) estadoPedidos.textContent = textoEstado;
  if (estadoInicio) estadoInicio.textContent = textoEstado;

  [tarjetaPedidos, tarjetaInicio].forEach(tarjeta => {
    if (!tarjeta) return;
    tarjeta.classList.toggle("confirmada", checkProduccion.checked);
    tarjeta.classList.toggle("pendiente", !checkProduccion.checked);
  });
}

function sincronizarDiaDesdeProduccion() {
  const selectorProduccion = $("diaProduccion");
  const selectorPedidos = $("diaProduccionPedidos");
  const checkProduccion = $("checkProduccionCompleta");
  const checkPedidos = $("checkDiaPedidos");

  if (!selectorProduccion || !selectorPedidos) return;

  selectorPedidos.value = selectorProduccion.value;

  // Si cambia el día, se destilda la confirmación para obligar a revisar.
  if (checkProduccion) checkProduccion.checked = false;
  if (checkPedidos) checkPedidos.checked = false;

  actualizarTarjetaDiaPedidos();
}

function sincronizarDiaDesdePedidos() {
  const selectorProduccion = $("diaProduccion");
  const selectorPedidos = $("diaProduccionPedidos");
  const checkProduccion = $("checkProduccionCompleta");
  const checkPedidos = $("checkDiaPedidos");

  if (!selectorProduccion || !selectorPedidos) return;

  selectorProduccion.value = selectorPedidos.value;

  // Dispara la lógica existente del cuadro 1: recarga producción y diferencias.
  selectorProduccion.dispatchEvent(new Event("change", { bubbles: true }));

  if (checkProduccion) checkProduccion.checked = false;
  if (checkPedidos) checkPedidos.checked = false;

  actualizarTarjetaDiaPedidos();
}

function iniciarSincronizacionDia() {
  const selectorProduccion = $("diaProduccion");
  const selectorPedidos = $("diaProduccionPedidos");
  const selectorInicio = $("diaProduccionInicio");

  const checkProduccion = $("checkProduccionCompleta");
  const checkPedidos = $("checkDiaPedidos");
  const checkInicio = $("checkDiaInicio");

  function cambiarDiaDesde(valor) {
    if (!selectorProduccion) return;

    selectorProduccion.value = valor;
    if (selectorPedidos) selectorPedidos.value = valor;
    if (selectorInicio) selectorInicio.value = valor;

    if (checkProduccion) checkProduccion.checked = false;
    if (checkPedidos) checkPedidos.checked = false;
    if (checkInicio) checkInicio.checked = false;

    selectorProduccion.dispatchEvent(new Event("change", { bubbles: true }));
    actualizarTarjetaDiaPedidos();
  }

  if (selectorProduccion) {
    selectorProduccion.addEventListener("change", () => {
      if (selectorPedidos) selectorPedidos.value = selectorProduccion.value;
      if (selectorInicio) selectorInicio.value = selectorProduccion.value;

      if (checkProduccion) checkProduccion.checked = false;
      if (checkPedidos) checkPedidos.checked = false;
      if (checkInicio) checkInicio.checked = false;

      actualizarTarjetaDiaPedidos();
    });
  }

  if (selectorPedidos) {
    selectorPedidos.addEventListener("change", () => cambiarDiaDesde(selectorPedidos.value));
  }

  if (selectorInicio) {
    selectorInicio.addEventListener("change", () => cambiarDiaDesde(selectorInicio.value));
  }

  function sincronizarChecks(origen) {
    const valor = origen?.checked || false;
    if (checkProduccion) checkProduccion.checked = valor;
    if (checkPedidos) checkPedidos.checked = valor;
    if (checkInicio) checkInicio.checked = valor;
    actualizarTarjetaDiaPedidos();
  }

  if (checkProduccion) checkProduccion.addEventListener("change", () => sincronizarChecks(checkProduccion));
  if (checkPedidos) checkPedidos.addEventListener("change", () => sincronizarChecks(checkPedidos));
  if (checkInicio) checkInicio.addEventListener("change", () => sincronizarChecks(checkInicio));

  actualizarTarjetaDiaPedidos();
}


function clientesConRecordatorioActivo() {
  return clientes.filter(nombre => {
    const datos = datosClientesCompletos[nombre];
    return datos && datos.enviarRecordatorio;
  });
}

function clientesQueYaPidieron() {
  return new Set(
    pedidos
      .filter(p => p && p.cliente)
      .map(p => normalizar(p.cliente))
  );
}

function obtenerClientesPendientes() {
  const enviados = clientesQueYaPidieron();

  return clientesConRecordatorioActivo().filter(nombre => {
    return !enviados.has(normalizar(nombre));
  });
}

function renderClientesPendientes() {
  const cont = $("listaClientesPendientes");
  const contador = $("contadorClientesPendientes");
  if (!cont || !contador) return;

  const pendientes = obtenerClientesPendientes();
  contador.textContent = `${pendientes.length} pendiente${pendientes.length === 1 ? "" : "s"}`;

  if (!pendientes.length) {
    cont.innerHTML = '<p class="pendingOk">✅ Todos los clientes con recordatorio ya enviaron pedido.</p>';
    actualizarEstadoColaRecordatorios();
    return;
  }

  cont.innerHTML = pendientes.map(nombre => {
    const datos = datosClientesCompletos[nombre] || {};
    const telefono = datos.telefono || "Sin teléfono";
    const seguro = nombre.replace(/'/g, "\\'");

    return `<div class="pendingClientRow">
      <label class="pendingClientSelect">
        <input type="checkbox" class="checkRecordatorioPendiente" value="${nombre}" checked>
        <span>
          <strong>${nombre}</strong>
          <small>📞 ${telefono}</small>
        </span>
      </label>
      <button type="button" onclick="recordarClientePendiente('${seguro}')">Recordar</button>
    </div>`;
  }).join("");

  actualizarEstadoColaRecordatorios();
}

function linkFormularioPedido() {
  const base = window.location.origin + window.location.pathname.replace("index.html", "");
  return base + "pedido.html";
}

function telefonoWhatsAppCliente(nombre) {
  const datos = datosClientesCompletos[nombre] || {};
  const telefono = normalizarTelefonoCliente(datos.telefono || "");

  if (!telefono) return "";
  if (telefono.startsWith("549")) return telefono;
  if (telefono.startsWith("54")) return "549" + telefono.slice(2);
  return "549" + telefono;
}

function mensajeRecordatorioCliente(nombre) {
  return `Hola ${nombre}! Te recordamos cargar tu pedido para la próxima entrega:

${linkFormularioPedido()}

Gracias, Fratello.`;
}

function recordarClientePendiente(nombre) {
  const telefono = telefonoWhatsAppCliente(nombre);

  if (!telefono) {
    alert(`El cliente ${nombre} no tiene teléfono cargado.`);
    return;
  }

  abrirWhatsApp(telefono, mensajeRecordatorioCliente(nombre));
}

function leerColaRecordatorios() {
  try {
    return JSON.parse(localStorage.getItem("fratello_cola_recordatorios") || "[]");
  } catch {
    return [];
  }
}

function guardarColaRecordatorios(cola) {
  localStorage.setItem("fratello_cola_recordatorios", JSON.stringify(cola || []));
  actualizarEstadoColaRecordatorios();
}

function actualizarEstadoColaRecordatorios() {
  const estado = $("estadoColaRecordatorios");
  const boton = $("btnRecordarPendientes");
  if (!estado || !boton) return;

  const cola = leerColaRecordatorios();

  if (!cola.length) {
    estado.classList.add("hidden");
    estado.textContent = "";
    boton.textContent = "📲 Enviar recordatorios seleccionados";
    return;
  }

  estado.classList.remove("hidden");
  estado.textContent = `Quedan ${cola.length} cliente${cola.length === 1 ? "" : "s"} por contactar.`;
  boton.textContent = `📲 Enviar siguiente (${cola.length})`;
}

function enviarSiguienteRecordatorioPendiente() {
  const cola = leerColaRecordatorios();

  if (!cola.length) {
    alert("No quedan recordatorios pendientes en la cola.");
    actualizarEstadoColaRecordatorios();
    return;
  }

  const siguiente = cola.shift();
  guardarColaRecordatorios(cola);

  abrirWhatsApp(
    siguiente.telefono,
    mensajeRecordatorioCliente(siguiente.nombre)
  );
}

function recordarTodosLosPendientes() {
  const colaExistente = leerColaRecordatorios();

  if (colaExistente.length) {
    enviarSiguienteRecordatorioPendiente();
    return;
  }

  const seleccionados = Array.from(
    document.querySelectorAll(".checkRecordatorioPendiente:checked")
  ).map(check => check.value);

  const nombres = seleccionados.length
    ? seleccionados
    : obtenerClientesPendientes();

  if (!nombres.length) {
    alert("No hay clientes pendientes seleccionados.");
    return;
  }

  const sinTelefono = [];
  const cola = [];

  nombres.forEach(nombre => {
    const telefono = telefonoWhatsAppCliente(nombre);
    if (!telefono) {
      sinTelefono.push(nombre);
      return;
    }
    cola.push({ nombre, telefono });
  });

  if (sinTelefono.length) {
    alert(
      "Estos clientes no tienen teléfono cargado y no se incluirán:\n\n" +
      sinTelefono.join("\n")
    );
  }

  if (!cola.length) return;

  guardarColaRecordatorios(cola);
  enviarSiguienteRecordatorioPendiente();
}


function continuarAlResumenSiEstaConfirmado() {
  const checkPedidos = $("checkPedidoCompleto");

  if (!pedidos.length) {
    alert("Todavía no hay pedidos cargados.");
    return;
  }

  const ambiguosUnidad = pedidosConUnidadAmbigua();
  const ambiguosProducto = pedidosConProductoAmbiguo();
  const totalAmbiguos = ambiguosUnidad.length + ambiguosProducto.length;
  if (totalAmbiguos) {
    alert(`Hay ${totalAmbiguos} revisión(es) pendiente(s) de producto o unidad. Revisalas antes de continuar.`);
    abrirSeccionFratello("seccionPedidos");
    return;
  }

  if (!checkPedidos || !checkPedidos.checked) {
    alert("Primero tildá que todos los pedidos cargados están correctos.");
    return;
  }

  abrirSeccionFratello("seccionResumen");
}


function normalizarTelefonoCliente(telefono) {
  return String(telefono || "").replace(/\D/g, "");
}

function limpiarFormularioClienteCompleto() {
  const nombre = $("nuevoClienteNombre");
  const telefono = $("nuevoClienteTelefono");
  const direccion = $("nuevoClienteDireccion");
  const barrio = $("nuevoClienteBarrio");
  const listaPrecio = $("nuevoClienteListaPrecio");
  const recordatorio = $("nuevoClienteRecordatorio");
  const boton = $("btnGuardarClienteCompleto");

  if (nombre) {
    nombre.value = "";
    delete nombre.dataset.editando;
  }
  if (telefono) telefono.value = "";
  if (direccion) direccion.value = "";
  if (barrio) barrio.value = "";
  if (listaPrecio) renderSelectorListasCliente("auto");
  if (recordatorio) recordatorio.checked = false;
  if (boton) boton.textContent = "➕ Agregar cliente";
}

function mostrarMensajeClienteCompleto(texto, error = false) {
  const el = $("mensajeClienteCompleto");
  if (!el) return;

  el.textContent = texto;
  el.style.display = "block";
  el.style.background = error ? "#ffe1de" : "#eaf7eb";
  el.style.color = error ? "#9b1c1c" : "#1f7a35";
}

function guardarClienteCompleto() {
  try {
    const nombreInput = $("nuevoClienteNombre");
    const telefonoInput = $("nuevoClienteTelefono");
    const direccionInput = $("nuevoClienteDireccion");
    const barrioInput = $("nuevoClienteBarrio");
    const listaPrecioInput = $("nuevoClienteListaPrecio");
    const recordatorioInput = $("nuevoClienteRecordatorio");

    if (!nombreInput) {
      alert("No se encontró el formulario de clientes.");
      return;
    }

    const nombre = nombreInput.value.trim();
    const telefono = normalizarTelefonoCliente(telefonoInput?.value || "");
    const direccion = direccionInput?.value.trim() || "";
    const barrio = barrioInput?.value.trim() || "";
    const listaPrecio = listaPrecioInput?.value || "auto";
    const enviarRecordatorio = Boolean(recordatorioInput?.checked);
    const nombreAnterior = nombreInput.dataset.editando || "";

    if (!nombre) {
      mostrarMensajeClienteCompleto("Escribí el nombre del cliente.", true);
      return;
    }

    if (!Array.isArray(clientes)) clientes = [];
    if (!datosClientesCompletos || typeof datosClientesCompletos !== "object") {
      datosClientesCompletos = {};
    }

    const duplicado = clientes.find(c =>
      normalizar(c) === normalizar(nombre) &&
      normalizar(c) !== normalizar(nombreAnterior)
    );

    if (duplicado) {
      mostrarMensajeClienteCompleto("Ya existe un cliente con ese nombre.", true);
      return;
    }

    if (nombreAnterior && nombreAnterior !== nombre) {
      clientes = clientes.map(c => c === nombreAnterior ? nombre : c);
      delete datosClientesCompletos[nombreAnterior];

      pedidos.forEach(p => {
        if (p.cliente === nombreAnterior) p.cliente = nombre;
        if (Array.isArray(p.items)) {
          p.items.forEach(i => {
            if (i.cliente === nombreAnterior) i.cliente = nombre;
          });
        }
      });
    } else if (!clientes.some(c => normalizar(c) === normalizar(nombre))) {
      clientes.push(nombre);
    }

    datosClientesCompletos[nombre] = {
      nombre, telefono, direccion, barrio, listaPrecio, enviarRecordatorio,
      actualizado: new Date().toISOString()
    };

    guardarTodo();
    renderClientes(nombre);
    renderListaClientesCompleta();
    if (typeof renderClientesPendientes === "function") renderClientesPendientes();

    limpiarFormularioClienteCompleto();
    mostrarMensajeClienteCompleto("Cliente guardado correctamente.");
  } catch (error) {
    console.error("Error al guardar cliente:", error);
    alert("No se pudo guardar el cliente.");
  }
}

function editarClienteCompleto(nombre) {
  const datos = datosClientesCompletos[nombre] || {
    nombre,
    telefono: "",
    direccion: "",
    barrio: "",
    listaPrecio: "auto",
    enviarRecordatorio: false
  };

  const nombreInput = $("nuevoClienteNombre");
  if (nombreInput) {
    nombreInput.value = datos.nombre || nombre;
    nombreInput.dataset.editando = nombre;
  }

  if ($("nuevoClienteTelefono")) $("nuevoClienteTelefono").value = datos.telefono || "";
  if ($("nuevoClienteDireccion")) $("nuevoClienteDireccion").value = datos.direccion || "";
  if ($("nuevoClienteBarrio")) $("nuevoClienteBarrio").value = datos.barrio || "";
  renderSelectorListasCliente(datos.listaPrecio || "auto");
  if ($("nuevoClienteRecordatorio")) $("nuevoClienteRecordatorio").checked = Boolean(datos.enviarRecordatorio);
  if ($("btnGuardarClienteCompleto")) $("btnGuardarClienteCompleto").textContent = "💾 Guardar cambios";

  abrirSeccionFratello("seccionClientes");
}

function eliminarClienteCompleto(nombre) {
  if (!confirm(`¿Seguro que querés eliminar a ${nombre}?`)) return;

  clientes = clientes.filter(c => c !== nombre);
  delete datosClientesCompletos[nombre];

  guardarTodo();
  renderClientes();
  actualizarPanelMemoriaEnvio();
  renderListaClientesCompleta();
  if (typeof renderClientesPendientes === "function") renderClientesPendientes();
  abrirSeccionFratello("seccionClientes");
}

function renderListaClientesCompleta() {
  const cont = $("listaClientesCompleta");
  if (!cont) return;

  if (!clientes.length) {
    cont.innerHTML = "<p>No hay clientes cargados.</p>";
    return;
  }

  cont.innerHTML = clientes.map(nombre => {
    const datos = datosClientesCompletos[nombre] || {};
    const tel = datos.telefono || "Sin teléfono";
    const dir = datos.direccion || "Sin dirección";
    const rec = datos.enviarRecordatorio ? "🔔 Recordatorio activado" : "🔕 Sin recordatorio";
    const seguro = nombre.replace(/'/g, "\\'");

    return `<div class="clienteCompletoCard">
      <div>
        <strong>${nombre}</strong>
        <span>📞 ${tel}</span>
        <span>📍 ${dir}</span>
        <small>${rec}</small>
      </div>
      <div class="clienteCompletoActions">
        <button type="button" onclick="editarClienteCompleto('${seguro}')">✏️ Editar</button>
        <button type="button" onclick="configurarPedidoFijoCliente('${seguro}')">🔁 Pedido fijo</button>
        <button type="button" class="dangerBtn" onclick="eliminarClienteCompleto('${seguro}')">🗑️ Eliminar</button>
      </div>
    </div>`;
  }).join("");
}


function configurarPedidoFijoCliente(nombre) {
  abrirSeccionFratello("seccionClientes");
  renderSelectorClientesPedidoFijo();
  const selector = $("pedidoFijoCliente");
  if (selector) selector.value = nombre;
  const bloque = $("pedidosFijosClientes");
  if (bloque) {
    bloque.open = true;
    setTimeout(() => bloque.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }
  if ($("pedidoFijoTexto")) $("pedidoFijoTexto").focus();
}

function mostrarInicioFratello() {
  const inicio = document.getElementById("panelInicio");
  const contenido = document.getElementById("contenidoApp");

  document.querySelectorAll(".appSection").forEach(seccion => {
    seccion.classList.remove("seccionActiva");
  });

  if (inicio) inicio.classList.remove("hidden");
  if (contenido) contenido.classList.remove("contenidoVisible");
  window.scrollTo({ top: 0, behavior: "smooth" });
}


let notificacionesHistorial = [];
let unsubscribeHistorialNotificaciones = null;
let ultimaNotificacionVista =
  localStorage.getItem("fratello_ultima_notificacion_vista") || "";

function fechaNotificacionISO(notificacion) {
  const valor = notificacion?.fechaISO || notificacion?.creadoEn || "";
  if (valor && typeof valor.toDate === "function") {
    return valor.toDate().toISOString();
  }

  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? "" : fecha.toISOString();
}

function mostrarFechaNotificacion(notificacion) {
  const iso = fechaNotificacionISO(notificacion);
  if (!iso) return "";

  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function cantidadNotificacionesNoLeidas() {
  return notificacionesHistorial.filter(notificacion => {
    const fecha = fechaNotificacionISO(notificacion);
    return fecha && (!ultimaNotificacionVista || fecha > ultimaNotificacionVista);
  }).length;
}

function actualizarCampanaNotificaciones() {
  const badge = $("badgeNotificaciones");
  const resumen = $("resumenNotificacionesInicio");
  const cantidad = cantidadNotificacionesNoLeidas();

  if (badge) {
    badge.textContent = String(cantidad);
    badge.classList.toggle("hidden", cantidad === 0);
  }

  if (resumen) {
    if (cantidad > 0) {
      resumen.textContent =
        `${cantidad} aviso${cantidad === 1 ? "" : "s"} sin leer`;
    } else if (notificacionesHistorial.length > 0) {
      resumen.textContent = "No hay avisos nuevos";
    } else {
      resumen.textContent = "Todavía no hay notificaciones";
    }
  }
}

function renderHistorialNotificaciones() {
  const lista = $("listaNotificaciones");
  const estado = $("estadoListaNotificaciones");
  if (!lista || !estado) return;

  if (!notificacionesHistorial.length) {
    estado.textContent = "Todavía no hay notificaciones guardadas.";
    lista.innerHTML = "";
    actualizarCampanaNotificaciones();
    return;
  }

  estado.textContent =
    `${notificacionesHistorial.length} notificación${
      notificacionesHistorial.length === 1 ? "" : "es"
    }`;

  lista.innerHTML = notificacionesHistorial.map(notificacion => {
    const titulo = notificacion.titulo || "Notificación de Fratello";
    const mensaje = notificacion.mensaje || notificacion.cuerpo || "";
    const cliente = notificacion.cliente || "";
    const fecha = mostrarFechaNotificacion(notificacion);

    return `<article class="notificationHistoryCard">
      <div class="notificationHistoryIcon">📦</div>
      <div class="notificationHistoryContent">
        <div class="notificationHistoryHeader">
          <strong>${titulo}</strong>
          <time>${fecha}</time>
        </div>
        ${cliente ? `<span class="notificationClient">${cliente}</span>` : ""}
        <p>${mensaje}</p>
      </div>
    </article>`;
  }).join("");

  actualizarCampanaNotificaciones();
}


async function borrarTodasLasNotificaciones() {
  if (!db) {
    alert("Firebase no está conectado.");
    return;
  }

  if (!confirm("¿Seguro que querés borrar todo el historial de notificaciones?")) {
    return;
  }

  const boton = $("btnBorrarNotificaciones");
  if (boton) {
    boton.disabled = true;
    boton.textContent = "Borrando...";
  }

  try {
    const snapshot = await db
      .collection("fratello_historial_notificaciones")
      .limit(200)
      .get();

    if (snapshot.empty) {
      alert("No hay notificaciones para borrar.");
      return;
    }

    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    notificacionesHistorial = [];
    ultimaNotificacionVista = new Date().toISOString();
    localStorage.setItem(
      "fratello_ultima_notificacion_vista",
      ultimaNotificacionVista
    );

    renderHistorialNotificaciones();
    actualizarCampanaNotificaciones();
    alert("Notificaciones borradas correctamente.");
  } catch (error) {
    console.error("Error borrando notificaciones:", error);
    alert("No se pudieron borrar las notificaciones.");
  } finally {
    if (boton) {
      boton.disabled = false;
      boton.textContent = "🗑 Borrar notificaciones";
    }
  }
}

async function cargarHistorialNotificaciones() {
  const estado = $("estadoListaNotificaciones");

  if (!db) {
    if (estado) estado.textContent = "Firebase no está conectado.";
    return;
  }

  if (estado) estado.textContent = "Actualizando notificaciones...";

  try {
    const snapshot = await db
      .collection("fratello_historial_notificaciones")
      .orderBy("fechaISO", "desc")
      .limit(50)
      .get();

    notificacionesHistorial = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderHistorialNotificaciones();
  } catch (error) {
    console.error("Error cargando historial:", error);
    if (estado) {
      estado.textContent = "No se pudieron cargar las notificaciones.";
    }
  }
}

function escucharHistorialNotificaciones() {
  if (!db || unsubscribeHistorialNotificaciones) return;

  unsubscribeHistorialNotificaciones = db
    .collection("fratello_historial_notificaciones")
    .orderBy("fechaISO", "desc")
    .limit(50)
    .onSnapshot(snapshot => {
      notificacionesHistorial = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      renderHistorialNotificaciones();
    }, error => {
      console.error("Error escuchando historial:", error);
    });
}

function marcarNotificacionesComoVistas() {
  ultimaNotificacionVista = new Date().toISOString();
  localStorage.setItem(
    "fratello_ultima_notificacion_vista",
    ultimaNotificacionVista
  );
  actualizarCampanaNotificaciones();
}

function abrirSeccionFratello(idSeccion) {
  const inicio = document.getElementById("panelInicio");
  const contenido = document.getElementById("contenidoApp");
  const destino = document.getElementById(idSeccion);

  if (inicio) inicio.classList.add("hidden");
  if (contenido) contenido.classList.add("contenidoVisible");

  document.querySelectorAll(".appSection").forEach(seccion => {
    seccion.classList.toggle("seccionActiva", seccion === destino);
  });

  if (idSeccion === "seccionNotificaciones") {
    cargarHistorialNotificaciones();
    marcarNotificacionesComoVistas();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function iniciarNavegacionFratello() {
  document.querySelectorAll("[data-seccion]").forEach(boton => {
    boton.addEventListener("click", () => abrirSeccionFratello(boton.dataset.seccion));
  });

  document.querySelectorAll(".volverInicio").forEach(boton => {
    boton.addEventListener("click", mostrarInicioFratello);
  });

  const btnInicio = document.getElementById("btnInicio");
  if (btnInicio) btnInicio.addEventListener("click", mostrarInicioFratello);

  const btnBorrarRapido = document.getElementById("btnBorrarRapido");
  if (btnBorrarRapido) {
    btnBorrarRapido.addEventListener("click", () => {
      const btnReset = document.getElementById("btnReset");
      if (btnReset) btnReset.click();
    });
  }

  mostrarInicioFratello();
}

let eventoInstalacion = null;
window.addEventListener("beforeinstallprompt", (evento) => {
  evento.preventDefault();
  eventoInstalacion = evento;
  const boton = document.getElementById("btnInstalarApp");
  if (boton) boton.classList.remove("hidden");
});
async function instalarFratello() {
  if (!eventoInstalacion) {
    alert("En iPhone usá Compartir y elegí Agregar a pantalla de inicio.");
    return;
  }
  eventoInstalacion.prompt();
  await eventoInstalacion.userChoice;
  eventoInstalacion = null;
  const boton = document.getElementById("btnInstalarApp");
  if (boton) boton.classList.add("hidden");
}

const productos = [
  { id: "CHIC", nombre: "Chicharrón", unidad: "unidad", visible: true, activo: true, nuevo: false },
  { id: "TREN", nombre: "Trenzas", unidad: "unidad", visible: true, activo: true, nuevo: false },
  { id: "RASP", nombre: "Raspaditas", unidad: "unidad", visible: true, activo: true, nuevo: false },
  { id: "CORD_S", nombre: "Corderos salados", unidad: "unidad", visible: true, activo: true, nuevo: false },
  { id: "CORD_D", nombre: "Corderos dulces", unidad: "unidad", visible: true, activo: true, nuevo: false },
  { id: "RASQ_G", nombre: "Rasquetas grasas", unidad: "unidad", visible: true, activo: true, nuevo: false },
  { id: "RASQ_M", nombre: "Rasquetas manteca", unidad: "unidad", visible: true, activo: true, nuevo: false },
  { id: "BIZ_H", nombre: "Bizcocho hojaldre", unidad: "kg", visible: true, activo: true, nuevo: false },
  { id: "LIB_MEM", nombre: "Librito membrillo", unidad: "kg", visible: true, activo: true, nuevo: false },
  { id: "BIZ_G", nombre: "Bizcochos de grasa", unidad: "kg", visible: true, activo: true, nuevo: false },
  { id: "FAC_SUR", nombre: "Facturas surtidas", unidad: "docena", visible: true, activo: true, nuevo: false },
  { id: "MED", nombre: "Medialunas", unidad: "docena", visible: true, activo: true, nuevo: false },
  { id: "PAN", nombre: "Pan", unidad: "kg", visible: true, activo: true, nuevo: false },
  { id: "CAS", nombre: "Caserito", unidad: "kg", visible: true, activo: true, nuevo: false },
  { id: "PAN_CAS", nombre: "Pan casero", unidad: "unidad", visible: true, activo: true, nuevo: false },
  { id: "PALM", nombre: "Palmeritas", unidad: "kg", visible: true, activo: true, nuevo: false },
  { id: "PAN_SAL", nombre: "Pan de salvado", unidad: "kg", visible: true, activo: true, nuevo: false },
  { id: "PREP", nombre: "Prepizzas", unidad: "unidad", visible: true, activo: true, nuevo: false },
  { id: "PAN_INT", nombre: "Pan integral", unidad: "unidad", visible: true, activo: true, nuevo: false },
  { id: "BUD", nombre: "Budín", unidad: "unidad", visible: true, activo: true, nuevo: false },
  { id: "TAP_MAI", nombre: "Tapitas maicena", unidad: "kg", visible: true, activo: true, nuevo: false },
  { id: "FROLA", nombre: "Frolas", unidad: "kg", visible: true, activo: true, nuevo: false },
  { id: "SCON", nombre: "Scon", unidad: "kg", visible: true, activo: true, nuevo: false },
  { id: "PEPAS", nombre: "Pepas", unidad: "kg", visible: true, activo: true, nuevo: false },
  { id: "CANON", nombre: "Cañoncitos", unidad: "kg", visible: true, activo: true, nuevo: false },
  { id: "PIZZ_KG", nombre: "Pizzetas x kg", unidad: "kg", visible: true, activo: true, nuevo: false },

  { id: "PAN_HAMB", nombre: "Pan hamburguesa", unidad: "unidad", visible: false, activo: true, nuevo: false },
  { id: "PAN_CHIPS", nombre: "Pan de chips", unidad: "unidad", visible: false, activo: true, nuevo: false },
  { id: "PAN_PANCHO", nombre: "Pan de pancho", unidad: "unidad", visible: false, activo: true, nuevo: false },
];

const dias = ["lunes_jueves", "viernes", "sabado", "domingo"];

const clientesIniciales = [
  "Fratello",
  "Pedernera y Colombia",
  "Giuliano",
  "Laura",
  "Cliente 4",
  "Cliente 5",
  "Cliente 6",
  "Cliente 7",
];

const diccionario = [
  ["rasquetas grasas", "RASQ_G"], ["rasqueta grasa", "RASQ_G"],
  ["rasquetas manteca", "RASQ_M"], ["rasqueta manteca", "RASQ_M"],
  ["bizcochos de grasa", "BIZ_G"], ["bizcocho de grasa", "BIZ_G"],
  ["bizcocho hojaldre", "BIZ_H"], ["librito membrillo", "LIB_MEM"],
  ["facturas surtidas", "FAC_SUR"], ["factura surtida", "FAC_SUR"],
  ["corderos salados", "CORD_S"], ["cordero salado", "CORD_S"],
  ["corderos dulces", "CORD_D"], ["cordero dulce", "CORD_D"],
  ["pan de salvado", "PAN_SAL"], ["pan integral", "PAN_INT"],
  ["pan casero", "PAN_CAS"], ["pan hamburguesa", "PAN_HAMB"],
  ["pan de hamburguesa", "PAN_HAMB"], ["pan de chips", "PAN_CHIPS"],
  ["pan chips", "PAN_CHIPS"], ["pan de pancho", "PAN_PANCHO"],
  ["pan pancho", "PAN_PANCHO"], ["chicharrón", "CHIC"], ["chicharron", "CHIC"],
  ["trenzas", "TREN"], ["raspaditas", "RASP"], ["medialunas", "MED"],
  ["caserito", "CAS"], ["palmeritas", "PALM"], ["prepizzas", "PREP"], ["prepizza", "PREP"],
  ["budín", "BUD"], ["budin", "BUD"], ["tapitas maicena", "TAP_MAI"],
  ["frolas", "FROLA"], ["scon", "SCON"], ["pepas", "PEPAS"], ["cañoncitos", "CANON"],
  ["canon", "CANON"], ["pizzetas", "PIZZ_KG"], ["pan", "PAN"],
].sort((a, b) => b[0].length - a[0].length);

function crearPredeterminadasIniciales() {
  const base = {};
  for (const d of dias) {
    base[d] = {};
    for (const p of productos) base[d][p.id] = 0;
  }
  return base;
}


// --- SINCRONIZACIÓN ONLINE FIREBASE ---
// Pegá acá el firebaseConfig de Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyDPg7UWyqOKYxP5qEelgqjcfTjXD3BXYQY",
  authDomain: "fratello-c1765.firebaseapp.com",
  projectId: "fratello-c1765",
  storageBucket: "fratello-c1765.firebasestorage.app",
  messagingSenderId: "897400694131",
  appId: "1:897400694131:web:4262fca5934bcc56629106",
  measurementId: "G-DSFYHG7QFV"
};

const FIREBASE_ACTIVO = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("PEGAR");
let db = null;
let cargandoDesdeNube = false;

if (FIREBASE_ACTIVO && typeof firebase !== "undefined") {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
}


const CLAVE_VAPID_NOTIFICACIONES = "BG6gYJciGDS2YKNz1pIUx_Y1qMauuao5J3PY5uinZ1zLLbG7rY5ZQyO_fXbJPoY4kaXECH7EunZPq4EeBmct2QU";
let messaging = null;
let tokenNotificaciones = localStorage.getItem("fratello_token_notificaciones") || "";

if (FIREBASE_ACTIVO && typeof firebase !== "undefined" && firebase.messaging) {
  try {
    messaging = firebase.messaging();
  } catch (error) {
    console.error("No se pudo iniciar Firebase Messaging:", error);
  }
}

function actualizarEstadoNotificaciones() {
  const estado = $("estadoNotificaciones");
  const btnActivar = $("btnActivarNotificaciones");
  const btnProbar = $("btnProbarNotificacion");

  if (!estado) return;

  if (!("Notification" in window)) {
    estado.textContent = "Este dispositivo no admite notificaciones web.";
    if (btnActivar) btnActivar.disabled = true;
    if (btnProbar) btnProbar.disabled = true;
    return;
  }

  if (Notification.permission === "denied") {
    estado.textContent = "Notificaciones bloqueadas. Habilitalas desde Ajustes del iPhone.";
    if (btnActivar) btnActivar.disabled = true;
    if (btnProbar) btnProbar.disabled = true;
    return;
  }

  if (Notification.permission === "granted" && tokenNotificaciones) {
    estado.textContent = "✅ Notificaciones activadas en este dispositivo.";
    if (btnActivar) btnActivar.textContent = "Notificaciones activadas";
    if (btnProbar) btnProbar.disabled = false;
    return;
  }

  if (Notification.permission === "granted") {
    estado.textContent = "Permiso concedido. Falta registrar el dispositivo.";
    if (btnProbar) btnProbar.disabled = true;
    return;
  }

  estado.textContent = "Todavía no están activadas.";
  if (btnProbar) btnProbar.disabled = true;
}

async function obtenerRegistroServiceWorkerNotificaciones() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("El navegador no admite Service Worker.");
  }

  let registro = await navigator.serviceWorker.getRegistration("./");

  if (!registro) {
    registro = await navigator.serviceWorker.register("service-worker.js?v=080", {
      scope: "./",
      updateViaCache: "none"
    });
  }

  await navigator.serviceWorker.ready;
  return registro;
}

async function guardarTokenNotificaciones(token) {
  if (!db || !token) return;

  const idSeguro = token.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 120);
  const datos = {
    token,
    plataforma: navigator.userAgent,
    pwa: window.matchMedia("(display-mode: standalone)").matches || Boolean(navigator.standalone),
    activo: true,
    actualizado: new Date().toISOString()
  };

  await db.collection("fratello_notificaciones").doc(idSeguro).set(datos, { merge: true });
}

async function activarNotificacionesFratello() {
  const boton = $("btnActivarNotificaciones");
  const estado = $("estadoNotificaciones");

  if (boton) {
    boton.disabled = true;
    boton.textContent = "Activando...";
  }
  if (estado) estado.textContent = "Solicitando permiso...";

  try {
    if (!messaging) {
      throw new Error("Firebase Messaging no está disponible.");
    }

    const permiso = await Notification.requestPermission();

    if (permiso !== "granted") {
      throw new Error("No se concedió permiso para notificaciones.");
    }

    const registro = await obtenerRegistroServiceWorkerNotificaciones();

    const token = await messaging.getToken({
      vapidKey: CLAVE_VAPID_NOTIFICACIONES,
      serviceWorkerRegistration: registro
    });

    if (!token) {
      throw new Error("Firebase no devolvió un token para este dispositivo.");
    }

    tokenNotificaciones = token;
    localStorage.setItem("fratello_token_notificaciones", token);
    await guardarTokenNotificaciones(token);

    actualizarEstadoNotificaciones();

    if (estado) estado.textContent = "✅ Dispositivo registrado correctamente.";
    if (boton) boton.textContent = "Notificaciones activadas";
  } catch (error) {
    console.error("Error activando notificaciones:", error);
    if (estado) estado.textContent = "❌ " + (error.message || "No se pudieron activar.");
    if (boton) {
      boton.disabled = false;
      boton.textContent = "Reintentar activación";
    }
    return;
  }

  if (boton) boton.disabled = false;
}

async function probarNotificacionFratello() {
  const boton = $("btnProbarNotificacion");
  const estado = $("estadoNotificaciones");

  if (Notification.permission !== "granted") {
    alert("Primero activá las notificaciones.");
    return;
  }

  if (boton) {
    boton.disabled = true;
    boton.textContent = "Enviando prueba...";
  }

  try {
    const registro = await obtenerRegistroServiceWorkerNotificaciones();

    await registro.showNotification("Fratello", {
      body: "✅ Las notificaciones funcionan correctamente.",
      icon: "icon-192.png",
      badge: "icon-192.png",
      tag: "fratello-prueba",
      data: { url: "./index.html" }
    });

    if (estado) estado.textContent = "✅ Notificación de prueba enviada.";
  } catch (error) {
    console.error("Error mostrando notificación de prueba:", error);
    if (estado) estado.textContent = "❌ No se pudo mostrar la prueba.";
  } finally {
    if (boton) {
      boton.disabled = false;
      boton.textContent = "Enviar prueba";
    }
  }
}

function setEstadoSync(texto) {
  const el = $("estadoSync");
  if (el) el.textContent = texto;
}

function datosActuales() {
  return {
    produccion,
    pedidos,
    pedidosFijos,
    historialPedidos,
    predeterminadas,
    clientes,
    datosClientesCompletos,
    listasPrecios,
    listasPrecioPersonalizadas,
    productosExtra,
    catalogoProductos: productos,
    pedidosConfirmados,
    correspondePedido,
    memoriaUltimoEnvio,
    actualizado: new Date().toISOString()
  };
}

async function guardarEnNube() {
  if (!db || cargandoDesdeNube) return;
  try {
    await db.collection("fratello").doc("estado").set(datosActuales());
    setEstadoSync("Guardado online");
  } catch (error) {
    console.error("Error guardando en Firebase:", error);
    setEstadoSync("Error al guardar online");
  }
}

async function cargarDesdeNube() {
  if (!db) {
    console.error("Firebase no se inicializó. Revisar scripts o conexión.");
    setEstadoSync("Modo local — Firebase no inició");
    return;
  }

  try {
    setEstadoSync("Cargando online...");
    const doc = await db.collection("fratello").doc("estado").get();

    if (doc.exists) {
      const data = doc.data();

      produccion = data.produccion || produccion;
      pedidos = Array.isArray(data.pedidos) ? data.pedidos : pedidos;
    pedidosFijos = Array.isArray(data.pedidosFijos) ? data.pedidosFijos : pedidosFijos;
    historialPedidos = Array.isArray(data.historialPedidos) ? data.historialPedidos : historialPedidos;
      pedidosFijos = Array.isArray(data.pedidosFijos) ? data.pedidosFijos : pedidosFijos;
      historialPedidos = Array.isArray(data.historialPedidos) ? data.historialPedidos : historialPedidos;
      predeterminadas = data.predeterminadas || predeterminadas;
      clientes = Array.isArray(data.clientes) && data.clientes.length
        ? data.clientes
        : clientes;

      datosClientesCompletos =
        data.datosClientesCompletos || datosClientesCompletos;
      listasPrecios = data.listasPrecios || listasPrecios;
    listasPrecioPersonalizadas = Array.isArray(data.listasPrecioPersonalizadas)
      ? data.listasPrecioPersonalizadas
      : listasPrecioPersonalizadas;
      listasPrecioPersonalizadas = Array.isArray(data.listasPrecioPersonalizadas)
        ? data.listasPrecioPersonalizadas
        : listasPrecioPersonalizadas;
      productosExtra = Array.isArray(data.productosExtra)
        ? data.productosExtra
        : productosExtra;

      // Nunca vaciar el catálogo si Firebase no trae uno válido.
      if (Array.isArray(data.catalogoProductos) && data.catalogoProductos.length) {
        productos.splice(0, productos.length, ...data.catalogoProductos);
      }

      productosExtra.forEach(productoExtra => {
        if (!productos.find(producto => producto.id === productoExtra.id)) {
          productos.push(productoExtra);
        }
      });

      pedidosConfirmados = Boolean(data.pedidosConfirmados);
      correspondePedido = data.correspondePedido || correspondePedido;
      memoriaUltimoEnvio = data.memoriaUltimoEnvio || memoriaUltimoEnvio;

      validarClientes();

      localStorage.setItem("fratello_produccion", JSON.stringify(produccion));
      localStorage.setItem("fratello_pedidos", JSON.stringify(pedidos));
  localStorage.setItem("fratello_pedidos_fijos", JSON.stringify(pedidosFijos));
  localStorage.setItem("fratello_historial_pedidos", JSON.stringify(historialPedidos));
      localStorage.setItem("fratello_predeterminadas", JSON.stringify(predeterminadas));
      localStorage.setItem("fratello_clientes", JSON.stringify(clientes));
      localStorage.setItem("fratello_clientes_completos", JSON.stringify(datosClientesCompletos));
    localStorage.setItem("fratello_listas_precios", JSON.stringify(listasPrecios));
  localStorage.setItem(
    "fratello_listas_precio_personalizadas",
    JSON.stringify(listasPrecioPersonalizadas)
  );
      localStorage.setItem("fratello_listas_precios", JSON.stringify(listasPrecios));
      localStorage.setItem(
        "fratello_listas_precio_personalizadas",
        JSON.stringify(listasPrecioPersonalizadas)
      );
      localStorage.setItem("fratello_productos_extra", JSON.stringify(productosExtra));
      localStorage.setItem("fratello_catalogo_productos", JSON.stringify(productos));
      localStorage.setItem("fratello_pedidos_confirmados", JSON.stringify(pedidosConfirmados));
      localStorage.setItem("fratello_memoria_envio", JSON.stringify(memoriaUltimoEnvio));
    }

    setEstadoSync("Online");
  } catch (error) {
    console.error("Error cargando Firebase:", error);
    setEstadoSync("Error online / usando local");
  }
}

async function actualizarDatosManual() {
  const boton = $("btnActualizarDatos");
  const texto = boton?.querySelector(".refreshText");
  const icono = boton?.querySelector(".refreshIcon");
  const estado = $("estadoActualizacionManual");

  if (!boton) return;

  boton.disabled = true;
  boton.classList.add("actualizando");
  if (texto) texto.textContent = "Actualizando...";
  if (estado) estado.textContent = "Consultando Firebase...";

  try {
    if (!db) {
      throw new Error("Firebase no está conectado.");
    }

    const doc = await db.collection("fratello").doc("estado").get();

    if (!doc.exists) {
      throw new Error("No hay datos guardados en Firebase.");
    }

    const data = doc.data();

    cargandoDesdeNube = true;

    produccion = data.produccion || produccion;
    pedidos = Array.isArray(data.pedidos) ? data.pedidos : pedidos;
    predeterminadas = data.predeterminadas || predeterminadas;
    clientes = Array.isArray(data.clientes) && data.clientes.length
      ? data.clientes
      : clientes;
    datosClientesCompletos = data.datosClientesCompletos || datosClientesCompletos;
      listasPrecios = data.listasPrecios || listasPrecios;
    productosExtra = data.productosExtra || productosExtra;
    if (Array.isArray(data.catalogoProductos) && data.catalogoProductos.length) {
      productos.splice(0, productos.length, ...data.catalogoProductos);
    }
    pedidosConfirmados = Boolean(data.pedidosConfirmados);
    correspondePedido = data.correspondePedido || correspondePedido;
    memoriaUltimoEnvio = data.memoriaUltimoEnvio || memoriaUltimoEnvio;

    validarClientes();

    productosExtra.forEach(p => {
      if (!productos.find(x => x.id === p.id)) productos.push(p);
    });

    localStorage.setItem("fratello_produccion", JSON.stringify(produccion));
    localStorage.setItem("fratello_pedidos", JSON.stringify(pedidos));
    localStorage.setItem("fratello_predeterminadas", JSON.stringify(predeterminadas));
    localStorage.setItem("fratello_clientes", JSON.stringify(clientes));
    localStorage.setItem("fratello_clientes_completos", JSON.stringify(datosClientesCompletos));
  localStorage.setItem("fratello_listas_precios", JSON.stringify(listasPrecios));
    localStorage.setItem("fratello_productos_extra", JSON.stringify(productosExtra));
  localStorage.setItem("fratello_catalogo_productos", JSON.stringify(productos));
    localStorage.setItem("fratello_pedidos_confirmados", JSON.stringify(pedidosConfirmados));
    localStorage.setItem("fratello_memoria_envio", JSON.stringify(memoriaUltimoEnvio));

    renderClientes();
    renderListaClientesCompleta();
    renderClientesPendientes();
    renderProduccion();
    renderPedidosCargados();
    calcularDiferencias();
    actualizarPanelMemoriaEnvio();
    actualizarTarjetaDiaPedidos();

    const hora = new Date().toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit"
    });

    if (estado) estado.textContent = `✅ Datos actualizados a las ${hora}`;

    boton.classList.remove("actualizando");
    boton.classList.add("actualizado");
    if (icono) icono.textContent = "✅";
    if (texto) texto.textContent = "Actualizado";

    setTimeout(() => {
      boton.classList.remove("actualizado");
      if (icono) icono.textContent = "🔄";
      if (texto) texto.textContent = "Actualizar datos";
    }, 1800);

    setEstadoSync("Online actualizado");
  } catch (error) {
    console.error("Error actualizando datos:", error);

    if (estado) estado.textContent = "❌ No se pudieron actualizar los datos";
    boton.classList.remove("actualizando");
    boton.classList.add("errorActualizacion");
    if (icono) icono.textContent = "⚠️";
    if (texto) texto.textContent = "Reintentar";

    setTimeout(() => {
      boton.classList.remove("errorActualizacion");
      if (icono) icono.textContent = "🔄";
      if (texto) texto.textContent = "Actualizar datos";
    }, 2200);
  } finally {
    cargandoDesdeNube = false;
    boton.disabled = false;
  }
}


let guardandoInterpretacionFormulario = false;

function interpretarPedidosFormularioPendientes(listaPedidos) {
  let huboCambios = false;

  const interpretados = (Array.isArray(listaPedidos) ? listaPedidos : []).map(pedido => {
    const esFormulario = pedido?.origen === "formulario_cliente";
    const necesitaInterpretacion =
      pedido?.pendienteInterpretacion === true ||
      (esFormulario && pedido?.textoOriginal && (!Array.isArray(pedido.items) || pedido.items.length === 0));

    if (!necesitaInterpretacion) return pedido;

    const items = procesarTextoPedido(
      pedido.textoOriginal || "",
      pedido.cliente || "",
      pedido.fecha || hoyISO()
    );

    huboCambios = true;

    return {
      ...pedido,
      items,
      pendienteInterpretacion: false,
      versionInterpretador: "motor_central_v101",
      interpretadoEn: new Date().toISOString()
    };
  });

  return { pedidos: interpretados, huboCambios };
}

async function guardarInterpretacionFormularioEnNube() {
  if (!db || guardandoInterpretacionFormulario) return;
  guardandoInterpretacionFormulario = true;

  try {
    await db.collection("fratello").doc("estado").set({
      pedidos,
      productosExtra,
      catalogoProductos: productos,
      pedidosConfirmados: false,
      actualizado: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error("No se pudo guardar la interpretación del formulario:", error);
  } finally {
    guardandoInterpretacionFormulario = false;
  }
}

function reprocesarPedidoFormulario(pedidoId) {
  const pedido = pedidos.find(p => Number(p.id) === Number(pedidoId));
  if (!pedido || !pedido.textoOriginal) {
    alert("Este pedido no tiene el texto original para volver a interpretarlo.");
    return;
  }

  pedido.items = procesarTextoPedido(
    pedido.textoOriginal,
    pedido.cliente || "",
    pedido.fecha || hoyISO()
  );
  pedido.pendienteInterpretacion = false;
  pedido.versionInterpretador = "motor_central_v101";
  pedido.interpretadoEn = new Date().toISOString();
  pedidosConfirmados = false;

  guardarTodo();
  renderPedidosCargados();
  renderUltimoProcesado();
  calcularDiferencias();
  actualizarAvisoUnidadesAmbiguas();
  actualizarEstadoConfirmacion();

  alert("Pedido reinterpretado con el motor inteligente.");
}

function escucharCambiosNube() {
  if (!db) return;

  db.collection("fratello").doc("estado").onSnapshot((doc) => {
    if (!doc.exists) return;

    cargandoDesdeNube = true;

    try {
      const data = doc.data();

      produccion = data.produccion || produccion;

      const resultadoInterpretacion = interpretarPedidosFormularioPendientes(
        Array.isArray(data.pedidos) ? data.pedidos : pedidos
      );
      pedidos = resultadoInterpretacion.pedidos;

      predeterminadas = data.predeterminadas || predeterminadas;
      clientes = Array.isArray(data.clientes) && data.clientes.length
        ? data.clientes
        : clientes;
      datosClientesCompletos = data.datosClientesCompletos || datosClientesCompletos;
      listasPrecios = data.listasPrecios || listasPrecios;
      productosExtra = data.productosExtra || productosExtra;
      pedidosConfirmados = Boolean(data.pedidosConfirmados);
      correspondePedido = data.correspondePedido || correspondePedido;
      memoriaUltimoEnvio = data.memoriaUltimoEnvio || memoriaUltimoEnvio;

      validarClientes();

      productosExtra.forEach(p => {
        if (!productos.find(x => x.id === p.id)) productos.push(p);
      });

      localStorage.setItem("fratello_produccion", JSON.stringify(produccion));
      localStorage.setItem("fratello_pedidos", JSON.stringify(pedidos));
      localStorage.setItem("fratello_predeterminadas", JSON.stringify(predeterminadas));
      localStorage.setItem("fratello_clientes", JSON.stringify(clientes));
      localStorage.setItem("fratello_clientes_completos", JSON.stringify(datosClientesCompletos));
      localStorage.setItem("fratello_productos_extra", JSON.stringify(productosExtra));
      localStorage.setItem("fratello_pedidos_confirmados", JSON.stringify(pedidosConfirmados));
      localStorage.setItem("fratello_memoria_envio", JSON.stringify(memoriaUltimoEnvio));

      renderClientes();
      renderListaClientesCompleta();
      renderClientesPendientes();
      renderProduccion();
      renderPedidosCargados();
      calcularDiferencias();
      actualizarPanelMemoriaEnvio();
      actualizarTarjetaDiaPedidos();

      if (resultadoInterpretacion.huboCambios) {
        guardarInterpretacionFormularioEnNube();
      }

      const estado = $("estadoActualizacionManual");
      if (estado) {
        estado.textContent = "Actualizado " + new Date().toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit"
        });
      }

      setEstadoSync("Online actualizado");
    } catch (error) {
      console.error("Error procesando actualización en tiempo real:", error);
      setEstadoSync("Error al actualizar");
    } finally {
      cargandoDesdeNube = false;
    }
  }, (error) => {
    console.error("Error escuchando Firebase:", error);
    setEstadoSync("Error de sincronización");
  });
}

function guardarTodo() {
  localStorage.setItem("fratello_produccion", JSON.stringify(produccion));
  localStorage.setItem("fratello_pedidos", JSON.stringify(pedidos));
  localStorage.setItem("fratello_predeterminadas", JSON.stringify(predeterminadas));
  localStorage.setItem("fratello_clientes", JSON.stringify(clientes));
  localStorage.setItem("fratello_clientes_completos", JSON.stringify(datosClientesCompletos));
  localStorage.setItem("fratello_productos_extra", JSON.stringify(productosExtra));
  localStorage.setItem("fratello_pedidos_confirmados", JSON.stringify(pedidosConfirmados));
  localStorage.setItem("fratello_memoria_envio", JSON.stringify(memoriaUltimoEnvio));
  guardarEnNube();
}


let produccion = JSON.parse(localStorage.getItem("fratello_produccion") || "{}");
let pedidos = JSON.parse(localStorage.getItem("fratello_pedidos") || "[]");
let pedidosFijos = JSON.parse(localStorage.getItem("fratello_pedidos_fijos") || "[]");
let historialPedidos = JSON.parse(localStorage.getItem("fratello_historial_pedidos") || "[]");
let predeterminadas = JSON.parse(localStorage.getItem("fratello_predeterminadas") || "null") || crearPredeterminadasIniciales();
let clientes = JSON.parse(localStorage.getItem("fratello_clientes") || "null") || [...clientesIniciales];
let datosClientesCompletos = JSON.parse(localStorage.getItem("fratello_clientes_completos") || "{}");
let listasPrecios = JSON.parse(localStorage.getItem("fratello_listas_precios") || "{}");
let productosExtra = JSON.parse(localStorage.getItem("fratello_productos_extra") || "[]");
productosExtra.forEach(p => { if (!productos.find(x => x.id === p.id)) productos.push(p); });

function formaVentaPredeterminada(unidad) {
  const u = String(unidad || "unidad").toLowerCase();
  if (u === "docena") return "unidad_docena";
  if (u === "kg") return "unidad_kg";
  return "solo_unidad";
}

productos.forEach(producto => {
  if (!producto.formaVenta) producto.formaVenta = formaVentaPredeterminada(producto.unidad);
  if (!Array.isArray(producto.sinonimos)) producto.sinonimos = [];
  if (!producto.precios || typeof producto.precios !== "object") producto.precios = {};
  ["unidad","docena","kg","paquete","bolsa","bandeja"].forEach(u => {
    producto.precios[u] = Number(producto.precios[u] || 0);
  });
});

const catalogoProductosGuardado = JSON.parse(localStorage.getItem("fratello_catalogo_productos") || "null");
if (Array.isArray(catalogoProductosGuardado) && catalogoProductosGuardado.length) {
  productos.splice(0, productos.length, ...catalogoProductosGuardado.map((p, indice) => ({
    id: String(p.id || `PRODUCTO_${indice + 1}`),
    nombre: String(p.nombre || "Producto"),
    unidad: String(p.unidad || "unidad"),
    formaVenta: String(p.formaVenta || formaVentaPredeterminada(p.unidad)),
    sinonimos: Array.isArray(p.sinonimos) ? p.sinonimos : [],
    precios: {
      unidad: Number(p.precios?.unidad || 0),
      docena: Number(p.precios?.docena || 0),
      kg: Number(p.precios?.kg || 0),
      paquete: Number(p.precios?.paquete || 0),
      bolsa: Number(p.precios?.bolsa || 0),
      bandeja: Number(p.precios?.bandeja || 0)
    },
    visible: p.visible !== false,
    activo: p.activo !== false,
    nuevo: Boolean(p.nuevo),
  })));
}
productos.forEach(producto => {
  dias.forEach(dia => {
    if (!predeterminadas[dia]) predeterminadas[dia] = {};
    if (predeterminadas[dia][producto.id] === undefined) predeterminadas[dia][producto.id] = 0;
  });
});
let correspondePedido = JSON.parse(localStorage.getItem("fratello_corresponde") || "{}");
let modoEdicionPredeterminada = false;
let pedidosConfirmados = JSON.parse(localStorage.getItem("fratello_pedidos_confirmados") || "false");
let memoriaUltimoEnvio = JSON.parse(localStorage.getItem("fratello_memoria_envio") || "null");
let produccionDesbloqueada = false;

const $ = (id) => document.getElementById(id);

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

function normalizar(texto) {
  return String(texto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}

function productoPorId(id) {
  return productos.find(p => p.id === id);
}

function buscarProducto(lineaNormalizada) {
  for (const [palabra, id] of diccionario) {
    if (lineaNormalizada.includes(normalizar(palabra))) return id;
  }
  return null;
}

function extraerCantidad(lineaNormalizada) {
  const match = lineaNormalizada.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return 0;
  const n = Number(match[1].replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function diaActual() {
  return $("diaProduccion").value || "lunes_jueves";
}

function nombreDiaActual() {
  const mapa = {
    lunes_jueves: "lunes a jueves",
    viernes: "viernes",
    sabado: "sábado",
    domingo: "domingo",
  };
  return mapa[diaActual()] || diaActual();
}

function claveProduccion(id) {
  return `${diaActual()}_${id}`;
}

function valorProduccion(id) {
  const key = claveProduccion(id);
  if (produccion[key] !== undefined) return produccion[key];
  return predeterminadas[diaActual()]?.[id] || 0;
}

function renderProduccion() {
  const visibles = productos.filter(p => p.visible && p.activo !== false);
  const dia = diaActual();

  let html = "<table><thead><tr><th>Producto</th><th>Cantidad</th><th>Unidad</th></tr></thead><tbody>";

  for (const p of visibles) {
    const valor = modoEdicionPredeterminada
      ? (predeterminadas[dia]?.[p.id] || "")
      : (valorProduccion(p.id) || "");

    const bloqueado = !produccionDesbloqueada ? "disabled" : "";
    html += `<tr>
      <td>${p.nombre}</td>
      <td><input type="number" step="0.001" data-prod="${p.id}" value="${valor}" placeholder="0" ${bloqueado}></td>
      <td>${p.unidad}</td>
    </tr>`;
  }

  html += "</tbody></table>";
  $("produccionLista").innerHTML = html;
  renderProduccionExtra();
  actualizarTextoModo();
}

function renderProduccionExtra() {
  const bloqueado = !produccionDesbloqueada ? "disabled" : "";
  let html = "<table><thead><tr><th>Producto extra</th><th>Cantidad</th><th>Unidad</th></tr></thead><tbody>";

  for (let i = 0; i < 6; i++) {
    html += `<tr>
      <td><input data-extra-nombre="${i}" placeholder="Ej: Pan hamburguesa" ${bloqueado}></td>
      <td><input data-extra-cantidad="${i}" type="number" step="0.001" placeholder="0" ${bloqueado}></td>
      <td>
        <select data-extra-unidad="${i}" ${bloqueado}>
          <option>unidad</option>
          <option>kg</option>
          <option>docena</option>
        </select>
      </td>
    </tr>`;
  }

  html += "</tbody></table>";
  $("produccionExtra").innerHTML = html;
}

function actualizarTextoModo() {
  $("modoProduccion").textContent = modoEdicionPredeterminada
    ? "Modo actual: cambiando la producción base"
    : (produccionDesbloqueada ? "Modo actual: producción desbloqueada" : "Modo actual: producción bloqueada");

  $("estadoBase").textContent = modoEdicionPredeterminada
    ? "editando base para " + nombreDiaActual()
    : "cargada automáticamente para " + nombreDiaActual();

  if ($("btnDesbloquearProduccion")) {
    $("btnDesbloquearProduccion").classList.toggle("hidden", produccionDesbloqueada);
    $("btnBloquearProduccion").classList.toggle("hidden", !produccionDesbloqueada);
    $("btnGuardarProduccion").disabled = !produccionDesbloqueada;
    $("btnEditarPredeterminada").disabled = !produccionDesbloqueada;
  }
}

function actualizarBloqueo() {
  renderProduccion();
}

function actualizarBloqueoProduccion() {
  renderProduccion();
}

function desbloquearProduccion() {
  const clave = window.prompt("Clave para desbloquear producción:");
  const claveLimpia = clave ? clave.trim().toLowerCase() : "";

  if (claveLimpia !== "fratello") {
    alert("Clave incorrecta.");
    return;
  }

  produccionDesbloqueada = true;
  renderProduccion();
}

function bloquearProduccion() {
  produccionDesbloqueada = false;
  if (modoEdicionPredeterminada) cancelarEdicionPredeterminada();
  renderProduccion();
}

function guardarProduccion() {
  if (!produccionDesbloqueada) {
    alert("Producción bloqueada. Primero desbloqueá.");
    return;
  }
  if (modoEdicionPredeterminada) {
    alert("Estás cambiando la producción base. Tocá Guardar nueva base o Cancelar.");
    return;
  }

  document.querySelectorAll("#produccionLista input").forEach(input => {
    produccion[claveProduccion(input.dataset.prod)] = Number(input.value || 0);
  });

  document.querySelectorAll("[data-extra-nombre]").forEach(input => {
    const i = input.dataset.extraNombre;
    const nombre = input.value.trim();
    const cantidad = Number(document.querySelector(`[data-extra-cantidad="${i}"]`).value || 0);
    const unidad = document.querySelector(`[data-extra-unidad="${i}"]`).value;

    if (!nombre || cantidad === 0) return;

    const normal = normalizar(nombre);
    const prodId = buscarProducto(normal) || `EXTRA_${normal.replace(/[^a-z0-9]/g, "_")}`;
    const productoExistente = productoPorId(prodId);

    if (!productoExistente && !productos.find(p => p.id === prodId)) {
      productos.push({ id: prodId, nombre, unidad, visible: false });
    }

    produccion[claveProduccion(prodId)] = cantidad;
  });

  guardarTodo();
  alert("Producción estibada/realizada guardada.");
  calcularDiferencias();
  actualizarEstadoConfirmacion();
}

function activarEdicionPredeterminada() {
  if (!produccionDesbloqueada) {
    const clave = window.prompt("Clave para editar la producción base:");
    const claveLimpia = clave ? clave.trim().toLowerCase() : "";

    if (claveLimpia !== "fratello") {
      alert("Clave incorrecta.");
      return;
    }

    produccionDesbloqueada = true;
  }

  modoEdicionPredeterminada = true;

  $("btnGuardarPredeterminada").classList.remove("hidden");
  $("btnCancelarPredeterminada").classList.remove("hidden");
  $("btnEditarPredeterminada").classList.add("hidden");

  renderProduccion();
}

function guardarPredeterminada() {
  const dia = diaActual();
  if (!predeterminadas[dia]) predeterminadas[dia] = {};

  document.querySelectorAll("#produccionLista input").forEach(input => {
    predeterminadas[dia][input.dataset.prod] = Number(input.value || 0);
  });

  guardarTodo();

  document.querySelectorAll("#produccionLista input").forEach(input => {
    produccion[claveProduccion(input.dataset.prod)] = Number(input.value || 0);
  });
  guardarTodo();

  modoEdicionPredeterminada = false;
  produccionDesbloqueada = false;
  $("btnGuardarPredeterminada").classList.add("hidden");
  $("btnCancelarPredeterminada").classList.add("hidden");
  $("btnEditarPredeterminada").classList.remove("hidden");

  alert("Producción base guardada para " + nombreDiaActual() + ".");
  renderProduccion();
  calcularDiferencias();
}

function cancelarEdicionPredeterminada() {
  modoEdicionPredeterminada = false;
  produccionDesbloqueada = false;

  $("btnGuardarPredeterminada").classList.add("hidden");
  $("btnCancelarPredeterminada").classList.add("hidden");
  $("btnEditarPredeterminada").classList.remove("hidden");

  renderProduccion();
}



function escaparHtmlCatalogo(valor) {
  return String(valor ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function crearIdProductoCatalogo(nombre) {
  const base = normalizar(nombre).replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "").toUpperCase() || "PRODUCTO";
  let id = base;
  let numero = 2;
  while (productos.some(p => p.id === id)) id = `${base}_${numero++}`;
  return id;
}
function guardarCatalogoProductos() {
  localStorage.setItem("fratello_catalogo_productos", JSON.stringify(productos));
  localStorage.setItem("fratello_predeterminadas", JSON.stringify(predeterminadas));
  localStorage.setItem("fratello_productos_extra", JSON.stringify(productosExtra));
  guardarEnNube();
}
function renderAdministradorProductos() {
  const contenedor = $("listaAdministradorProductos");
  if (!contenedor) return;
  contenedor.innerHTML = productos.map(producto => {
    const visible = producto.visible !== false;
    const activo = producto.activo !== false;
    return `<div class="catalogProductRow" data-catalog-id="${escaparHtmlCatalogo(producto.id)}">
      <div class="catalogProductFields">
        <input type="text" data-catalog-nombre value="${escaparHtmlCatalogo(producto.nombre)}">
        <select data-catalog-unidad>
          ${["unidad","kg","docena","bandeja","bolsa"].map(unidad =>
            `<option value="${unidad}" ${producto.unidad === unidad ? "selected" : ""}>${unidad}</option>`
          ).join("")}
        </select>
        <select data-catalog-forma-venta title="Cómo interpretar números sin unidad">
          ${[
            ["solo_unidad","Solo unidad"],
            ["solo_docena","Solo docena"],
            ["solo_kg","Solo kilo"],
            ["unidad_docena","Unidad o docena"],
            ["unidad_kg","Unidad o kilo"],
            ["kg_paquete","Kilo o paquete"],
            ["revisar_siempre","Revisar siempre"]
          ].map(([valor, etiqueta]) =>
            `<option value="${valor}" ${(producto.formaVenta || formaVentaPredeterminada(producto.unidad)) === valor ? "selected" : ""}>${etiqueta}</option>`
          ).join("")}
        </select>
        <textarea data-catalog-sinonimos rows="2" placeholder="Sinónimos separados por coma">${escaparHtmlCatalogo((producto.sinonimos || []).join(", "))}</textarea>
        <label class="catalogCheck"><input type="checkbox" data-catalog-visible ${visible ? "checked" : ""}> Mostrar</label>
        <label class="catalogCheck"><input type="checkbox" data-catalog-activo ${activo ? "checked" : ""}> Activo</label>
      </div>
      <div class="catalogPriceFields">
        <label>Precio unidad<input type="number" min="0" step="0.01" data-precio-unidad value="${Number(producto.precios?.unidad || 0)}"></label>
        <label>Precio docena<input type="number" min="0" step="0.01" data-precio-docena value="${Number(producto.precios?.docena || 0)}"></label>
        <label>Precio kg<input type="number" min="0" step="0.01" data-precio-kg value="${Number(producto.precios?.kg || 0)}"></label>
        <label>Precio paquete<input type="number" min="0" step="0.01" data-precio-paquete value="${Number(producto.precios?.paquete || 0)}"></label>
      </div>
      <div class="catalogProductActions">
        <button type="button" data-catalog-guardar="${escaparHtmlCatalogo(producto.id)}">💾 Guardar</button>
        <button type="button" class="dangerBtn" data-catalog-eliminar="${escaparHtmlCatalogo(producto.id)}">🗑 Eliminar</button>
      </div>
    </div>`;
  }).join("");
}
function agregarProductoCatalogo() {
  const nombre = $("nuevoProductoNombre")?.value.trim();
  const unidad = $("nuevoProductoUnidad")?.value || "unidad";
  const formaVenta = $("nuevoProductoFormaVenta")?.value || formaVentaPredeterminada(unidad);
  const sinonimos = [];
  if (!nombre) return alert("Escribí el nombre del producto.");
  if (productos.some(p => normalizar(p.nombre) === normalizar(nombre))) {
    return alert("Ya existe un producto con ese nombre.");
  }
  const nuevo = {
    id: crearIdProductoCatalogo(nombre),
    nombre,
    unidad,
    formaVenta,
    sinonimos,
    precios: { unidad: 0, docena: 0, kg: 0, paquete: 0, bolsa: 0, bandeja: 0 },
    visible: true,
    activo: true,
    nuevo: true
  };
  productos.push(nuevo);
  productosExtra.push(nuevo);
  dias.forEach(dia => {
    if (!predeterminadas[dia]) predeterminadas[dia] = {};
    predeterminadas[dia][nuevo.id] = 0;
  });
  guardarCatalogoProductos();
  $("nuevoProductoNombre").value = "";
  renderAdministradorProductos();
  renderProduccion();
  alert(`Producto "${nombre}" agregado. Asignale cantidades desde “Editar producción base”.`);
}
function guardarProductoCatalogo(id) {
  const fila = document.querySelector(`[data-catalog-id="${CSS.escape(id)}"]`);
  const producto = productos.find(p => p.id === id);
  if (!fila || !producto) return;
  const nombre = fila.querySelector("[data-catalog-nombre]").value.trim();
  if (!nombre) return alert("El nombre no puede quedar vacío.");
  if (productos.some(p => p.id !== id && normalizar(p.nombre) === normalizar(nombre))) {
    return alert("Ya existe otro producto con ese nombre.");
  }
  producto.nombre = nombre;
  producto.unidad = fila.querySelector("[data-catalog-unidad]").value;
  producto.formaVenta = fila.querySelector("[data-catalog-forma-venta]").value;
  producto.sinonimos = fila.querySelector("[data-catalog-sinonimos]").value
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
  producto.precios = {
    ...(producto.precios || {}),
    unidad: Number(fila.querySelector("[data-precio-unidad]")?.value || 0),
    docena: Number(fila.querySelector("[data-precio-docena]")?.value || 0),
    kg: Number(fila.querySelector("[data-precio-kg]")?.value || 0),
    paquete: Number(fila.querySelector("[data-precio-paquete]")?.value || 0)
  };
  producto.visible = fila.querySelector("[data-catalog-visible]").checked;
  producto.activo = fila.querySelector("[data-catalog-activo]").checked;
  const extra = productosExtra.find(p => p.id === id);
  if (extra) Object.assign(extra, producto);
  guardarCatalogoProductos();
  renderAdministradorProductos();
  renderProduccion();
  calcularDiferencias();
  alert(`Producto "${nombre}" actualizado.`);
}
function eliminarProductoCatalogo(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;
  if (!confirm(`¿Eliminar "${producto.nombre}" de la producción predeterminada?\n\nLos pedidos históricos no se borrarán.`)) return;
  productos.splice(productos.findIndex(p => p.id === id), 1);
  productosExtra = productosExtra.filter(p => p.id !== id);
  dias.forEach(dia => {
    if (predeterminadas[dia]) delete predeterminadas[dia][id];
    delete produccion[`${dia}_${id}`];
  });
  guardarTodo();
  renderAdministradorProductos();
  renderProduccion();
  calcularDiferencias();
  alert(`Producto "${producto.nombre}" eliminado.`);
}
function manejarClicksAdministradorProductos(evento) {
  const guardar = evento.target.closest("[data-catalog-guardar]");
  if (guardar) return guardarProductoCatalogo(guardar.dataset.catalogGuardar);
  const eliminar = evento.target.closest("[data-catalog-eliminar]");
  if (eliminar) eliminarProductoCatalogo(eliminar.dataset.catalogEliminar);
}


function normalizarPedidoInteligente(texto) {
  let t = String(texto || "").toLowerCase();

  t = t
    .replace(/(\d)\s*k\b/g, "$1 kg")
    .replace(/(\d)\s*kg\b/g, "$1 kg")
    .replace(/(\d)\s*gr\b/g, "$1 gramos")
    .replace(/(\d)\s*g\b/g, "$1 gramos")
    .replace(/\bc\s*\/\s*/g, " con ")
    .replace(/\bs\s*\/\s*/g, " sin ")
    .replace(/\bdd l\b/g, " dulce de leche ")
    .replace(/\bddl\b/g, " dulce de leche ")
    .replace(/\bdulces\b/g, " dulce ")
    .replace(/\bdoc\b/g, " docena ")
    .replace(/\bdocs\b/g, " docenas ")
    .replace(/\bunid\b/g, " unidad ")
    .replace(/\bu\b/g, " unidad ")
    .replace(/[.,;:()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return t;
}

function singularizarPalabra(palabra) {
  const p = String(palabra || "");
  if (p.length <= 3) return p;
  if (p.endsWith("ces")) return p.slice(0, -3) + "z";
  if (p.endsWith("es") && p.length > 5) return p.slice(0, -2);
  if (p.endsWith("s") && p.length > 4) return p.slice(0, -1);
  return p;
}

function tokensProducto(texto) {
  const ignorar = new Set([
    "de","del","la","las","el","los","con","sin","para","por","y",
    "kg","kilo","kilos","gramo","gramos","docena","docenas",
    "unidad","unidades","paquete","paquetes","bolsa","bolsas",
    "bandeja","bandejas"
  ]);

  return normalizarPedidoInteligente(texto)
    .split(/\s+/)
    .map(singularizarPalabra)
    .filter(token => token && !ignorar.has(token) && !/^\d+(?:[.,]\d+)?$/.test(token));
}

function similitudTokens(a, b) {
  const aa = new Set(tokensProducto(a));
  const bb = new Set(tokensProducto(b));

  if (!aa.size || !bb.size) return 0;

  let inter = 0;
  aa.forEach(token => {
    if (bb.has(token)) inter += 1;
  });

  const precision = inter / aa.size;
  const cobertura = inter / bb.size;
  return (precision * 0.55) + (cobertura * 0.45);
}

function variantesProducto(producto) {
  const variantes = [producto.nombre];
  if (Array.isArray(producto.sinonimos)) variantes.push(...producto.sinonimos);
  return variantes.filter(Boolean);
}

function puntuarProductoTexto(textoLinea, producto) {
  const textoNormalizado = normalizarPedidoInteligente(textoLinea);
  let mejor = 0;
  let varianteGanadora = producto.nombre;

  for (const variante of variantesProducto(producto)) {
    const varianteNormalizada = normalizarPedidoInteligente(variante);
    let puntaje = similitudTokens(textoNormalizado, varianteNormalizada);

    const tokensVariante = tokensProducto(varianteNormalizada);
    const tokensTexto = new Set(tokensProducto(textoNormalizado));
    const todosPresentes = tokensVariante.length > 0 && tokensVariante.every(t => tokensTexto.has(t));

    if (todosPresentes) {
      // Una coincidencia específica de varias palabras gana frente a una genérica.
      const bonoEspecificidad = Math.min(0.09, Math.max(0, tokensVariante.length - 1) * 0.035);
      puntaje = Math.max(puntaje, 0.91 + bonoEspecificidad);
    }

    if (textoNormalizado === varianteNormalizada) {
      puntaje = 1;
    }

    if (puntaje > mejor) {
      mejor = puntaje;
      varianteGanadora = variante;
    }
  }

  return { producto, puntaje: mejor, variante: varianteGanadora };
}

function buscarCoincidenciasProducto(textoLinea) {
  return productos
    .filter(p => p.activo !== false)
    .map(p => puntuarProductoTexto(textoLinea, p))
    .sort((a, b) => b.puntaje - a.puntaje);
}

function resolverProductoInteligente(textoLinea) {
  const coincidencias = buscarCoincidenciasProducto(textoLinea);
  const mejor = coincidencias[0];
  const segundo = coincidencias[1];

  if (!mejor || mejor.puntaje < 0.48) {
    return {
      producto: null,
      confianza: mejor?.puntaje || 0,
      revisar: true,
      sugerencias: coincidencias.slice(0, 3)
    };
  }

  const diferencia = mejor.puntaje - (segundo?.puntaje || 0);
  const revisar = mejor.puntaje < 0.72 || diferencia < 0.10;

  return {
    producto: mejor.producto,
    confianza: mejor.puntaje,
    revisar,
    sugerencias: coincidencias.slice(0, 3)
  };
}

function extraerCantidadYUnidadInteligente(original) {
  const texto = normalizarPedidoInteligente(original);
  const match = texto.match(/(\d+(?:[.,]\d+)?)\s*(kg|kilo|kilos|gramos|gramo|docena|docenas|unidad|unidades|paquete|paquetes|bolsa|bolsas|bandeja|bandejas)?/);

  if (!match) {
    return { cantidad: 0, unidadExplicita: "", textoLimpio: texto };
  }

  let cantidad = Number(match[1].replace(",", "."));
  let unidadExplicita = match[2] || "";

  if (unidadExplicita === "gramo" || unidadExplicita === "gramos") {
    cantidad = cantidad / 1000;
    unidadExplicita = "kg";
  } else if (unidadExplicita === "kilo" || unidadExplicita === "kilos") {
    unidadExplicita = "kg";
  } else if (unidadExplicita === "docenas") {
    unidadExplicita = "docena";
  } else if (unidadExplicita === "unidades") {
    unidadExplicita = "unidad";
  } else if (unidadExplicita === "paquetes") {
    unidadExplicita = "paquete";
  } else if (unidadExplicita === "bolsas") {
    unidadExplicita = "bolsa";
  } else if (unidadExplicita === "bandejas") {
    unidadExplicita = "bandeja";
  }

  const textoLimpio = texto.replace(match[0], " ").replace(/\s+/g, " ").trim();
  return { cantidad, unidadExplicita, textoLimpio };
}

function detectarUnidadExplicita(texto) {
  const t = ` ${normalizar(texto)} `;
  if (/\b(kg|kilo|kilos)\b/.test(t)) return "kg";
  if (/\b(doc|docena|docenas)\b/.test(t)) return "docena";
  if (/\b(unid|unidad|unidades|u)\b/.test(t)) return "unidad";
  if (/\b(paquete|paquetes|paq)\b/.test(t)) return "paquete";
  if (/\b(bolsa|bolsas)\b/.test(t)) return "bolsa";
  if (/\b(bandeja|bandejas)\b/.test(t)) return "bandeja";
  return "";
}

function detectarUnidad(texto, unidadDefault = "unidad") {
  return detectarUnidadExplicita(texto) || unidadDefault || "unidad";
}

function opcionesUnidadPorFormaVenta(formaVenta, unidadProducto) {
  switch (formaVenta) {
    case "solo_docena": return ["docena"];
    case "solo_kg": return ["kg"];
    case "unidad_docena": return ["unidad", "docena"];
    case "unidad_kg": return ["unidad", "kg"];
    case "kg_paquete": return ["kg", "paquete"];
    case "revisar_siempre":
      return [...new Set(["unidad", unidadProducto || "unidad"])];
    case "solo_unidad":
    default:
      return ["unidad"];
  }
}

function interpretarUnidadProducto(original, producto) {
  const explicita = detectarUnidadExplicita(original);
  if (explicita) {
    return {
      unidad: explicita,
      ambiguo: false,
      opciones: [explicita],
      razon: ""
    };
  }

  const formaVenta = producto.formaVenta || formaVentaPredeterminada(producto.unidad);
  const opciones = opcionesUnidadPorFormaVenta(formaVenta, producto.unidad);

  if (opciones.length === 1 && formaVenta !== "revisar_siempre") {
    return {
      unidad: opciones[0],
      ambiguo: false,
      opciones,
      razon: ""
    };
  }

  return {
    unidad: producto.unidad || opciones[0] || "unidad",
    ambiguo: true,
    opciones,
    razon: "El cliente escribió una cantidad sin aclarar la unidad."
  };
}

function nombreProductoDesdeLinea(original) {
  return original
    .replace(/\d+([.,]\d+)?/g, "")
    .replace(/\bkg\b/gi, "")
    .replace(/\bkilos?\b/gi, "")
    .replace(/\bunidad(es)?\b/gi, "")
    .replace(/\bunid\b/gi, "")
    .replace(/\bu\b/gi, "")
    .replace(/\bdoc(ena|enas)?\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function crearProductoExtra(nombre, unidad) {
  const id = "EXTRA_" + normalizar(nombre).replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").toUpperCase();
  let existente = productos.find(p => p.id === id || normalizar(p.nombre.replace("*","")) === normalizar(nombre));
  if (existente) return existente;

  const nuevo = {
    id,
    nombre: nombre + " *",
    unidad,
    formaVenta: formaVentaPredeterminada(unidad),
    sinonimos: [],
    precios: { unidad: 0, docena: 0, kg: 0, paquete: 0, bolsa: 0, bandeja: 0 },
    visible: false,
    activo: false,
    nuevo: true
  };
  productos.push(nuevo);
  productosExtra.push(nuevo);

  if (typeof dias !== "undefined") {
    dias.forEach(d => {
      if (!predeterminadas[d]) predeterminadas[d] = {};
      if (predeterminadas[d][id] === undefined) predeterminadas[d][id] = 0;
    });
  }

  guardarTodo();
  return nuevo;
}

function esProductoGenericoPan(lineaNormalizada, prodId) {
  return prodId === "PAN" && lineaNormalizada !== "pan";
}

function procesarTextoPedido(texto, cliente, fecha) {
  return texto
    .split(/\r?\n/)
    .map(linea => linea.trim())
    .filter(Boolean)
    .flatMap(original => {
      const normal = normalizarPedidoInteligente(original);

      if (
        normal.includes("pedido") ||
        normal.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)
      ) {
        return [];
      }

      const lectura = extraerCantidadYUnidadInteligente(original);
      const cantidad = lectura.cantidad;
      const textoProducto = lectura.textoLimpio || original;
      const reconocimiento = resolverProductoInteligente(textoProducto);

      let producto = reconocimiento.producto;
      let productoNoReconocido = false;

      if (!producto && cantidad > 0) {
        const nombreNuevo = nombreProductoDesdeLinea(original);
        const unidadNueva = lectura.unidadExplicita || detectarUnidad(original, "unidad");
        producto = crearProductoExtra(nombreNuevo, unidadNueva);
        productoNoReconocido = true;
      }

      if (!producto) return [];

      const originalParaUnidad = lectura.unidadExplicita
        ? `${cantidad} ${lectura.unidadExplicita} ${textoProducto}`
        : original;

      const interpretacionUnidad = interpretarUnidadProducto(
        originalParaUnidad,
        producto
      );

      const unidad = interpretacionUnidad.unidad;

      let estado = cantidad === 0
        ? "NO PEDIDO"
        : (
            productoNoReconocido || reconocimiento.revisar
              ? "REVISAR PRODUCTO"
              : (
                  interpretacionUnidad.ambiguo
                    ? "REVISAR UNIDAD"
                    : "OK"
                )
          );

      let observacion = cantidad === 0
        ? "Línea sin cantidad: se toma como 0"
        : (
            productoNoReconocido
              ? "Producto no reconocido."
              : (
                  reconocimiento.revisar
                    ? `Coincidencia con confianza ${Math.round(reconocimiento.confianza * 100)}%.`
                    : (
                        interpretacionUnidad.ambiguo
                          ? interpretacionUnidad.razon
                          : ""
                      )
                )
          );

      if (producto.nuevo || producto.activo === false) {
        observacion = observacion
          ? `${observacion} Producto nuevo/no habitual.`
          : "Producto nuevo/no habitual";
      }

      if (normal.includes(" o ")) {
        estado = "VARIABLE";
        observacion = observacion
          ? `${observacion} - cantidad variable`
          : "Cantidad variable: se toma el mínimo detectado";
      }

      return [{
        itemId: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        fecha,
        cliente,
        productoId: producto.id,
        producto: producto.nombre,
        cantidad,
        unidad,
        unidadAmbigua: interpretacionUnidad.ambiguo,
        opcionesUnidad: interpretacionUnidad.opciones,
        productoAmbiguo: productoNoReconocido || reconocimiento.revisar,
        confianzaProducto: reconocimiento.confianza,
        sugerenciasProducto: (reconocimiento.sugerencias || []).map(s => ({
          id: s.producto.id,
          nombre: s.producto.nombre,
          puntaje: s.puntaje
        })),
        estado,
        observacion,
        original
      }];
    });
}


function pedidosConProductoAmbiguo() {
  return pedidos.flatMap(pedido =>
    (pedido.items || [])
      .filter(item => item.productoAmbiguo || item.estado === "REVISAR PRODUCTO")
      .map(item => ({ pedido, item }))
  );
}

function resolverProductoPedido(pedidoId, itemId, productoId) {
  const pedido = pedidos.find(p => Number(p.id) === Number(pedidoId));
  if (!pedido) return;

  const item = (pedido.items || []).find(i => String(i.itemId) === String(itemId));
  const producto = productoPorId(productoId);
  if (!item || !producto) return;

  const textoOriginal = item.original || "";
  const alias = normalizarPedidoInteligente(
    extraerCantidadYUnidadInteligente(textoOriginal).textoLimpio
  );

  item.productoId = producto.id;
  item.producto = producto.nombre;
  item.productoAmbiguo = false;
  item.confianzaProducto = 1;
  item.sugerenciasProducto = [];
  item.estado = item.unidadAmbigua ? "REVISAR UNIDAD" : "OK";
  item.observacion = item.unidadAmbigua
    ? "Producto confirmado. Falta confirmar la unidad."
    : "Producto confirmado manualmente.";

  if (alias && !variantesProducto(producto).some(v => normalizarPedidoInteligente(v) === alias)) {
    producto.sinonimos = Array.isArray(producto.sinonimos) ? producto.sinonimos : [];
    producto.sinonimos.push(alias);

    const extra = productosExtra.find(p => p.id === producto.id);
    if (extra) extra.sinonimos = [...producto.sinonimos];

    guardarCatalogoProductos();
  }

  pedidosConfirmados = false;
  guardarTodo();
  renderPedidosCargados();
  renderUltimoProcesado();
  calcularDiferencias();
  actualizarAvisoUnidadesAmbiguas();
  actualizarEstadoConfirmacion();
}

function botonesResolverProducto(pedidoId, item) {
  if (!(item.productoAmbiguo || item.estado === "REVISAR PRODUCTO")) return "";

  const sugerencias = Array.isArray(item.sugerenciasProducto)
    ? item.sugerenciasProducto.filter(s => s && s.id)
    : [];

  if (!sugerencias.length) {
    return `<div class="productResolution">
      <span>⚠️ Producto no reconocido. Revisalo en el administrador.</span>
    </div>`;
  }

  return `<div class="productResolution">
    <span>⚠️ ¿Qué producto es?</span>
    ${sugerencias.slice(0, 3).map(s =>
      `<button type="button" onclick="resolverProductoPedido(${pedidoId}, '${item.itemId}', '${s.id}')">
        ${s.nombre} ${s.puntaje ? `(${Math.round(s.puntaje * 100)}%)` : ""}
      </button>`
    ).join("")}
  </div>`;
}

function pedidosConUnidadAmbigua() {
  return pedidos.flatMap(pedido =>
    (pedido.items || [])
      .filter(item => item.unidadAmbigua || item.estado === "REVISAR UNIDAD")
      .map(item => ({ pedido, item }))
  );
}

function actualizarAvisoUnidadesAmbiguas() {
  const aviso = $("avisoUnidadesAmbiguas");
  const check = $("checkPedidoCompleto");
  if (!aviso) return;

  const ambiguosUnidad = pedidosConUnidadAmbigua();
  const ambiguosProducto = pedidosConProductoAmbiguo();
  const totalAmbiguos = ambiguosUnidad.length + ambiguosProducto.length;

  if (!totalAmbiguos) {
    aviso.classList.add("hidden");
    aviso.innerHTML = "";
    if (check) check.disabled = false;
    return;
  }

  aviso.classList.remove("hidden");
  const partes = [];
  if (ambiguosProducto.length) partes.push(`${ambiguosProducto.length} producto(s) sin reconocer`);
  if (ambiguosUnidad.length) partes.push(`${ambiguosUnidad.length} unidad(es) sin confirmar`);
  aviso.innerHTML = `⚠️ Hay <strong>${totalAmbiguos}</strong> revisión(es) pendiente(s): ${partes.join(" y ")}.`;
  if (check) {
    check.checked = false;
    check.disabled = true;
  }
}

function resolverUnidadPedido(pedidoId, itemId, unidad) {
  const pedido = pedidos.find(p => Number(p.id) === Number(pedidoId));
  if (!pedido) return;

  const item = (pedido.items || []).find(i => String(i.itemId) === String(itemId));
  if (!item) return;

  item.unidad = unidad;
  item.unidadAmbigua = false;
  item.estado = "OK";
  item.observacion = `Unidad confirmada manualmente: ${unidad}`;

  pedidosConfirmados = false;
  guardarTodo();
  renderPedidosCargados();
  renderUltimoProcesado();
  calcularDiferencias();
  actualizarAvisoUnidadesAmbiguas();
  actualizarEstadoConfirmacion();
}

function botonesResolverUnidad(pedidoId, item) {
  if (!(item.unidadAmbigua || item.estado === "REVISAR UNIDAD")) return "";

  const opciones = Array.isArray(item.opcionesUnidad) && item.opcionesUnidad.length
    ? item.opcionesUnidad
    : ["unidad", item.unidad || "unidad"];

  return `<div class="unitResolution">
    <span>⚠️ Elegir unidad:</span>
    ${[...new Set(opciones)].map(unidad =>
      `<button type="button" onclick="resolverUnidadPedido(${pedidoId}, '${item.itemId}', '${unidad}')">${fmt(item.cantidad)} ${unidad}</button>`
    ).join("")}
  </div>`;
}

function mostrarMensajePedido(texto) {
  let aviso = $("mensajePedido");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.id = "mensajePedido";
    aviso.className = "mensajePedido";
    const btn = $("btnProcesar");
    btn.parentNode.insertBefore(aviso, btn.nextSibling);
  }

  aviso.textContent = texto;
  aviso.style.display = "block";

  setTimeout(() => {
    aviso.style.display = "none";
  }, 2500);
}

function validarClientes() {
  if (!Array.isArray(clientes) || clientes.length === 0) {
    clientes = [...clientesIniciales];
  }

  clientes = clientes
    .filter(c => c && String(c).trim())
    .map(c => String(c).trim());

  if (clientes.length === 0) {
    clientes = [...clientesIniciales];
  }
}


function guardarClientes() {
  guardarTodo();
}

function renderClientes(clienteSeleccionado = null) {
  validarClientes();

  const select = $("cliente");
  if (!select) return;

  const actual = clienteSeleccionado || select.value || clientes[0] || "";
  select.innerHTML = "";

  clientes.forEach(nombre => {
    const option = document.createElement("option");
    option.value = nombre;
    option.textContent = nombre;
    select.appendChild(option);
  });

  if (clientes.includes(actual)) {
    select.value = actual;
  } else if (clientes.length > 0) {
    select.value = clientes[0];
  }
}

function limpiarPedidoCrudo() {
  const pedido = $("pedidoCrudo");
  if (pedido) pedido.value = "";
}

function agregarCliente() {
  validarClientes();

  const nombre = prompt("Nombre del nuevo cliente:");
  if (!nombre) return;

  const limpio = nombre.trim();
  if (!limpio) return;

  const existe = clientes.some(c => normalizar(c) === normalizar(limpio));
  if (existe) {
    alert("Ese cliente ya existe.");
    return;
  }

  clientes.push(limpio);
  guardarTodo();
  renderClientes(limpio);
  limpiarPedidoCrudo();
  alert("Cliente agregado.");
}

function modificarCliente() {
  validarClientes();

  const select = $("cliente");
  const actual = select ? select.value : "";
  if (!actual) {
    alert("No hay cliente seleccionado.");
    return;
  }

  const nuevo = prompt("Modificar nombre del cliente:", actual);
  if (!nuevo) return;

  const limpio = nuevo.trim();
  if (!limpio) return;

  const existe = clientes.some(c => normalizar(c) === normalizar(limpio) && c !== actual);
  if (existe) {
    alert("Ya existe otro cliente con ese nombre.");
    return;
  }

  clientes = clientes.map(c => c === actual ? limpio : c);
  guardarTodo();
  renderClientes(limpio);
  limpiarPedidoCrudo();
  alert("Cliente modificado.");
}


function fechaISOManana() {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 1);
  return fecha.toISOString().slice(0, 10);
}

function fechaEntregaPedido(pedido) {
  return pedido.fechaEntrega || pedido.fecha || hoyISO();
}

function registrarPedidoEnHistorial(pedido) {
  if (!pedido || !pedido.id) return;
  const copia = JSON.parse(JSON.stringify({
    ...pedido,
    fechaEntrega: fechaEntregaPedido(pedido),
    guardadoHistorial: new Date().toISOString()
  }));
  historialPedidos = historialPedidos.filter(item => Number(item.id) !== Number(pedido.id));
  historialPedidos.unshift(copia);
  historialPedidos = historialPedidos.slice(0, 250);
}

function detectarProximoDiaEnTexto(texto, fechaBase = new Date()) {
  const normal = normalizarPedidoInteligente(texto || "");
  const dias = [
    ["domingo",0],["lunes",1],["martes",2],["miercoles",3],
    ["jueves",4],["viernes",5],["sabado",6]
  ];
  const encontrado = dias.find(([nombre]) => normal.includes(nombre));
  if (!encontrado) return "";
  const objetivo = encontrado[1];
  const fecha = new Date(fechaBase);
  let diferencia = (objetivo - fecha.getDay() + 7) % 7;
  if (diferencia === 0) diferencia = 7;
  fecha.setDate(fecha.getDate() + diferencia);
  return fecha.toISOString().slice(0,10);
}

function aplicarFechaDetectadaAlPedido(texto) {
  const input = $("fechaPedido");
  if (!input) return;
  const detectada = detectarProximoDiaEnTexto(texto);
  if (!detectada) return;
  if (input.value !== detectada) {
    const legible = new Date(detectada+"T12:00:00").toLocaleDateString("es-AR");
    if (confirm(`El pedido parece ser para el ${legible}. ¿Usar esa fecha de entrega?`)) {
      input.value = detectada;
    }
  }
}

function editarPedidoCargado(id) {
  const pedido = pedidos.find(p => Number(p.id) === Number(id));
  if (!pedido) return;
  const textoNuevo = prompt("Corregí el texto del pedido:", pedido.textoOriginal || "");
  if (textoNuevo === null) return;
  const fechaNueva = prompt("Fecha de entrega (AAAA-MM-DD):", fechaEntregaPedido(pedido));
  if (fechaNueva === null) return;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaNueva)) {
    alert("La fecha debe tener formato AAAA-MM-DD.");
    return;
  }
  pedido.textoOriginal = textoNuevo;
  pedido.fecha = fechaNueva;
  pedido.fechaEntrega = fechaNueva;
  pedido.items = procesarTextoPedido(textoNuevo, pedido.cliente, fechaNueva);
  pedido.editadoEn = new Date().toISOString();
  pedidosConfirmados = false;
  registrarPedidoEnHistorial(pedido);
  guardarTodo();
  renderPedidosCargados();
  renderPedidosFuturos();
  renderHistorialPedidos();
  calcularDiferencias();
  alert("Pedido actualizado.");
}

function repetirPedidoHistorial(id) {
  const anterior = historialPedidos.find(p => Number(p.id) === Number(id));
  if (!anterior) return;
  const fecha = prompt("Fecha de entrega para repetirlo (AAAA-MM-DD):", fechaISOManana());
  if (!fecha) return;
  const nuevo = {
    id: Date.now(),
    cliente: anterior.cliente,
    fecha,
    fechaEntrega: fecha,
    textoOriginal: anterior.textoOriginal,
    origen: "pedido_repetido",
    items: procesarTextoPedido(anterior.textoOriginal || "", anterior.cliente, fecha)
  };
  pedidos.push(nuevo);
  registrarPedidoEnHistorial(nuevo);
  pedidosConfirmados = false;
  guardarTodo();
  renderPedidosCargados();
  renderPedidosFuturos();
  renderHistorialPedidos();
  calcularDiferencias();
  alert("Pedido repetido correctamente.");
}

function renderHistorialPedidos() {
  const cont = $("listaHistorialPedidos");
  if (!cont) return;
  if (!historialPedidos.length) {
    cont.innerHTML = "<p>No hay pedidos en el historial todavía.</p>";
    return;
  }
  cont.innerHTML = historialPedidos.slice(0,80).map(p => `
    <div class="historyOrderCard">
      <div><strong>${escaparHtmlCatalogo(p.cliente || "Sin cliente")}</strong>
      <span>Entrega: ${new Date(fechaEntregaPedido(p)+"T12:00:00").toLocaleDateString("es-AR")}</span></div>
      <pre>${escaparHtmlCatalogo(p.textoOriginal || "")}</pre>
      <button type="button" onclick="repetirPedidoHistorial(${p.id})">📋 Repetir pedido</button>
    </div>`).join("");
}

function renderPedidosFuturos() {
  const cont = $("listaPedidosFuturos");
  if (!cont) return;
  const hoy = hoyISO();
  const futuros = pedidos.filter(p => fechaEntregaPedido(p) > hoy)
    .sort((a,b)=>fechaEntregaPedido(a).localeCompare(fechaEntregaPedido(b)));
  if (!futuros.length) {
    cont.innerHTML = "<p>No hay pedidos para fechas posteriores.</p>";
    return;
  }
  const grupos = {};
  futuros.forEach(p => {
    const fecha = fechaEntregaPedido(p);
    (grupos[fecha] ||= []).push(p);
  });
  cont.innerHTML = Object.entries(grupos).map(([fecha,lista]) => `
    <div class="futureDateGroup">
      <h3>📅 ${new Date(fecha+"T12:00:00").toLocaleDateString("es-AR",{weekday:"long",day:"2-digit",month:"2-digit"})}</h3>
      ${lista.map(p=>`<div class="futureOrderRow"><strong>${escaparHtmlCatalogo(p.cliente)}</strong><span>${(p.items||[]).filter(i=>i.estado!=="NO PEDIDO").length} ítems</span><button type="button" onclick="editarPedidoCargado(${p.id})">✏️ Editar</button></div>`).join("")}
    </div>`).join("");
}

function limpiarFormularioPedidoFijo() {
  if ($("pedidoFijoTexto")) $("pedidoFijoTexto").value="";
  document.querySelectorAll('input[name="diaFijo"]').forEach(c=>c.checked=false);
  if ($("btnGuardarPedidoFijo")) {
    $("btnGuardarPedidoFijo").dataset.editando="";
    $("btnGuardarPedidoFijo").textContent="💾 Guardar pedido fijo";
  }
}

function guardarPedidoFijo() {
  const cliente=$("pedidoFijoCliente")?.value||"";
  const texto=$("pedidoFijoTexto")?.value.trim()||"";
  const dias=[...document.querySelectorAll('input[name="diaFijo"]:checked')].map(c=>Number(c.value));
  if(!cliente||!texto||!dias.length){alert("Elegí cliente, escribí el pedido y marcá al menos un día.");return;}
  const idEditando=Number($("btnGuardarPedidoFijo")?.dataset.editando||0);
  if(idEditando){
    const fijo=pedidosFijos.find(p=>Number(p.id)===idEditando);
    if(fijo) Object.assign(fijo,{cliente,texto,dias,activo:true,actualizado:new Date().toISOString()});
  }else{
    pedidosFijos.push({id:Date.now(),cliente,texto,dias,activo:true,creado:new Date().toISOString()});
  }
  guardarTodo();limpiarFormularioPedidoFijo();renderPedidosFijos();alert("Pedido fijo guardado.");
}

function editarPedidoFijo(id){
  const fijo=pedidosFijos.find(p=>Number(p.id)===Number(id));if(!fijo)return;
  $("pedidoFijoCliente").value=fijo.cliente;$("pedidoFijoTexto").value=fijo.texto;
  document.querySelectorAll('input[name="diaFijo"]').forEach(c=>c.checked=fijo.dias.includes(Number(c.value)));
  $("btnGuardarPedidoFijo").dataset.editando=String(id);$("btnGuardarPedidoFijo").textContent="💾 Guardar cambios";
}

function alternarPedidoFijo(id){
  const fijo=pedidosFijos.find(p=>Number(p.id)===Number(id));if(!fijo)return;
  fijo.activo=!fijo.activo;guardarTodo();renderPedidosFijos();
}

function eliminarPedidoFijo(id){
  if(!confirm("¿Eliminar este pedido fijo?"))return;
  pedidosFijos=pedidosFijos.filter(p=>Number(p.id)!==Number(id));guardarTodo();renderPedidosFijos();
}

function renderPedidosFijos(){
  const cont=$("listaPedidosFijos");if(!cont)return;
  if(!pedidosFijos.length){cont.innerHTML="<p>No hay pedidos fijos cargados.</p>";return;}
  const nombres=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  cont.innerHTML=pedidosFijos.map(f=>`<div class="fixedOrderCard ${f.activo?"":"paused"}">
    <div><strong>${escaparHtmlCatalogo(f.cliente)}</strong><span>${f.dias.map(d=>nombres[d]).join(", ")}</span></div>
    <pre>${escaparHtmlCatalogo(f.texto)}</pre>
    <div class="toolbar"><button onclick="editarPedidoFijo(${f.id})">✏️ Editar</button><button onclick="alternarPedidoFijo(${f.id})">${f.activo?"⏸ Pausar":"▶ Activar"}</button><button class="dangerBtn" onclick="eliminarPedidoFijo(${f.id})">🗑 Eliminar</button></div>
  </div>`).join("");
}

function cargarPedidosFijosParaFecha(){
  const fecha=$("fechaCargarPedidosFijos")?.value;
  if(!fecha){alert("Elegí una fecha.");return;}
  const dia=new Date(fecha+"T12:00:00").getDay();
  const aplicables=pedidosFijos.filter(f=>f.activo&&f.dias.includes(dia));
  if(!aplicables.length){alert("No hay pedidos fijos activos para ese día.");return;}
  let agregados=0;
  aplicables.forEach(f=>{
    const existe=pedidos.some(p=>p.origen==="pedido_fijo"&&p.pedidoFijoId===f.id&&fechaEntregaPedido(p)===fecha);
    if(existe)return;
    const pedido={id:Date.now()+agregados,cliente:f.cliente,fecha,fechaEntrega:fecha,textoOriginal:f.texto,origen:"pedido_fijo",pedidoFijoId:f.id,items:procesarTextoPedido(f.texto,f.cliente,fecha)};
    pedidos.push(pedido);registrarPedidoEnHistorial(pedido);agregados++;
  });
  guardarTodo();renderPedidosCargados();renderPedidosFuturos();renderHistorialPedidos();calcularDiferencias();
  alert(`${agregados} pedido(s) fijo(s) cargado(s).`);
}

function renderSelectorClientesPedidoFijo(){
  const s=$("pedidoFijoCliente");if(!s)return;
  const actual=s.value;s.innerHTML=clientes.map(c=>`<option value="${escaparHtmlCatalogo(c)}">${escaparHtmlCatalogo(c)}</option>`).join("");
  if(clientes.includes(actual))s.value=actual;
}

function procesarPedidoActual() {
  const cliente = $("cliente").value;
  const texto = $("pedidoCrudo").value;
  aplicarFechaDetectadaAlPedido(texto);
  const fecha = $("fechaPedido").value || fechaISOManana();

  if (!texto.trim()) {
    alert("Pegá un pedido primero.");
    return;
  }

  const procesado = procesarTextoPedido(texto, cliente, fecha);
  const nuevoPedido = { id: Date.now(), fecha, fechaEntrega: fecha, cliente, textoOriginal: texto, items: procesado };
  pedidos.push(nuevoPedido);
  registrarPedidoEnHistorial(nuevoPedido);

  pedidosConfirmados = false;
  guardarTodo();

  renderUltimoProcesado(procesado);
  renderPedidosCargados();
  renderPedidosFuturos();
  renderHistorialPedidos();
  calcularDiferencias();
  actualizarEstadoConfirmacion();

  $("pedidoCrudo").value = "";
  mostrarMensajePedido("Pedido cargado correctamente");
}

function renderUltimoProcesado() {
  const filas = pedidos.flatMap(pedido =>
    (pedido.items || []).map(item => ({ pedidoId: pedido.id, ...item, cliente: pedido.cliente }))
  );

  if (!filas.length) {
    $("ultimoProcesado").innerHTML = "<p>No se detectaron productos.</p>";
    actualizarAvisoUnidadesAmbiguas();
    return;
  }

  let html = "<table><thead><tr><th>Producto</th><th>Cantidad</th><th>Unidad</th><th>Cliente</th><th>Estado</th><th>Texto leído</th></tr></thead><tbody>";

  for (const it of filas) {
    const clase = (it.unidadAmbigua || it.estado === "REVISAR UNIDAD") ? "ambiguousRow" : "";
    html += `<tr class="${clase}">
      <td>${it.producto}${botonesResolverProducto(it.pedidoId, it)}${botonesResolverUnidad(it.pedidoId, it)}</td>
      <td>${fmt(it.cantidad)}</td>
      <td>${it.unidad}</td>
      <td>${it.cliente}</td>
      <td>${it.estado}</td>
      <td>${it.original}</td>
    </tr>`;
  }

  $("ultimoProcesado").innerHTML = html + "</tbody></table>";
  actualizarAvisoUnidadesAmbiguas();
}

function renderPedidosCargados() {
  if (!pedidos.length) {
    $("pedidosCargados").innerHTML = "<p>No hay pedidos cargados.</p>";
    return;
  }

  let html = "";

  pedidos.forEach((pedido) => {
    const itemsValidos = pedido.items.filter(i => i.estado !== "NO PEDIDO");

    html += `<div class="pedidoClienteCard">
      <div class="pedidoClienteHeader">
        <label class="pedidoSelect">
          <input type="checkbox" class="checkPedidoEliminar" value="${pedido.id}">
          <strong>${pedido.cliente}</strong>
        </label>
        <span>${itemsValidos.length} ítems · Entrega ${new Date(fechaEntregaPedido(pedido)+"T12:00:00").toLocaleDateString("es-AR")}${fechaEntregaPedido(pedido)>hoyISO()?" · 📅 Futuro":""}${pedido.origen==="pedido_fijo"?" · 🔁 Fijo":""}</span>
      </div>`;

    if (!itemsValidos.length) {
      html += "<p>No se detectaron productos con cantidad.</p>";
    } else {
      html += "<table><thead><tr><th>Producto</th><th>Cantidad</th><th>Unidad</th></tr></thead><tbody>";
      itemsValidos.forEach(it => {
        const clase = (it.unidadAmbigua || it.estado === "REVISAR UNIDAD") ? "ambiguousRow" : "";
        html += `<tr class="${clase}">
          <td>${it.producto}${botonesResolverProducto(pedido.id, it)}${botonesResolverUnidad(pedido.id, it)}</td>
          <td>${fmt(it.cantidad)}</td>
          <td>${it.unidad}</td>
        </tr>`;
      });
      html += "</tbody></table>";
    }

    html += `<div class="accionesPedido">
      <button type="button" onclick="editarPedidoCargado(${pedido.id})">✏️ Editar pedido</button>
      <button type="button" onclick="descargarPdfPedidoIndividual(${pedido.id})">📄 PDF del cliente</button>
      <button type="button" onclick="reprocesarPedidoFormulario(${pedido.id})">🔄 Reinterpretar pedido</button>
      <button type="button" class="btnEliminarPedido" onclick="borrarPedido(${pedido.id})">Eliminar este pedido</button>
    </div>`;
    html += `</div>`;
  });

  $("pedidosCargados").innerHTML = html;
  actualizarAvisoUnidadesAmbiguas();
  renderClientesPendientes();
}


function borrarPedido(id) {
  if (!confirm("¿Seguro que querés borrar este pedido?")) return;

  pedidos = pedidos.filter(p => Number(p.id) !== Number(id));
  pedidosConfirmados = false;
  guardarTodo();

  renderPedidosCargados();
  calcularDiferencias();
  actualizarEstadoConfirmacion();

  const vista = $("vistaPedidosInline");
  if (vista) vista.innerHTML = "";
}

function borrarPedidosSeleccionados() {
  const seleccionados = Array.from(document.querySelectorAll(".checkPedidoEliminar:checked"))
    .map(c => Number(c.value));

  if (!seleccionados.length) {
    alert("Seleccioná al menos un pedido para borrar.");
    return;
  }

  if (!confirm(`¿Seguro que querés borrar ${seleccionados.length} pedido(s)?`)) return;

  pedidos = pedidos.filter(p => !seleccionados.includes(Number(p.id)));
  pedidosConfirmados = false;
  guardarTodo();

  renderPedidosCargados();
  calcularDiferencias();
  actualizarEstadoConfirmacion();

  const vista = $("vistaPedidosInline");
  if (vista) vista.innerHTML = "";
}

function productoAdmiteUnidadDocena(producto) {
  const forma = producto?.formaVenta || "";
  return forma === "unidad_docena" ||
    producto?.unidad === "docena" ||
    producto?.unidad === "unidad";
}

function cantidadAUnidadBase(cantidad, unidad, producto) {
  const valor = Number(cantidad || 0);
  const u = String(unidad || producto?.unidad || "unidad").toLowerCase();

  if (productoAdmiteUnidadDocena(producto)) {
    if (u === "docena" || u === "docenas") return valor * 12;
    if (u === "unidad" || u === "unidades" || u === "unid") return valor;
  }

  return valor;
}

function formatearCantidadResumen(cantidadBase, producto) {
  const valor = Number(cantidadBase || 0);

  if (productoAdmiteUnidadDocena(producto)) {
    const signo = valor < 0 ? "-" : "";
    const absoluto = Math.abs(valor);
    const docenas = Math.floor(absoluto / 12);
    const unidades = Math.round((absoluto - docenas * 12) * 1000) / 1000;
    const partes = [];

    if (docenas > 0) partes.push(`${fmt(docenas)} doc`);
    if (unidades > 0 || !partes.length) partes.push(`${fmt(unidades)} unid`);

    return signo + partes.join(" + ");
  }

  return `${fmt(valor)} ${producto?.unidad || "unidad"}`;
}

function calcularDiferencias() {
  const totalesPedido = {};

  const fechaTrabajo = $("fechaPedido")?.value || hoyISO();
  for (const pedido of pedidos.filter(p => fechaEntregaPedido(p) === fechaTrabajo)) {
    for (const it of pedido.items || []) {
      if (it.estado === "NO PEDIDO") continue;

      const producto = productoPorId(it.productoId);
      if (!producto) continue;

      const cantidadBase = cantidadAUnidadBase(it.cantidad, it.unidad, producto);
      totalesPedido[it.productoId] =
        (totalesPedido[it.productoId] || 0) + cantidadBase;
    }
  }

  const filas = [];

  for (const p of productos) {
    const produccionCargada = Number(produccion[claveProduccion(p.id)] || 0);
    const prodBase = cantidadAUnidadBase(produccionCargada, p.unidad, p);
    const pedBase = Number(totalesPedido[p.id] || 0);

    if ((p.activo === false || p.nuevo) && prodBase === 0 && pedBase === 0) continue;
    if (prodBase === 0 && pedBase === 0) continue;

    const difBase = prodBase - pedBase;
    let estado = "JUSTO";
    let accion = "No hacer nada";

    if (difBase > 0) {
      estado = "SOBRA";
      accion = `Sobran ${formatearCantidadResumen(difBase, p)}`;
    }

    if (difBase < 0) {
      estado = "FALTA";
      accion = `HACER ${formatearCantidadResumen(Math.abs(difBase), p)}`;
    }

    filas.push({
      producto: p.nombre,
      unidad: p.unidad,
      productoConfig: p,
      prod: prodBase,
      ped: pedBase,
      dif: difBase,
      prodTexto: formatearCantidadResumen(prodBase, p),
      pedTexto: formatearCantidadResumen(pedBase, p),
      difTexto: formatearCantidadResumen(Math.abs(difBase), p),
      estado,
      accion
    });
  }

  renderComparador(filas);
  renderResumenPanadero(filas);
}

function renderComparador(filas) {
  if (!filas.length) {
    $("comparador").innerHTML = "<p>Todavía no hay datos para comparar.</p>";
    return;
  }

  let html = "<table><thead><tr><th>Producto</th><th>Producido</th><th>Pedido total</th><th>Estado</th><th>Acción</th></tr></thead><tbody>";

  for (const f of filas) {
    const cls = f.estado === "FALTA" ? "estado-falta" : f.estado === "SOBRA" ? "estado-sobra" : "estado-justo";
    html += `<tr><td>${f.producto}</td><td>${f.prodTexto}</td><td>${f.pedTexto}</td><td class="${cls}">${f.estado}</td><td>${f.accion}</td></tr>`;
  }

  $("comparador").innerHTML = html + "</tbody></table>";
}

function renderResumenPanadero(filas) {
  const faltas = filas.filter(f => f.estado === "FALTA");
  const sobras = filas.filter(f => f.estado === "SOBRA");

  let txt = "FRATELLO - RESUMEN PARA PANADERO\n--------------------------------\n\n🔴 FALTANTES A PRODUCIR\n";
  txt += faltas.length ? faltas.map(f => `- ${f.producto}: HACER ${f.difTexto}`).join("\n") : "No falta producir nada.";

  txt += "\n\n🟢 SOBRANTES / NO HACER MÁS\n";
  txt += sobras.length ? sobras.map(f => `- ${f.producto}: sobran ${f.difTexto}`).join("\n") : "No hay sobrantes.";

  $("resumenPanadero").textContent = txt;
}

function fmt(n) {
  return String(Math.round((Number(n) + Number.EPSILON) * 1000) / 1000).replace(".", ",");
}

function copiarResumen() {
  navigator.clipboard.writeText($("resumenPanadero").textContent)
    .then(() => alert("Resumen copiado. Ahora podés pegarlo en WhatsApp."))
    .catch(() => alert("No se pudo copiar automáticamente. Copiá el texto manualmente."));
}



function textoPedidosClientes() {
  if (!pedidos.length) return "No hay pedidos cargados.";
  let texto = "FRATELLO - Pedidos clientes\n\n";
  pedidos.forEach(p => {
    texto += `${p.cliente}:\n`;
    p.items.filter(i => i.estado !== "NO PEDIDO").forEach(i => {
      texto += `- ${fmt(i.cantidad)} ${i.unidad} ${i.producto}\n`;
    });
    texto += "\n";
  });
  return texto;
}

function abrirModalImpresion() {
  $("modalImpresion")?.classList.remove("hidden");
  document.body.classList.add("modalAbierto");
}
function cerrarModalImpresion() {
  $("modalImpresion")?.classList.add("hidden");
  document.body.classList.remove("modalAbierto");
}
function dibujarPunteada(ctx,x1,y1,x2,y2){
  ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle="#777";ctx.lineWidth=1.4;
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();
}
function cargarImagen(src){
  return new Promise((ok,fail)=>{const img=new Image();img.onload=()=>ok(img);img.onerror=fail;img.src=src;});
}


const LISTAS_PRECIO_BASE = [
  { id: "cliente", nombre: "Clientes", fija: true },
  { id: "giuliano", nombre: "Giuliano", fija: true },
  { id: "bailone_libano", nombre: "Bailone / Líbano", fija: true },
  { id: "fratello", nombre: "Fratello", fija: true }
];

let listasPrecioPersonalizadas = JSON.parse(
  localStorage.getItem("fratello_listas_precio_personalizadas") || "[]"
);

function todasLasListasPrecio() {
  const personalizadas = Array.isArray(listasPrecioPersonalizadas)
    ? listasPrecioPersonalizadas
    : [];

  return [
    ...LISTAS_PRECIO_BASE,
    ...personalizadas.filter(lista =>
      lista &&
      lista.id &&
      lista.nombre &&
      !LISTAS_PRECIO_BASE.some(base => base.id === lista.id)
    )
  ];
}
function etiquetaListaPrecio(id){return todasLasListasPrecio().find(l=>l.id===id)?.nombre||"Clientes";}
function listaPrecioAutomatica(nombreCliente){const n=normalizar(nombreCliente||"");if(n.includes("giuliano"))return"giuliano";if(n.includes("bailone")||n.includes("libano"))return"bailone_libano";if(n.includes("fratello"))return"fratello";return"cliente";}
function listaPrecioCliente(nombreCliente){const c=datosClientesCompletos[nombreCliente]?.listaPrecio||"auto";return c==="auto"?listaPrecioAutomatica(nombreCliente):c;}
function unidadesPrecioProducto(p){const f=p.formaVenta||formaVentaPredeterminada(p.unidad);const m={solo_unidad:["unidad"],solo_docena:["docena"],solo_kg:["kg"],unidad_docena:["unidad","docena"],unidad_kg:["unidad","kg"],kg_paquete:["kg","paquete"],revisar_siempre:[p.unidad||"unidad"]};return[...new Set(m[f]||[p.unidad||"unidad"])];}
function clavePrecio(id,u){return`${id}__${normalizarUnidadPrecio(u)}`;}
function precioLista(id,u,lista){u=normalizarUnidadPrecio(u);const d=Number(listasPrecios?.[clavePrecio(id,u)]?.[lista]||0);if(d>0)return d;const pu=Number(listasPrecios?.[clavePrecio(id,"unidad")]?.[lista]||0),pd=Number(listasPrecios?.[clavePrecio(id,"docena")]?.[lista]||0);if(u==="docena"&&pu>0)return pu*12;if(u==="unidad"&&pd>0)return pd/12;return Number(productoPorId(id)?.precios?.[u]||0);}
function renderSelectorListasCliente(valorSeleccionado = null) {
  const select = $("nuevoClienteListaPrecio");
  if (!select) return;

  const valorActual = valorSeleccionado ?? select.value ?? "auto";
  select.innerHTML =
    '<option value="auto">Automática según el nombre</option>' +
    todasLasListasPrecio()
      .map(lista => `<option value="${escaparHtmlCatalogo(lista.id)}">${escaparHtmlCatalogo(lista.nombre)}</option>`)
      .join("");

  const existe = [...select.options].some(option => option.value === valorActual);
  select.value = existe ? valorActual : "auto";
}

function crearIdListaPrecio(nombre) {
  const base = normalizar(nombre)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "lista_especial";

  let id = base;
  let numero = 2;

  while (todasLasListasPrecio().some(lista => lista.id === id)) {
    id = `${base}_${numero}`;
    numero += 1;
  }

  return id;
}

function agregarListaPrecioPersonalizada() {
  const nombre = prompt(
    "Nombre del cliente o de la nueva lista de precios:",
    ""
  );

  if (!nombre || !nombre.trim()) return;

  const limpio = nombre.trim();
  const repetida = todasLasListasPrecio().some(
    lista => normalizar(lista.nombre) === normalizar(limpio)
  );

  if (repetida) {
    alert("Ya existe una lista con ese nombre.");
    return;
  }

  const nueva = {
    id: crearIdListaPrecio(limpio),
    nombre: limpio,
    fija: false
  };

  listasPrecioPersonalizadas.push(nueva);
  localStorage.setItem(
    "fratello_listas_precio_personalizadas",
    JSON.stringify(listasPrecioPersonalizadas)
  );

  renderListasPrecios();
  renderSelectorListasCliente();
  renderSelectorListasCliente(nueva.id);
  guardarEnNube();

  alert(`Lista "${limpio}" agregada correctamente.`);
}

function eliminarListaPrecioPersonalizada(id) {
  const lista = listasPrecioPersonalizadas.find(item => item.id === id);
  if (!lista) return;

  if (!confirm(`¿Eliminar la lista de precios "${lista.nombre}"?`)) return;

  listasPrecioPersonalizadas = listasPrecioPersonalizadas.filter(
    item => item.id !== id
  );

  Object.values(datosClientesCompletos || {}).forEach(cliente => {
    if (cliente?.listaPrecio === id) cliente.listaPrecio = "auto";
  });

  Object.keys(listasPrecios || {}).forEach(clave => {
    if (listasPrecios[clave] && typeof listasPrecios[clave] === "object") {
      delete listasPrecios[clave][id];
    }
  });

  localStorage.setItem(
    "fratello_listas_precio_personalizadas",
    JSON.stringify(listasPrecioPersonalizadas)
  );

  guardarTodo();
  renderListasPrecios();
  renderSelectorListasCliente("auto");
  renderListaClientesCompleta();

  alert(`Lista "${lista.nombre}" eliminada.`);
}

function renderListasPrecios(){
  const c = $("tablaListasPrecios");
  if (!c) return;

  const listas = todasLasListasPrecio();

  let h = `<table class="priceMatrix">
    <thead>
      <tr>
        <th>Producto</th>
        <th>Unidad</th>
        ${listas.map(lista => `
          <th>
            <div class="priceColumnHeader">
              <span>${escaparHtmlCatalogo(lista.nombre)}</span>
              ${lista.fija ? "" : `<button type="button" class="priceDeleteColumn" onclick="eliminarListaPrecioPersonalizada('${escaparHtmlCatalogo(lista.id)}')" title="Eliminar esta lista">×</button>`}
            </div>
          </th>`).join("")}
      </tr>
    </thead>
    <tbody>`;

  productos
    .filter(producto => producto.activo !== false)
    .forEach(producto => {
      unidadesPrecioProducto(producto).forEach(unidad => {
        const clave = clavePrecio(producto.id, unidad);

        h += `<tr data-price-key="${escaparHtmlCatalogo(clave)}">
          <td>${escaparHtmlCatalogo(producto.nombre)}</td>
          <td>${escaparHtmlCatalogo(unidad)}</td>
          ${listas.map(lista => `
            <td>
              <input
                type="number"
                min="0"
                step="0.01"
                data-price-list="${escaparHtmlCatalogo(lista.id)}"
                value="${Number(listasPrecios?.[clave]?.[lista.id] || 0)}"
                placeholder="0">
            </td>`).join("")}
        </tr>`;
      });
    });

  c.innerHTML = h + "</tbody></table>";
}

function guardarListasPrecios(){document.querySelectorAll("[data-price-key]").forEach(f=>{const k=f.dataset.priceKey;listasPrecios[k]=listasPrecios[k]||{};f.querySelectorAll("[data-price-list]").forEach(i=>listasPrecios[k][i.dataset.priceList]=Number(i.value||0));});localStorage.setItem("fratello_listas_precios",JSON.stringify(listasPrecios));guardarEnNube();const m=$("mensajeListasPrecios");if(m){m.textContent="✅ Listas de precios guardadas.";m.style.display="block";}}
function normalizarUnidadPrecio(unidad) {
  const u = String(unidad || "unidad").toLowerCase();
  if (["unid","unidades","u"].includes(u)) return "unidad";
  if (["doc","docenas"].includes(u)) return "docena";
  if (["kilo","kilos"].includes(u)) return "kg";
  if (u === "paquetes") return "paquete";
  if (u === "bolsas") return "bolsa";
  if (u === "bandejas") return "bandeja";
  return u;
}

function precioUnitarioItem(producto,unidad,cliente=""){if(!producto)return 0;return precioLista(producto.id,unidad,listaPrecioCliente(cliente));}

function datosTicketPedido(pedido){const dc=datosClientesCompletos[pedido.cliente]||{},lista=listaPrecioCliente(pedido.cliente);const items=(pedido.items||[]).filter(i=>i.estado!=="NO PEDIDO").map(item=>{const p=productoPorId(item.productoId),precioUnitario=precioUnitarioItem(p,item.unidad,pedido.cliente);return{descripcion:p?.nombre||item.producto||"Producto",cantidad:Number(item.cantidad||0),unidad:normalizarUnidadPrecio(item.unidad),precioUnitario,total:Number(item.cantidad||0)*precioUnitario};});return{id:pedido.id,cliente:pedido.cliente||"Sin cliente",fecha:pedido.fecha||$("fechaPedido")?.value||hoyISO(),direccion:dc.direccion||"",barrio:dc.barrio||"",listaPrecio:lista,listaPrecioNombre:etiquetaListaPrecio(lista),items,total:items.reduce((a,i)=>a+i.total,0)};}

function formatoDineroTicket(valor) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0
  }).format(Number(valor || 0));
}

function nombreArchivoSeguro(texto) {
  return String(texto || "cliente").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "").toLowerCase();
}

function cortarTextoCanvas(ctx, texto, maxWidth) {
  const palabras = String(texto || "").split(/\s+/);
  const lineas = [];
  let linea = "";
  palabras.forEach(p => {
    const prueba = linea ? `${linea} ${p}` : p;
    if (ctx.measureText(prueba).width <= maxWidth) linea = prueba;
    else { if (linea) lineas.push(linea); linea = p; }
  });
  if (linea) lineas.push(linea);
  return lineas.length ? lineas : [""];
}

function calcularAltoTicket(t,a=640){return Math.max(720,430+t.items.reduce((x,i)=>x+(String(i.descripcion).length>25?74:58),0)+(t.direccion||t.barrio?90:35));}
function dibujarTicketEnCanvas(ctx,t,x,y,a,h,n=""){const p=26,l=x+p,r=x+a-p;let yy=y+38;ctx.save();ctx.fillStyle="#fff";ctx.fillRect(x,y,a,h);ctx.strokeStyle="#111";ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,a-2,h-2);ctx.fillStyle="#111";ctx.textAlign="center";ctx.font="bold 29px Arial";ctx.fillText("PANADERÍA FRATELLO",x+a/2,yy);yy+=30;ctx.font="14px Arial";ctx.fillText("PEDIDO / TICKET DE ENTREGA",x+a/2,yy);yy+=28;ctx.setLineDash([8,5]);ctx.beginPath();ctx.moveTo(l,yy);ctx.lineTo(r,yy);ctx.stroke();ctx.setLineDash([]);yy+=26;ctx.textAlign="left";ctx.font="bold 17px Arial";ctx.fillText(`Cliente: ${t.cliente}`,l,yy);yy+=24;ctx.font="15px Arial";ctx.fillText(`Fecha: ${new Date(t.fecha+"T12:00:00").toLocaleDateString("es-AR")}`,l,yy);ctx.textAlign="right";ctx.fillText(`Pedido Nº ${n}`,r,yy);yy+=28;ctx.setLineDash([8,5]);ctx.beginPath();ctx.moveTo(l,yy);ctx.lineTo(r,yy);ctx.stroke();ctx.setLineDash([]);yy+=24;ctx.textAlign="left";ctx.font="bold 14px Arial";ctx.fillText("DESCRIPCIÓN",l,yy);yy+=22;ctx.font="bold 13px Arial";ctx.fillText("CANT.",l,yy);ctx.textAlign="right";ctx.fillText("P. UNIT.",x+a*.70,yy);ctx.fillText("TOTAL",r,yy);yy+=16;ctx.beginPath();ctx.moveTo(l,yy);ctx.lineTo(r,yy);ctx.stroke();yy+=24;for(const i of t.items){ctx.textAlign="left";ctx.font="bold 15px Arial";const ls=cortarTextoCanvas(ctx,i.descripcion,a-p*2).slice(0,2);ls.forEach((v,j)=>ctx.fillText(v,l,yy+j*18));yy+=ls.length*18+8;ctx.font="14px Arial";ctx.fillText(`${fmt(i.cantidad)} ${i.unidad}`,l,yy);ctx.textAlign="right";ctx.fillText(i.precioUnitario>0?formatoDineroTicket(i.precioUnitario):"Sin precio",x+a*.70,yy);ctx.fillText(i.precioUnitario>0?formatoDineroTicket(i.total):"—",r,yy);yy+=18;ctx.strokeStyle="#bbb";ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(l,yy);ctx.lineTo(r,yy);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle="#111";yy+=20;}ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(l,yy);ctx.lineTo(r,yy);ctx.stroke();yy+=34;ctx.font="bold 25px Arial";ctx.textAlign="left";ctx.fillText("TOTAL",l,yy);ctx.textAlign="right";ctx.fillText(formatoDineroTicket(t.total),r,yy);yy+=34;ctx.lineWidth=2;ctx.setLineDash([8,5]);ctx.beginPath();ctx.moveTo(l,yy);ctx.lineTo(r,yy);ctx.stroke();ctx.setLineDash([]);yy+=30;ctx.textAlign="left";ctx.font="bold 16px Arial";ctx.fillText("DIRECCIÓN DE ENTREGA",l,yy);yy+=24;ctx.font="15px Arial";if(t.direccion){cortarTextoCanvas(ctx,t.direccion,a-p*2).forEach(v=>{ctx.fillText(v,l,yy);yy+=20;});}else{ctx.fillText("Sin dirección cargada",l,yy);yy+=20;}if(t.barrio){ctx.fillText(`Barrio: ${t.barrio}`,l,yy);yy+=22;}yy+=12;ctx.textAlign="center";ctx.font="14px Arial";ctx.fillText("Gracias por elegir Panadería Fratello",x+a/2,yy);ctx.restore();}

function crearCanvasTicketIndividual(t,a=640){const h=calcularAltoTicket(t,a),c=document.createElement("canvas");c.width=a;c.height=h;dibujarTicketEnCanvas(c.getContext("2d"),t,0,0,a,h,String(t.id).slice(-6));return c;}

function avisarPreciosFaltantes(lista=pedidos) {
  const faltantes=new Set();
  lista.forEach(p=>(p.items||[]).forEach(i=>{
    if(i.estado==="NO PEDIDO")return;
    const prod=productoPorId(i.productoId);
    if(precioUnitarioItem(prod,i.unidad,p.cliente)<=0)faltantes.add(prod?.nombre||i.producto);
  }));
  if(faltantes.size)alert("El ticket se generará, pero faltan precios para:\n\n"+[...faltantes].slice(0,12).join("\n")+"\n\nCargalos desde Administrar productos predeterminados.");
}

async function generarVistaPedidos(){
  if(!pedidos.length){alert("No hay pedidos cargados.");return;}
  avisarPreciosFaltantes(pedidos);
  const tickets=pedidos.map(datosTicketPedido),canvas=$("canvasPedidosImpresion");
  const W=1400,cols=2,cellW=W/cols,cellH=900,rows=Math.ceil(tickets.length/cols);
  canvas.width=W;canvas.height=Math.max(cellH,rows*cellH);
  const ctx=canvas.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);
  tickets.forEach((t,i)=>dibujarTicketEnCanvas(ctx,t,(i%cols)*cellW+8,Math.floor(i/cols)*cellH+8,cellW-16,cellH-16,String(t.id).slice(-6)));
  abrirModalImpresion();
}

function obtenerJsPDF(){return window.jspdf?.jsPDF||null;}

function agregarTicketPdf(doc,t,x,y,a){const c=crearCanvasTicketIndividual(t),h=a*c.height/c.width;doc.addImage(c.toDataURL("image/jpeg",.95),"JPEG",x,y,a,h,undefined,"FAST");return h;}
function descargarPdfPedidos(){if(!pedidos.length){alert("No hay pedidos cargados.");return;}const J=obtenerJsPDF();if(!J){alert("No se pudo cargar el generador de PDF.");return;}avisarPreciosFaltantes(pedidos);const d=new J({orientation:"portrait",unit:"mm",format:"a4"}),a=62,m=6,g=4;let x=m,y=m,col=0,hf=0;pedidos.map(datosTicketPedido).forEach((t,idx)=>{const c=crearCanvasTicketIndividual(t),h=a*c.height/c.width;if(y+h>291&&col===0){d.addPage();y=m;}agregarTicketPdf(d,t,x,y,a);hf=Math.max(hf,h);col++;if(col===3){col=0;x=m;y+=hf+g;hf=0;if(idx<pedidos.length-1&&y+80>291){d.addPage();y=m;}}else x=m+col*(a+g);});d.save(`tickets-fratello-${hoyISO()}.pdf`);}
function descargarPdfPedidoIndividual(id){const p=pedidos.find(x=>Number(x.id)===Number(id));if(!p){alert("No se encontró el pedido.");return;}const J=obtenerJsPDF();if(!J){alert("No se pudo cargar el generador de PDF.");return;}avisarPreciosFaltantes([p]);const t=datosTicketPedido(p),c=crearCanvasTicketIndividual(t),a=80,h=Math.max(100,a*c.height/c.width),d=new J({orientation:"portrait",unit:"mm",format:[a,h]});d.addImage(c.toDataURL("image/jpeg",.96),"JPEG",0,0,a,h,undefined,"FAST");d.save(`ticket-fratello-${nombreArchivoSeguro(t.cliente)}-${t.fecha}.pdf`);}

function guardarImagenPedidos(){
  const canvas=$("canvasPedidosImpresion"); if(!canvas)return;
  const a=document.createElement("a");a.download=`tickets-fratello-${hoyISO()}.jpg`;a.href=canvas.toDataURL("image/jpeg",0.95);a.click();
}
async function compartirImagenPedidos(){
  const canvas=$("canvasPedidosImpresion"); if(!canvas)return;
  const blob=await new Promise(r=>canvas.toBlob(r,"image/jpeg",0.95));
  const file=new File([blob],`tickets-fratello-${hoyISO()}.jpg`,{type:"image/jpeg"});
  if(navigator.share && navigator.canShare && navigator.canShare({files:[file]})){
    try{await navigator.share({title:"Pedidos Fratello",files:[file]});return;}catch(e){if(e.name==="AbortError")return;}
  }
  guardarImagenPedidos();
}
function imprimirImagenPedidos(){if(!pedidos.length){alert("No hay pedidos cargados.");return;}const imgs=pedidos.map(p=>crearCanvasTicketIndividual(datosTicketPedido(p)).toDataURL("image/png")),w=window.open("","_blank");if(!w){alert("Permití ventanas emergentes para imprimir.");return;}w.document.write(`<html><head><style>@page{size:80mm auto;margin:0}body{margin:0}.ticket{display:block;width:80mm;height:auto;page-break-after:always}.ticket:last-child{page-break-after:auto}</style></head><body>`);imgs.forEach(src=>w.document.write(`<img class="ticket" src="${src}">`));w.document.write(`<script>window.addEventListener("load",()=>setTimeout(()=>window.print(),300));<\/script></body></html>`);w.document.close();}


function resetDatos() {
  if (!confirm("¿Seguro que querés borrar solo los pedidos cargados?")) return;

  pedidos = [];
  localStorage.setItem("fratello_pedidos", JSON.stringify(pedidos));
  guardarEnNube();

  renderPedidosCargados();
  $("ultimoProcesado").innerHTML = "";
  $("comparador").innerHTML = "";
  $("resumenPanadero").textContent = "";
}


// --- MODO ADMINISTRADOR ÚNICO ---
let usuarioActual = "admin";

function aplicarPermisosUsuario() {
  document.querySelectorAll(".adminOnly").forEach(el => {
    el.style.display = "";
  });

  document.querySelectorAll(".normalOnly").forEach(el => {
    el.style.display = "none";
  });
}



function destildarCasillasConfirmacion() {
  const checkProduccion = $("checkProduccionCompleta");
  const checkPedido = $("checkPedidoCompleto");

  if (checkProduccion) checkProduccion.checked = false;
  if (checkPedido) checkPedido.checked = false;
}

function actualizarEstadoConfirmacion() {
  const el = $("estadoConfirmacion");
  if (!el) return;
  el.textContent = pedidosConfirmados ? "Pedidos confirmados" : "Pedidos sin confirmar";
  el.className = pedidosConfirmados ? "estadoConfirmacion confirmado" : "estadoConfirmacion";
}

function confirmarPedidos() {
  const checkProduccion = $("checkProduccionCompleta");
  const checkPedido = $("checkPedidoCompleto");

  if (checkProduccion && !checkProduccion.checked) {
    alert("Falta tildar que el día seleccionado es correcto.");
    return;
  }

  if (checkPedido && !checkPedido.checked) {
    alert("Falta tildar que todos los pedidos cargados están correctos.");
    return;
  }

  if (!pedidos.length) {
    alert("Todavía no hay pedidos cargados.");
    return;
  }

  const ambiguosUnidad = pedidosConUnidadAmbigua();
  const ambiguosProducto = pedidosConProductoAmbiguo();
  const totalAmbiguos = ambiguosUnidad.length + ambiguosProducto.length;
  if (totalAmbiguos) {
    alert(`Hay ${totalAmbiguos} revisión(es) pendiente(s) de producto o unidad.`);
    return;
  }

  pedidosConfirmados = true;
  guardarTodo();
  actualizarEstadoConfirmacion();
  destildarCasillasConfirmacion();
  alert("Pedidos confirmados correctamente. Se conservarán hasta iniciar una nueva jornada.");
}




function fechaJornadaActual() {
  return $("fechaPedido")?.value || hoyISO();
}

function diaJornadaActual() {
  return $("diaProduccion")?.value || $("diaProduccionPedidos")?.value || "";
}

function totalesPedidosDe(listaPedidos) {
  const totales = {};
  (listaPedidos || []).forEach(pedido => {
    (pedido.items || []).forEach(it => {
      if (it.estado === "NO PEDIDO") return;
      const id = it.productoId;
      if (!id) return;
      totales[id] = (totales[id] || 0) + Number(it.cantidad || 0);
    });
  });
  return totales;
}

function sumarTotales(a, b) {
  const salida = {...(a || {})};
  Object.entries(b || {}).forEach(([id, cantidad]) => {
    salida[id] = Number(salida[id] || 0) + Number(cantidad || 0);
  });
  return salida;
}

function mapaProduccionActual() {
  const salida = {};
  productos.forEach(p => {
    salida[p.id] = Number(produccion[claveProduccion(p.id)] || 0);
  });
  return salida;
}

function diferenciasDesde(produccionMapa, pedidosMapa) {
  const salida = {};
  const ids = new Set([
    ...Object.keys(produccionMapa || {}),
    ...Object.keys(pedidosMapa || {})
  ]);

  ids.forEach(id => {
    salida[id] = Number(produccionMapa?.[id] || 0) - Number(pedidosMapa?.[id] || 0);
  });

  return salida;
}

function productoPorIdMemoria(id) {
  return productos.find(p => p.id === id) || {
    id,
    nombre: id.replace(/^EXTRA_/, "").replace(/_/g, " "),
    unidad: "unidad"
  };
}

function memoriaCorrespondeAJornadaActual() {
  if (!memoriaUltimoEnvio) return false;
  return memoriaUltimoEnvio.fecha === fechaJornadaActual();
}

function actualizarPanelMemoriaEnvio() {
  const estado = $("estadoMemoriaEnvio");
  if (!estado) return;

  if (!memoriaUltimoEnvio) {
    estado.textContent = "No hay un envío guardado.";
    return;
  }

  const cantidadClientes = (memoriaUltimoEnvio.clientes || []).length;
  estado.textContent =
    `${memoriaUltimoEnvio.fecha} · ${memoriaUltimoEnvio.hora || ""} · ` +
    `${cantidadClientes} cliente${cantidadClientes === 1 ? "" : "s"} incluidos.`;
}

function borrarMemoriaEnvio() {
  if (!memoriaUltimoEnvio) {
    alert("No hay memoria de envío para borrar.");
    return;
  }

  if (!confirm("¿Seguro que querés comenzar una jornada nueva y borrar la memoria del último envío?")) return;

  memoriaUltimoEnvio = null;
  localStorage.removeItem("fratello_memoria_envio");

  // La limpieza completa ocurre únicamente al comenzar una jornada nueva.
  limpiarJornadaDespuesDeEnviar();
  actualizarPanelMemoriaEnvio();

  alert("Nueva jornada iniciada. Se borraron los pedidos y la memoria del envío anterior.");
}

function guardarMemoriaEnvio(produccionMapa, pedidosAcumulados, diferencias, clientesAcumulados) {
  memoriaUltimoEnvio = {
    fecha: fechaJornadaActual(),
    dia: diaJornadaActual(),
    produccion: produccionMapa,
    pedidosTotales: pedidosAcumulados,
    diferencias,
    clientes: clientesAcumulados,
    hora: new Date().toLocaleTimeString("es-AR", {hour:"2-digit", minute:"2-digit"}),
    actualizado: new Date().toISOString()
  };

  localStorage.setItem("fratello_memoria_envio", JSON.stringify(memoriaUltimoEnvio));
  actualizarPanelMemoriaEnvio();
}

function construirMensajeActualizacion(pedidosNuevos, diferenciasAnteriores, diferenciasNuevas) {
  let mensaje = "FRATELLO - ACTUALIZACIÓN DE PEDIDOS\n\n";

  mensaje += "PEDIDOS NUEVOS / TARDÍOS:\n\n";
  pedidosNuevos.forEach(pedido => {
    mensaje += `${pedido.cliente}:\n`;
    const items = (pedido.items || []).filter(i => i.estado !== "NO PEDIDO");
    if (!items.length) {
      mensaje += "- Sin productos detectados\n";
    } else {
      items.forEach(it => {
        mensaje += `- ${fmt(it.cantidad)} ${it.unidad} ${it.producto}\n`;
      });
    }
    mensaje += "\n";
  });

  mensaje += "--------------------\n";
  mensaje += "CAMBIOS SOBRE EL MENSAJE ANTERIOR:\n\n";

  const ids = new Set([
    ...Object.keys(diferenciasAnteriores || {}),
    ...Object.keys(diferenciasNuevas || {})
  ]);

  const cambios = [];
  ids.forEach(id => {
    const anterior = Number(diferenciasAnteriores?.[id] || 0);
    const nuevo = Number(diferenciasNuevas?.[id] || 0);
    const delta = nuevo - anterior;
    if (Math.abs(delta) < 0.0001) return;

    const producto = productoPorIdMemoria(id);
    cambios.push({producto, delta});
  });

  if (!cambios.length) {
    mensaje += "- El pedido no modifica las cantidades informadas anteriormente.\n";
  } else {
    cambios.forEach(({producto, delta}) => {
      if (delta < 0) {
        mensaje += `🔴 AGREGAR ${fmt(Math.abs(delta))} ${producto.unidad} ${producto.nombre}\n`;
      } else {
        mensaje += `🟢 REDUCIR / GUARDAR ${fmt(delta)} ${producto.unidad} ${producto.nombre}\n`;
      }
    });
  }

  mensaje += "\nEste mensaje complementa el envío anterior.";
  return mensaje;
}

function obtenerFilasComparador() {
  const totalesPedido = {};

  for (const pedido of pedidos) {
    for (const it of pedido.items) {
      if (it.estado !== "NO PEDIDO") {
        totalesPedido[it.productoId] = (totalesPedido[it.productoId] || 0) + Number(it.cantidad || 0);
      }
    }
  }

  const filas = [];

  for (const p of productos) {
    const prod = Number(produccion[claveProduccion(p.id)] || 0);
    const ped = Number(totalesPedido[p.id] || 0);

    if (prod === 0 && ped === 0) continue;

    const dif = prod - ped;

    filas.push({
      producto: p.nombre,
      unidad: p.unidad,
      prod,
      ped,
      dif
    });
  }

  return filas;
}


function limpiarJornadaDespuesDeEnviar() {
  pedidos = [];
  pedidosConfirmados = false;

  localStorage.setItem("fratello_pedidos", JSON.stringify(pedidos));
  localStorage.setItem("fratello_pedidos_confirmados", JSON.stringify(false));

  const selectorProduccion = $("diaProduccion");
  const selectorPedidos = $("diaProduccionPedidos");
  const checkProduccion = $("checkProduccionCompleta");
  const checkDiaPedidos = $("checkDiaPedidos");
  const checkPedidos = $("checkPedidoCompleto");
  const pedidoCrudo = $("pedidoCrudo");

  if (selectorProduccion) selectorProduccion.value = "";
  if (selectorPedidos) selectorPedidos.value = "";
  if (checkProduccion) checkProduccion.checked = false;
  if (checkDiaPedidos) checkDiaPedidos.checked = false;
  if (checkPedidos) checkPedidos.checked = false;
  if (pedidoCrudo) pedidoCrudo.value = "";

  const pedidosCargados = $("pedidosCargados");
  const ultimoProcesado = $("ultimoProcesado");
  const comparador = $("comparador");
  const resumenPanadero = $("resumenPanadero");
  const vistaPedidos = $("vistaPedidosInline");
  const produccionLista = $("produccionLista");
  const produccionExtra = $("produccionExtra");

  if (pedidosCargados) pedidosCargados.innerHTML = "<p>No hay pedidos cargados.</p>";
  if (ultimoProcesado) ultimoProcesado.innerHTML = "";
  if (comparador) comparador.innerHTML = "";
  if (resumenPanadero) resumenPanadero.textContent = "";
  if (vistaPedidos) vistaPedidos.innerHTML = "";
  if (produccionLista) produccionLista.innerHTML = "";
  if (produccionExtra) produccionExtra.innerHTML = "";

  actualizarTarjetaDiaPedidos();
  guardarEnNube();
}

function abrirWhatsApp(numero, mensaje) {
  const texto = encodeURIComponent(mensaje);
  const url = numero
    ? `https://wa.me/${numero}?text=${texto}`
    : `https://wa.me/?text=${texto}`;

  window.location.href = url;
}


function verificarChecksAntesDeWhatsApp() {
  const selectorProduccion = $("diaProduccion");
  const selectorPedidos = $("diaProduccionPedidos");
  const checkProduccion = $("checkProduccionCompleta");
  const checkDiaPedidos = $("checkDiaPedidos");
  const checkPedido = $("checkPedidoCompleto");

  const diaElegido =
    (selectorProduccion && selectorProduccion.value) ||
    (selectorPedidos && selectorPedidos.value);

  if (!diaElegido) {
    alert("Primero seleccioná el día de producción.");
    return false;
  }

  const diaConfirmado =
    (checkProduccion && checkProduccion.checked) ||
    (checkDiaPedidos && checkDiaPedidos.checked);

  if (!diaConfirmado) {
    alert("Primero confirmá que el día seleccionado es correcto.");
    return false;
  }

  if (checkPedido && !checkPedido.checked) {
    alert("Primero tildá que los pedidos cargados están correctos.");
    return false;
  }

  return true;
}

function generarMensajeGrupoFratello() {
  if (!verificarChecksAntesDeWhatsApp()) return;

  const pedidosNuevos = [...pedidos];
  const totalesNuevos = totalesPedidosDe(pedidosNuevos);
  const esActualizacion = memoriaCorrespondeAJornadaActual();

  let produccionMapa;
  let pedidosAcumulados;
  let diferenciasNuevas;
  let clientesAcumulados;
  let mensaje;

  if (esActualizacion) {
    produccionMapa = memoriaUltimoEnvio.produccion || mapaProduccionActual();
    pedidosAcumulados = sumarTotales(memoriaUltimoEnvio.pedidosTotales, totalesNuevos);
    diferenciasNuevas = diferenciasDesde(produccionMapa, pedidosAcumulados);
    clientesAcumulados = [
      ...(memoriaUltimoEnvio.clientes || []),
      ...pedidosNuevos.map(p => p.cliente)
    ];

    mensaje = construirMensajeActualizacion(
      pedidosNuevos,
      memoriaUltimoEnvio.diferencias || {},
      diferenciasNuevas
    );
  } else {
    produccionMapa = mapaProduccionActual();
    pedidosAcumulados = totalesNuevos;
    diferenciasNuevas = diferenciasDesde(produccionMapa, pedidosAcumulados);
    clientesAcumulados = pedidosNuevos.map(p => p.cliente);

    const filas = obtenerFilasComparador();
    const faltan = filas.filter(f => f.dif < 0);
    const sobran = filas.filter(f => f.dif > 0);

    mensaje = "FRATELLO - Resumen de producción y pedidos\n\n";

    mensaje += "🔴 FALTA HACER:\n";
    if (!faltan.length) {
      mensaje += "- Nada\n";
    } else {
      faltan.forEach(f => {
        mensaje += `🔴 ${fmt(Math.abs(f.dif))} ${f.unidad} ${f.producto}\n`;
      });
    }

    mensaje += "\n🟢 SOBRA / GUARDAR:\n";
    if (!sobran.length) {
      mensaje += "- Nada\n";
    } else {
      sobran.forEach(f => {
        mensaje += `🟢 ${fmt(f.dif)} ${f.unidad} ${f.producto}\n`;
      });
    }

    mensaje += "\n--------------------\nPEDIDOS DE CLIENTES:\n\n";

    pedidosNuevos.forEach(pedido => {
      const itemsValidos = (pedido.items || []).filter(i => i.estado !== "NO PEDIDO");
      mensaje += `${pedido.cliente}:\n`;

      if (!itemsValidos.length) {
        mensaje += "- Sin productos detectados\n";
      } else {
        itemsValidos.forEach(it => {
          mensaje += `- ${fmt(it.cantidad)} ${it.unidad} ${it.producto}\n`;
        });
      }
      mensaje += "\n";
    });

    mensaje += "Enviado desde sistema Fratello.";
  }

  guardarMemoriaEnvio(
    produccionMapa,
    pedidosAcumulados,
    diferenciasNuevas,
    [...new Set(clientesAcumulados)]
  );

  guardarEnNube();

  // v1.03: enviar el mensaje NO borra los pedidos.
  // Se conservan para poder corregirlos o reenviarlos.
  abrirWhatsApp("", mensaje);
}


const WHATSAPP_CLIENTE_PRUEBA = "5492657545599";

function generarLinkFormularioCliente() {
  const base = window.location.origin + window.location.pathname.replace("index.html", "");
  return base + "pedido.html";
}

function recordarPedidoCliente() {
  const link = generarLinkFormularioCliente();

  const mensaje = `Hola! Te recordamos cargar tu pedido para mañana en este formulario:

${link}

Gracias, Fratello.`;

  abrirWhatsApp(WHATSAPP_CLIENTE_PRUEBA, mensaje);
}


async function init() {
  if ($("btnGuardarPedidoFijo")) $("btnGuardarPedidoFijo").onclick=guardarPedidoFijo;
  if ($("btnLimpiarPedidoFijo")) $("btnLimpiarPedidoFijo").onclick=limpiarFormularioPedidoFijo;
  if ($("btnCargarPedidosFijosFecha")) $("btnCargarPedidosFijosFecha").onclick=cargarPedidosFijosParaFecha;

  if ($("btnAgregarListaPrecio")) {
    $("btnAgregarListaPrecio").onclick = agregarListaPrecioPersonalizada;
  }

  if ($("btnGuardarListasPrecios")) {
    $("btnGuardarListasPrecios").onclick = guardarListasPrecios;
  }
  if ($("btnAgregarProductoCatalogo")) $("btnAgregarProductoCatalogo").onclick = agregarProductoCatalogo;
  if ($("listaAdministradorProductos")) $("listaAdministradorProductos").onclick = manejarClicksAdministradorProductos;
  renderAdministradorProductos();

  const btnContinuarResumen = $("btnContinuarResumen");
  if (btnContinuarResumen) {
    btnContinuarResumen.onclick = continuarAlResumenSiEstaConfirmado;
  }

  const btnRecordarPendientes = $("btnRecordarPendientes");
  if (btnRecordarPendientes) {
    btnRecordarPendientes.onclick = recordarTodosLosPendientes;
  }

  const btnActualizarPendientes = $("btnActualizarPendientes");
  if (btnActualizarPendientes) {
    btnActualizarPendientes.onclick = renderClientesPendientes;
  }

  const btnBorrarNotificaciones = $("btnBorrarNotificaciones");
  if (btnBorrarNotificaciones) {
    btnBorrarNotificaciones.onclick = borrarTodasLasNotificaciones;
  }

  actualizarEstadoColaRecordatorios();

  iniciarNavegacionFratello();

  const btnActualizarNotificaciones = $("btnActualizarNotificaciones");
  if (btnActualizarNotificaciones) {
    btnActualizarNotificaciones.addEventListener(
      "click",
      cargarHistorialNotificaciones
    );
  }

  const btnActivarNotificaciones = $("btnActivarNotificaciones");
  const btnProbarNotificacion = $("btnProbarNotificacion");

  if (btnActivarNotificaciones) {
    btnActivarNotificaciones.addEventListener("click", activarNotificacionesFratello);
  }

  if (btnProbarNotificacion) {
    btnProbarNotificacion.addEventListener("click", probarNotificacionFratello);
  }

  actualizarEstadoNotificaciones();

  const btnActualizarDatos = $("btnActualizarDatos");
  if (btnActualizarDatos) {
    btnActualizarDatos.addEventListener("click", actualizarDatosManual);
  }

  const btnGuardarClienteCompleto = $("btnGuardarClienteCompleto");
  const btnLimpiarClienteCompleto = $("btnLimpiarClienteCompleto");

  if (btnGuardarClienteCompleto) {
    btnGuardarClienteCompleto.addEventListener("click", guardarClienteCompleto);
  }

  if (btnLimpiarClienteCompleto) {
    btnLimpiarClienteCompleto.addEventListener("click", limpiarFormularioClienteCompleto);
  }

  if (!Array.isArray(clientes) || clientes.length === 0) clientes = [...clientesIniciales];
  await cargarDesdeNube();
  validarClientes();

  // v1.06: después de recuperar Firebase, volver a dibujar catálogo y precios.
  renderAdministradorProductos();
  renderListasPrecios();
  escucharCambiosNube();
  escucharHistorialNotificaciones();
  aplicarPermisosUsuario();
  if ($("fechaPedido")) $("fechaPedido").value = fechaISOManana();
  if ($("fechaCargarPedidosFijos")) $("fechaCargarPedidosFijos").value = fechaISOManana();
  renderClientes();

  if ($("cliente")) $("cliente").onchange = limpiarPedidoCrudo;
  if ($("btnAgregarCliente")) $("btnAgregarCliente").onclick = agregarCliente;
  if ($("btnModificarCliente")) $("btnModificarCliente").onclick = modificarCliente;

  $("diaProduccion").onchange = () => {
    renderProduccion();
    calcularDiferencias();
  };

  $("btnDesbloquearProduccion").onclick = desbloquearProduccion;
  $("btnBloquearProduccion").onclick = bloquearProduccion;
  $("btnGuardarProduccion").onclick = guardarProduccion;
  $("btnEditarPredeterminada").onclick = activarEdicionPredeterminada;
  $("btnGuardarPredeterminada").onclick = guardarPredeterminada;
  $("btnCancelarPredeterminada").onclick = cancelarEdicionPredeterminada;

  $("btnProcesar").onclick = () => procesarPedidoActual();
  $("btnLimpiarPedido").onclick = () => $("pedidoCrudo").value = "";
  $("btnCalcular").onclick = calcularDiferencias;
  if ($("btnWhatsAppGrupo")) $("btnWhatsAppGrupo").onclick = generarMensajeGrupoFratello;
  if ($("btnRecordarCliente")) $("btnRecordarCliente").onclick = recordarPedidoCliente;
  if ($("btnBorrarMemoriaEnvio")) $("btnBorrarMemoriaEnvio").onclick = borrarMemoriaEnvio;
  $("btnExportar").onclick = copiarResumen;
  $("btnReset").onclick = resetDatos;
  $("btnVistaPedidos").onclick = generarVistaPedidos;
  if ($("btnCerrarModalImpresion")) $("btnCerrarModalImpresion").onclick = cerrarModalImpresion;
  if ($("btnCerrarModalImpresion2")) $("btnCerrarModalImpresion2").onclick = cerrarModalImpresion;
  if ($("cerrarModalBackdrop")) $("cerrarModalBackdrop").onclick = cerrarModalImpresion;
  if ($("btnImprimirImagenPedidos")) $("btnImprimirImagenPedidos").onclick = imprimirImagenPedidos;
  if ($("btnCompartirImagenPedidos")) $("btnCompartirImagenPedidos").onclick = compartirImagenPedidos;
  if ($("btnGuardarImagenPedidos")) $("btnGuardarImagenPedidos").onclick = guardarImagenPedidos;
  if ($("btnDescargarPdfPedidos")) $("btnDescargarPdfPedidos").onclick = descargarPdfPedidos;
  if ($("btnBorrarSeleccionados")) $("btnBorrarSeleccionados").onclick = borrarPedidosSeleccionados;

  iniciarSincronizacionDia();

  if (window.location.hash === "#notificaciones") {
    abrirSeccionFratello("seccionNotificaciones");
  }

  renderListaClientesCompleta();
  renderClientesPendientes();
  actualizarPanelMemoriaEnvio();
  actualizarCampanaNotificaciones();

  renderProduccion();
  renderPedidosCargados();
  renderSelectorClientesPedidoFijo();
  renderPedidosFijos();
  renderPedidosFuturos();
  renderHistorialPedidos();
  renderListasPrecios();
  calcularDiferencias();
}




window.configurarPedidoFijoCliente=configurarPedidoFijoCliente;
window.editarPedidoCargado=editarPedidoCargado;
window.repetirPedidoHistorial=repetirPedidoHistorial;
window.editarPedidoFijo=editarPedidoFijo;
window.alternarPedidoFijo=alternarPedidoFijo;
window.eliminarPedidoFijo=eliminarPedidoFijo;
window.eliminarListaPrecioPersonalizada = eliminarListaPrecioPersonalizada;
window.descargarPdfPedidoIndividual = descargarPdfPedidoIndividual;
window.reprocesarPedidoFormulario = reprocesarPedidoFormulario;
window.resolverProductoPedido = resolverProductoPedido;
window.resolverUnidadPedido = resolverUnidadPedido;
window.editarClienteCompleto = editarClienteCompleto;
window.eliminarClienteCompleto = eliminarClienteCompleto;
 
init().catch(error => {
  console.error("Error iniciando Fratello:", error);
  const estado = document.getElementById("estadoSync");
  if (estado) estado.textContent = "Error parcial al iniciar";
});


window.recordarClientePendiente = recordarClientePendiente;
window.recordarTodosLosPendientes = recordarTodosLosPendientes;
window.enviarSiguienteRecordatorioPendiente = enviarSiguienteRecordatorioPendiente;
window.borrarTodasLasNotificaciones = borrarTodasLasNotificaciones;

if (messaging) {
  messaging.onMessage(async payload => {
    cargarHistorialNotificaciones();
    const titulo = payload.notification?.title || "Fratello";
    const cuerpo = payload.notification?.body || "Tenés una nueva notificación.";

    try {
      const registro = await obtenerRegistroServiceWorkerNotificaciones();
      await registro.showNotification(titulo, {
        body: cuerpo,
        icon: "icon-192.png",
        badge: "icon-192.png",
        data: payload.data || { url: "./index.html" }
      });
    } catch (error) {
      console.error("Error mostrando notificación recibida:", error);
    }
  });
}
