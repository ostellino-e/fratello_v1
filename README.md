# Fratello v4.2.1 — Reparación de pedidos fijos duplicados

## Corrección principal
- Evita que un pedido fijo se vuelva a crear para el mismo cliente y fecha.
- Reconoce pedidos antiguos aunque hayan quedado asociados a otro identificador fijo.
- Antes de generar tickets, elimina automáticamente los pedidos fijos repetidos.
- Los pedidos manuales no se eliminan.
- Si un duplicado tenía una entrega, un cobro o una modificación registrada, esos datos se priorizan y se conservan.

## Tickets
- Los tickets huérfanos de jornadas activas dejan de acumularse.
- La cantidad de tickets vuelve a sincronizarse con la cantidad real de pedidos.
- Cada día tiene el botón `🧹 Reparar pedidos y tickets`.
- El botón informa cuántos pedidos duplicados y tickets antiguos eliminó.

## Cómo reparar el jueves actual
1. Entrar en Tickets.
2. Abrir el jueves.
3. Presionar `🧹 Reparar pedidos y tickets`.
4. Confirmar la reparación.
5. Verificar que quede un solo ticket por cliente.

## Versión esperada
v4.2.1

## Progreso
- Duplicación de pedidos fijos: 100%
- Reparación manual por día: 100%
- Sincronización Pedidos/Tickets: 100%
- Entrega real y cuenta corriente inicial: 100%
- Proyecto Fratello estimado: 96%
