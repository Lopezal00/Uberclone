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
