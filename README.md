# Fratello v5.2.2 — Pedidos manuales estables y Criollos definitivo

## Errores corregidos

### Pedido cargado que desaparecía
La eliminación semántica creada para impedir que reaparezcan pedidos fijos también estaba alcanzando pedidos manuales nuevos con el mismo cliente, fecha y contenido que una prueba borrada.

Ahora:
- los pedidos manuales se eliminan y sincronizan únicamente por su ID;
- la firma semántica se usa solo para pedidos fijos regenerables;
- se limpian las firmas antiguas que podían ocultar pedidos manuales;
- cada pedido manual nuevo guarda fecha de creación y actualización;
- el pedido permanece al salir, volver a entrar y sincronizar.

### Criollos interpretado como Chicharrón
- Criollos se fuerza como producto independiente antes de cualquier búsqueda aproximada;
- “criollo” y “criollos” apuntan directamente a CRIOLLOS;
- el catálogo se repara después de cada descarga desde Firebase;
- el catálogo corregido se guarda localmente;
- Chicharrón no conserva alias relacionados con Criollos.

## Prueba
1. Cargar un pedido nuevo con `Criollos 10 unidades`.
2. Confirmar que aparezca Criollos.
3. Salir de Pedidos y volver a entrar.
4. Esperar Guardado online / Online actualizado.
5. Confirmar que el pedido siga visible y que el producto continúe como Criollos.

## Versión esperada
v5.2.2
