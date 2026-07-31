# Fratello v5.0.8 — Resumen operativo y Plata Real

## Correcciones
- La fecha/mes ahora aparece en la misma franja que Online actualizado.
- El estado de sincronización muestra también la versión aplicada: v5.0.8.
- Se agregó correctamente el contenedor que faltaba para mostrar el Resumen móvil.
- Ahora aparece el cuadro para cargar Plata Real.
- Plata Real es el único valor editable del Resumen.
- Se puede cargar Efectivo, Transferencias y Cheques.
- La Diferencia se calcula como: Plata Real - Ganancia esperada.
- Los valores se guardan por mes.

## Lógica del Resumen
La primera vista muestra únicamente:
1. Ingresos de Panadería Fratello provenientes de los cierres de Caja.
2. Pagos cobrados de clientes externos.
3. Total de ingresos.
4. Total de gastos.
5. Ganancia esperada.
6. Plata Real ingresada manualmente.
7. Diferencia.

Los ingresos externos pendientes de cobro no se cuentan como plata generada/cobrada en esta vista.

## Prueba
1. Entrar a Administración > Resumen.
2. Confirmar que arriba aparezcan Online, v5.0.8 y el mes.
3. Verificar Panadería Fratello y los clientes externos cobrados.
4. Cargar Plata Real.
5. Confirmar que la Diferencia cambie mientras se escribe.
6. Guardar, salir y volver a entrar.

## Versión esperada
v5.0.8
