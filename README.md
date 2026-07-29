# Fratello v3.9.3B.1 — Sincronización de Caja

## Qué mejora
- Mañana y tarde se fusionan por fecha y turno.
- Un dispositivo ya no debería borrar el cierre cargado desde otro.
- Al editar el mismo turno, prevalece la modificación más reciente.
- Caja se actualiza en tiempo real desde el listener principal de Firebase.
- Se eliminó el segundo listener incompatible que no estaba funcionando.
- Menos renderizados repetidos del panel de Caja.
- Si se corta Internet, el cambio queda local y se reintenta al volver la conexión.
- Estado visible: sincronizando, guardado online, sin conexión o error.

## Prueba recomendada
1. Abrir Fratello en dos dispositivos.
2. En uno cargar turno mañana.
3. En el otro cargar turno tarde.
4. Confirmar que ambos turnos aparezcan juntos en el Libro Diario.
5. Editar un turno y comprobar que el otro no desaparezca.

## Notificaciones
La opción para activar o desactivar notificaciones por cada cliente queda anotada para v3.9.3B.2.

## Estado
- v3.9.3B.1: 100%
- v3.9.3B.2: 0%
- v3.9.3B.3: 0%
- Módulo Caja estimado: 92%
- Proyecto Fratello estimado: 84%
