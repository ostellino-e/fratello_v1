# Fratello v5.1.1 — Navegación persistente en Administración

## Bug corregido
Las pantallas internas de Administración podían volver solas al menú cuando:
- Firebase terminaba de verificar la sesión;
- llegaban datos desde la nube;
- se actualizaba Caja;
- se volvía a renderizar Administración.

## Solución
- La app guarda explícitamente qué pantalla administrativa está abierta.
- Resumen, Ingresos, Gastos, Presupuesto, Caja, Usuarios, Dispositivos, Auditoría y Copias permanecen abiertas.
- Las sincronizaciones y renderizados restauran la vista elegida.
- Solo se vuelve al menú al tocar `← Administración`.
- Al entrar desde Inicio, Administración continúa abriendo en su menú principal.

## Prueba
1. Entrar en Administración > Resumen.
2. Esperar al menos 15 segundos.
3. Confirmar que no vuelva sola.
4. Repetir con Ingresos, Gastos, Presupuesto y Caja.
5. Usar `← Administración` y confirmar que recién ahí vuelve al menú.

## Versión esperada
v5.1.1
