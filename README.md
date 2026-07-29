# Fratello v3.9.3B.2 — Notificaciones configurables

## Clientes
- Cada cliente tiene un interruptor para activar o silenciar notificaciones de pedidos.
- El pedido sigue entrando aunque el cliente esté silenciado.
- Los clientes existentes quedan activados por defecto.
- La preferencia queda guardada y sincronizada con los datos generales.

## Configuración general
- Activar o pausar todas las notificaciones.
- Mostrar u ocultar banners.
- Activar o desactivar sonido.
- Activar o desactivar vibración.
- Agrupar pedidos que llegan casi al mismo tiempo.

## Funcionamiento
- Los avisos locales respetan la preferencia de cada cliente.
- Los mensajes de Firebase en primer plano también la respetan.
- El Service Worker recibe y guarda las preferencias para filtrar avisos con la app cerrada.
- Al abrir Fratello, las notificaciones internas quedan marcadas como vistas.
- Se actualizó el Service Worker y el caché a v3.9.3B.2.

## Pruebas recomendadas
1. Desactivar notificaciones para un cliente.
2. Enviar un pedido desde su enlace: debe entrar sin mostrar aviso.
3. Reactivarlo y enviar otro pedido: debe mostrar aviso.
4. Enviar dos pedidos seguidos: deben agruparse.
5. Pausar notificaciones generales: ningún cliente debe generar banner.

## Estado
- v3.9.3B.1: 100%
- v3.9.3B.2: 100%
- v3.9.3B.3: 0%
- Módulo Caja: 92%
- Sistema de notificaciones: 90%
- Proyecto Fratello estimado: 87%
