# Fratello v5.5.6

## Gastos por fuera de Caja
- Un gasto puede dividirse entre Efectivo, Transferencia, Cheque, Mercado Pago y Otro.
- La suma de los medios debe coincidir con el monto total.
- Se muestra en vivo cuánto se distribuyó y cuánto falta/sobra.
- Gastos anteriores de un solo medio siguen siendo compatibles.
- En la lista se ve el detalle por medio.

## Resumen de gastos
- Los totales por medio respetan los gastos mixtos.
- Las tarjetas Empleados / Insumos / Atención / Generales ahora se pueden tocar.
- Al tocar una tarjeta, se selecciona esa categoría sin abrir todas las semanas.
- Debajo de las tarjetas hay filtro principal y subfiltro por persona, proveedor o motivo.

## Sin cambios
Caja, Pedidos, Tickets, Pagos pendientes e Ingresos no fueron modificados.

## Correcciones v5.4.8
- Alta de nuevos nombres directamente desde el cierre de Caja.
- Las tarjetas de gastos abren el detalle completo de la categoría.
- Los ingresos diarios discriminan efectivo y transferencias.
- Sincronización reforzada para Caja, Administración, plata real y precios.
- Los tickets toman los precios actuales y reconocen correctamente Criollos.

## Correcciones v5.4.9
- La gestión de nombres vuelve a estar únicamente dentro de Administración.
- Las pestañas abiertas permanecen abiertas cuando la pantalla actualiza datos.
- Los gastos se muestran desde los más recientes hacia los más antiguos.
- Las tarjetas de categorías abren todos sus gastos.
- Los botones de filtro de gastos vuelven a responder.

## Mejoras v5.5.0
- Nuevo filtro visible debajo de las cuatro tarjetas de gastos.
- Subfiltro por empleado, proveedor, insumo o motivo cargado.
- Cada opción del subfiltro muestra su total acumulado.
- Tocar una tarjeta filtra la categoría sin abrir todas las semanas.
- Fechas visibles en formato argentino: día/mes/año.

## Corrección v5.5.1
- Se eliminó la copia antigua de precios que podía pisar una actualización.
- Los tickets consultan la lista vigente antes de abrirse o imprimirse.
- Editar precios desde Productos actualiza también la lista general.
- Las listas especiales conservan sus valores propios cuando son diferentes.
- El mensaje de guardado confirma cuándo los precios quedaron sincronizados.

## Mejora v5.5.2
- El ticket individual abre inmediatamente con los precios sincronizados.
- La comprobación online ocurre en segundo plano y no bloquea el botón.
- Si llega una lista más nueva, el ticket abierto se actualiza automáticamente.
- La impresión comercial mantiene la verificación previa de precios.

## Mejora v5.5.3
- Fratello se identifica como pedido interno.
- No muestra ni genera ticket comercial individual.
- Fratello queda excluido al imprimir o descargar todos los tickets comerciales.
- Fratello conserva su ticket individual para panaderos.
- Fratello continúa incluido al imprimir juntos todos los pedidos para producción.

## Mejora v5.5.4
- Los pagos mayores al total generan saldo a favor del cliente.
- Ese saldo se descuenta automáticamente de deudas y pedidos posteriores del mismo cliente.
- Pagos pendientes muestra por separado deuda y saldo a favor.
- Entregas, cobros y estado de tickets se sincronizan entre celular y computadora.
- Los botones de cada ticket son más compactos en pantallas de celular.

## Corrección v5.5.5
- Confirmar una entrega guarda un registro independiente y liviano en Firebase.
- Celular y computadora escuchan esos registros en tiempo real.
- Dibujar la pantalla de tickets ya no cambia falsamente la fecha de modificación.
- Una copia vieja de otro dispositivo ya no puede pisar una entrega nueva.
- El mensaje de entrega confirma si la sincronización quedó guardada para todos los dispositivos.

## Mejora v5.5.6
- Se eliminaron las leyendas superiores de la pantalla Tickets.
- Cada cliente ocupa una fila mucho más baja en el celular.
- Las cuatro acciones individuales se muestran en una línea compacta con icono y nombre corto.
- Las acciones generales del día quedan plegadas y se abren solo cuando se necesitan.
- En computadora se conservan los textos completos de los botones.

Versión esperada: v5.5.6
