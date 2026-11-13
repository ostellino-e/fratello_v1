/* Fratello: kilos manuales de masa por fecha de pedidos. */
(() => {
  'use strict';
  const datos=new Map(),pendientes=new Set(),invalidas=new Set(),revisiones=new Map();
  let fechaActiva='',baja=null,escuchaFecha='',iniciado=false;
  const el=id=>document.getElementById(id);
  const clave=f=>'fratello_masas_panadero_'+f;
  const limpiar=v=>({factura:valor(v?.factura),hojaldre:valor(v?.hojaldre)});
  function valor(v){if(v===null||v===undefined||String(v).trim()==='')return null;const n=Number(String(v).replace(',','.'));return Number.isFinite(n)&&n>=0?n:null;}
  function valores(f){if(!datos.has(f)){let d={};try{d=JSON.parse(localStorage.getItem(clave(f))||'{}');}catch(_){}datos.set(f,limpiar(d));if(d.pendiente)pendientes.add(f);}return {...datos.get(f)};}
  function local(f){try{localStorage.setItem(clave(f),JSON.stringify({...valores(f),pendiente:pendientes.has(f)}));return true;}catch(_){estado('No se pudo guardar en este dispositivo. Tocá Guardar kilos con conexión.');return false;}}
  function ref(f){return typeof db!=='undefined'&&db?db.collection('fratello').doc('masas_panadero').collection('jornadas').doc(f):null;}
  function estado(t){if(el('estadoMasasPanadero'))el('estadoMasasPanadero').textContent=t;}
  function pintar(){const d=valores(fechaActiva);el('masaFacturaKg').value=d.factura??'';el('masaHojaldreKg').value=d.hojaldre??'';el('fechaMasasPanadero').textContent=fechaActiva.split('-').reverse().join('/');}
  function refrescarResumen(){if(typeof calcularDiferencias==='function')calcularDiferencias();}
  function activar(f){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(f))return;
    if(fechaActiva!==f){fechaActiva=f;invalidas.delete(f);pintar();estado(pendientes.has(f)?'Cambios en este dispositivo. Tocá Guardar kilos para compartirlos.':'Cargá los kilos que querés indicar al panadero.');}
    if(escuchaFecha===f)return;
    if(baja)baja();baja=null;escuchaFecha='';const r=ref(f);if(!r)return;
    escuchaFecha=f;
    baja=r.onSnapshot({includeMetadataChanges:true},snap=>{
      if(fechaActiva!==f||pendientes.has(f)||invalidas.has(f)||snap.metadata?.hasPendingWrites)return;
      if(snap.metadata?.fromCache&&!snap.exists)return;
      datos.set(f,limpiar(snap.exists?snap.data():{}));local(f);pintar();
      estado(snap.metadata?.fromCache?'Kilos guardados en caché. Conectando…':'Kilos actualizados para esta fecha.');refrescarResumen();
    },()=>{if(fechaActiva===f){escuchaFecha='';estado('No se pudieron consultar los kilos online. Conservamos la carga de este dispositivo.');}});
  }
  function editar(){
    const f=fechaActiva,inputs=[el('masaFacturaKg'),el('masaHojaldreKg')];
    if(inputs.some(n=>n.validity?.badInput||n.value!==''&&valor(n.value)===null)){invalidas.add(f);estado('Ingresá kilos válidos, iguales o mayores que cero.');return;}
    invalidas.delete(f);datos.set(f,{factura:valor(inputs[0].value),hojaldre:valor(inputs[1].value)});pendientes.add(f);revisiones.set(f,(revisiones.get(f)||0)+1);
    const guardado=local(f);if(guardado)estado('Cambios guardados en este dispositivo. Tocá Guardar kilos para compartirlos.');refrescarResumen();
  }
  function validar(f){if(!invalidas.has(f))return true;alert('Revisá los kilos de masa: deben ser números iguales o mayores que cero.');return false;}
  async function guardar(){
    const f=fechaActiva;if(!validar(f))return;const r=ref(f);if(!r||navigator.onLine===false){estado('Sin conexión. Los kilos siguen guardados en este dispositivo.');return;}
    const d=valores(f),revision=revisiones.get(f)||0;estado('Guardando kilos online…');
    const timer=setTimeout(()=>{if(fechaActiva===f)estado('El guardado sigue pendiente. Conservamos los kilos en este dispositivo.');},10000);
    try{await r.set({...d,fecha:f,actualizado:new Date().toISOString()},{merge:true});
      if((revisiones.get(f)||0)===revision){pendientes.delete(f);local(f);if(fechaActiva===f)estado('Kilos guardados para compartir entre dispositivos.');}
    }catch(_){if(fechaActiva===f)estado('No se pudieron guardar online. Conservamos los kilos en este dispositivo.');}finally{clearTimeout(timer);}
  }
  function texto(f,incluirVacio=false){const d=valores(f),lineas=[];
    if(d.factura!==null)lineas.push('- Masa de factura a preparar: '+formato(d.factura)+' kg');
    if(d.hojaldre!==null)lineas.push('- Masa de hojaldre a preparar: '+formato(d.hojaldre)+' kg');
    if(!lineas.length&&!incluirVacio)return '';
    return '\n\nMASA A PREPARAR\n'+(lineas.length?lineas.join('\n'):'- Sin kilos de masa indicados para esta fecha.')+'\n';
  }
  function formato(n){return new Intl.NumberFormat('es-AR',{maximumFractionDigits:6}).format(n);}
  async function preparar(f){
    if(!validar(f))return false;
    // La fecha semanal enviada puede ser distinta de la que está en el editor.
    if(f!==fechaActiva&&!pendientes.has(f)){
      valores(f);if(pendientes.has(f))return true;
      const r=ref(f);if(r){let timer;try{const snap=await Promise.race([r.get({source:'server'}),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('timeout')),6000);})]);datos.set(f,limpiar(snap.exists?snap.data():{}));local(f);}catch(_){alert('No se pudieron consultar los kilos de masa de la fecha a enviar. Abrí esa fecha en Resumen y revisalos antes de enviar.');return false;}finally{clearTimeout(timer);}}
    }return true;
  }
  function iniciar(){if(iniciado||!el('masaFacturaKg'))return;iniciado=true;
    ['masaFacturaKg','masaHojaldreKg'].forEach(id=>el(id).addEventListener('input',editar));el('guardarMasasPanadero').addEventListener('click',guardar);
    if(typeof authFratello!=='undefined'&&authFratello)authFratello.onAuthStateChanged(()=>{if(baja)baja();baja=null;escuchaFecha='';if(fechaActiva)activar(fechaActiva);});
  }
  window.MasasPanadero={iniciar,activar,valores,texto,preparar,validar};
})();
