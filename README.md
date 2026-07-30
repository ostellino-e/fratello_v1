# Fratello v4.2.2 — Recuperación y conservación de Tickets de Hoy

## Corrección principal
- Los tickets creados desde `Pedido Hoy` permanecen visibles aunque ya no estén en la lista operativa.
- Los tickets entregados permanecen visibles aunque el pedido original ya no esté entre los pedidos confirmados.
- Los tickets que tengan cobro registrado tampoco se eliminan.
- Se recuperan automáticamente tickets antiguos cuya clave comienza con `hoy-`.

## Reparación de duplicados
El botón `🧹 Reparar pedidos y tickets` ahora:
- elimina únicamente pedidos fijos duplicados;
- no borra tickets de Pedido Hoy;
- no borra tickets entregados;
- no borra tickets con cobros;
- vuelve a sincronizar la pantalla.

## Estado visual
- Los entregados aparecen con indicador verde y `✅ Entregado`.
- Los pendientes muestran `⏳ Pendiente`.
- Dentro del día, los entregados aparecen primero.

## Prueba recomendada
1. Abrir Tickets.
2. Abrir el día de hoy.
3. Verificar que aparezcan los tickets confirmados desde Pedido Hoy.
4. Confirmar una entrega.
5. Salir y volver a entrar en Tickets.
6. Comprobar que el ticket entregado continúe visible.
7. Presionar Reparar y confirmar que el ticket no desaparezca.

## Versión esperada
v4.2.2

## Progreso
- Conservación de Pedido Hoy: 100%
- Conservación de entregas y cobros: 100%
- Reparación segura de duplicados: 100%
- Estado visual de entrega: 100%
- Proyecto Fratello estimado: 96%
