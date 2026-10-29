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

<!-- Plantilla para copiar en cada nueva entrada:

### Entrada #N
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
