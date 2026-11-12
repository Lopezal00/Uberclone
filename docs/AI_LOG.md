# Bitácora de uso de IA

Registro de todo uso de herramientas de inteligencia artificial en el proyecto UberClone, versión conductor.
Cada entrada se escribe en el momento de usar la herramienta. Los bloques de código asistidos llevan el comentario
`// AI-assisted: see docs/AI_LOG.md #N`.

Reglas: nunca pegar en un prompt llaves de API, access_token ni datos personales reales.

---

### Entrada #1
- Fecha: 2026-10-29
- Integrante: Camilo López Alzate
- Herramienta: Claude
- Objetivo: Entender el taller, organizar el trabajo en pareja y crear el proyecto base (estructura, configuración, validaciones, componentes de formulario, contexto y navegación) para la Entrega 1.
- Prompt: "cambiemos el promt de la bitacora por este:
Quiero que me acompañes y me guíes en el desarrollo de este taller, ya que lo voy a realizar con mi compañera con la que he venido trabajando.
El taller está dividido en dos entregas: la primera es el 5 de noviembre y la entrega final es el 15 de noviembre. Mi objetivo inicial es comprender bien los requisitos, organizar el trabajo en pareja y construir una base sólida del proyecto para cumplir con la primera entrega.
 No quiero que desarrolles todo el proyecto por mí, sino que me orientes durante el proceso para entender qué debo hacer, cómo hacerlo y por qué se utiliza cada herramienta o concepto.
Para la primera entrega, debo avanzar en los siguientes puntos:

1. Registro del conductor.
2. Pestaña 1.
3. Pestaña 2.

Quiero que me guíes en los siguientes aspectos:

* Análisis del taller: ayúdame a interpretar los requisitos y a identificar qué funcionalidades debemos implementar en cada apartado.
* Organización del trabajo en pareja: propón una forma de distribuir las tareas entre mi compañera y yo, manteniendo una estructura de proyecto coherente y evitando conflictos al integrar nuestro trabajo.
* Estructura inicial del proyecto: oriéntame sobre cómo organizar las carpetas, los archivos y los componentes, siguiendo los métodos vistos en los videos.
* Configuración: explícame qué dependencias, herramientas y configuraciones necesitamos y para qué sirve cada una.
* Validaciones: ayúdame a identificar qué campos requieren validaciones, qué reglas debemos aplicar y cómo implementarlas correctamente.
* Componentes de formulario: guíame en la creación de componentes reutilizables para los formularios, evitando duplicar código innecesariamente.
* Contexto y navegación: explícame cómo y cuándo debemos utilizar Context para compartir información entre componentes y cómo organizar la navegación entre las pantallas o pestañas del proyecto, según los requisitos del taller.
* Buenas prácticas: ayúdame a aplicar los principios de organización, reutilización y mantenimiento del código que correspondan al nivel y a los temas vistos en clase.

Forma de trabajo que quiero seguir:

1. Primero, revisemos el taller.
2. Después, definamos el alcance exacto de la primera entrega y organicemos las tareas.
3. Luego, construyamos el proyecto base paso a paso, explicando cada decisión antes de implementar el código.
4. A medida que avancemos, explícame los conceptos desde cero cuando sea necesario, sin saltarte pasos ni dar por hecho que ya los domino.
5. Ayúdame a probar cada funcionalidad y a verificar que cumpla los requisitos de la entrega.
6. Finalmente, dejemos identificados los aspectos pendientes para la entrega final del 15 de noviembre.

