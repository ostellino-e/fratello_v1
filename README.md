# Fratello v3.2 — Pedidos externos, notificaciones y navegación

1. Pedidos enviados desde pedido.html
- Se incorporan mediante escucha en tiempo real de Firebase.
- Nueva bandeja “Pedidos recibidos desde el enlace de clientes”.
- Muestra pedidos aunque correspondan a otra fecha.
- Botón para abrir automáticamente la fecha correcta en Pedidos cargados.
- El formulario guarda fecha y fechaEntrega de forma explícita.

2. Notificaciones
- Manejo de mensajes FCM con la app abierta.
- Aviso local cuando aparece una notificación nueva en Firestore.
- Aviso local inmediato cuando llega un pedido desde el formulario.
- Service Worker unificado en la versión v3.2.
- Se mantiene el historial de notificaciones.

3. Navegación
- Nueva pila de navegación.
- “Volver” regresa a la pantalla anterior.
- Desde Producción, Pedidos o Resumen vuelve al centro de Pedidos.
- El botón Inicio sigue llevando directamente a la pantalla principal.
