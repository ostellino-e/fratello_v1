# Fratello v3.9.5D.3 — Caja integrada en Administración

## Corrección principal
La versión anterior había preparado el panel, pero el acceso no quedaba suficientemente visible dentro de Administración.

En esta versión:
- El panel privado de Caja está alojado dentro de `panelAdministracionPrivado`.
- Se agregó la pestaña visible “🏦 Caja privada”.
- Se agregó una tarjeta grande “Control completo de Caja” en el Resumen de Administración.
- La tarjeta abre directamente el módulo.
- El código verifica y relocaliza automáticamente el panel dentro de Administración si el navegador conserva una estructura anterior en caché.
- La pantalla Caja de empleados no contiene acceso privado, PIN ni referencias administrativas.
- La pestaña Caja privada exige una sesión con rol administrador.

## Caja para empleados
Los empleados continúan usando la pantalla Caja para:
- registrar cierres;
- cargar efectivo y transferencias;
- cargar gastos;
- consultar únicamente las funciones operativas habilitadas.

## Administración > Caja privada
Incluye:
- resumen diario;
- cierres del día;
- indicadores de ventas;
- comparación por períodos;
- libro diario;
- acumulados;
- personas habilitadas.

## Prueba
1. Abrir Fratello sin iniciar sesión.
2. Entrar a Caja y verificar que no exista “Acceso privado”.
3. Iniciar sesión desde el ícono de usuario.
4. Entrar a Administración.
5. En el Resumen debe verse una tarjeta grande “Control completo de Caja”.
6. También debe verse la pestaña “🏦 Caja privada”.
7. Abrirla y comprobar cierres, indicadores, libro diario y personas.

## Versión
v3.9.5D.3

## Estado
- Etapa A: 100%
- Etapa B: 100%
- Etapa C — Administración: 38%
- Etapa D — Seguridad: 40%
- Administración financiera: 50%
- Seguridad y usuarios: 48%
- Proyecto Fratello estimado: 93%
