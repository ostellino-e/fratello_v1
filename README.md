# Fratello v3.1.1 — Corrección definitiva de decimales

Problema corregido:
- `0,5 kg` se convertía internamente en `0 5 kg`.
- El parser tomaba la cantidad como 0 y descartaba la línea.

Ahora reconoce correctamente:
- Marineras 300 gr → 0,3 kg
- Bizcocho de hojaldre 0,5 kg → 0,5 kg
- Bizcocho de grasa 0,5 kg → 0,5 kg

Además:
- Reinterpreta automáticamente todos los pedidos existentes usando su texto actual.
- Conserva las modificaciones manuales del texto.
- Mantiene la sección Notificaciones en la pantalla principal.
