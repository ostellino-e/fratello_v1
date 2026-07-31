# Fratello v5.0.9 — Resumen en PC y navegación estable

## Correcciones
- El mismo Resumen operativo del celular ahora se muestra también en computadora.
- En PC se visualizan:
  - ingresos de Panadería Fratello;
  - pagos cobrados de clientes externos;
  - total de ingresos;
  - gastos;
  - ganancia;
  - Plata Real manual;
  - diferencia.
- Plata Real continúa siendo el único dato editable.
- La distribución en PC aprovecha el ancho con clientes en dos columnas e indicadores en una fila.

## Bug corregido
Al entrar a Resumen, la verificación de Firebase podía terminar unos segundos después y ejecutar nuevamente la apertura de Administración. Eso enviaba al usuario al menú anterior.

Ahora:
- la verificación de sesión se realiza en segundo plano;
- si ya estás dentro de Resumen, Ingresos, Gastos u otra pantalla, conserva esa vista;
- únicamente vuelve al menú cuando vos tocás el botón correspondiente.

## Prueba
1. Entrar a Administración > Resumen.
2. Esperar varios segundos sin tocar nada.
3. Confirmar que no vuelva al menú.
4. Abrir Resumen desde computadora.
5. Confirmar que aparezca la misma información operativa del celular.
6. Editar y guardar Plata Real.

## Versión esperada
v5.0.9
