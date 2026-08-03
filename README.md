# Fratello v5.1.8 — Eliminación persistente de cierres de Caja

## Bug corregido
Un cierre eliminado volvía a aparecer porque la copia de Firebase se fusionaba otra vez con el dispositivo.

## Solución
- Cada eliminación genera una marca persistente.
- La marca se guarda localmente y en Firebase.
- La sincronización ya no restaura cierres eliminados.
- Se puede cargar de nuevo el mismo día y turno.
- Al crear el nuevo cierre real, la marca anterior se limpia.

## Versión esperada
v5.1.8
