# Fratello v5.3.1

## Ticket Xprinter 58 mm
- La impresión de tickets deja de generarse como A4.
- Formato: 58 mm de papel, 54 mm de contenido y márgenes mínimos.
- Un ticket por ancho, pensado para Xprinter XP-58.

## Pedidos multidispositivo
- Se agrega `fratello/pedidos_estado`.
- Pedidos, eliminaciones, pedidos fijos y exclusiones se sincronizan en un documento independiente.
- El documento general continúa como respaldo.
- Al iniciar, se fusionan Firebase + datos locales y se migra lo existente.
- Listener en tiempo real para que los pedidos cargados desde el celular de la panadería aparezcan en los demás dispositivos.

## Sin cambios
Caja, Gastos, Ingresos, Administración, cálculos y Producción conservan su lógica.
