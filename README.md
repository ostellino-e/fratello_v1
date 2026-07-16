# Fratello — Cloud Functions v2

Además de enviar la notificación push:
- Guarda cada aviso en `fratello_historial_notificaciones`.
- Al tocar la notificación abre `#notificaciones`.
- El historial muestra cliente, pedido, fecha y hora.

Deploy:
```powershell
firebase.cmd deploy --only functions
```