Quiero que trabajemos de manera progresiva: primero entender, después planificar, luego implementar y finalmente probar. Dame ejemplos cuando sean útiles, hazme preguntas para comprobar que comprendí y permíteme intentar resolver las cosas antes de mostrarme una solución completa.
Empecemos por revisar los requisitos del taller. No supongas requisitos que no aparezcan en el taller ni introduzcas tecnologías que no sean necesarias."
- Resumen de la respuesta: Explicó el taller, propuso el reparto por ramas (base juntos, pestaña 1 Camilo, pestaña 2 Sara) y una lista de chequeo.
- Enlace: 
- Qué se usó / modificó / descartó: (completar: qué archivos dejaron tal cual y qué cambiaron)
- Archivos y commit: App.js, src/config/*, src/constants/*, src/context/RegisterContext.js, src/components/*, src/navigation/*, src/screens/* (marcadores), src/services/*, src/theme/colors.js, src/utils/validators.js, .env.example — (completar con el hash del commit)
- Verificación: (completar: por ejemplo, "la app abre en Expo Go y muestra las 3 pestañas")
- Aprendizaje: 
Variables de entorno. La diferencia entre .env (los valores reales, que no se suben) y .env.example (solo los nombres, que sí se sube), y por qué las llaves no van en el código.
Firebase. Crear el proyecto, registrar una app web, crear Firestore en modo de prueba sin activar el plan de pago, y que las reglas de prueba vencen el 28 de noviembre.
Cloudinary. Por qué se usa para las fotos en vez de Firebase Storage (que pide tarjeta), y que el preset Unsigned permite subir fotos sin poner la llave secreta en la app.
Git. Revisar con git status qué se va a subir antes del primer commit, y para qué sirve el .gitignore.
Dependencias. No ejecutar npm audit fix --force, porque cambia versiones y rompe la compatibilidad con el SDK 58.
Organización. Separar el proyecto en carpetas por responsabilidad (services, context, components, utils) para poder trabajar en paralelo sin chocar

---
## #3 — Pestaña Datos personales y botón Enviar registro

- **Fecha:** 2026-11-03
- **Integrante:** Camilo López Alzate
- **Herramienta:** Claude Code (Claude Opus 5.5) en VS Code
- **Objetivo:** Que me guíen para construir la Pestaña 1 (datos personales) con validaciones y estado compartido, y una barra fija con el botón **Enviar registro** que solo se habilite cuando las pestañas estén completas. La idea es entender las decisiones y escribir yo el código.

- **Prompt:**

> "Hola. Estoy haciendo una app en React Native (Expo) y me toca la pantalla `PersonalDataScreen`, que es la Pestaña 1 de un registro de varios pasos, y además el botón para enviar el registro. **No quiero que me des el código completo.** Quiero que me guíes paso a paso, me expliques el porqué de cada decisión y me hagas preguntas para saber si entendí. Si hace falta, dame fragmentos pequeños o pseudocódigo, nunca el archivo entero.
>
> **Parte A: campos de la pantalla (todos obligatorios):**
> 1. Foto de perfil (redonda, con el texto de ayuda 'una foto clara de tu cara, sin gafas oscuras').
> 2. Nombre completo (máximo 50 caracteres, con mayúscula inicial en cada palabra).
> 3. Documento de identidad (solo números, entre 6 y 10 dígitos).
> 4. Número de celular (solo números, 10 dígitos).
> 5. Fecha de nacimiento (no puede ser futura ni anterior a 1940).
> 6. Género (lista de opciones).
> 7. Correo electrónico (sin espacios, sin autocorrección, en minúsculas).
> 8. Idioma (lista de opciones). Este además se debe guardar como preferencia en AsyncStorage.
>
> **Parte B: botón Enviar registro:**
> - Debe verse en **todas** las pestañas, justo encima de la barra de pestañas.
> - Solo se habilita cuando Datos personales y Vehículo son válidos (en la entrega final se suma Documentos).
> - Si está deshabilitado, debe decirle al conductor qué le falta, por ejemplo 'Completa Vehículo'.
> - Debe poder mostrar un indicador de carga y un mensaje de error de envío.
> - Por ahora el envío real no existe (lo hace otra compañera en su rama). Mientras tanto, al tocar el botón solo deben aparecer todos los errores.
> - Una pestaña completa debería mostrar un check verde en lugar de su ícono.
>
> **Lo que ya tengo o pienso tener:**
> - Componentes en `components/form/`: `FormField`, `DateField`, `SelectField` e `ImageField`, y un `AppButton` con props `disabled` y `loading`.
> - Las constantes `GENDERS` y `LANGUAGES` en `constants/options.js`, y las claves en `constants/storageKeys.js`.
> - Un contexto `RegisterContext`, los validadores en `utils/validators.js`, `saveData` en `services/asyncStorage.js` y los colores en `theme/colors.js`.
> - La navegación por pestañas en `navigation/RegisterTabs.js`.
>
> **Mis dudas:**
> 1. ¿Guardo los datos en un `useState` local de la pantalla o en el contexto? Si cambio de pestaña y vuelvo, ¿se pierden con `useState`?
> 2. ¿Cómo diseño el contexto? Pensaba exponer `personal`, `updatePersonal(campo, valor)`, los errores e `isPersonalValid`. ¿Una función genérica para actualizar o una por campo?
> 3. ¿Dónde viven las validaciones? ¿Cómo hago que un error **solo aparezca si el usuario ya tocó el campo o intentó enviar**? ¿Sirve una bandera como `showAllErrors`?
> 4. Si uso `keyboardType='number-pad'`, ¿el usuario igual puede pegar letras? ¿Cómo dejo solo los dígitos?
> 5. ¿El `trim()` del correo va al escribir o al validar?
> 6. ¿Cómo pongo los límites de la fecha en el date picker? ¿Guardo un `Date` o un string?
> 7. Para guardar el idioma en AsyncStorage, ¿llamo a `saveData` en el `onChange` o uso un `useEffect`?
> 8. ¿Cómo combino `KeyboardAvoidingView` con `ScrollView` para que el teclado no tape los campos? ¿Por qué el `behavior` cambia entre iOS y Android? ¿Para qué sirve `keyboardShouldPersistTaps`?
> 9. Para la foto, ¿qué librería me recomiendas y qué permisos necesito?
> 10. Para que el botón salga en todas las pestañas, ¿lo pongo dentro de cada pantalla o uso la prop `tabBar` del navegador? ¿Qué pasa con `BottomTabBar` si personalizo `tabBar`?
> 11. ¿Calculo `isPersonalValid` en el contexto o en el componente del botón? ¿Cómo evito recalcularlo de más?
> 12. ¿Cómo dejo el botón listo para conectarlo después con el envío real (por ejemplo con props `onSubmit`, `loading` y `submitError`) sin tener que reescribirlo?
>
> **Cómo quiero que me guíes:**
> - Primero un plan corto con el orden de construcción (contexto, validadores, un campo funcionando, el resto de los campos, la barra de envío, el check en las pestañas).
> - De a un paso, con 1 o 2 preguntas de comprobación al final de cada uno.
> - Avísame si estoy cometiendo un error típico (estado duplicado, validar de más, re-renders innecesarios).
> - Al final, una lista de chequeo de pruebas manuales: casos válidos, inválidos y extremos."

- **Resumen de la respuesta:** La IA propuso guardar todo en `RegisterContext` y no en `useState` local, para no perder datos al cambiar de pestaña. Recomendó una función genérica `updatePersonal(campo, valor)` y validadores puros en `validators.js`. Desde el contexto se calculan `personalErrors` e `isPersonalValid`, y hay un `getError` que solo devuelve el error si el campo fue tocado o si `showAllErrors` está activo. Recomendó filtrar los dígitos con una regex porque `keyboardType` no impide pegar texto, y guardar el idioma directamente en el handler. Para el botón sugirió un componente aparte, `SubmitRegistrationBar`, que lee la validez del contexto y recibe `onSubmit`, `loading` y `submitError` por props. Se monta con la prop `tabBar` del navegador, envolviendo a `BottomTabBar`. Para el check en las pestañas propuso un objeto `isComplete` que se consulta dentro de `tabBarIcon`.
- **Enlace:** 
- **Qué se usó / modificó / descartó:**
  - **Usado:** el estado en el contexto con `updatePersonal`; `onlyDigits` con `/[^0-9]/g`; `errorOf(field)` sobre `getError`; los límites de fecha con `maximumDate` y `minimumDate`; `saveData` dentro de `handleLanguage`; `SubmitRegistrationBar` con props pensadas para la integración; la prop `tabBar` con `BottomTabBar`; el check verde con `isComplete`.
  - **Modificado:** el `trim()` del correo quedó en `onChangeText`. El envío quedó temporal (`setShowAllErrors(true)`) hasta integrar `useRegisterSubmit` de la rama de Sara.
  - **Descartado:** el `useEffect` para persistir el idioma, el `useState` local por campo y poner el botón dentro de cada pantalla (se repetía en las tres).
- **Archivos y commit:**
  - `src/screens/register/PersonalDataScreen.js`
  - `src/components/register/SubmitRegistrationBar.js`
  - `src/navigation/RegisterTabs.js` (validez de las pestañas, `tabBar` y botón temporal)
  - También se apoya en `src/context/RegisterContext.js` y `src/utils/validators.js`
  - Commit: (personaldatascreen 'ee005b6'),  86e10c1 Componente de la barra Enviar Registro, af5d7da Barra de enviar registro e indicador de pestañas completa
- **Verificación:**
  - Al abrir la pantalla no se ve ningún error. Al salir de un campo vacío aparece su error.
  - Pegar letras en documento o celular deja solo los números. Un correo con espacios queda limpio, y uno sin `@` da error.
  - El date picker no permite fechas futuras ni anteriores a 1940.
  - Los datos se conservan al cambiar de pestaña. El idioma sigue guardado después de reiniciar la app.
  - Con el teclado abierto se llega al último campo, tanto en iOS como en Android.
  - El botón aparece en las tres pestañas y está deshabilitado con el mensaje correcto: 'Completa Datos personales y Vehículo', 'Completa Datos personales' o 'Completa Vehículo'.
  - Al tocar Enviar se muestran todos los errores. Al completar una pestaña, su ícono cambia a un check verde.
- **Aprendizaje:** Entendí el estado compartido con `useContext` en un formulario de varios pasos y por qué las validaciones conviene tenerlas como funciones puras. Mostrar los errores solo en los campos tocados mejora la experiencia de usuario. Con la prop `tabBar` se agrega contenido común a todas las pestañas. Si un componente recibe todo por props, después se puede conectar con la lógica real sin reescribirlo.

## #2 — Navegación por pestañas del registro

- **Fecha:** 3/11/2026
- **Integrante:** Camilo López Alzate
- **Herramienta:** Claude Code (Claude Opus 5.5) en VS Code
- **Objetivo:** Que me guíen para montar la navegación del registro con tres pestañas (Datos personales, Vehículo y Documentos) usando React Navigation, entendiendo cómo se configura en vez de copiar un ejemplo.

- **Prompt:**

> "Hola. En mi app de React Native (Expo) tengo que hacer el registro de un conductor dividido en tres pestañas: **Datos personales**, **Vehículo** y **Documentos**. **No quiero que me des el código completo.** Quiero que me guíes paso a paso, me expliques el porqué y me hagas preguntas para comprobar que entendí. Si hace falta, dame fragmentos pequeños, no el archivo entero.
>
> **Lo que necesito:**
> 1. Un navegador de pestañas inferior con las tres pantallas.
> 2. Un ícono para cada pestaña (estoy usando `@expo/vector-icons`, Ionicons).
> 3. Colores de pestaña activa e inactiva tomados de mi archivo `theme/colors.js`.
> 4. Sin header en las pantallas, porque cada una tiene su propio título.
> 5. Nombres internos de ruta en inglés (`PersonalData`, `Vehicle`, `Documents`) y títulos visibles en español.
>
> **Mis dudas:**
> 1. ¿Qué paquetes tengo que instalar para `createBottomTabNavigator` en Expo y por qué se usa `npx expo install` en vez de `npm install`?
> 2. ¿Dónde va el `NavigationContainer`: en este archivo o en `App.js`? ¿Qué pasa si pongo dos?
> 3. ¿Cuál es la diferencia entre pasar las opciones a cada `Tab.Screen` y usar `screenOptions` en el `Tab.Navigator`? ¿Por qué `screenOptions` puede ser una función que recibe `route`?
> 4. ¿Cómo elijo el ícono según la pestaña sin escribir un `if` por cada una? ¿Me sirve un objeto que relacione el nombre de la ruta con el ícono?
> 5. ¿Qué son el `color` y el `size` que recibe `tabBarIcon` y por qué conviene usarlos en vez de poner valores fijos?
> 6. Si más adelante quiero poner algo fijo encima de la barra de pestañas (un botón que se vea en todas), ¿qué opciones tengo?
>
> **Cómo quiero que me guíes:**
> - Primero un plan corto con el orden de los pasos.
> - De a un paso, con 1 o 2 preguntas de comprobación al final de cada uno.
> - Avísame si estoy cometiendo un error típico de React Navigation.
> - Al final, una lista de chequeo para probar la navegación a mano."

- **Resumen de la respuesta:** La IA explicó cómo instalar `@react-navigation/bottom-tabs` y sus dependencias con `npx expo install`, y que el `NavigationContainer` debe estar una sola vez, en la raíz de la app. Recomendó usar `screenOptions` como función de `route` para centralizar los íconos y colores, con un objeto `ICONS` que relaciona el nombre de la ruta con el ícono. Explicó que `color` y `size` vienen del navegador y cambian según la pestaña esté activa o no. Para el contenido fijo sobre la barra, mencionó la prop `tabBar`, que permite envolver a `BottomTabBar`.
- **Enlace:** 
- **Qué se usó / modificó / descartó:**
  - **Usado:** `createBottomTabNavigator` en una constante `Tab`; `screenOptions` como función con `headerShown: false`; el objeto `ICONS`; `tabBarActiveTintColor` y `tabBarInactiveTintColor` desde `colors`; los títulos en español con `options.title`.
  - **Descartado:** definir un `tabBarIcon` en cada `Tab.Screen` (se repetía mucho código).
- **Archivos y commit:**
  - `src/navigation/RegisterTabs.js`
  - Commit: 
- **Verificación:** Se ven las tres pestañas con su ícono y su título en español. El color cambia al tocar cada una. No aparece header duplicado. Al cambiar de pestaña no hay errores en la consola.
- **Aprendizaje:** Aprendí la estructura `Navigator` / `Screen` de React Navigation y que el contenedor va una sola vez. Con `screenOptions` como función se evita repetir código. Conviene separar el nombre interno de la ruta del título que ve el usuario.


## #4 -Error en la hora de enviar el registro
- Fecha: 05/11/2026
- Integrante: Camilo Lopez Alzate
- Herramienta: chat de Claude en visual studio code
- Objetivo: Corregir el error que aparece al enviar el registro " LOG  Error al enviar el registro [Error: Unsupported FormDataPart implementation] "
- Prompt: " LOG  Error al enviar el registro [Error: Unsupported FormDataPart implementation], A que se debe este error y como puedo solucionarlo?" 
- Resumen de la respuesta: El error Unsupported FormDataPart implementation ocurre porque en Expo SDK 58 el fetch de Expo no acepta el objeto { uri, type, name } dentro de un FormData. La solución es instalar expo-file-system y convertir la foto en un File (new File(uri)) antes de agregarla al FormData, en cloudinaryService.js.
- Enlace:
- Qué se usó / modificó / descartó: Se usó la solución propuesta: se instaló expo-file-system con `npx expo install` y se cambió en `cloudinaryService.js` la forma de agregar la foto al FormData (de `{ uri, type, name }` a `new File(uri)`). No se modificó nada más. Se descartó cambiar `fetch` por XMLHttpRequest, para seguir usando fetch como en clase.
- Archivos y commit: src/services/cloudinaryService.js, package.json, package-lock.json — [9b6400e]
- Verificación: Al tocar Enviar registro aparece la pantalla de cuenta pendiente, el conductor queda en Firestore en la colección drivers con status "pending" y las 2 fotos aparecen en Cloudinary en la carpeta uberclone.
- Aprendizaje: Que cada versión del SDK de Expo puede cambiar cómo funcionan cosas básicas como fetch, y que leer el mensaje exacto en la terminal es la forma más rápida de encontrar la causa en vez de adivinar.

### Entrada #5
- Fecha: 2026-11-05
- Integrante: Camilo López
- Herramienta: Claude vs
- Objetivo: Proponer un diseño más limpio, parecido a la app real de Uber, e implementar una pantalla de bienvenida antes del registro del conductor.
- Prompt: Me gustaria que me propusieras un diseño más limpio, parecido a la app real de Uber, para la pantalla de bienvenida antes del registro del conductor. Quiero que me expliques cómo abrir esta pantalla desde `RootStack` cuando no hay sesión, y cómo pasar la pantalla de fondo negro a blanco cambiando solo los colores del `StyleSheet`.
- Resumen de la respuesta: La IA propuso un diseño de 5 pantallas en blanco y negro: bienvenida, datos personales, vehículo, lista de opciones tipo hoja inferior y cuenta en revisión. Mantuvo las 3 pestañas que pide el PDF. Para hoy generó `WelcomeScreen.js` con la marca, un mapa dibujado solo con `View`, el título, los 3 pasos numerados y el botón "Registrarme como conductor". Explicó cómo abrir la bienvenida desde `RootStack` cuando no hay sesión`StyleSheet`.
- Enlace:
- Qué se usó / modificó / descartó:
  - **Usado:** `WelcomeScreen` con `useSafeAreaInsets` y `useNavigation`; ruta `Welcome` con `headerShown: false`; ruta inicial `Welcome` cuando no hay `DRIVER_ID`; el botón de pruebas de la cuenta pendiente ahora vuelve a `Welcome`.
  - **Modificado:**
  - **Descartado por ahora:** el enlace "Ya me registré" del diseño, porque `RootStack` ya abre la cuenta pendiente si hay sesión. El rediseño de las demás pantallas queda para después de la Entrega 1.
- Archivos y commit:
  - `src/screens/WelcomeScreen.js` (nuevo)
  - `src/navigation/RootStack.js`
  - `src/screens/PendingApprovalScreen.js`
  - Commits: `<12064a6>` Agrega la pantalla de bienvenida del conductor.
- Verificación: Probado en Expo Go (iPhone). Sin sesión, la app abre en la bienvenida. El botón abre el registro y la flecha de atrás regresa. Con sesión guardada abre directo la cuenta en revisión. "Registrar otro conductor (pruebas)" vuelve a la bienvenida. No hay errores en la consola.
- Aprendizaje: Aprendí a ocultar el header de una sola pantalla con `headerShown: false`, a usar los insets del área segura para que el contenido no quede debajo del notch, y a empujar el botón al final de la pantalla con `marginTop: 'auto'`. También vi que con `initialRouteName` se decide qué pantalla abre según la sesión guardada.


### Entrada #6
Fecha: 06/11/2026-07/11/26
Integrante: Camilo Lopez Alzate
Herramienta: Claude vs
Objetivo: Diseñar la arquitectura de navegación condicional y gestión reactiva de sesión del conductor en React Native (Expo), garantizando el bloqueo de acceso según el estado de aprobación en Firestore, una navegación limpia con Stack y Drawer personalizado, y una estructura modular desacoplada mediante pantallas temporales (placeholders) para facilitar la integración con el trabajo de los demás integrantes del equipo (Camilo y Sara).

Prompt:

"Actúa como mi Compañero senior de proyecto y arquitecto de software móvil. Estoy desarrollando la aplicación móvil para conductores de un clon de Uber en React Native con Expo y Firebase Firestore. Actualmente me enfrento al reto de estructurar la navegación global y el flujo de sesión, pero no quiero que me des código resuelto; necesito que me asesores y me guíes metodológica y conceptualmente para llegar a la solución por mí mismo.

Tengo los siguientes requerimientos y dudas:
1. Flujo de sesión y seguridad en la navegación: Un conductor puede estar en tres situaciones: nunca se ha registrado en el dispositivo, se registró pero su cuenta está en revisión (pending o rejected), o ya fue aprobado por el administrador (approved). ¿Cómo debo estructurar el árbol de navegación para que la app determine automáticamente en qué pantalla abrir sin saltos bruscos y sin permitir que un conductor no aprobado regrese a la pantalla principal usando el botón 'Atrás' de Android?
2. Estado global y reactividad en tiempo real: Necesitamos que si un administrador aprueba al conductor en Firestore mientras este tiene abierta la app en la pantalla de revisión, la interfaz reaccione en tiempo real sin obligar al usuario a recargar la app ni saturar la base de datos con peticiones cíclicas (polling). ¿Qué patrón de React debo usar para escuchar estos cambios y cómo debo gestionar la memoria y el ciclo de vida para evitar fugas de memoria (memory leaks)?
3. Jerarquía Stack vs. Drawer: Las vistas principales del conductor aprobado serán Inicio (con mapa y switch de disponibilidad), Historial, Ganancias y Perfil. Además, debe haber un menú lateral con los datos del conductor y su vehículo, junto con la opción de cerrar sesión. ¿Cómo se orquestan un Native Stack y un Drawer Navigator para que convivan ordenadamente sin interferir con futuros flujos modales de viajes (solicitud entrante, viaje en curso, cobro)?
4. Estrategia para trabajo en equipo en paralelo: Mis compañeros de equipo están desarrollando en paralelo otras ramas ( Yo la pantalla de Inicio con mapa y disponibilidad, y Sara el módulo de Ganancias e Historial). ¿Qué arquitectura de componentes me recomiendas diseñar para que la navegación ya esté 100% funcional y enlazada, pero permitiendo que ella sustituya sus pantallas en sus respectivas ramas sin generar conflictos de fusión (merge conflicts)?

Explícame la arquitectura recomendada, los conceptos clave de React Navigation y Context API a implementar, y el paso a paso de diseño que debo seguir."

Resumen de la respuesta:
Me  explicó la arquitectura de navegación guiada por estado (state-driven navigation) dividida en cuatro pilares:

Contexto unificado de sesión (DriverSessionContext): Recomendó centralizar el driverId, la entidad driver y la bandera calculada isApproved en un Context Provider envolvente. Indicó utilizar el patrón Observer mediante un listener en tiempo real (onSnapshot / listenDriver) dentro de un useEffect, asegurando la función de limpieza (unsubscribe) en el retorno para prevenir memory leaks.
Navegación condicional en RootStack: Sugirió una función pura determinista (getInitialRoute) que evalúe la sesión al iniciar la aplicación. Durante la lectura asíncrona de almacenamiento local (AsyncStorage), se debe renderizar un estado de carga global (ActivityIndicator). Al mismo tiempo, aconsejó deshabilitar gestos y botones de retroceso (gestureEnabled: false, headerBackVisible: false) en pantallas críticas como PendingApproval para evitar regresiones no autorizadas.
Anidamiento jerárquico (Stack que envuelve al Drawer): Planteó que el Stack raíz controle los flujos de autenticación, revisión y futuros flujos lineales de viaje, mientras que el DrawerNavigator sea una ruta más dentro del Stack (Main). Para el menú lateral, asesoró desacoplar el encabezado dinámico (consumiendo los datos del conductor desde el contexto) del listado estándar (DrawerItemList) e implementar el cierre de sesión mediante navigation.getParent().reset(...) para purgar el historial de pantallas.
Patrón de Placeholders para trabajo concurrente: Aconsejó crear un componente modular PlaceholderScreen parametrizable por icono, título y descripción. Con esto, las rutas del Drawer quedan declaradas y enlazadas desde el primer momento, dejando contratos claros y mínimos en las carpetas de destino para que los compañeros reemplacen únicamente el archivo de pantalla correspondiente sin alterar la configuración del navegador.

Enlace:
(Enlace a la sesión/conversación con el asistente o herramienta de IA)

Qué se usó / modificó / descartó:

Qué se usó:
@react-navigation/native-stack para el stack principal (RootStack) y @react-navigation/drawer para el menú lateral del conductor aprobado (MainDrawer).
react-native-gesture-handler (GestureHandlerRootView) en la raíz (App.js) para habilitar el soporte de gestos del Drawer.
SafeAreaProvider y useSafeAreaInsets para respetar el notch y la barra de navegación del sistema en el menú lateral.
React Context API con hooks avanzados (useCallback, useMemo, useContext) para optimizar re-renderizados innecesarios y exponer useDriverSession.
Componente genérico y reutilizable PlaceholderScreen para aislar las pantallas pendientes de los demás compañeros.
Qué se modificó:
App.js: Se configuró la jerarquía de Providers (GestureHandlerRootView > SafeAreaProvider > NavigationContainer > DriverSessionProvider > RegisterProvider) y la personalización del tema visual (navTheme).
src/screens/PendingApprovalScreen.js: Se integró con el contexto de sesión para reaccionar a cambios en tiempo real, bloqueando el switch de disponibilidad hasta la aprobación formal y ofreciendo botones de redirección o reinicio de sesión para pruebas.
Qué se descartó:
Se descartó el uso de consultas periódicas por intervalo (polling con setInterval) para verificar el estado de aprobación, prefiriendo la suscripción por eventos en tiempo real con Firestore.
Se descartó anidar el flujo completo de la aplicación dentro del Drawer; se optó por un RootStack jerárquicamente superior para que pantallas como el registro, la bienvenida y los futuros cobros/viajes se presenten en pantalla completa sin menús laterales invasivos.
Se descartó el uso de navigation.navigate('Welcome') al cerrar sesión; se optó por navigation.reset() sobre el navegador padre (getParent()) para destruir el árbol de navegación previo y prevenir navegación residual hacia atrás.

Archivos y commit:

Archivos implementados:
App.js: Envoltorio principal con temas, gestos y Providers.
src/context/DriverSessionContext.js: Contexto global de sesión, listener de Firestore y persistencia local.
src/navigation/RootStack.js: Navegador Stack raíz con rutas condicionales según el estado del conductor.
src/navigation/MainDrawer.js: Navegador Drawer con vista de perfil, vehículo y logout seguro.
src/screens/PendingApprovalScreen.js: Pantalla de estado de cuenta reactiva (pending, approved, rejected).
src/components/PlaceholderScreen.js: Pantalla base provisional reutilizable.
src/screens/main/HomeScreen.js: Stub temporal para la rama de Camilo (Mapa y Disponibilidad).
src/screens/main/HistoryScreen.js: Stub temporal para la rama de Sara (Historial de carreras).
src/screens/main/EarningsScreen.js: Stub temporal para la rama de Sara (Totales y saldo).
src/screens/main/ProfileScreen.js: Stub temporal para la vista de perfil y configuración.
Commit:
- 23c67fc Se instala  el Drawer de React Navigation
- 380c914 Agrego  el contexto de sesión del conductor
- 03d548d Agrego  el Drawer con sus secciones
- 17dd0e2 Abre el inicio cuando la cuenta está aprobada

Verificación:

Flujo de primer ingreso: Sin driverId en AsyncStorage, la aplicación inicia de forma predeterminada en Welcome.
Flujo de cuenta en revisión: Conductor registrado con estado pending: la app abre directamente en PendingApprovalScreen. Se valida que el switch Disponible permanezca bloqueado (disabled) y que presionar el botón atrás del dispositivo no permita volver a pantallas anteriores.
Reacción en tiempo real: Al simular el cambio de estado del documento en la base de datos a approved, la pantalla PendingApprovalScreen actualiza automáticamente su tarjeta a "Cuenta aprobada" y habilita el botón "Ir al inicio".
Navegación en el Drawer: Al pasar a Main, el Drawer muestra el nombre del conductor, foto o avatar por defecto, placa y modelo del vehículo. Todas las opciones (Inicio, Historial, Ganancias, Perfil) cargan sus respectivos placeholders sin errores de renderizado.
Cierre de sesión seguro: Al pulsar "Cerrar sesión" en el pie del Drawer, se eliminan las llaves de AsyncStorage, se limpia el estado en memoria, se cancela la suscripción en tiempo real y el Stack se reinicia (reset) en Welcome.

Aprendizaje:

Control de acceso declarativo: La navegación no debe manejarse mediante redirecciones manuales dispersas, sino derivarse como una función pura del estado de autenticación y autorización del usuario (getInitialRoute), garantizando consistencia y previniendo accesos indebidos.
Gestión responsable de conexiones en tiempo real: Los listeners de Firestore en React Native deben estar estrictamente acoplados al ciclo de vida del componente mediante funciones de limpieza (return () => unsubscribe()), evitando fugas de memoria o actualizaciones de estado sobre componentes desmontados.
Estrategia de desarrollo modular en equipo: El uso de pantallas puente (PlaceholderScreen) con interfaces y contratos claros permite que la arquitectura base de navegación quede cerrada y validada sin bloquear el progreso de otros desarrolladores que trabajan en submódulos específico


## Entrada 7: Pantalla de inicio con mapa interactivo, gestión de disponibilidad y seguimiento de ubicación en tiempo real
Fecha: 9 de noviembre de 2026
Integrante: Camilo López (Lopezal00)
Herramienta: Claude VS
Objetivo: Implementar la pantalla principal (HomeScreen) del conductor con visualización de mapa interactivo (react-native-maps), control de disponibilidad mediante interruptor ("Disponible" / "No disponible" supeditado a la aprobación de la cuenta), solicitud y gestión de permisos de geolocalización, y el hook personalizado useDriverLocation para emitir la ubicación periódica a Firestore en tiempo real únicamente mientras el conductor esté activo y visualizando la pantalla.
Prompt: "Necesito implementar la funcionalidad de la pantalla de Inicio (HomeScreen) para la app de conductor en React Native con Expo dentro de la rama 'rama-inicio-mapa'. La pantalla debe mostrar un mapa con MapView de react-native-maps centrado en la ubicación del conductor (o Medellín por defecto). Debe incluir una tarjeta inferior flotante con un Switch de disponibilidad ('Estás disponible' / 'No disponible'). Solo si el conductor está aprobado en Firestore (obtenido desde useDriverSession) se le permite encender el Switch. Crea un custom hook useDriverLocation que solicite permisos en primer plano con expo-location, capture la ubicación inicial y, cuando tracking sea true (solo si está disponible y en foco de navegación con useIsFocused), ejecute watchPositionAsync cada 5 segundos o 10 metros para actualizar las coordenadas en Firestore (updateDriverLocation). Si el usuario deniega los permisos, muestra un banner persistente con enlace a Ajustes del dispositivo usando Linking.openSettings(). Además, guarda la preferencia de disponibilidad en AsyncStorage para restaurarla al reabrir la app, y en DriverSessionContext asegura que al invocar endSession se desactive la disponibilidad en Firestore y se limpie el storage. Incluye comentarios educativos de conceptos clave como useEffect con cleanup, useCallback y optimizaciones de render."
Resumen de la respuesta: La IA entregó la solución modular en 5 partes:
HomeScreen.js: Integración del MapView con animaciones de cámara (animateToRegion), banner de aviso si se deniegan permisos con enlace a Ajustes (Linking.openSettings()), tarjeta inferior con feedback visual (indicador circular verde/gris según disponibilidad), y control del Switch restringido por aprobación (!isApproved) y permisos. Persistencia local del último estado en AsyncStorage.
useDriverLocation.js: Custom Hook con dos efectos useEffect: uno inicial para pedir permisos y obtener la posición inicial (getCurrentPositionAsync), y un segundo efecto condicionado a tracking que inicia la suscripción de rastreo (Location.watchPositionAsync con intervalo de 5000 ms y 10 m), cancelando el watcher en la función de limpieza (subscription.remove()).
driverService.js: Métodos setDriverAvailability (actualiza isAvailable y availabilityUpdatedAt) y updateDriverLocation (actualiza location: { lat, lng } y locationUpdatedAt).
DriverSessionContext.js: Actualización de la función endSession para apagar la disponibilidad en Firestore (setDriverAvailability(driverId, false)) y eliminar STORAGE_KEYS.LAST_AVAILABILITY.
app.json: Configuración del plugin expo-location con el mensaje de permiso para iOS y Android.
Enlace: Chat del IDE / Sesión local de asistencia
Qué se usó / modificó / descartó:
Qué se usó:
expo-location (requestForegroundPermissionsAsync, getCurrentPositionAsync, watchPositionAsync).
react-native-maps (MapView, animateToRegion imperativo con useRef).
Hooks de React: useState, useEffect (con funciones de retorno/limpieza para evitar fugas de memoria), useCallback y useRef.
useIsFocused de @react-navigation/native para pausar el rastreo si el conductor cambia de sección en el Drawer.
useSafeAreaInsets de react-native-safe-area-context para dar margen a la tarjeta inferior.
AsyncStorage para recordar la última preferencia de disponibilidad sin almacenar datos sensibles.
Qué se modificó:
src/services/driverService.js: se añadieron las funciones setDriverAvailability y updateDriverLocation.
src/context/DriverSessionContext.js: se integró el apagado de disponibilidad al cerrar sesión.
app.json: se añadió la configuración del plugin expo-location.
Qué se descartó:
Se descartó el seguimiento en segundo plano con expo-task-manager para simplificar el MVP y evitar consumo excesivo de batería y permisos invasivos.
Se descartó esperar (await) cada actualización en el watcher de ubicación para no bloquear la interfaz en caso de latencia o desconexión intermitente.
Se descartó permitir el cambio de disponibilidad si el conductor no cuenta con el estado DRIVER_STATUS.APPROVED.
Archivos y commit:
Archivos:
src/screens/main/HomeScreen.js
src/hooks/useDriverLocation.js
src/services/driverService.js
src/context/DriverSessionContext.js
app.json
Rama: rama-inicio-mapa
Commit sugerido:  implementar mapa, switch de disponibilidad y rastreo de ubicacion #7
Verificación:
Se probó el rechazo de permisos de geolocalización, mostrando el banner de advertencia y comprobando que el enlace a Ajustes del sistema (Linking.openSettings()) responda.
Con permisos otorgados, el mapa se centró y animó correctamente a las coordenadas del conductor con delta de zoom 0.01.
Se validó que el switch permanezca inhabilitado si el estado del conductor no es APPROVED.
Al encender "Disponible", se corroboró en Firestore la creación/actualización de los campos isAvailable: true y availabilityUpdatedAt.
Se comprobó que el watcher envíe actualizaciones periódicas a Firestore (location y locationUpdatedAt) y que al navegar a otra pantalla (isFocused: false) o apagar el switch se ejecute la limpieza del watcher (watcher.remove()), deteniendo el consumo de GPS.
Se verificó que al cerrar sesión en el menú de usuario, el conductor pase a estar no disponible automáticamente en la base de datos.
Aprendizaje:
La importancia de desacoplar la lógica de APIs nativas en un Custom Hook (useDriverLocation) para mantener la pantalla (HomeScreen) limpia y enfocada en la presentación.
El uso de la condición tracking: isAvailable && isFocused para proteger la batería del dispositivo y evitar lecturas y escrituras innecesarias en Firestore.
La gestión del ciclo de vida en useEffect con banderas (active, cancelled) y funciones de limpieza (subscription.remove()) para evitar actualizaciones de estado sobre componentes desmontados o suscripciones huérfanas.


## Entrada 8
Fecha: 10 de noviembre de 2026
Integrante:  Camilo Lopez 
Herramienta: Claude VS
Objetivo: Diseñar e implementar la arquitectura del backend de pagos para la aplicación móvil UberClone Conductor, integrando la pasarela de Mercado Pago (Checkout Pro en modo Sandbox) con Firebase Firestore (Firebase Admin SDK), garantizando que las credenciales sensibles y la lógica de validación de tarifas permanezcan estrictamente en el servidor.


Prompt: "Estoy desarrollando el módulo de pagos para nuestra aplicación móvil de transporte (UberClone Conductor en Expo / React Native con Firebase Firestore). Necesito que me acompañes paso a paso en el diseño y construcción de un backend en Node.js y Express para procesar los cobros mediante Mercado Pago Checkout Pro (Sandbox).

Por favor, no me des solo el código resuelto, sino guíame y acompáñame en las decisiones técnicas para cumplir con estas directrices clave:

Seguridad y arquitectura: Quiero asegurarme de que el Access Token de Mercado Pago y las credenciales de Firebase Admin nunca queden expuestas en la app móvil. ¿Cómo estructuramos el flujo para que la app cliente solo envíe el identificador del viaje (tripId) y sea el backend el que consulte en Firestore el monto real y cree la preferencia, evitando cualquier manipulación de tarifas por parte del usuario?
Validaciones de negocio: ¿Qué comprobaciones de integridad deberíamos hacer antes de emitir la orden de pago (validar existencia, estado completed, método mercadopago, evitar cobros duplicados si ya está paid, tarifas válidas)?
Sincronización dual (Webhooks vs. Polling): Explícame cómo manejar tanto la recepción de webhooks de Mercado Pago (con validación de firma criptográfica y re-consulta a la API para no confiar en el payload entrante) como un mecanismo de respaldo por consulta manual (GET /payments/status/:tripId), pensando en que durante el desarrollo local no siempre contaremos con un túnel HTTPS público.
Estructura limpia y modular: Acompáñame a estructurar el proyecto en Node (ES Modules) separando configuración, clientes SDK, lógica de pagos en Firestore y rutas (/payments, /webhooks).
Integración con la app móvil y pruebas: ¿Cómo estructuramos el servicio en el frontend Expo (paymentService.js) con fetch y async/await para comunicarse con este backend, y cómo diseñamos un script de pruebas (createTestTrip.js) para simular viajes finalizados y verificar el flujo completo de pago sin depender de que la app móvil esté terminada?"

Resumen de la respuesta: La IA guio el proceso de desarrollo en las siguientes etapas clave:

Modelo de Seguridad y Arquitectura Desacoplada: Se definió un flujo donde la aplicación móvil nunca contacta directamente a Mercado Pago ni maneja credenciales privadas. El cliente envía únicamente el tripId al backend.
Verificación de Integridad en Servidor: Se diseñó la función getPayableTrip para consultar Firestore con privilegios de administrador, asegurando que el viaje exista, esté finalizado (status === 'completed'), use paymentMethod === 'mercadopago' y no haya sido pagado previamente (status !== 'paid'), calculando el valor total (fare + tip) de forma fidedigna.
Generación de Preferencias Checkout Pro: Implementación de POST /payments/preference usando mercadopago v2, inyectando external_reference = trip.id, actualizando el viaje a paymentStatus: 'pending' y retornando el checkoutUrl (init_point).
Estrategia Híbrida de Confirmación:
Webhook seguro: En POST /webhooks/mercadopago, validación de cabeceras (x-signature, x-request-id) mediante WebhookSignatureValidator. Siguiendo el principio de desconfianza cero, el backend re-consulta el pago oficial a Mercado Pago con paymentClient.get(dataId) antes de actualizar Firestore (savePaymentInTrip).
Verificación manual / polling: Endpoint de contingencia GET /payments/status/:tripId que busca transacciones recientes mediante paymentClient.search({ external_reference: tripId }), permitiendo probar el flujo en red local sin túneles HTTPS.
Manejo de Red y Accesibilidad: Configuración de Express escuchando en 0.0.0.0 para que dispositivos físicos (iPhone/Android) en la misma red Wi-Fi puedan comunicarse con la IP del servidor.
Capa Cliente y Scripting: Diseño de paymentService.js para la app Expo y de createTestTrip.js para crear viajes de prueba con valores realistas (19.200 COP).

Enlace: Completar Bitácora de Desarrollo

Qué se usó / modificó / descartó:

Qué se usó:
Node.js (v20+ con ES Modules) y Express 5.
SDK oficial de Mercado Pago (mercadopago v2.13.0: Preference, Payment, WebhookSignatureValidator).
Firebase Admin SDK (firebase-admin v13.10.0) para manipulación directa y autorizada de Firestore (serviceAccountKey.json).
dotenv para gestión segura de variables de entorno.
fetch con sintaxis async/await en la capa de servicios de la app Expo/React Native.
Qué se modificó:
Creación completa de la infraestructura backend en la carpeta backend/.
Actualización de plantillas de variables de entorno (backend/.env.example y .env.example en la raíz para EXPO_PUBLIC_BACKEND_URL).
Creación de los módulos de integración cliente en src/config/backend.js y src/services/paymentService.js.
Qué se descartó:
Se descartó inicializar Mercado Pago en el cliente móvil: Conectar la pasarela directamente desde Expo expondría el Access Token y permitiría al usuario manipular el monto del cobro en el dispositivo.
Se descartó confiar en el cuerpo del Webhook: Se descartó procesar directamente el JSON entrante del webhook sin verificación; en su lugar, se implementó validación criptográfica de firma HMAC y consulta activa de confirmación (paymentClient.get).
Se descartó exigir túneles HTTPS de forma estricta para desarrollo local: Se implementó el fallback GET /payments/status/:tripId para permitir pruebas inmediatas sin requerir herramientas como ngrok o Cloudflare Tunnels en etapas tempranas.

Archivos y commit:

Archivos creados/modificados:
backend/package.json
backend/.env.example
backend/.gitignore
backend/README.md
backend/src/config.js
backend/src/firebaseAdmin.js
backend/src/mercadoPago.js
backend/src/tripPayments.js
backend/src/server.js
backend/src/routes/payments.js
backend/src/routes/webhooks.js
backend/scripts/createTestTrip.js
.env.example
src/config/backend.js
src/services/paymentService.js
Commit sugerido:

- ac9b255 (HEAD -> feature/pagos-backend) Se agrego el servicio de pagos de la app
- 39cdbf4 Agrego  el viaje de prueba y la guía del backend
- e8aa212 Se agregan las rutas de pago y el webhook de Mercado Pago
- c68456c Crea el proyecto del backend de pagos


Verificación:

Disponibilidad de red: Comprobación del endpoint GET /health respondiendo {"ok":true,"webhook":false} desde localhost y desde la IP local en el dispositivo móvil.
Generación de datos de prueba: Ejecución de npm run test-trip para poblar Firestore con un viaje de prueba en estado completed por valor de $19.200 COP y obtención de su ID.
Creación de Checkout Preference: Petición POST /payments/preference con cuerpo {"tripId":"<ID>"}; verificación de que el backend valida el documento en Firestore, genera la preferencia en Mercado Pago, retorna checkoutUrl y actualiza el viaje a paymentStatus: 'pending'.
Simulación de cobro y Sandbox: Apertura del enlace de checkout en navegador y realización de pago con credenciales y tarjeta de prueba de Mercado Pago.
Sincronización de estado: Ejecución de GET /payments/status/<ID>; el backend localiza el pago mediante paymentClient.search({ external_reference: tripId }), actualiza el estado en Firestore a paymentStatus: 'approved' y el viaje a status: 'paid' con sus respectivas marcas de tiempo.
Resiliencia ante errores: Verificación de rechazos controlados con códigos HTTP adecuados (400 si el viaje no está finalizado o faltan datos, 404 si no existe, 409 si ya fue pagado).

Aprendizaje:

Principio de Confianza Cero en Clientes Móviles: Las aplicaciones cliente son entornos inseguros; delegar el cálculo de tarifas o la interacción directa con la pasarela de pago al dispositivo móvil introduce vulnerabilidades críticas de alteración de precios o filtración de claves API.
Patrón de Re-consulta en Webhooks: Frente a eventos asíncronos externos, no basta con autenticar la firma criptográfica; volver a consultar el recurso directamente a la pasarela emisora (paymentClient.get) previene ataques de repetición o estados desactualizados.
Diseño orientado a la experiencia de desarrollo (DX): Al diseñar un flujo dependiente de webhooks (que requiere túneles HTTPS públicos), proveer un mecanismo simétrico de sondeo o verificación manual simplifica drásticamente el desarrollo y la depuración en red local.
Mapeo explícito de estados: Es esencial desacoplar los estados propios del proveedor de pagos (approved, in_process, rejected) de la máquina de estados de negocio de la aplicación (pending, completed, paid).


Fecha: 11/11/2026
Integrante: Camilo Lopez
Herramienta: Code VS 
Objetivo: Diseñar e implementar la arquitectura del flujo integral de viajes para el conductor en la app móvil UberClone Conductor (React Native / Expo + Firebase Firestore), abarcando la escucha reactiva y aceptación concurrente de solicitudes con temporizador regresivo de 15 segundos, cálculo y renderizado de rutas mediante OSRM con contingencia offline, simulador de pasajero y recorrido para pruebas, liquidación pura de tarifas y pantalla de cobro multimetodológica (efectivo y pasarela de pago).
Prompt: "Hola. Estoy desarrollando el módulo principal de viajes (rama-viaje) para una aplicación móvil de conductor tipo Uber (UberClone Conductor) utilizando React Native con Expo y Firebase Firestore como backend. No quiero que me des el código completo ni que me resuelvas el trabajo directamente. Quiero que actúes como mi Tech Lead / Desarrollador Senior y me aconsejes sobre buenas prácticas de arquitectura, patrones de diseño y posibles problemas que deba anticipar antes y durante la codificación.

Específicamente, requiero tu criterio senior sobre los siguientes puntos:

Gestión de concurrencia y asignación: ¿Cuál es la forma más limpia y robusta de manejar la aceptación de una solicitud en Firestore para evitar condiciones de carrera (por ejemplo, si dos conductores aceptan el mismo viaje exactamente al mismo tiempo)? ¿Debería usar transacciones (runTransaction), reglas de seguridad o batches?
Máquina de estados del viaje: ¿Cómo me recomiendas modelar el ciclo de vida del viaje (requested, accepted, driver_arriving, in_progress, completed, paid, rejected) en la colección de Firestore y en la navegación de la app para que la transición entre pantallas sea fluida y no permita volver atrás accidentalmente una vez iniciado o cobrado el servicio?
UX del temporizador de solicitudes: Necesito que el conductor reciba una tarjeta de solicitud flotante con una cuenta regresiva de 15 segundos que se rechace automáticamente al llegar a cero, con retroalimentación visual urgente en los últimos 5 segundos y alertas de accesibilidad/vibración. ¿Cómo diseño este componente y su hook para no generar re-renders innecesarios en la pantalla principal ni fugas de memoria con los intervalos?
Estrategia de mapas y ruteo económico/gratuito: Para no incurrir en costos de Google Maps API / Directions, planeo integrar OSRM (Open Source Routing Machine). ¿Qué precauciones debo tomar al consumir esta API pública y cómo diseño un mecanismo de contingencia (fallback) para que la app no quede congelada si la API falla o no hay conexión de datos en la calle?
Estrategia de pruebas sin app de pasajero: Actualmente aún no tenemos lista la app del pasajero. ¿Cómo me sugieres estructurar un simulador de solicitudes aleatorias cercanas y una simulación de recorrido sobre la polilínea en el mapa para poder grabar demos y validar el flujo de punta a punta sin tener que salir a conducir físicamente?
Lógica de liquidación y finanzas: ¿Cómo estructurar el cálculo de tarifas (tarifa base, distancia recorrida, tiempo, multiplicadores por categoría como Economy, XL, Premium, tarifa mínima y comisión del 20%) para que sea una función pura y reutilizable tanto en la estimación inicial como en el cobro final, garantizando que las propinas queden 100% libres de comisión?
Flujo de cobro y seguridad en pagos: En la pantalla de liquidación debemos permitir pago en efectivo y pago digital con Mercado Pago. ¿Cómo desacoplar la aplicación móvil de las credenciales sensibles y cómo estructurar la verificación del pago (polling/webhooks) para que el conductor no pueda confirmar cobros indebidos?

Por favor, enfócate en aconsejarme sobre la separación de responsabilidades (servicios, hooks, componentes), manejo de suscripciones en tiempo real (onSnapshot) con su respectiva limpieza, y advertencias sobre errores típicos que un junior suele cometer en este tipo de apps."

Resumen de la respuesta: El Senior recomendó una arquitectura modular desacoplada basada en servicios y hooks personalizados, orientada a la robustez y tolerancia a fallos:
Concurrencia atómica: Implementar obligatoriamente runTransaction de Firestore para la aceptación de solicitudes. La transacción lee primero el documento trips/{tripId} dentro del contexto atómico; si el estado ya no es requested, aborta la operación arrojando un error controlado ("Esta solicitud ya no está disponible"), previniendo doble asignación.
Máquina de estados y navegación: Modelar los estados del viaje de manera secuencial (requested → accepted → driver_arriving → in_progress → completed → paid) y sobreponer la pantalla Trip y Payment sobre el RootStack con propiedades de bloqueo de gestos (gestureEnabled: false) y sin botón de retroceso (headerBackVisible: false) en cobro para forzar el flujo natural del servicio.
Temporizador y Accesibilidad: Aislar la tarjeta RequestCard con un setInterval interno de corta duración (250 ms) que recalcula la diferencia de tiempo respecto al createdAt del viaje en lugar de restar un contador simple (evitando desincronizaciones por pausas del sistema operativo). Añadir Vibration.vibrate(400) y AccessibilityInfo.announceForAccessibility en la recepción del viaje, e invocar el auto-rechazo una sola vez mediante banderas con useRef.
Ruteo resiliente: Consumir OSRM transformando la geometría GeoJSON [lng, lat] a coordenadas compatibles con react-native-maps ({ latitude, longitude }), encapsulado en un bloque try/catch. En caso de fallo o timeout de red, activar inmediatamente una función de respaldo que calcula la distancia mediante la fórmula de Haversine trazando una línea recta con un factor de corrección urbano (+30% de distancia y velocidad estimada a 25 km/h).
Simulación desacoplada para QA: Crear un servicio independiente (simulatorService.js) que genere coordenadas geográficas aleatorias en un radio de 0.3 a 1.2 km del conductor, obtenga direcciones legibles mediante Location.reverseGeocodeAsync e inserte la solicitud en Firestore con el flag isSimulated: true. Para la conducción, crear el hook useSimulatedDrive que recorra la polilínea en 25 pasos temporizados actualizando las coordenadas del conductor en Firestore cada 3 iteraciones.
Funciones puras y números enteros: Configurar los parámetros tarifarios en una constante inmutable (pricing.js) y aislar calculateFare como una función matemática pura sin efectos secundarios, redondeando siempre a múltiplos enteros de 100 COP para evitar problemas de coma flotante en JavaScript y asegurando que driverEarnings = (fare - commission) + tip.
Seguridad en pagos: Prohibir terminantemente que el cliente móvil maneje secretos de pasarelas. La app solo envía el tripId a un endpoint propio del backend (/payments/preference), abre el checkout mediante expo-web-browser y escucha cambios reactivos del estado del pago vía onSnapshot o consulta a /payments/status/:tripId. Permitir cambio dinámico a efectivo si el pago digital es rechazado.
Enlace: 
Qué se usó / modificó / descartó:
Qué se usó:
runTransaction de Firebase Firestore para asignación y descarte atómico de viajes en contienda.
onSnapshot con retornos de desuscripción (unsubscribe) dentro de useEffect en useTripRequests.js, TripScreen.js y PaymentScreen.js.
API pública de OSRM (router.project-osrm.org) con decodificación GeoJSON y fallback matemático local con fórmula de Haversine (routeService.js).
MapView, Polyline y marcadores dinámicos (Marker) de react-native-maps para representar al pasajero, destino y ubicación del vehículo en tiempo real.
Componentes de accesibilidad nativa (Vibration, AccessibilityInfo, etiquetas ARIA) en RequestCard.js.
Hooks useTripRequests (filtrado y cola de solicitudes reactivas) y useSimulatedDrive (interpolación de movimiento vehicular en 25 pasos).
expo-web-browser para abrir la pasarela de Mercado Pago de forma segura dentro del ciclo de vida de la aplicación.
Función pura calculateFare con manejo de redondeos en pesos colombianos (COP).
Qué se modificó:
src/screens/main/HomeScreen.js: Se incorporó la escucha de solicitudes activas mientras el conductor esté disponible y enfocado, integrando el modal de RequestCard y el botón de simulación de pasajero.
src/navigation/RootStack.js: Se añadieron las rutas 'Trip' (TripScreen) y 'Payment' (PaymentScreen) en la pila raíz por encima del MainDrawer.
src/constants/options.js: Se agregaron los diccionarios y constantes de TRIP_STATUS, PAYMENT_METHODS, PAYMENT_METHOD_LABELS y REQUEST_TIMEOUT_SECONDS = 15.
Qué se descartó:
Se descartó el uso de Google Directions API por motivos de costos y requisitos de facturación con tarjeta de crédito, optando por OSRM con contingencia local.
Se descartó la comunicación directa desde el frontend móvil hacia las APIs de Mercado Pago con credenciales privadas por vulnerabilidad de seguridad.
Se descartó el uso de consultas periódicas por polling (setInterval) hacia Firestore, reemplazándolo por suscripciones reactivas en tiempo real mediante onSnapshot.
Se descartó permitir la modificación de propinas una vez generado el checkout de Mercado Pago para evitar discrepancias de saldos contra la preferencia creada.
Archivos y commit:
Archivos involucrados:
src/components/trip/RequestCard.js (UI de la solicitud entrante con temporizador y auto-rechazo)
src/screens/trip/TripScreen.js (Pantalla del viaje en curso, rutas OSRM, marcadores y cambio de estados)
src/screens/trip/PaymentScreen.js (Liquidación, desglose de tarifa/comisión, propinas y pasarela de cobro)
src/screens/main/HomeScreen.js (Integración de disponibilidad, recepción de solicitudes y disparador de simulación)
src/navigation/RootStack.js (Registro de pantallas de flujo de viaje Trip y Payment)
src/services/tripService.js (Transacciones Firestore, escucha en tiempo real, actualización de estados y confirmación)
src/services/routeService.js (Consumo de OSRM, cálculo de distancia Haversine y fallback de línea recta)
src/services/simulatorService.js (Generación de solicitudes de pasajero simuladas con geocodificación inversa)
src/services/paymentService.js (Cliente HTTP para backend de preferencias y verificación de estado de pago)
src/hooks/useTripRequests.js (Hook de escucha reactiva y ordenamiento por antigüedad de viajes solicitados)
src/hooks/useSimulatedDrive.js (Hook de animación paso a paso del auto a lo largo de la ruta)
src/config/pricing.js (Parámetros del tarifario, factores por categoría y porcentaje de comisión)
src/utils/calculateFare.js (Función pura de liquidación de tarifa, comisión y ganancia neta)
src/constants/options.js (Definición de estados de viaje, métodos de pago y timeout)
src/utils/format.js (Utilidades de formateo visual para moneda COP, kilómetros y minutos)
src/config/backend.js (Definición de variable de entorno para URL del backend de pagos)
Commit sugerido:
- 4ee18ab (HEAD -> feature/viaje) Agrega el cobro en efectivo y Mercado Pago
- 8cdd496 Agrega el viaje en curso con ruta y estados
- f5d3481 Agrega las solicitudes con temporizador de 15 s
- 9eef772 Agrega rutas con OSRM, servicio de viajes y simulador de pasajero
- d506d7d  Se Agrega estados del viaje y formatos
- 706e7e0 Se Instala expo-web-browser para el checkout

Simulación de solicitud: Desde HomeScreen, se presionó "Simular solicitud de pasajero (pruebas)"; se verificó en Firestore la creación inmediata del documento en la colección trips con estado requested, geocodificación inversa del origen/destino y tarifa estimada.
Temporizador y rechazo: En RequestCard, se comprobó la cuenta regresiva fluida desde 15 s, la vibración del dispositivo, el cambio de barra y texto a color rojo en los últimos 5 s y la ejecución automática del rechazo en Firestore al llegar a 0 s.
Concurrencia: Se validó la ejecución de acceptTrip con runTransaction, comprobando que solo el primer conductor asigna el viaje y que intentos simultáneos posteriores reciben la excepción controlada.
Ruta y navegación: En TripScreen, se verificó la consulta a OSRM para dibujar la polilínea entre la posición del conductor y el origen del pasajero. Se simuló una desconexión de red y se comprobó que el fallback Haversine generó la ruta en línea recta sin interrumpir la app.
Simulación de conducción: Se activó el botón "Simular recorrido"; el vehículo recorrió los 25 puntos sobre la polilínea actualizando su latitud/longitud en Firestore cada 3 pasos.
Transición de estados: Se presionó "Pasajero a bordo" pasando a in_progress con recálculo de ruta hacia el destino, y posteriormente "Finalizar viaje", navegando de forma automática a PaymentScreen.
Liquidación y cobro: En PaymentScreen, se verificó el cálculo matemático de la tarifa, comisión del 20% y adición de propinas ($2.000 / $5.000 COP) sin deducción de comisión. Se probó el cobro en efectivo marcando el viaje como paid, y se validó la apertura del navegador externo para Mercado Pago.
Aprendizaje:
El uso indispensable de transacciones (runTransaction) para resolver problemas de concurrencia y condiciones de carrera en bases de datos NoSQL distribuidas en tiempo real.
La importancia de diseñar arquitecturas tolerantes a fallos con estrategias de contingencia (fallbacks offline / matemáticos locales), garantizando que la aplicación continúe operativa aun si servicios externos de terceros (OSRM o pasarelas) se caen o tienen latencia.
La ventaja de estructurar la lógica financiera mediante funciones puras inmutables (calculateFare), lo que previene inconsistencias entre las estimaciones mostradas al pasajero y los montos finales debitados al conductor.
El valor de construir simuladores de entorno temprano (simulatorService y useSimulatedDrive) para permitir ciclos de desarrollo ágiles e independientes cuando los módulos complementarios (app del pasajero) se construyen en paralelo.
La necesidad estricta de limpiar suscripciones (unsubscribe) e intervalos (clearInterval) en hooks de ciclo de vida en React Native para evitar sobrecostos de lecturas en Firestore y degradación de rendimiento por fugas de memoria.

<!-- Plantilla para copiar en cada nueva entrada:

###
- Fecha:
- Integrante: 
- Herramienta: 
- Objetivo:
- Prompt: "..." (texto completo, sin resumir)
- Resumen de la respuesta:
- Enlace:
- Qué se usó / modificó / descartó:
- Archivos y commit:
- Verificación:
- Aprendizaje:
-->
