# Fratello v5.2.8 — Sincronización separada de Caja y Administración

## Cambio principal
Caja y Administración dejan de depender del documento gigante `fratello/estado`.

Ahora usan:
- `fratello/caja_estado`
- `fratello/administracion_estado`

Esto evita que un guardado de Pedidos u otro módulo pise Caja/Gastos y reduce
los conflictos entre celulares.

## Qué se sincroniza en tiempo real
Caja:
- cierres por turno
- gastos incluidos en cierres
- auditoría
- personas de Caja
- configuración de Caja

Administración:
- gastos manuales
- ingresos externos
- clientes externos
- presupuestos
- plata real
- transferencias de dinero

## Recuperación
Al abrir v5.2.8 cada celular:
1. toma lo que conserva localmente;
2. lo fusiona con el documento dedicado de Firebase;
3. publica la unión;
4. queda escuchando cambios en tiempo real.

Por eso conviene abrir primero v5.2.8 en el celular de la panadería, que conserva
los datos que faltan, y después abrirla en el otro celular.

## No modificado
Pedidos, Tickets, Producción y resto de funciones siguen con su lógica previa.

## Versión esperada
v5.2.8
