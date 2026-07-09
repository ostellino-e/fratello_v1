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

function setEstadoSync(texto) {
  const el = $("estadoSync");
  if (el) el.textContent = texto;
}

function datosActuales() {
  return {
    produccion,
    pedidos,
    predeterminadas,
    clientes,
    correspondePedido,
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
    setEstadoSync("Modo local");
    return;
  }

  try {
    setEstadoSync("Cargando online...");
    const doc = await db.collection("fratello").doc("estado").get();

    if (doc.exists) {
      const data = doc.data();
      produccion = data.produccion || produccion;
      pedidos = data.pedidos || pedidos;
      predeterminadas = data.predeterminadas || predeterminadas;
      clientes = (Array.isArray(data.clientes) && data.clientes.length > 0) ? data.clientes : clientes;
      validarClientes();
    productosExtra = data.productosExtra || productosExtra;
    pedidosConfirmados = data.pedidosConfirmados || false;
    productosExtra.forEach(p => { if (!productos.find(x => x.id === p.id)) productos.push(p); } );
      productosExtra = data.productosExtra || productosExtra;
      pedidosConfirmados = data.pedidosConfirmados || false;
      productosExtra.forEach(p => { if (!productos.find(x => x.id === p.id)) productos.push(p); } );
    correspondePedido = data.correspondePedido || correspondePedido;
      correspondePedido = data.correspondePedido || correspondePedido;
    }

    setEstadoSync("Online");
  } catch (error) {
    console.error("Error cargando Firebase:", error);
    setEstadoSync("Error online / usando local");
  }
}

function escucharCambiosNube() {
  if (!db) return;

  db.collection("fratello").doc("estado").onSnapshot((doc) => {
    if (!doc.exists) return;

    cargandoDesdeNube = true;
    const data = doc.data();

    produccion = data.produccion || produccion;
    pedidos = data.pedidos || pedidos;
    predeterminadas = data.predeterminadas || predeterminadas;
    clientes = (Array.isArray(data.clientes) && data.clientes.length > 0) ? data.clientes : clientes;
      validarClientes();
      productosExtra = data.productosExtra || productosExtra;
      pedidosConfirmados = data.pedidosConfirmados || false;
      productosExtra.forEach(p => { if (!productos.find(x => x.id === p.id)) productos.push(p); } );
    correspondePedido = data.correspondePedido || correspondePedido;

    guardarTodo();
    guardarTodo();
    guardarTodo();
    guardarTodo();

    if (typeof renderClientes === "function") renderClientes();
    if (typeof renderProduccion === "function") renderProduccion();
    if (typeof renderCorrespondePedido === "function")
    if (typeof renderPedidosCargados === "function") renderPedidosCargados();
    if (typeof calcularDiferencias === "function") calcularDiferencias();

    cargandoDesdeNube = false;
    setEstadoSync("Online actualizado");
  });
}

function guardarTodo() {
  localStorage.setItem("fratello_produccion", JSON.stringify(produccion));
  localStorage.setItem("fratello_pedidos", JSON.stringify(pedidos));
  localStorage.setItem("fratello_predeterminadas", JSON.stringify(predeterminadas));
  localStorage.setItem("fratello_clientes", JSON.stringify(clientes));
  localStorage.setItem("fratello_productos_extra", JSON.stringify(productosExtra));
  localStorage.setItem("fratello_pedidos_confirmados", JSON.stringify(pedidosConfirmados));
  guardarEnNube();
}


let produccion = JSON.parse(localStorage.getItem("fratello_produccion") || "{}");
let pedidos = JSON.parse(localStorage.getItem("fratello_pedidos") || "[]");
let predeterminadas = JSON.parse(localStorage.getItem("fratello_predeterminadas") || "null") || crearPredeterminadasIniciales();
let clientes = JSON.parse(localStorage.getItem("fratello_clientes") || "null") || [...clientesIniciales];
let productosExtra = JSON.parse(localStorage.getItem("fratello_productos_extra") || "[]");
productosExtra.forEach(p => { if (!productos.find(x => x.id === p.id)) productos.push(p); });
let correspondePedido = JSON.parse(localStorage.getItem("fratello_corresponde") || "{}");
let modoEdicionPredeterminada = false;
let pedidosConfirmados = JSON.parse(localStorage.getItem("fratello_pedidos_confirmados") || "false");
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
  const visibles = productos.filter(p => p.visible);
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
    alert("Primero desbloqueá producción.");
    return;
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
  $("btnGuardarPredeterminada").classList.add("hidden");
  $("btnCancelarPredeterminada").classList.add("hidden");
  $("btnEditarPredeterminada").classList.remove("hidden");

  alert("Producción base guardada para " + nombreDiaActual() + ".");
  renderProduccion();
  calcularDiferencias();
}

