# Fratello v3.2.1 — Corrección de modo online

Se corrigió el error:
`Cannot access 'pedidos' before initialization`

Ese error detenía la aplicación antes de que Firebase pudiera cargar, por eso aparecía “Modo local”.

Cambios:
- Inicialización segura de pedidos recibidos.
- Firebase vuelve a conectarse normalmente.
- Se mantiene la bandeja de pedidos externos.
- Se mantienen notificaciones y navegación hacia atrás.
