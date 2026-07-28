# Fratello v3.7.1 — Panel semanal corregido

Correcciones:
- Confirmar un cliente ya no reconstruye el panel.
- Permanecen abiertos el día, el grupo y la pestaña del cliente.
- Se eliminó un render duplicado que cerraba los desplegables.
- La sincronización de Firebase ahora recupera también pedidos fijos.
- Los pedidos fijos se guardan correctamente en localStorage.
- Al cargar o editar un pedido para una fecha futura, esa fecha se reabre si había quedado cerrada por una prueba anterior.
- Se redujeron las escrituras simultáneas a Firestore mediante guardado agrupado.
- Esto evita el error QUICK_TOO_MANY_RPCS observado en la consola.