function cancelarEdicionPredeterminada() {
  modoEdicionPredeterminada = false;
  $("btnGuardarPredeterminada").classList.add("hidden");
  $("btnCancelarPredeterminada").classList.add("hidden");
  $("btnEditarPredeterminada").classList.remove("hidden");
  renderProduccion();
}


function detectarUnidad(texto, unidadDefault = "unidad") {
  const t = normalizar(texto);
  if (t.includes("kg") || t.includes("kilo")) return "kg";
  if (t.includes("doc")) return "docena";
  if (t.includes("unid") || t.includes("unidad") || t.includes("unidades") || t.includes(" u")) return "unidad";
  return unidadDefault || "unidad";
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

  const nuevo = { id, nombre: nombre + " *", unidad, visible: false, activo: false, nuevo: true };
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
  return texto.split(/\r?\n/).map(linea => linea.trim()).filter(Boolean).flatMap(original => {
    const normal = normalizar(original);
    if (normal.includes("pedido") || normal.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)) return [];

    let id = buscarProducto(normal);
    const cantidad = extraerCantidad(normal);

    if (!id && cantidad > 0) {
      const unidadNueva = detectarUnidad(original, "unidad");
      const nombreNuevo = nombreProductoDesdeLinea(original);
      const nuevo = crearProductoExtra(nombreNuevo, unidadNueva);
      id = nuevo.id;
    }

    if (id && esProductoGenericoPan(normal, id)) {
      const unidadNueva = detectarUnidad(original, "unidad");
      const nombreNuevo = nombreProductoDesdeLinea(original);
      const nuevo = crearProductoExtra(nombreNuevo, unidadNueva);
      id = nuevo.id;
    }

    if (!id) return [];

    const producto = productoPorId(id);
    const unidad = detectarUnidad(original, producto.unidad);
    let estado = cantidad === 0 ? "NO PEDIDO" : "OK";
    let observacion = cantidad === 0 ? "Línea sin cantidad: se toma como 0" : "";

    if (producto.nuevo || producto.activo === false) {
      observacion = "Producto nuevo/no habitual";
    }

    if (normal.includes(" o ")) {
      estado = "VARIABLE";
      observacion = observacion ? observacion + " - cantidad variable" : "Cantidad variable: se toma el mínimo detectado";
    }

    return [{ fecha, cliente, productoId: id, producto: producto.nombre, cantidad, unidad, estado, observacion, original }];
  });
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

function procesarPedidoActual() {
  const fecha = $("fechaPedido").value || hoyISO();
  const cliente = $("cliente").value;
  const texto = $("pedidoCrudo").value;

  if (!texto.trim()) {
    alert("Pegá un pedido primero.");
    return;
  }

  const procesado = procesarTextoPedido(texto, cliente, fecha);
  pedidos.push({ id: Date.now(), fecha, cliente, textoOriginal: texto, items: procesado });

  pedidosConfirmados = false;
  bloquearEnvioWhatsappConfirmado();
  guardarTodo();

  renderUltimoProcesado(procesado);
  renderPedidosCargados();
  calcularDiferencias();
  actualizarEstadoConfirmacion();

  $("pedidoCrudo").value = "";
  mostrarMensajePedido("Pedido cargado correctamente");
}

