# Fratello v4.0.1 — Corrección de inicio de Seguridad

## Error corregido
La v4.0 intentaba ejecutar el módulo antes de declarar `SEG_STORAGE_KEY`, lo que provocaba:

`ReferenceError: Cannot access 'SEG_STORAGE_KEY' before initialization`

## Solución aplicada
- Las constantes y funciones de Seguridad ahora se cargan al comienzo de `app.js`.
- Después se inicia el resto de Fratello.
- No hace falta modificar Firebase ni volver a publicar reglas para aplicar este parche.
- Se mantienen usuarios, roles, dispositivos, auditoría y copias.

## Versión esperada
v4.0.1
