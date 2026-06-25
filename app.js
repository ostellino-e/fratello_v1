const productos = [
  { id: "CHIC", nombre: "Chicharrón", unidad: "unidad", visible: true },
  { id: "TREN", nombre: "Trenzas", unidad: "unidad", visible: true },
  { id: "RASP", nombre: "Raspaditas", unidad: "unidad", visible: true },
  { id: "CORD_S", nombre: "Corderos salados", unidad: "unidad", visible: true },
  { id: "CORD_D", nombre: "Corderos dulces", unidad: "unidad", visible: true },
  { id: "RASQ_G", nombre: "Rasquetas grasas", unidad: "unidad", visible: true },
  { id: "RASQ_M", nombre: "Rasquetas manteca", unidad: "unidad", visible: true },
  { id: "BIZ_H", nombre: "Bizcocho hojaldre", unidad: "kg", visible: true },
  { id: "LIB_MEM", nombre: "Librito membrillo", unidad: "kg", visible: true },
  { id: "BIZ_G", nombre: "Bizcochos de grasa", unidad: "kg", visible: true },
  { id: "FAC_SUR", nombre: "Facturas surtidas", unidad: "docena", visible: true },
  { id: "MED", nombre: "Medialunas", unidad: "docena", visible: true },
  { id: "PAN", nombre: "Pan", unidad: "kg", visible: true },
  { id: "CAS", nombre: "Caserito", unidad: "kg", visible: true },
  { id: "PAN_CAS", nombre: "Pan casero", unidad: "unidad", visible: true },
  { id: "PALM", nombre: "Palmeritas", unidad: "kg", visible: true },
  { id: "PAN_SAL", nombre: "Pan de salvado", unidad: "kg", visible: true },
  { id: "PREP", nombre: "Prepizzas", unidad: "unidad", visible: true },
  { id: "PAN_INT", nombre: "Pan integral", unidad: "unidad", visible: true },
  { id: "BUD", nombre: "Budín", unidad: "unidad", visible: true },
  { id: "TAP_MAI", nombre: "Tapitas maicena", unidad: "kg", visible: true },
  { id: "FROLA", nombre: "Frolas", unidad: "kg", visible: true },
  { id: "SCON", nombre: "Scon", unidad: "kg", visible: true },
  { id: "PEPAS", nombre: "Pepas", unidad: "kg", visible: true },
  { id: "CANON", nombre: "Cañoncitos", unidad: "kg", visible: true },
  { id: "PIZZ_KG", nombre: "Pizzetas x kg", unidad: "kg", visible: true },

  { id: "PAN_HAMB", nombre: "Pan hamburguesa", unidad: "unidad", visible: false },
  { id: "PAN_CHIPS", nombre: "Pan de chips", unidad: "unidad", visible: false },
  { id: "PAN_PANCHO", nombre: "Pan de pancho", unidad: "unidad", visible: false },
];

const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

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

  // Lunes a jueves quedan iguales por defecto, pero los valores reales los cargás vos una sola vez desde "Cambiar producción base".
  for (const d of ["lunes", "martes", "miercoles", "jueves"]) {
    base[d]["PAN"] = 0;
    base[d]["RASQ_G"] = 0;
    base[d]["RASQ_M"] = 0;
    base[d]["BIZ_H"] = 0;
    base[d]["BIZ_G"] = 0;
    base[d]["FAC_SUR"] = 0;
    base[d]["MED"] = 0;
  }

  return base;
}

let produccion = JSON.parse(localStorage.getItem("fratello_produccion") || "{}");
let pedidos = JSON.parse(localStorage.getItem("fratello_pedidos") || "[]");
let predeterminadas = JSON.parse(localStorage.getItem("fratello_predeterminadas") || "null") || crearPredeterminadasIniciales();
let modoEdicionPredeterminada = false;

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
  return $("diaProduccion").value || "lunes";
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

    html += `<tr>
      <td>${p.nombre}</td>
      <td><input type="number" step="0.001" data-prod="${p.id}" value="${valor}" placeholder="0"></td>
      <td>${p.unidad}</td>
    </tr>`;
  }

  html += "</tbody></table>";
  $("produccionLista").innerHTML = html;
  renderProduccionExtra();
  actualizarTextoModo();
}

