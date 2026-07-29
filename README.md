# Fratello v3.9.5D.1 — Acceso de Administrador

## Cambios
- Se agregó un ícono de usuario en la esquina superior derecha.
- Administración permanece oculta mientras no exista una sesión iniciada.
- Inicio de sesión con usuario y contraseña mediante Firebase Authentication.
- La sesión se guarda únicamente en el navegador o dispositivo donde se inició.
- Iniciar sesión en un celular no abre Administración en otros dispositivos.
- Cierre de sesión independiente por dispositivo.
- El acceso anterior mediante PIN fue reemplazado para Administración.
- Caja conserva su funcionamiento actual.

## Configuración necesaria en Firebase
1. Abrir Firebase Console.
2. Ir a Authentication.
3. Presionar “Comenzar”.
4. Abrir “Método de acceso”.
5. Habilitar “Correo electrónico/contraseña”.
6. Ir a “Usuarios”.
7. Crear el usuario administrador con su correo y contraseña.

No escribas la contraseña dentro del código.

## Prueba
1. Abrir Fratello en tu dispositivo.
2. Tocar el ícono 👤.
3. Ingresar el usuario creado en Firebase.
4. Confirmar que aparezca la tarjeta Administración.
5. Abrir Fratello en otro celular: Administración debe continuar oculta.
6. Cerrar sesión en tu dispositivo: la tarjeta debe desaparecer.

## Alcance de seguridad
Esta versión controla el acceso visible y la sesión por dispositivo.
La autorización de dispositivos específicos y las reglas privadas de Firestore se completarán en D.2 y D.3.

## Estado
- Etapa A: 100%
- Etapa B: 100%
- Etapa C: 25%
- Etapa D: 20%
- Administración Financiera: 40%
- Seguridad y usuarios: 35%
- Proyecto Fratello estimado: 92%