function renderUltimoProcesado(items) {
  items = pedidos.flatMap(p=>p.items.map(i=>({...i,cliente:p.cliente})));
  if (!items || !items.length) {
    $("ultimoProcesado").innerHTML = "<p>No se detectaron productos.</p>";
    return;
  }

  let html = "<table><thead><tr><th>Producto</th><th>Cantidad</th><th>Unidad</th><th>Cliente</th><th>Estado</th><th>Texto leído</th></tr></thead><tbody>";

  for (const it of items) {
    html += `<tr><td>${it.producto}</td><td>${fmt(it.cantidad)}</td><td>${it.unidad}</td><td>${it.cliente}</td><td>${it.estado}</td><td>${it.original}</td></tr>`;
  }

  $("ultimoProcesado").innerHTML = html + "</tbody></table>";
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
        <span>${itemsValidos.length} ítems</span>
      </div>`;

    if (!itemsValidos.length) {
      html += "<p>No se detectaron productos con cantidad.</p>";
    } else {
      html += "<table><thead><tr><th>Producto</th><th>Cantidad</th><th>Unidad</th></tr></thead><tbody>";
      itemsValidos.forEach(it => {
        html += `<tr><td>${it.producto}</td><td>${fmt(it.cantidad)}</td><td>${it.unidad}</td></tr>`;
      });
      html += "</tbody></table>";
    }

    html += `<button type="button" class="btnEliminarPedido" onclick="borrarPedido(${pedido.id})">Eliminar este pedido</button>`;
    html += `</div>`;
  });

  $("pedidosCargados").innerHTML = html;
}


function borrarPedido(id) {
  if (!confirm("¿Seguro que querés borrar este pedido?")) return;

  pedidos = pedidos.filter(p => Number(p.id) !== Number(id));
  pedidosConfirmados = false;
  bloquearEnvioWhatsappConfirmado();
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
  bloquearEnvioWhatsappConfirmado();
  guardarTodo();

  renderPedidosCargados();
  calcularDiferencias();
  actualizarEstadoConfirmacion();

  const vista = $("vistaPedidosInline");
  if (vista) vista.innerHTML = "";
}

function calcularDiferencias() {
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

    if ((p.activo === false || p.nuevo) && prod === 0 && ped === 0) continue;
    if (prod === 0 && ped === 0) continue;

    const dif = prod - ped;
    let estado = "JUSTO";
    let accion = "No hacer nada";

    if (dif > 0) {
      estado = "SOBRA";
      accion = `Sobran ${fmt(dif)} ${p.unidad}`;
    }

    if (dif < 0) {
      estado = "FALTA";
      accion = `HACER ${fmt(Math.abs(dif))} ${p.unidad}`;
    }

    filas.push({ producto: p.nombre, unidad: p.unidad, prod, ped, dif, estado, accion });
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
    html += `<tr><td>${f.producto}</td><td>${fmt(f.prod)} ${f.unidad}</td><td>${fmt(f.ped)} ${f.unidad}</td><td class="${cls}">${f.estado}</td><td>${f.accion}</td></tr>`;
  }

  $("comparador").innerHTML = html + "</tbody></table>";
}

function renderResumenPanadero(filas) {
  const faltas = filas.filter(f => f.estado === "FALTA");
  const sobras = filas.filter(f => f.estado === "SOBRA");

  let txt = "FRATELLO - RESUMEN PARA PANADERO\n--------------------------------\n\n🔴 FALTANTES A PRODUCIR\n";
  txt += faltas.length ? faltas.map(f => `- ${f.producto}: HACER ${fmt(Math.abs(f.dif))} ${f.unidad}`).join("\n") : "No falta producir nada.";

  txt += "\n\n🟢 SOBRANTES / NO HACER MÁS\n";
  txt += sobras.length ? sobras.map(f => `- ${f.producto}: sobran ${fmt(f.dif)} ${f.unidad}`).join("\n") : "No hay sobrantes.";

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
    const items = p.items.filter(i => i.estado !== "NO PEDIDO");

    if (!items.length) {
      texto += "- Sin productos detectados\n";
    } else {
      items.forEach(i => {
        texto += `- ${fmt(i.cantidad)} ${i.unidad} ${i.producto}\n`;
      });
    }

    texto += "\n";
  });

  return texto;
}

function compartirVistaPedidosWhatsApp() {
  if (!verificarPedidosConfirmadosAntesDeEnviar()) return;

  abrirWhatsApp("", textoPedidosClientes());
}

function generarVistaPedidos(){
  const cont = $("vistaPedidosInline");
  if (!cont) return;

  if (!pedidos.length) {
    cont.innerHTML = "<p>No hay pedidos cargados.</p>";
    return;
  }

  let html = `<div class="vistaPedidosCard" id="vistaPedidosCard">
    <h2>FRATELLO - PEDIDOS</h2>
    <p>Pedidos cargados para producción/reparto</p>`;

  pedidos.forEach(p => {
    const items = p.items.filter(i => i.estado !== "NO PEDIDO");

    html += `<div class="vistaCliente">
      <h3>${p.cliente}</h3>`;

    if (!items.length) {
      html += "<p>Sin productos detectados</p>";
    } else {
      html += "<table><thead><tr><th>Producto</th><th>Cantidad</th></tr></thead><tbody>";
      items.forEach(i => {
        html += `<tr><td>${i.producto}</td><td>${fmt(i.cantidad)} ${i.unidad}</td></tr>`;
      });
      html += "</tbody></table>";
    }

    html += "</div>";
  });

  html += `</div>
    <div class="vistaPedidosActions">
      <button type="button" onclick="window.print()">🖨 Imprimir</button>
      <button type="button" onclick="compartirVistaPedidosWhatsApp()">📲 Compartir por WhatsApp</button>
    </div>`;

  cont.innerHTML = html;
}

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

  pedidosConfirmados = true;
  guardarTodo();
  actualizarEstadoConfirmacion();
  destildarCasillasConfirmacion();
  alert("Pedidos confirmados correctamente.");
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

function abrirWhatsApp(numero, mensaje) {
  const texto = encodeURIComponent(mensaje);

  let url = "";

  if (numero) {
    url = `https://wa.me/${numero}?text=${texto}`;
  } else {
    // En celular abre WhatsApp para elegir contacto o grupo.
    url = `whatsapp://send?text=${texto}`;
  }

  const link = document.createElement("a");
  link.href = url;
  link.target = "_self";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Fallback para computadora si whatsapp:// no abre.
  if (!numero) {
    setTimeout(() => {
      window.location.href = `https://wa.me/?text=${texto}`;
    }, 800);
  }
}

