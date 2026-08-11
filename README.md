# Fratello v5.3.2

## Tickets Xprinter XP-58
- Se mantiene el papel de 58 mm.
- Se aprovechan 56 mm de ancho.
- Márgenes de 1 mm.
- Tipografías considerablemente más grandes.
- Mayor separación vertical para evitar texto encimado.
- Alto automático adaptado al contenido.

## Pedidos entre dispositivos
Se corrigió un error real de v5.3.1:
- el módulo dedicado llamaba a `guardarLocal()`, función que no existía;
- eso podía detener la sincronización de pedidos con un error de JavaScript.

Ahora:
- usa `guardarPedidosLocal()`;
- los pedidos remotos no se eliminan por una jornada cerrada en otro dispositivo;
- si llega un pedido nuevo, la fecha se reabre automáticamente;
- al recibir datos se actualiza la pantalla semanal, futuros, historial, diferencias y tickets.

## Versión esperada
v5.3.2
