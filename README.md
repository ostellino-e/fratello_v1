# Fratello v5.4.0 — Pagos pendientes por cliente

## Nueva pantalla
Pedidos > Pagos pendientes

Muestra todos los clientes cargados, ordenados por saldo pendiente.

Cada cliente permite:
- ver saldo pendiente actual;
- registrar pagos parciales;
- elegir medio de pago;
- fecha y observación;
- ver historial de cargos y pagos;
- eliminar un pago manual cargado por error.

## Regla fundamental
Los pagos cargados en esta pantalla:
- NO se suman a Caja;
- NO modifican efectivo ni transferencias de Caja;
- NO generan un nuevo ingreso;
- NO modifican ventas del día.

Solo reducen la deuda del cliente.

## Cuenta corriente
Saldo = pedidos/cargos - pagos recibidos.

Si queda deuda, permanece asociada al cliente y se arrastra para los siguientes pedidos.

## Sincronización
La cuenta corriente usa un documento independiente:
`fratello/cuentas_pendientes_estado`

Así el control de deuda se comparte entre dispositivos sin mezclarse con Caja.

## Sin cambios
Tickets, Producción, Caja, Gastos, Ingresos y Administración conservan su funcionamiento.

## Versión esperada
v5.4.0