function generarMensajeGrupoFratello() {
  if (!verificarPedidosConfirmadosAntesDeEnviar()) return;

  const filas = obtenerFilasComparador();
  const faltan = filas.filter(f => f.dif < 0);
  const sobran = filas.filter(f => f.dif > 0);

  let mensaje = "FRATELLO - Resumen de producción y pedidos\n\n";

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

  mensaje += "\n--------------------\n";
  mensaje += "PEDIDOS DE CLIENTES:\n\n";

  if (!pedidos.length) {
    mensaje += "No hay pedidos cargados.\n";
  } else {
    pedidos.forEach(pedido => {
      const itemsValidos = pedido.items.filter(i => i.estado !== "NO PEDIDO");

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
  }

  mensaje += "Enviado desde sistema Fratello.";

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
  if (!Array.isArray(clientes) || clientes.length === 0) clientes = [...clientesIniciales];
  await cargarDesdeNube();
  validarClientes();
  escucharCambiosNube();
  aplicarPermisosUsuario();
  $("fechaPedido").value = hoyISO();
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
  if ($("btnConfirmarPedidos")) $("btnConfirmarPedidos").onclick = confirmarPedidos;
  if ($("btnWhatsAppGrupo")) $("btnWhatsAppGrupo").onclick = generarMensajeGrupoFratello;
  if ($("btnRecordarCliente")) $("btnRecordarCliente").onclick = recordarPedidoCliente;
  $("btnExportar").onclick = copiarResumen;
  $("btnReset").onclick = resetDatos;
  $("btnVistaPedidos").onclick = generarVistaPedidos;
  if ($("btnBorrarSeleccionados")) $("btnBorrarSeleccionados").onclick = borrarPedidosSeleccionados;

  renderProduccion();
  renderPedidosCargados();
  calcularDiferencias();
}

init();
