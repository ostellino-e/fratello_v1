# Fratello v3.0 — Pedidos fijos por cliente

Cambios principales:
- Cada cliente muestra Pedido 1, Pedido 2, Pedido 3 y los que sean necesarios.
- Cada pedido tiene su propio campo de productos y sus propios días.
- Botón “Agregar pedido fijo” dentro de cada cliente.
- Evita que dos pedidos del mismo cliente usen el mismo día.
- Vinculación automática con el día seleccionado en Producción.
- La fecha de Pedidos se sincroniza con Producción y carga el pedido fijo correspondiente.
- Nuevo editor diario con textarea, sin perder saltos de línea.
- Parser mejorado para reconocer varios productos escritos en una misma línea.
- Reparación automática de pedidos viejos que aparecían con 0 ítems.
- Conserva los pedidos fijos ya existentes y los presenta dentro de su cliente.