function renderProduccionExtra() {
  let html = "<table><thead><tr><th>Producto extra</th><th>Cantidad</th><th>Unidad</th></tr></thead><tbody>";

  for (let i = 0; i < 6; i++) {
    html += `<tr>
      <td><input data-extra-nombre="${i}" placeholder="Ej: Pan hamburguesa"></td>
      <td><input data-extra-cantidad="${i}" type="number" step="0.001" placeholder="0"></td>
      <td>
        <select data-extra-unidad="${i}">
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
    ? "Modo actual: cambiando la producción base del día"
    : "Modo actual: cargando producción estibada/realizada";

  $("estadoBase").textContent = modoEdicionPredeterminada
    ? "editando base para " + diaActual()
    : "cargada automáticamente para " + diaActual();
}

function guardarProduccion() {
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

  localStorage.setItem("fratello_produccion", JSON.stringify(produccion));
  alert("Producción estibada/realizada guardada.");
  calcularDiferencias();
}

function activarEdicionPredeterminada() {
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

  localStorage.setItem("fratello_predeterminadas", JSON.stringify(predeterminadas));

  document.querySelectorAll("#produccionLista input").forEach(input => {
    produccion[claveProduccion(input.dataset.prod)] = Number(input.value || 0);
  });
  localStorage.setItem("fratello_produccion", JSON.stringify(produccion));

  modoEdicionPredeterminada = false;
  $("btnGuardarPredeterminada").classList.add("hidden");
  $("btnCancelarPredeterminada").classList.add("hidden");
  $("btnEditarPredeterminada").classList.remove("hidden");

  alert("Producción base guardada para " + dia + ".");
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

function procesarTextoPedido(texto, cliente, fecha) {
  return texto.split(/\r?\n/).map(linea => linea.trim()).filter(Boolean).flatMap(original => {
    const normal = normalizar(original);
    if (normal.includes("pedido") || normal.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)) return [];
    const id = buscarProducto(normal);
    if (!id) return [];
    const producto = productoPorId(id);
    const cantidad = extraerCantidad(normal);
    let estado = cantidad === 0 ? "NO PEDIDO" : "OK";
    let observacion = cantidad === 0 ? "Línea sin cantidad: se toma como 0" : "";
    if (normal.includes(" o ")) {
      estado = "VARIABLE";
      observacion = "Cantidad variable: se toma el mínimo detectado";
    }
    return [{ fecha, cliente, productoId: id, producto: producto.nombre, cantidad, unidad: producto.unidad, estado, observacion, original }];
  });
}

function procesarPedidoActual() {
  const fecha = $("fechaPedido").value || hoyISO();
  const cliente = $("cliente").value;
  const texto = $("pedidoCrudo").value;

  if (!texto.trim()) return alert("Pegá un pedido primero.");

  const procesado = procesarTextoPedido(texto, cliente, fecha);
  pedidos.push({ id: Date.now(), fecha, cliente, textoOriginal: texto, items: procesado });

  localStorage.setItem("fratello_pedidos", JSON.stringify(pedidos));

  renderUltimoProcesado(procesado);
  renderPedidosCargados();
  calcularDiferencias();
  alert("Pedido procesado.");
}

function renderUltimoProcesado(items) {
  if (!items || !items.length) {
    $("ultimoProcesado").innerHTML = "<p>No se detectaron productos.</p>";
    return;
  }

  let html = "<table><thead><tr><th>Producto</th><th>Cantidad</th><th>Unidad</th><th>Estado</th><th>Texto leído</th></tr></thead><tbody>";

  for (const it of items) {
    html += `<tr><td>${it.producto}</td><td>${fmt(it.cantidad)}</td><td>${it.unidad}</td><td>${it.estado}</td><td>${it.original}</td></tr>`;
  }

  $("ultimoProcesado").innerHTML = html + "</tbody></table>";
}

function renderPedidosCargados() {
  $("pedidosCargados").innerHTML = pedidos.length
    ? `<p>${pedidos.map(p => `${p.cliente} (${p.items.filter(i => i.estado !== "NO PEDIDO").length} ítems)`).join("<br>")}</p>`
    : "<p>No hay pedidos cargados.</p>";
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

  let html = "<table><thead><tr><th>Producto</th><th>Producido</th><th>Pedido total</th><th>Diferencia</th><th>Estado</th><th>Acción</th></tr></thead><tbody>";

  for (const f of filas) {
    const cls = f.estado === "FALTA" ? "estado-falta" : f.estado === "SOBRA" ? "estado-sobra" : "estado-justo";
    html += `<tr><td>${f.producto}</td><td>${fmt(f.prod)} ${f.unidad}</td><td>${fmt(f.ped)} ${f.unidad}</td><td>${fmt(f.dif)} ${f.unidad}</td><td class="${cls}">${f.estado}</td><td>${f.accion}</td></tr>`;
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

function resetDatos() {
  if (!confirm("¿Seguro que querés borrar producción y pedidos cargados?")) return;

  produccion = {};
  pedidos = [];

  localStorage.removeItem("fratello_produccion");
  localStorage.removeItem("fratello_pedidos");

  renderProduccion();
  renderPedidosCargados();
  $("ultimoProcesado").innerHTML = "";
  $("comparador").innerHTML = "";
  $("resumenPanadero").textContent = "";
}

function init() {
  $("fechaPedido").value = hoyISO();

  $("diaProduccion").onchange = () => {
    renderProduccion();
    calcularDiferencias();
  };

  $("btnGuardarProduccion").onclick = guardarProduccion;
  $("btnEditarPredeterminada").onclick = activarEdicionPredeterminada;
  $("btnGuardarPredeterminada").onclick = guardarPredeterminada;
  $("btnCancelarPredeterminada").onclick = cancelarEdicionPredeterminada;

  $("btnProcesar").onclick = procesarPedidoActual;
  $("btnLimpiarPedido").onclick = () => $("pedidoCrudo").value = "";
  $("btnCalcular").onclick = calcularDiferencias;
  $("btnExportar").onclick = copiarResumen;
  $("btnReset").onclick = resetDatos;

  renderProduccion();
  renderPedidosCargados();
  calcularDiferencias();
}

init();
