# Fratello v5.3.0 — Sincronización sin bucles

## Causa encontrada
El motor antiguo de Firebase tenía un reintento automático sin límite.
Si el documento general `fratello/estado` fallaba una vez de forma persistente,
la app volvía a intentar cada 1,2 segundos indefinidamente.

Eso explicaba:
- “Sincronizando...” de forma constante;
- lentitud;
- mensajes intermitentes de “Error al guardar online”.

## Correcciones
- El guardado general ahora tiene máximo 3 intentos.
- Los reintentos usan espera progresiva en vez de repetirse cada 1,2 segundos.
- Los errores permanentes de Firebase no se reintentan en bucle.
- Caja y Administración continúan usando sus documentos separados.
- Al abrir la app, Caja y Administración primero leen y fusionan Firebase.
- Solo escriben al iniciar si realmente hay diferencias.
- La carga inicial de Caja y Administración se hace en paralelo.
- Se eliminó un segundo guardado completo de Caja que ocurría después de cada cierre.
- Acciones de configuración de Caja que aún usaban el documento general ahora usan `caja_estado`.
- La edición inline de Caja también usa la sincronización dedicada.

## No modificado
- lógica de Pedidos;
- contenido de Pedidos;
- Tickets;
- Producción;
- cálculos financieros.

## Versión esperada
v5.3.0
