# Fratello v3.7.3 — Notificaciones únicas

Corrección definitiva del flujo de avisos:

- Un pedido manual genera una sola notificación en el momento de crearse.
- Un pedido externo genera una sola notificación al aparecer por primera vez en Firebase.
- Los pedidos fijos nunca generan notificaciones.
- La sincronización, el renderizado y el recálculo no recorren pedidos para notificarlos.
- Los pedidos externos existentes se registran como conocidos al iniciar la app.
- Se mantiene la navegación corregida desde las notificaciones.
- Se mantiene el recuento correcto de producción y pedidos.
