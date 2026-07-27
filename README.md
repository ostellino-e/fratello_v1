# Fratello v2.5 — Programaciones de pedidos fijos

Cambios:
- Un mismo cliente puede tener varias programaciones de pedido fijo.
- Ejemplo: una programación de lunes a jueves y otra distinta para el viernes.
- Cada programación tiene nombre, días, pedido, prioridad y estado activo/pausado.
- Si dos programaciones del mismo cliente coinciden en un día, se usa la de mayor prioridad.
- Se puede duplicar una programación para crear rápidamente una variante.
- En Pedidos cargados se muestra el nombre de la programación aplicada.
- Los pedidos fijos anteriores siguen siendo compatibles y aparecen como “Pedido fijo”.
