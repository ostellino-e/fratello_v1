# Fratello v5.2.7 — Sincronización multidispositivo

## Problema corregido
La v5.2.6 podía escribir en Firebase el estado local completo de Administración.
Si un celular tenía una copia vieja, podía pisar Caja/Gastos/Ingresos cargados desde
otro dispositivo. Además el indicador podía quedar visualmente en “Sincronizando...”.

## Cambios
- Caja sigue fusionándose por cierre y fecha de actualización.
- Auditoría de Caja ahora se fusiona antes de guardar.
- Gastos, ingresos externos, clientes, presupuestos y transferencias de dinero
  se fusionan por ID entre Firebase y el dispositivo.
- El listener en tiempo real fusiona datos en lugar de reemplazar ciegamente.
- La carga inicial también recupera y fusiona Administración.
- El estado “Sincronizando...” tiene control de demora y ya no queda indefinidamente.
- Se eliminó una fusión duplicada de auditoría presente en v5.2.6.

## Importante
Esta versión no inventa datos que nunca llegaron a Firebase. Si los importes siguen
visibles en el celular de la panadería, conviene actualizar primero ese celular y
abrir la app con conexión para que pueda sincronizarlos.

## Versión esperada
v5.2.7
