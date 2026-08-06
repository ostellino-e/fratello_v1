# Fratello v5.2.6 — Auditoría de cierres de Caja

## Nueva función
Cada cierre de Caja muestra un botón ⓘ con:
- fecha y hora de la primera carga;
- fecha y hora de última modificación;
- persona;
- identificador y tipo de dispositivo;
- cantidad de intentos registrados;
- historial de intentos;
- errores de validación;
- guardado local;
- sincronización online;
- errores de sincronización;
- ediciones y eliminaciones.

## Cierres anteriores
Los cierres ya existentes conservan los campos `creado` y `actualizado`, por lo que se muestra esa fecha y hora cuando estaba disponible.

No es posible reconstruir de manera retroactiva:
- el dispositivo usado;
- intentos fallidos anteriores;
- acciones que la versión previa nunca registró.

En esos casos la app lo indica como “No registrado: cierre anterior a v5.2.6”.

## Alcance
Solo se modificó el módulo de Caja y su auditoría.

## Versión esperada
v5.2.6
