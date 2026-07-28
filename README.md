# Fratello v3.7.6 — Notificaciones aisladas

Corrección estructural:

- El historial de notificaciones ya no puede generar avisos del dispositivo.
- Recargar la página no genera notificaciones.
- Borrar la memoria o comenzar una jornada no genera notificaciones.
- La primera sincronización con Firebase registra pedidos existentes sin avisar.
- Solo cambios posteriores con origen externo pueden generar aviso.
- Los mensajes FCM sin origen explícito se descartan.
- Los pedidos fijos se descartan tanto con la app abierta como cerrada.
- Se eliminó el doble listener de Firebase Messaging.
- Los pedidos manuales mantienen su aviso directo al crearse.
