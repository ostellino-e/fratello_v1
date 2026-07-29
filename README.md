# Fratello v4.0.2 — Corrección de reingreso a Administración

## Bug corregido
La primera entrada a Administración funcionaba, pero al salir y volver a entrar el contenido podía quedar vacío.

## Causa
La tarjeta del menú volvía a abrir solamente la sección exterior. No restauraba el panel privado ni renderizaba nuevamente sus módulos.

## Solución
Cada ingreso a Administración ahora:
- verifica la sesión y el dispositivo;
- vuelve a mostrar el panel privado;
- activa la pestaña Resumen;
- renderiza nuevamente Administración;
- renderiza Usuarios, Dispositivos, Auditoría y Copias;
- reinicia el control de actividad.

## Prueba
1. Entrar a Administración.
2. Volver al inicio.
3. Entrar nuevamente.
4. Repetirlo varias veces.
5. La pantalla debe mostrarse completa en cada ingreso.

## Versión esperada
v4.0.2
