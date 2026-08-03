# Fratello v5.1.9 — Pedidos persistentes y pedidos fijos restaurados

## Errores corregidos
- Un pedido borrado ya no vuelve a aparecer desde Firebase.
- El borrado individual y el borrado múltiple quedan registrados.
- Si el pedido era fijo, se conserva la exclusión solamente para esa fecha.
- Los pedidos fijos locales y remotos se fusionan en vez de reemplazarse.
- Las exclusiones de pedidos fijos se combinan entre dispositivos.
- La pantalla semanal vuelve a generar los pedidos fijos correspondientes para los siete días visibles.
- La sincronización en tiempo real no reemplaza los pedidos fijos por una lista incompleta.

## Prueba recomendada
1. Borrar un pedido normal y esperar Guardado online.
2. Salir y volver a entrar: no debe reaparecer.
3. Borrar un pedido fijo de una fecha: no debe reaparecer ese día.
4. Revisar otra fecha donde corresponda ese fijo: sí debe aparecer.
5. Confirmar que los pedidos fijos vuelvan a verse en la pantalla semanal.

## Versión esperada
v5.1.9
