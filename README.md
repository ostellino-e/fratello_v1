# Fratello v4.2 — Tickets, entregas y cuenta corriente

## 1. Días de Tickets
- Ningún día queda abierto al entrar.
- Al seleccionar un día, permanece abierto aunque la vista se renderice nuevamente.
- Al abrir otro día, se cierra el anterior.
- Ya no vuelve automáticamente al martes.

## 2. Ticket individual compacto
- El visor individual usa únicamente el ancho y alto real del ticket.
- Se eliminó la mitad blanca que aparecía a la derecha.
- El PDF individual mantiene formato angosto tipo ticket/remito.

## 3. Pedido original y entrega real
- El pedido original nunca se borra ni se modifica.
- Nuevo botón `Entrega / cobro`.
- Permite cambiar la cantidad realmente entregada.
- Permite marcar un artículo como `No se llevó`.
- Permite dejar una observación.
- El ticket se recalcula usando solamente lo efectivamente entregado.
- La entrega puede corregirse y volver a guardarse sin duplicar el movimiento.

## 4. Cuenta corriente
Cada entrega guarda:
- saldo anterior;
- importe entregado hoy;
- pago recibido hoy;
- saldo final pendiente.

El ticket muestra automáticamente:
- Compra de hoy
- Saldo anterior
- Pago recibido
- Total pendiente

## Prueba recomendada
1. Abrir Tickets y comprobar que todos los días estén cerrados.
2. Abrir un día distinto de martes.
3. Abrir un ticket individual y verificar que no tenga espacio blanco lateral.
4. Entrar en `Entrega / cobro`.
5. Colocar 0 en un producto o usar `No se llevó`.
6. Registrar un pago parcial.
7. Guardar y abrir nuevamente el ticket.
8. Confirmar que el total corresponda a lo entregado y que aparezca el saldo pendiente.

## Versión esperada
v4.2

## Progreso
- Correcciones solicitadas en Tickets: 100%
- Entrega real vs pedido: 100%
- Cuenta corriente inicial: 100%
- Etapa Seguridad y usuarios: 92%
- Proyecto Fratello estimado: 96%
