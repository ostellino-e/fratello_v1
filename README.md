# Fratello v5.2.0 — Borrado definitivo de pedidos

## Causa encontrada
Los pedidos fijos podían volver con un ID nuevo. La versión anterior recordaba principalmente el ID eliminado, por lo que una regeneración automática podía crear visualmente el mismo pedido con otro ID.

## Corrección
- El borrado ahora guarda:
  - ID del pedido;
  - fecha;
  - cliente;
  - origen;
  - pedido fijo relacionado;
  - nombre de programación;
  - firma del contenido.
- La app reconoce el mismo pedido aunque Firebase o el generador le asignen otro ID.
- Los pedidos eliminados se filtran antes de mostrar la semana.
- Los pedidos fijos eliminados para una fecha no se regeneran en esa fecha.
- Se eliminaron asignaciones duplicadas que podían reemplazar la lista fusionada de pedidos fijos.
- El estado de borrado se guarda inmediatamente antes de sincronizar.

## Prueba
1. Borrar uno de los pedidos de prueba de hoy.
2. Esperar Guardado online.
3. Permanecer en la pantalla 15 segundos.
4. Salir y volver a entrar.
5. Confirmar que no reaparezca.

## Versión esperada
v5.2.0
