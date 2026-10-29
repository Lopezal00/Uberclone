# UberClone Conductor

App móvil en React Native con Expo (SDK 58) para conductores: registro, solicitudes de viaje, cobro y ganancias.
Taller de Construcción de Software, Tecnológico de Antioquia.

## Instalación

```bash
git clone https://github.com/<usuario>/uberclone-conductor.git
cd uberclone-conductor
npm install
cp .env.example .env   # en Windows: copy .env.example .env
npx expo start
```

Abre la app con Expo Go (versión para SDK 58) escaneando el código QR.

## Variables de entorno

Las llaves van en un archivo `.env` que **no se sube a GitHub**. El archivo `.env.example` tiene los nombres de las variables sin valores.

| Variable | De dónde sale |
|---|---|
| `EXPO_PUBLIC_FIREBASE_*` | Firebase > Configuración del proyecto > Tus apps > App web |
| `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` | Panel de Cloudinary |
| `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary > Settings > Upload > preset sin firma (Unsigned) |

Firestore se crea en **modo de prueba**. Las llaves secretas de Mercado Pago o Stripe nunca van en la app, solo en el backend.

## Estructura de carpetas

```
App.js                  Punto de entrada: SafeAreaProvider, NavigationContainer y contexto
src/
├── components/         Piezas visuales reutilizables
│   ├── AppButton.js
│   └── form/           Campos de formulario con el error debajo (texto, lista, fecha, foto)
├── config/             Conexión con Firebase y Cloudinary (lee el .env)
├── constants/          Opciones de las listas y llaves de AsyncStorage
├── context/            Estado compartido con useContext (registro del conductor)
├── hooks/              Hooks personalizados (useDriverLocation, useTripRequests, useEarnings)
├── navigation/         Stack principal y Tabs del registro
├── screens/            Pantallas (register/ tiene una por pestaña)
├── services/           Firestore, Cloudinary y AsyncStorage, cada uno en su archivo
├── theme/              Colores de la app
└── utils/              Funciones puras: validaciones y cálculos
docs/AI_LOG.md          Bitácora de uso de IA
```

**Por qué así:** cada carpeta tiene una sola responsabilidad. Los servicios son los únicos que hablan con Firestore, Cloudinary o AsyncStorage, y están separados entre sí. Las validaciones son funciones puras en `utils/validators.js`, así las usan todas las pestañas y se pueden probar sin abrir la app. El contexto guarda los datos de las tres pestañas para que el botón Enviar registro sepa si todo está completo.

## Flujo de trabajo

- `main` solo recibe cambios por **Pull Request** revisado por la otra integrante.
- Cada integrante trabaja en su rama: `feature/datos-personales` y `feature/vehiculo`.
- Antes de empezar: `git checkout main && git pull`, y luego `git checkout -b <rama>`.

| Rama | Responsable | Contenido |
|---|---|---|
| `main` | Ambos | Proyecto base, configuración, validaciones, componentes de formulario, contexto y navegación |
| `feature/datos-personales` | Camilo López Alzate | Pestaña 1 y botón Enviar registro |
| `feature/vehiculo` | Sara Bustamante Gómez | Pestaña 2, guardado en Firestore y pantalla de cuenta pendiente |

## Uso de IA

Todo uso de herramientas de IA está registrado en [docs/AI_LOG.md](docs/AI_LOG.md). Los bloques de código asistidos llevan el comentario `// AI-assisted: see docs/AI_LOG.md #N`.
