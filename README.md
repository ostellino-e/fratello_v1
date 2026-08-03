# Fratello v5.2.1 — Criollos como producto independiente

## Bug corregido
La palabra “Criollos” podía interpretarse como Chicharrón. Al corregirla manualmente, el cambio visible no quedaba protegido y una nueva carga o regeneración volvía a mostrar Chicharrón.

## Correcciones
- Se agregó Criollos como producto independiente del catálogo.
- Se agregaron los alias exactos:
  - criollo
  - criollos
- La coincidencia exacta se evalúa antes de la búsqueda aproximada.
- Se eliminan posibles alias criollo/criollos del producto Chicharrón.
- La corrección manual guarda productoId, nombre y marca de corrección.
- El pedido recibe fecha de actualización para que Firebase conserve la versión corregida.
- Los pedidos fijos con corrección manual ya no se reinterpretan automáticamente.
- La migración agrega Criollos aunque el dispositivo tenga un catálogo anterior guardado.

## Prueba
1. Cargar: Criollos 10 unidades.
2. Confirmar que aparezca Criollos.
3. Salir y volver a Pedidos.
4. Esperar la sincronización.
5. Confirmar que continúe figurando Criollos.

## Versión esperada
v5.2.1
