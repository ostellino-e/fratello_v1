# Fratello v4.0 — Seguridad profesional

## Incluye
- Usuarios y roles: Administrador, Encargado, Atención y Producción.
- Permisos configurables por módulo.
- Dispositivos autorizados.
- Primer dispositivo del administrador autorizado automáticamente.
- Nuevos dispositivos registrados como pendientes.
- Bloqueo, desbloqueo y eliminación de dispositivos.
- Auditoría de sesiones, usuarios, dispositivos, administración y copias.
- Copia completa descargable en JSON.
- Restauración de copias.
- Exportación administrativa compatible con Excel mediante CSV.
- Vista imprimible para guardar como PDF.
- Historial de copias.
- Reglas de Firestore incluidas en `firestore.rules`.

## Importante sobre usuarios
La pantalla Usuarios asigna roles y permisos a correos existentes. Por seguridad, las cuentas y contraseñas deben crearse desde Firebase Authentication > Users.

## Importante sobre Firestore Rules
El ZIP incluye reglas seguras, pero antes de publicarlas se debe crear manualmente el documento:

`adminUsers/UID_DEL_ADMINISTRADOR`

Con los campos:
- `active`: true
- `role`: "administrador"
- `email`: correo del administrador

Después se publican con:

firebase deploy --only firestore:rules

No publiques las reglas sin crear primero ese documento porque bloquearías el acceso administrativo.

## Prueba recomendada
1. Subir la versión y actualizar.
2. Iniciar sesión desde el dispositivo principal.
3. Entrar en Administración.
4. Verificar las pestañas Usuarios, Dispositivos, Auditoría y Copias.
5. Agregar un usuario con correo ya creado en Firebase Authentication.
6. Abrir la app en otro dispositivo e iniciar sesión.
7. El nuevo dispositivo debe quedar pendiente y cerrar la sesión.
8. Desde el dispositivo principal, autorizarlo.
9. Probar copia JSON, CSV e impresión/PDF.

## Versión esperada
v4.0

## Progreso
- Etapa D — Seguridad y usuarios: 90%
- Falta para cierre total: separación física definitiva de finanzas privadas en otra colección y despliegue verificado de reglas en Firebase.
- Proyecto Fratello estimado: 95%
