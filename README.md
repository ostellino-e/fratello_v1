# Fratello v3.9.5D.2 — Roles y Caja privada oculta

## Cambios principales
- Se eliminó de la pantalla Caja el botón “Acceso privado”.
- Los empleados ya no ven ningún cartel, PIN ni referencia a un panel privado.
- Caja muestra únicamente la carga de cierres y gastos.
- El control completo de Caja fue trasladado a Administración.
- Dentro de Administración se agregó la pestaña “Control de Caja”.
- El acceso depende de la sesión de administrador iniciada en ese dispositivo.
- Se agregó una estructura inicial de roles, preparada para futuras cuentas de Atención, Producción y Encargado.
- El botón rápido para administrar personas queda oculto cuando no hay un administrador conectado.
- Se eliminó el cambio de PIN de Caja porque el acceso ahora utiliza Firebase Authentication.

## Prueba recomendada
1. Abrir la app sin iniciar sesión.
2. Entrar a Caja.
3. Confirmar que no aparezca “Acceso privado”, PIN ni panel administrativo.
4. Iniciar sesión desde el ícono de usuario.
5. Entrar a Administración.
6. Abrir la pestaña “Control de Caja”.
7. Confirmar que allí estén resumen, cierres, libro diario y personas.
8. Abrir la app en otro dispositivo y confirmar que continúe sin acceso administrativo.

## Versión
v3.9.5D.2

## Estado
- Etapa A: 100%
- Etapa B: 100%
- Etapa C — Administración: 32%
- Etapa D — Seguridad: 35%
- Administración financiera: 45%
- Seguridad y usuarios: 45%
- Proyecto Fratello estimado: 93%
