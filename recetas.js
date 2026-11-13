/* Fratello v6.0.57 — recetas enlazadas a precios de ingredientes. */
(() => {
  'use strict';
  const UNIDADES = Object.freeze({
    g:{grupo:'peso',factor:1,nombre:'g'}, kg:{grupo:'peso',factor:1000,nombre:'kg'},
    ml:{grupo:'volumen',factor:1,nombre:'ml'}, l:{grupo:'volumen',factor:1000,nombre:'litros'},
    unidad:{grupo:'cantidad',factor:1,nombre:'unidades'}, docena:{grupo:'cantidad',factor:12,nombre:'docenas'}
  });
  const estado = {ingredientes:new Map(),recetas:new Map(),listo:{ingredientes:false,recetas:false},
    escuchas:[],uid:null,iniciado:false,vista:'recetas',formIngrediente:null,formReceta:null,guardando:false,
    ingredientesPendientes:new Map(),archivadosIngredientes:false,archivadasRecetas:false};
  const el = id => document.getElementById(id);
  const escape = valor => String(valor ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const numero = valor => {
    if (String(valor ?? '').trim() === '') return null;
    const n=Number(String(valor).trim().replace(',','.'));
    return Number.isFinite(n) ? n : null;
  };
  const dinero = valor => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',minimumFractionDigits:2,maximumFractionDigits:2}).format(valor);
  const cantidad = valor => new Intl.NumberFormat('es-AR',{maximumFractionDigits:6}).format(valor);
  const autorizado = () => typeof tieneRolAdministrador === 'function' && tieneRolAdministrador();
  const usuario = () => typeof usuarioAdministradorActual !== 'undefined' ? usuarioAdministradorActual?.uid : null;
  const base = () => db.collection('administracion').doc('recetas_costos');
  const coleccion = tipo => base().collection(tipo);
  const idNuevo = () => window.crypto?.randomUUID ? window.crypto.randomUUID() : `rc_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const activos = tipo => [...estado[tipo].values()].filter(x=>!x.eliminado).sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
  function mensaje(id,texto,error=false) {
    const nodo=el(id); if(!nodo)return;
    nodo.textContent=texto; nodo.classList.toggle('rcError',error);nodo.setAttribute('role',error?'alert':'status');
  }
  function costeLinea(linea,ingrediente) {
    if(!ingrediente)return {ok:false,motivo:'Ingrediente no encontrado'};
    const origen=UNIDADES[ingrediente.unidadCompra], destino=UNIDADES[linea.unidad];
    const precio=numero(ingrediente.precioCompra), compra=numero(ingrediente.cantidadCompra), usada=numero(linea.cantidad);
    if(!origen || !destino || origen.grupo!==destino.grupo)return {ok:false,motivo:'Unidades incompatibles'};
    if(precio===null || precio<0 || compra===null || compra<=0 || usada===null || usada<=0)return {ok:false,motivo:'Falta precio o cantidad válida'};
    const importe=precio*(usada*destino.factor)/(compra*origen.factor);
    return Number.isFinite(importe) ? {ok:true,importe,archivado:Boolean(ingrediente.eliminado)} : {ok:false,motivo:'Importe fuera de rango'};
  }
  function costeReceta(receta,ingredientes=estado.ingredientes) {
    const filas=(receta.lineas||[]).map(linea=>({...linea,ingrediente:ingredientes.get(linea.ingredienteId),coste:costeLinea(linea,ingredientes.get(linea.ingredienteId))}));
    const errores=filas.filter(f=>!f.coste.ok);
    const materiaPrima=filas.reduce((s,f)=>s+(f.coste.ok?f.coste.importe:0),0);
    const extras=(receta.extras||[]).map(e=>{
      const cantidad=numero(e.cantidad)??0,precio=numero(e.precioUnitario);
      const ok=cantidad>=0 && (cantidad===0 || (Boolean(String(e.nombre||'').trim()) && precio!==null && precio>=0));
      const importe=cantidad*(precio??0);
      return {...e,cantidad,precioUnitario:precio??0,ok:ok&&Number.isFinite(importe),importe};
    });
    const extrasFijos=extras.reduce((s,e)=>s+(e.ok?e.importe:0),0);
    const porcentajes=['mermaPorcentaje','envolturaPorcentaje','energiaPorcentaje'].map(k=>numero(receta[k]??0));
    // El total de merma, envoltura y energía se aplica una sola vez.
    // El antiguo campo gananciaPorcentaje ya no interviene en el cálculo.
    const porcentajeTotal=porcentajes.reduce((s,n)=>s+(n??0),0);
    const costoBase=materiaPrima+extrasFijos;
    const adicional=costoBase*porcentajeTotal/100;
    const suma=costoBase+adicional;
    const pesoAuto=filas.length && filas.every(f=>UNIDADES[f.unidad]?.grupo==='peso'&&numero(f.cantidad)>0)
      ?filas.reduce((s,f)=>s+Number(f.cantidad)*UNIDADES[f.unidad].factor/1000,0):null;
    const pesoManual=numero(receta.pesoTotalKg),rindeManual=numero(receta.rinde),gramosUnidad=numero(receta.gramosUnidad);
    const pesoPorPiezas=rindeManual>0 && gramosUnidad>0 && ['unidad','docena'].includes(receta.unidadRinde)
      ? rindeManual*UNIDADES[receta.unidadRinde].factor*gramosUnidad/1000:null;
    const masaKg=pesoManual>0?pesoManual:receta.unidadRinde==='kg'&&rindeManual>0?rindeManual:pesoAuto>0?pesoAuto:pesoPorPiezas;
    const origenPeso=pesoManual>0||receta.unidadRinde==='kg'&&rindeManual>0?'manual':pesoAuto>0?'ingredientes':pesoPorPiezas>0?'piezas':'incompleto';
    const rinde=rindeManual??(receta.unidadRinde==='kg'?masaKg:null);
    const opcionalesOk=(pesoManual===null||pesoManual>0)&&(gramosUnidad===null||gramosUnidad>0);
    const valido=filas.length>0 && errores.length===0 && extras.every(e=>e.ok) &&
      porcentajes.every(n=>n!==null&&n>=0) && opcionalesOk &&
      rinde!==null&&rinde>0 && ['kg','unidad','docena','l'].includes(receta.unidadRinde);
    const ok=Boolean(valido&&Number.isFinite(suma)&&Number.isFinite(suma/rinde));
    const costoKg=ok&&masaKg>0?costoBase/masaKg:null;
    const costoRealKg=ok&&masaKg>0?suma/masaKg:null;
    const unidades=masaKg>0&&gramosUnidad>0?masaKg*1000/gramosUnidad:null;
    const producto=ok&&unidades>0?{nombre:receta.productoNombre||receta.nombre,gramos:gramosUnidad,unidades,
      costoBase:costoBase/unidades,costoReal:suma/unidades,precioIdeal:suma/unidades}:null;
    return {ok,filas,extras,materiaPrima,extrasFijos,costoBase,adicional,porcentajeTotal,
      masaKg,origenPeso,pesoAuto,rinde,gramosUnidad,unidades,producto,costoKg,costoRealKg,
      precioIdealKg:costoKg,
      precioRealKg:costoRealKg,
      total:ok?suma:null,porRendimiento:ok?suma/rinde:null,errores,archivados:filas.filter(f=>f.coste.archivado).length};
  }
  function precioReferencia(i) {
    if(!i)return null;
    const grupo=UNIDADES[i.unidadCompra]?.grupo;
    const unidad=grupo==='peso'?'kg':grupo==='volumen'?'l':'unidad';
    const c=costeLinea({cantidad:1,unidad},i);
    return c.ok?{importe:c.importe,unidad}:null;
  }
  function htmlResumenPlanilla(c,r) {
    const money=v=>v===null||!Number.isFinite(v)?'—':dinero(v);
    const filas=[['Materia prima',c.ok?c.materiaPrima:null],['Extras fijos',c.ok?c.extrasFijos:null],['Costo total base',c.ok?c.costoBase:null],['Costo por kg',c.costoKg],
      [`Adicionales (${cantidad(c.porcentajeTotal)}%)`,c.ok?c.adicional:null],['Costo total REAL',c.total],['Costo REAL por kg',c.costoRealKg]];
    const origen=c.origenPeso==='manual'?'Kilos fijados manualmente: no cambian al editar ingredientes.':c.origenPeso==='ingredientes'?'Kilos automáticos: suma de los ingredientes en kg y gramos.':c.origenPeso==='piezas'?'Kilos calculados según cantidad de piezas y peso por unidad.':'Para calcular kilos automáticamente, cargá todos los ingredientes en kg o gramos.';
    return `<p class="rcOrigenPeso${c.origenPeso==='manual'?' rcAviso':''}">${origen}${c.origenPeso==='manual'&&c.pesoAuto>0?` Suma actual de ingredientes: <b>${cantidad(c.pesoAuto)} kg</b>.`:''}</p><div class="rcCalculoPlanilla"><div class="rcTablaWrap"><table class="rcResumenTabla"><tbody>${filas.map(([n,v])=>`<tr${n.includes('REAL')?' class="rcTotalReal"':''}><th>${escape(n)}</th><td>${money(v)}</td></tr>`).join('')}</tbody></table></div>
      <div class="rcRendimientoPlanilla"><span>Masa / producción total <b>${c.masaKg>0?cantidad(c.masaKg)+' kg':'Completá producción en kg'}</b></span><span>Total gramos <b>${c.masaKg>0?cantidad(c.masaKg*1000)+' g':'—'}</b></span><span>Gramos por unidad <b>${c.gramosUnidad>0?cantidad(c.gramosUnidad)+' g':'—'}</b></span><span>Unidades estimadas <b>${c.unidades>0?cantidad(c.unidades):'—'}</b></span></div></div>
      ${c.producto?`<div class="rcTablaWrap"><table class="rcProductosTabla"><caption>PRECIO DE COSTO POR PRODUCTO</caption><thead><tr><th>Producto</th><th>Peso (g)</th><th>Costo base</th><th>REAL (con adicionales)</th></tr></thead><tbody><tr><td>${escape(c.producto.nombre)}</td><td>${cantidad(c.producto.gramos)}</td><td>${money(c.producto.costoBase)}</td><td class="rcCostoProductoReal">${money(c.producto.costoReal)}</td></tr></tbody></table></div>`:''}`;
  }
  function htmlExtras(c) {
    return c.extras.some(e=>e.cantidad>0)?`<div class="rcTablaWrap"><table><caption>EXTRAS</caption><thead><tr><th>Concepto</th><th>Cantidad</th><th>Precio unitario</th><th>Costo</th></tr></thead><tbody>${c.extras.filter(e=>e.cantidad>0).map(e=>`<tr><td>${escape(e.nombre)}</td><td>${cantidad(e.cantidad)}</td><td>${dinero(e.precioUnitario)}</td><td>${e.ok?dinero(e.importe):'Revisar'}</td></tr>`).join('')}</tbody></table></div>`:'';
  }
  function opcionesUnidad(grupo,seleccionada) {
    return Object.entries(UNIDADES).filter(([,u])=>!grupo||u.grupo===grupo)
      .map(([k,u])=>`<option value="${k}"${k===seleccionada?' selected':''}>${u.nombre}</option>`).join('');
  }
  function singular(unidad){return {kg:'kg',unidad:'unidad',docena:'docena',l:'litro'}[unidad]||unidad;}
  function etiquetaCosto(coste,receta) {
    if(!coste.ok)return '<strong>Costo incompleto</strong><small>Revisá los ingredientes, cantidades y rendimiento.</small>';
    const porPieza=Boolean(coste.producto)||['unidad','docena'].includes(receta.unidadRinde);
    const importe=coste.producto?coste.producto.costoReal:receta.unidadRinde==='docena'?coste.porRendimiento/12:coste.porRendimiento;
    const unidad=porPieza?'unidad':singular(receta.unidadRinde);
    const peso=coste.producto?` · ${cantidad(coste.producto.gramos)} g`:'';
    return `<small class="rcCostoEtiqueta">Costo REAL por ${escape(unidad)}${peso}</small><strong>${dinero(importe)}</strong><small>Con adicionales incluidos</small><small class="rcCostoPreparacion">Total de la receta: ${dinero(coste.total)}</small>`;
  }
  function renderIngredientes() {
    const nodo=el('rcListaIngredientes');if(!nodo)return;
    const activo=document.activeElement,celda=activo?.closest?.('[data-rc-ingrediente]');
    const foco=celda&&activo.dataset?.rcCampo?{id:celda.dataset.rcIngrediente,campo:activo.dataset.rcCampo}:null;
    const scroll=nodo.querySelector('.rcTablaWrap')?.scrollLeft||0;
    const buscar=String(el('rcBuscarIngredientes')?.value||'').trim().toLocaleLowerCase('es');
    const lista=[...estado.ingredientes.values()].filter(i=>(estado.archivadosIngredientes||!i.eliminado)&&i.nombre.toLocaleLowerCase('es').includes(buscar)).sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
    nodo.innerHTML=lista.length?`<div class="rcTablaWrap"><table class="rcMateriasTabla"><thead><tr><th>Ingrediente</th><th>Cantidad por presentación</th><th>Precio por presentación ($)</th><th>Precio por kg / litro / unidad ($)</th><th>Actualizado</th><th>Acciones</th></tr></thead><tbody>${lista.map(i=>{
      const pendiente=estado.ingredientesPendientes.get(i.id),dato=pendiente?{...i,...pendiente}:i,precio=precioReferencia(dato);
      const fecha=i.actualizadoEn&&Number.isFinite(Date.parse(i.actualizadoEn))?new Date(i.actualizadoEn).toLocaleDateString('es-AR'):'—';
      return `<tr data-rc-ingrediente="${escape(i.id)}"${i.eliminado?' class="rcArchivado"':''}><th>${escape(i.nombre)}${i.eliminado?'<small>Archivado</small>':''}</th>
      <td><div class="rcCompraCelda"><input data-rc-campo="cantidadCompra" type="number" min="0.000001" step="any" inputmode="decimal" aria-label="Cantidad comprada de ${escape(i.nombre)}" value="${escape(dato.cantidadCompra??'')}"${i.eliminado?' disabled':''}><select data-rc-campo="unidadCompra" aria-label="Unidad de ${escape(i.nombre)}"${i.eliminado?' disabled':''}>${opcionesUnidad(UNIDADES[i.unidadCompra]?.grupo,dato.unidadCompra)}</select></div></td>
      <td><input data-rc-campo="precioCompra" type="number" min="0" step="any" inputmode="decimal" aria-label="Precio de ${escape(i.nombre)}" value="${escape(dato.precioCompra??'')}"${i.eliminado?' disabled':''}></td>
      <td class="rcReferenciaPrecio">${precio?`${dinero(precio.importe)} / ${singular(precio.unidad)}`:'Completá cantidad y precio'}</td>
      <td class="rcFechaPrecio">${pendiente?pendiente.version!==i.version?'Cambió online · revisar':'Sin guardar':escape(fecha)}</td><td><div class="rcAcciones">${!i.eliminado?`<button type="button" data-rc-guardar-precio="${escape(i.id)}">Guardar fila</button>`:''}<button type="button" data-rc-editar-ingrediente="${escape(i.id)}">Editar</button><button type="button" data-rc-archivo="ingredientes" data-id="${escape(i.id)}">${i.eliminado?'Restaurar':'Archivar'}</button></div></td></tr>`;
    }).join('')}</tbody></table></div>`:`<p class="rcVacio">${estado.listo.ingredientes?'No hay ingredientes para mostrar. Cargá el primero para empezar.':'Consultando ingredientes…'}</p>`;
    const tabla=nodo.querySelector('.rcTablaWrap');if(tabla)tabla.scrollLeft=scroll;
    if(foco){const fila=[...nodo.querySelectorAll('[data-rc-ingrediente]')].find(f=>f.dataset.rcIngrediente===foco.id);fila?.querySelector(`[data-rc-campo="${foco.campo}"]`)?.focus({preventScroll:true});}
  }
  function editarPrecioEnTabla(input) {
    const fila=input.closest('[data-rc-ingrediente]');if(!fila)return;
    const i=estado.ingredientes.get(fila.dataset.rcIngrediente);if(!i||i.eliminado)return;
    const anterior=estado.ingredientesPendientes.get(i.id);
    const leer=k=>fila.querySelector(`[data-rc-campo="${k}"]`).value;
    const dato={version:anterior?.version??i.version??0,cantidadCompra:numero(leer('cantidadCompra')),unidadCompra:leer('unidadCompra'),precioCompra:numero(leer('precioCompra'))};
    estado.ingredientesPendientes.set(i.id,dato);
    const precio=precioReferencia({...i,...dato});
    fila.querySelector('.rcReferenciaPrecio').textContent=precio?`${dinero(precio.importe)} / ${singular(precio.unidad)}`:'Completá cantidad y precio';
    fila.querySelector('.rcFechaPrecio').textContent='Sin guardar';
  }
  async function guardarPrecioEnTabla(id) {
    if(estado.guardando)return;
    const i=estado.ingredientes.get(id),pendiente=estado.ingredientesPendientes.get(id);if(!i||!pendiente){mensaje('rcEstado','No hay cambios pendientes en esa fila.');return;}
    const uid=estado.uid,dato={...i,...pendiente,nuevo:false};
    const fila=[...el('rcListaIngredientes').querySelectorAll('[data-rc-ingrediente]')].find(f=>f.dataset.rcIngrediente===id);
    try{
      validarIngrediente(dato);estado.guardando=true;fila?.querySelectorAll('input,select,button').forEach(n=>n.disabled=true);
      await escribir('ingredientes',dato);
      if(uid!==estado.uid)return;
      estado.ingredientesPendientes.delete(id);render();mensaje('rcEstado','Precio guardado. Todas las recetas vinculadas se actualizaron.');
    }catch(error){mensaje('rcEstado',error.code==='permission-denied'?'Firebase no autorizó guardar el precio.':error.message,true);}
    finally{estado.guardando=false;fila?.querySelectorAll('input,select,button').forEach(n=>n.disabled=false);}
  }
  function renderRecetas() {
    const nodo=el('rcListaRecetas');if(!nodo)return;
    const abiertos=new Set([...nodo.querySelectorAll('details[open]')].map(n=>n.dataset.receta));
    const buscar=String(el('rcBuscarRecetas')?.value||'').trim().toLocaleLowerCase('es');
    const lista=[...estado.recetas.values()].filter(r=>(estado.archivadasRecetas||!r.eliminado)&&r.nombre.toLocaleLowerCase('es').includes(buscar)).sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
    nodo.innerHTML=lista.length?lista.map(r=>{
      const coste=costeReceta(r);
      return `<article class="rcReceta${r.eliminado?' rcArchivado':''}"><div class="rcRecetaCabecera"><div><h4>${escape(r.nombre)}</h4><small>Rinde ${coste.rinde>0?cantidad(coste.rinde):"—"} ${escape(UNIDADES[r.unidadRinde]?.nombre||r.unidadRinde)}</small></div><div class="rcCosto">${etiquetaCosto(coste,r)}</div></div>
      ${coste.archivados?'<p class="rcAviso">Usa ingredientes archivados; se conserva su último precio.</p>':''}
      <details data-receta="${escape(r.id)}"${abiertos.has(r.id)?' open':''}><summary>Ver ficha de receta</summary><div class="rcFichaPlanilla"><div><div class="rcTablaWrap"><table><caption>FÓRMULA DE LA RECETA</caption><thead><tr><th>Ingrediente</th><th>Cantidad</th><th>Precio por kg / litro / unidad</th><th>Costo</th></tr></thead><tbody>${coste.filas.map(f=>`<tr><td>${escape(f.ingrediente?.nombre||'Ingrediente no encontrado')}</td><td>${cantidad(f.cantidad)} ${escape(UNIDADES[f.unidad]?.nombre||f.unidad)}</td><td>${precioReferencia(f.ingrediente)?dinero(precioReferencia(f.ingrediente).importe)+" / "+singular(precioReferencia(f.ingrediente).unidad):"—"}</td><td>${f.coste.ok?dinero(f.coste.importe):escape(f.coste.motivo)}</td></tr>`).join('')}</tbody></table></div>${htmlExtras(coste)}</div><div>${htmlResumenPlanilla(coste,r)}</div></div>${r.preparacion?`<p class="rcPreparacion">${escape(r.preparacion)}</p>`:''}</details>
      <div class="rcAcciones"><button type="button" data-rc-editar-receta="${escape(r.id)}">Editar receta</button><button type="button" data-rc-archivo="recetas" data-id="${escape(r.id)}">${r.eliminado?'Restaurar':'Archivar'}</button></div></article>`;
    }).join(''):`<p class="rcVacio">${estado.listo.recetas?'Todavía no hay recetas. Cargá los ingredientes y después creá una receta.':'Consultando recetas…'}</p>`;
  }
  function render() {renderIngredientes();renderRecetas();actualizarPreview();}
  function guardarBorrador(tipo) {
    if(!estado.uid)return;
    try {
      const valor=tipo==='ingredientes'?leerIngrediente():leerReceta();
      localStorage.setItem(`fratello_rc_borrador_${estado.uid}_${tipo}`,JSON.stringify(valor));
    } catch(_) {}
  }
  function borrarBorrador(tipo) {try {localStorage.removeItem(`fratello_rc_borrador_${estado.uid}_${tipo}`);}catch(_) {}}
  function leerBorrador(tipo){try{return JSON.parse(localStorage.getItem(`fratello_rc_borrador_${estado.uid}_${tipo}`)||'null')}catch(_){return null}}
  function seleccionarVista(vista) {
    estado.vista=vista;
    el('rcVistaIngredientes').hidden=vista!=='ingredientes';el('rcVistaRecetas').hidden=vista!=='recetas';
    document.querySelectorAll('[data-rc-vista]').forEach(b=>{b.classList.toggle('active',b.dataset.rcVista===vista);b.setAttribute('aria-selected',String(b.dataset.rcVista===vista));});
  }
  function abrirIngrediente(id=null,borrador=null) {
    if(estado.guardando)return;
    const baseDato=borrador||(id?estado.ingredientes.get(id):null);
    const dato=id&&!borrador&&estado.ingredientesPendientes.has(id)?{...baseDato,...estado.ingredientesPendientes.get(id)}:baseDato;
    if(id&&!dato)return;
    estado.formIngrediente={id:dato?.id||idNuevo(),version:dato?.version||0,nuevo:!dato?.id||dato.nuevo===true};
    el('rcIngredienteNombre').value=dato?.nombre||'';el('rcIngredientePrecio').value=dato?.precioCompra??'';
    el('rcIngredienteSinCosto').checked=dato?.precioCompra===0;actualizarPrecioIngrediente();
    el('rcIngredienteCantidad').value=dato?.cantidadCompra??1;el('rcIngredienteUnidad').value=dato?.unidadCompra||'kg';
    el('rcTituloIngrediente').textContent=id?'Editar ingrediente y precio':'Nuevo ingrediente';
    el('rcFormIngrediente').hidden=false;mensaje('rcEstadoIngrediente','');seleccionarVista('ingredientes');
  }
  function actualizarPrecioIngrediente() {
    const sinCosto=el('rcIngredienteSinCosto').checked,precio=el('rcIngredientePrecio');
    precio.required=!sinCosto;precio.readOnly=sinCosto;
    if(sinCosto)precio.value='';
    precio.placeholder=sinCosto?'Sin costo ($0)':'Ej.: 20000';
  }
  function leerIngrediente() {
    return {...estado.formIngrediente,nombre:el('rcIngredienteNombre').value.trim(),precioCompra:el('rcIngredienteSinCosto').checked?0:numero(el('rcIngredientePrecio').value),
      cantidadCompra:numero(el('rcIngredienteCantidad').value),unidadCompra:el('rcIngredienteUnidad').value};
  }
  function renderFila(linea={}) {
    const lista=activos('ingredientes');
    const actual=estado.ingredientes.get(linea.ingredienteId);
    if(actual?.eliminado)lista.push(actual);
    const elegido=actual||(!linea.ingredienteId?lista[0]:null);
    const grupo=UNIDADES[elegido?.unidadCompra]?.grupo;
    const unidad=!grupo&&UNIDADES[linea.unidad]?linea.unidad:UNIDADES[linea.unidad]?.grupo===grupo?linea.unidad:elegido?.unidadCompra||'g';
    return `<div class="rcLinea"><label class="rcElegirIngrediente">Ingrediente<select class="rcLineaIngrediente" required><option value=""${!elegido?' selected':''}>${linea.ingredienteId&&!actual?'Ingrediente no encontrado: seleccioná otro':'Seleccioná ingrediente'}</option>${lista.map(i=>`<option value="${escape(i.id)}"${i.id===elegido?.id?' selected':''}>${escape(i.nombre)}${i.eliminado?' (archivado)':''}</option>`).join('')}</select></label><label>Cantidad<input class="rcLineaCantidad" type="number" inputmode="decimal" min="0.000001" step="any" value="${escape(linea.cantidad??'')}" required></label><label>Unidad<select class="rcLineaUnidad">${opcionesUnidad(grupo,unidad)}</select></label><button type="button" class="rcQuitarLinea" data-rc-quitar-linea aria-label="Quitar ingrediente">×</button><span class="rcLineaPrecio"></span><small class="rcLineaCosto"></small></div>`;
  }
  function abrirReceta(id=null,borrador=null) {
    if(estado.guardando)return;
    if(!activos('ingredientes').length && !id && !borrador){seleccionarVista('ingredientes');mensaje('rcEstado','Primero cargá al menos un ingrediente con su precio.');return;}
    const dato=borrador||(id?estado.recetas.get(id):null);
    if(id&&!dato)return;
    estado.formReceta={id:dato?.id||idNuevo(),version:dato?.version||0,nuevo:!dato?.id||dato.nuevo===true};
    el('rcRecetaNombre').value=dato?.nombre||'';el('rcRecetaRinde').value=dato?.rinde??'';
    el('rcRecetaUnidadRinde').value=dato?.unidadRinde||'kg';el('rcRecetaPreparacion').value=dato?.preparacion||'';
    el('rcPesoTotalKg').value=dato?.pesoTotalKg??'';el('rcGramosUnidad').value=dato?.gramosUnidad??'';el('rcProductoNombre').value=dato?.productoNombre||'';
    ['Merma','Envoltura','Energia'].forEach(n=>el('rc'+n+'Porcentaje').value=dato?dato[n.toLowerCase()+'Porcentaje']??0:5);
    el('rcExtrasReceta').innerHTML=(dato?.extras?.length?dato.extras:[{nombre:'Mano de obra (horas)'},{nombre:'Gas (horas)'},{nombre:'Luz'},{nombre:'Envío'}]).map(renderExtra).join('');
    el('rcLineasReceta').innerHTML=(dato?.lineas?.length?dato.lineas:[{}]).map(renderFila).join('');
    el('rcTituloReceta').textContent=id?'Editar receta':'Nueva receta';el('rcFormReceta').hidden=false;
    mensaje('rcEstadoReceta','');seleccionarVista('recetas');actualizarPreview();
  }
  function leerReceta() {
    return {...estado.formReceta,nombre:el('rcRecetaNombre').value.trim(),rinde:numero(el('rcRecetaRinde').value),
      unidadRinde:el('rcRecetaUnidadRinde').value,preparacion:el('rcRecetaPreparacion').value.trim(),
      pesoTotalKg:el('rcRecetaUnidadRinde').value==='kg'?null:numero(el('rcPesoTotalKg').value),
      gramosUnidad:numero(el('rcGramosUnidad').value),productoNombre:el('rcProductoNombre').value.trim(),
      mermaPorcentaje:numero(el('rcMermaPorcentaje').value||0),envolturaPorcentaje:numero(el('rcEnvolturaPorcentaje').value||0),
      energiaPorcentaje:numero(el('rcEnergiaPorcentaje').value||0),gananciaPorcentaje:0,
      extras:[...el('rcExtrasReceta').querySelectorAll('.rcExtra')].map(f=>({nombre:f.querySelector('.rcExtraNombre').value.trim(),cantidad:numero(f.querySelector('.rcExtraCantidad').value),precioUnitario:numero(f.querySelector('.rcExtraPrecio').value)})),
      lineas:[...el('rcLineasReceta').querySelectorAll('.rcLinea')].map(f=>({ingredienteId:f.querySelector('.rcLineaIngrediente').value,
        cantidad:numero(f.querySelector('.rcLineaCantidad').value),unidad:f.querySelector('.rcLineaUnidad').value}))};
  }
  function actualizarPreview() {
    if(!el('rcFormReceta')||el('rcFormReceta').hidden)return;
    const r=leerReceta(),c=costeReceta(r);
    el('rcTotalPorcentajes').value=Number.isFinite(c.porcentajeTotal)?Number(c.porcentajeTotal.toFixed(10)):'';
    el('rcPreviewCosto').innerHTML=`<div class="rcCosto">${etiquetaCosto(c,r)}</div>${htmlResumenPlanilla(c,r)}`;
    el('rcPesoTotalLabel').hidden=r.unidadRinde==='kg';
    el('rcUsarPesoAutomatico').hidden=c.origenPeso==='ingredientes';
    el('rcRecetaRinde').placeholder=r.unidadRinde==='kg'?'Automático: suma de ingredientes':'Ej.: 30';
    [...el('rcLineasReceta').querySelectorAll('.rcLinea')].forEach((f,i)=>{const dato=c.filas[i]?.coste,precio=precioReferencia(c.filas[i]?.ingrediente);
      f.querySelector('.rcLineaPrecio').textContent=precio?`${dinero(precio.importe)} / ${singular(precio.unidad)}`:'—';
      f.querySelector('.rcLineaCosto').textContent=dato?.ok?dinero(dato.importe):dato?.motivo||'';});
    [...el('rcExtrasReceta').querySelectorAll('.rcExtra')].forEach((f,i)=>{const extra=c.extras[i];f.querySelector('.rcExtraCosto').textContent=extra?.ok?dinero(extra.importe):'Revisar cantidad y precio';});
  }
  function usarPesoAutomatico() {
    if(estado.guardando)return;
    const r=leerReceta(),c=costeReceta(r);
    if(!(c.pesoAuto>0)){mensaje('rcEstadoReceta','Para sumar los kilos automáticamente, cargá todos los ingredientes en kg o gramos. Si alguno está en litros o unidades, indicá el peso total manualmente.',true);return;}
    if(r.unidadRinde==='kg')el('rcRecetaRinde').value='';
    el('rcPesoTotalKg').value='';
    actualizarPreview();guardarBorrador('recetas');
    mensaje('rcEstadoReceta','Kilos automáticos activados. Al cambiar un ingrediente se actualizan el peso y el costo por unidad. Guardá la receta para conservarlo.');
  }
  function renderExtra(extra={}) {
    return `<div class="rcExtra"><label>Concepto<input class="rcExtraNombre" maxlength="120" value="${escape(extra.nombre||'')}"></label><label>Cantidad<input class="rcExtraCantidad" type="number" min="0" step="any" inputmode="decimal" value="${escape(extra.cantidad??0)}"></label><label>Precio unitario ($)<input class="rcExtraPrecio" type="number" min="0" step="any" inputmode="decimal" value="${escape(extra.precioUnitario??'')}"></label><button type="button" data-rc-quitar-extra aria-label="Quitar extra">×</button><small class="rcExtraCosto"></small></div>`;
  }
  function validarIngrediente(dato) {
    if(!dato.nombre||dato.nombre.length>120)throw Error('Ingresá un nombre de hasta 120 caracteres.');
    if(dato.precioCompra===null||dato.precioCompra<0||dato.cantidadCompra===null||dato.cantidadCompra<=0||!UNIDADES[dato.unidadCompra])throw Error('Completá precio, cantidad de compra y unidad.');
    if(!Number.isFinite(dato.precioCompra/dato.cantidadCompra))throw Error('Revisá el precio y la cantidad de compra.');
  }
  function validarReceta(dato) {
    if(!dato.nombre||dato.nombre.length>120)throw Error('Ingresá un nombre de hasta 120 caracteres.');
    if(dato.preparacion.length>15000)throw Error('La preparación es demasiado larga.');
    if((dato.extras||[]).length>50)throw Error('La receta admite hasta 50 extras.');
    if((dato.productoNombre||'').length>120)throw Error('El nombre del producto admite hasta 120 caracteres.');
    if(!dato.lineas.length||dato.lineas.length>150)throw Error('La receta necesita entre 1 y 150 ingredientes.');
    if(!costeReceta(dato).ok)throw Error('Revisá cantidades, rendimiento, porcentajes y extras. En kg podés dejar el rendimiento vacío si todos los ingredientes se cargaron en gramos o kilos.');
  }
  async function escribir(tipo,dato,{archivo=false}={}) {
    if(!autorizado()||!estado.uid||estado.uid!==usuario())throw Error('Ingresá como Administrador para guardar.');
    if(navigator.onLine===false)throw Error('Necesitás conexión para guardar. Conservamos lo que estás escribiendo.');
    if(typeof db==='undefined'||!db)throw Error('Firebase todavía no está listo. Volvé a intentar.');
    const ref=coleccion(tipo).doc(dato.id);
    const uid=estado.uid;
    const guardado=await db.runTransaction(async tx=>{
      const snap=await tx.get(ref),anterior=snap.exists?snap.data():null;
      if(uid!==usuario()||!autorizado())throw Error('La sesión cambió. Volvé a ingresar como Administrador.');
      if(dato.nuevo&&anterior)throw Error('Ese registro ya existe. Volvé a abrirlo.');
      if(!dato.nuevo&&!anterior)throw Error('Este registro ya no existe. Actualizá la sección.');
      if(anterior&&(anterior.version||0)!==dato.version)throw Error('Este registro cambió en otro dispositivo. Conservamos el formulario; revisá el precio o la receta actual antes de volver a editar.');
      if(!archivo&&anterior?.eliminado)throw Error('Primero restaurá el registro archivado.');
      if(tipo==='ingredientes'&&anterior&&!archivo&&UNIDADES[anterior.unidadCompra]?.grupo!==UNIDADES[dato.unidadCompra]?.grupo)throw Error('Para pasar de peso a volumen o unidades, creá otro ingrediente. Las recetas usan la medida original.');
      const ahora=new Date().toISOString();
      const campos=archivo?{...anterior,eliminado:!anterior.eliminado}:tipo==='ingredientes'?{
        nombre:dato.nombre,precioCompra:dato.precioCompra,cantidadCompra:dato.cantidadCompra,unidadCompra:dato.unidadCompra,eliminado:false
      }:{nombre:dato.nombre,rinde:dato.rinde,unidadRinde:dato.unidadRinde,preparacion:dato.preparacion,lineas:dato.lineas,pesoTotalKg:dato.pesoTotalKg,gramosUnidad:dato.gramosUnidad,productoNombre:dato.productoNombre,extras:dato.extras,mermaPorcentaje:dato.mermaPorcentaje,envolturaPorcentaje:dato.envolturaPorcentaje,energiaPorcentaje:dato.energiaPorcentaje,gananciaPorcentaje:dato.gananciaPorcentaje,eliminado:false};
      const datos={...campos,version:(anterior?.version||0)+1,actualizadoEn:ahora,creadoEn:anterior?.creadoEn||ahora};
      tx.set(ref,datos);return {id:dato.id,...datos};
    });
    if(uid===estado.uid){estado[tipo].set(guardado.id,guardado);render();}
    return guardado;
  }
  async function guardar(tipo) {
    if(estado.guardando)return;
    const ingrediente=tipo==='ingredientes',formId=ingrediente?'rcFormIngrediente':'rcFormReceta',status=ingrediente?'rcEstadoIngrediente':'rcEstadoReceta';
    const dato=ingrediente?leerIngrediente():leerReceta();
    const uid=estado.uid;
    try{
      ingrediente?validarIngrediente(dato):validarReceta(dato);
      guardarBorrador(tipo);estado.guardando=true;
      el(formId).querySelector('button[type="submit"]').disabled=true;
      el(formId).querySelectorAll('input,select,textarea,button').forEach(n=>n.disabled=true);mensaje(status,'Guardando en Firebase…');
      await escribir(tipo,dato);
      if(estado.uid!==uid)return;
      el(formId).hidden=true;borrarBorrador(tipo);
      if(ingrediente){estado.formIngrediente=null;estado.ingredientesPendientes.delete(dato.id);renderIngredientes();}else estado.formReceta=null;
      mensaje('rcEstado',ingrediente?'Ingrediente guardado. Los costos de las recetas ya están actualizados.':'Receta guardada y disponible en tus otros dispositivos.');
    }catch(error){mensaje(status,error.code==='permission-denied'?'Firebase no autorizó el guardado. Verificá tu cuenta de Administrador.':error.message,true);}
    finally{estado.guardando=false;el(formId)?.querySelector('button[type="submit"]')?.removeAttribute('disabled');el(formId)?.querySelectorAll('input,select,textarea,button').forEach(n=>n.disabled=false);}
  }
  async function archivar(tipo,id) {
    if(estado.guardando)return;
    const dato=estado[tipo].get(id);if(!dato)return;
    estado.guardando=true;
    try{await escribir(tipo,{...dato,nuevo:false},{archivo:true});mensaje('rcEstado',dato.eliminado?'Registro restaurado.':'Registro archivado. Podés restaurarlo desde Ver archivados.');}
    catch(error){mensaje('rcEstado',error.code==='permission-denied'?'Firebase no autorizó el cambio. Verificá tu cuenta de Administrador.':error.message,true);}
    finally{estado.guardando=false;}
  }
  function detener() {
    estado.escuchas.forEach(f=>f());estado.escuchas=[];
    estado.uid=null;estado.ingredientes.clear();estado.recetas.clear();estado.ingredientesPendientes.clear();estado.listo={ingredientes:false,recetas:false};
    estado.formIngrediente=null;estado.formReceta=null;
    if(el('rcFormIngrediente'))el('rcFormIngrediente').hidden=true;
    if(el('rcFormReceta'))el('rcFormReceta').hidden=true;
    render();
  }
  function escuchar() {
    if(!autorizado()||!usuario()) {mensaje('rcEstado','Ingresá como Administrador para consultar recetas y precios.',true);return;}
    if(typeof db==='undefined'||!db){mensaje('rcEstado','Firebase todavía no inició. Tocá Actualizar.',true);return;}
    if(estado.escuchas.length&&estado.uid===usuario())return;
    if(estado.uid&&estado.uid!==usuario())detener();
    estado.uid=usuario();const uid=estado.uid;
    mensaje('rcEstado','Consultando ingredientes y recetas…');
    ['ingredientes','recetas'].forEach(tipo=>{
      const baja=coleccion(tipo).onSnapshot({includeMetadataChanges:true},snap=>{
        if(estado.uid!==uid||!autorizado())return;
        const mapa=new Map();snap.forEach(doc=>mapa.set(doc.id,{...doc.data(),id:doc.id}));estado[tipo]=mapa;estado.listo[tipo]=true;
        render();
        if(estado.listo.ingredientes&&estado.listo.recetas)mensaje('rcEstado',snap.metadata?.fromCache?'Mostrando datos guardados. Conectando con Firebase…':'Ingredientes y recetas actualizados desde Firebase.');
      },error=>{
        if(estado.uid!==uid)return;
        mensaje('rcEstado',error.code==='permission-denied'?'Firebase no autorizó recetas y precios. Verificá tu cuenta de Administrador.':'No se pudieron recibir los cambios. Conservamos los formularios; tocá Actualizar con conexión.',true);
      });estado.escuchas.push(baja);
    });
  }
  function conectarUI() {
    if(estado.iniciado)return;estado.iniciado=true;
    const panel=el('rcPanel');
    panel.addEventListener('click',evento=>{
      const b=evento.target.closest('button');if(!b)return;
      if(b.dataset.rcVista){seleccionarVista(b.dataset.rcVista);return;}
      if(b.dataset.rcGuardarPrecio){guardarPrecioEnTabla(b.dataset.rcGuardarPrecio);return;}
      if(b.hasAttribute('data-rc-quitar-extra')){if(estado.guardando)return;b.closest('.rcExtra').remove();actualizarPreview();guardarBorrador('recetas');return;}
      if(b.dataset.rcEditarIngrediente){abrirIngrediente(b.dataset.rcEditarIngrediente);return;}
      if(b.dataset.rcEditarReceta){abrirReceta(b.dataset.rcEditarReceta);return;}
      if(b.dataset.rcArchivo){archivar(b.dataset.rcArchivo,b.dataset.id);return;}
      if(b.hasAttribute('data-rc-quitar-linea')){if(estado.guardando)return;b.closest('.rcLinea').remove();actualizarPreview();guardarBorrador('recetas');}
    });
    ['input','change'].forEach(tipo=>el('rcListaIngredientes').addEventListener(tipo,e=>{if(e.target.dataset.rcCampo)editarPrecioEnTabla(e.target);}));
    el('rcUsarPesoAutomatico').addEventListener('click',usarPesoAutomatico);
    el('rcAgregarExtra').addEventListener('click',()=>{if(estado.guardando)return;el('rcExtrasReceta').insertAdjacentHTML('beforeend',renderExtra());actualizarPreview();guardarBorrador('recetas');});
    el('rcNuevoIngrediente').addEventListener('click',()=>abrirIngrediente());el('rcNuevaReceta').addEventListener('click',()=>abrirReceta());
    el('rcAgregarIngrediente').addEventListener('click',()=>{if(estado.guardando)return;el('rcLineasReceta').insertAdjacentHTML('beforeend',renderFila());actualizarPreview();guardarBorrador('recetas');});
    ['Ingredientes','Recetas'].forEach(n=>el('rcBuscar'+n).addEventListener('input',n==='Ingredientes'?renderIngredientes:renderRecetas));
    el('rcVerArchivadosIngredientes').addEventListener('change',e=>{estado.archivadosIngredientes=e.target.checked;renderIngredientes();});
    el('rcVerArchivadasRecetas').addEventListener('change',e=>{estado.archivadasRecetas=e.target.checked;renderRecetas();});
    el('rcIngredienteSinCosto').addEventListener('change',()=>{actualizarPrecioIngrediente();guardarBorrador('ingredientes');});
    el('rcFormIngrediente').addEventListener('submit',e=>{e.preventDefault();guardar('ingredientes');});
    el('rcFormReceta').addEventListener('submit',e=>{e.preventDefault();guardar('recetas');});
    ['Ingrediente','Receta'].forEach(n=>{
      el('rcCancelar'+n).addEventListener('click',()=>{if(estado.guardando)return;el('rcForm'+n).hidden=true;borrarBorrador(n==='Ingrediente'?'ingredientes':'recetas');});
      el('rcForm'+n).addEventListener('input',()=>{guardarBorrador(n==='Ingrediente'?'ingredientes':'recetas');actualizarPreview();});
    });
    el('rcFormReceta').addEventListener('change',e=>{
      if(e.target.classList.contains('rcLineaIngrediente')){
        const fila=e.target.closest('.rcLinea'),i=estado.ingredientes.get(e.target.value);
        fila.querySelector('.rcLineaUnidad').innerHTML=opcionesUnidad(UNIDADES[i?.unidadCompra]?.grupo,i?.unidadCompra);
      }guardarBorrador('recetas');actualizarPreview();
    });
    el('rcActualizar').addEventListener('click',()=>{estado.escuchas.forEach(f=>f());estado.escuchas=[];escuchar();});
    el('rcRecuperarBorrador').addEventListener('click',()=>{
      const r=leerBorrador('recetas'),i=leerBorrador('ingredientes');
      if(r)abrirReceta(r.nuevo?null:r.id,r);else if(i)abrirIngrediente(i.nuevo?null:i.id,i);
      else mensaje('rcEstado','No hay un formulario pendiente en este dispositivo.');
    });
  }
  function iniciar() {conectarUI();escuchar();seleccionarVista(estado.vista);}
  window.RecetasCostos={iniciar,sesionCambiada(conectado){if(!conectado)detener();else if(estado.iniciado)escuchar();},
    calcular:costeReceta,costeLinea,precioReferencia,unidades:UNIDADES};
})();
