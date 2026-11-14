# UberClone Conductor

App móvil en **React Native con Expo (SDK 58)** para la versión **conductor** de un servicio tipo Uber: registro en tres pestañas, solicitudes de viaje en tiempo real, viaje con ruta en el mapa, cobro en efectivo o con **Mercado Pago (Checkout Pro)**, ganancias e historial.

Taller de Construcción de Software · Tecnológico de Antioquia
Integrantes: **Camilo López Alzate** y **Sara Bustamante Gómez**

---

## Funcionalidades

| Sección del PDF | Qué hace la app |
|---|---|
| **Registro (Tabs)** | 3 pestañas: Datos personales, Vehículo y Documentos y pagos. Validaciones con el error debajo de cada campo, botón **Continuar** entre pestañas y **Enviar registro** solo cuando las tres están completas. Fotos a Cloudinary; datos a Firestore con `status: pending`. |
| **Cuenta en revisión** | Escucha al conductor en tiempo real (`onSnapshot`). Cuando un administrador cambia `status` a `approved` en Firestore, aparece **Ir al inicio**. |
| **Inicio (Drawer)** | Mapa con la ubicación del conductor e interruptor **Disponible**. Mientras está Disponible, la ubicación se envía a Firestore cada 5 s; al salir o apagarlo, el seguimiento se detiene (`useEffect` con limpieza). El último estado se guarda en AsyncStorage. |
| **Solicitudes** | Tarjeta con **temporizador de 15 s**; si llega a 0 se rechaza sola. **Aceptar** usa una **transacción** de Firestore para que dos conductores no tomen el mismo viaje. |
| **Viaje** | Ruta hasta el pasajero y luego hasta el destino (`Polyline`), estados `accepted → driver_arriving → in_progress → completed`, y botón de **recorrido simulado** para las pruebas. |
| **Cobro** | Tarifa, comisión (20 %), propina sin comisión y ganancia calculadas con `calculateFare`. **Efectivo** o **Mercado Pago** a través del backend. |
| **Ganancias** | Saldo del conductor y totales de Hoy, Semana y Mes con `useMemo`. |
| **Historial** | `FlatList` con filtros (Hoy, Semana, Mes, Rango y método de pago), de a 20 viajes, y detalle con la ruta en el mapa. |
| **Perfil** | Correo y celular editables, vehículo, documentos, idioma (AsyncStorage) y cerrar sesión. |

---

## Instalación

Requisitos: Node 20 o superior y **Expo Go** (versión para SDK 58) en el celular.

### 1. App

```bash
git clone https://github.com/Lopezal00/Uberclone.git
cd Uberclone
npm install
copy .env.example .env      # en Mac/Linux: cp .env.example .env
```

Llena el `.env` (ver la tabla de abajo) y arranca:

```bash
npx expo start -c
```

Escanea el código QR con la cámara del iPhone. El celular y el computador deben estar en la misma red wifi.

### 2. Backend de pagos (solo para cobrar con Mercado Pago)

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Debe mostrar `Backend de pagos en http://localhost:3000`. Para comprobar que el celular lo alcanza, abre `http://IP_DEL_PC:3000/health` en el navegador del celular. Más detalles en [backend/README.md](backend/README.md).

---

## Variables de entorno

Las llaves van en archivos `.env` que **nunca se suben a GitHub** (están en `.gitignore`). Los archivos `.env.example` solo tienen los nombres.

### App: `.env` en la raíz

| Variable | De dónde sale |
|---|---|
| `EXPO_PUBLIC_FIREBASE_*` | Firebase → Configuración del proyecto → Tus apps → App web |
| `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` | Panel de Cloudinary |
| `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary → Settings → Upload → preset **Unsigned** |
| `EXPO_PUBLIC_BACKEND_URL` | `http://IP_DEL_PC:3000` (la IP sale con `ipconfig`; cambia si cambias de wifi) |

### Backend: `backend/.env`

| Variable | De dónde sale |
|---|---|
| `MP_ACCESS_TOKEN` | Mercado Pago Developers → Tus integraciones → tu aplicación → **Credenciales de prueba** → Access Token |
| `GOOGLE_APPLICATION_CREDENTIALS` | `./serviceAccountKey.json`: Firebase → Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada (el archivo tampoco se sube) |
| `MP_WEBHOOK_SECRET`, `PUBLIC_URL` | Opcionales: solo si el backend tiene una dirección HTTPS pública para recibir webhooks |

**Seguridad:**
- La app **nunca** tiene llaves secretas: el Access Token de Mercado Pago y la cuenta de servicio de Firebase viven solo en el backend.
- Cloudinary usa un preset sin firma, así que la API Secret no va en la app.
- Las variables `EXPO_PUBLIC_` quedan dentro de la app y no son secretas.
- Firestore está en **modo de prueba** y en el plan gratuito Spark, sin tarjeta.

---

## Cómo probar el flujo completo

1. **Registro:** Bienvenida → Registrarme → llenar las 3 pestañas → Enviar registro.
2. **Aprobar:** en Firestore → `drivers` → el conductor → cambiar `status` a `approved`. La app cambia sola → Ir al inicio.
3. **Disponible** → **Simular solicitud de pasajero (pruebas)** → aparece la tarjeta de 15 s.
4. **Aceptar** → Simular recorrido → Pasajero a bordo → Simular recorrido → Finalizar viaje.
5. **Cobro:**
   - **Efectivo:** "Recibí $X en efectivo".
   - **Mercado Pago** (con el backend corriendo): se abre el checkout. Iniciar sesión con el **comprador de prueba** y pagar con una tarjeta de prueba, con titular `APRO`. Al volver, la app verifica el pago y el viaje queda `paid`.
6. **Ganancias** e **Historial** → tocar un viaje → detalle con la ruta.

---

## Decisiones técnicas

| Tema | Decisión y motivo |
|---|---|
| **Pasajero** | No existe la app del pasajero. `simulatorService.js` hace de pasajero: crea la solicitud en la colección `trips` con `status: requested`. El conductor la recibe con `onSnapshot` igual que si la pidiera otra persona. Si se integra una API externa, solo se cambia ese archivo. |
| **Rutas** | **OSRM** (gratuito, sin llave) en lugar de Google Directions, que exige registrar tarjeta. Si OSRM no responde, se usa una línea recta para no bloquear la app. En iPhone, `react-native-maps` usa Apple Maps sin llave. |
| **Tarifa** | `calculateFare` es una función pura con los valores de `src/config/pricing.js` (base 3.500, 1.200/km, 250/min, mínima 6.000, multiplicadores 1,0 / 1,4 / 1,8). La misma función calcula la estimación y el cobro final. Prueba: `node backend/scripts/checkFare.js`. |
| **Pagos** | Checkout Pro con el SDK oficial en un backend Node + Express. El **monto lo lee el backend en Firestore** (la app solo envía el `tripId`). La confirmación llega por webhook (con validación de firma) o con `GET /payments/status/:tripId`. |
| **Aceptar viaje** | `runTransaction`: el viaje solo se asigna si sigue en `requested`. |
| **Historial** | La consulta filtra solo por `driverId` (no necesita índices compuestos). El orden, los filtros y la paginación de a 20 se hacen en la app con `useMemo`. |
| **Notificaciones** | FCM no funciona en Expo Go y en iPhone requiere una cuenta paga de Apple Developer. Las solicitudes llegan en tiempo real con `onSnapshot` mientras la app está abierta, con vibración y anuncio de VoiceOver. |
| **Año del vehículo** | Se acepta hasta un año más que el actual, por indicación de la profesora (los modelos nuevos salen con el año siguiente). |

---

## Estructura de carpetas

```
App.js                 GestureHandler, SafeArea, NavigationContainer y los contextos
src/
├── components/        Botón, campos de formulario, tarjeta de solicitud, elementos del historial
├── config/            Firebase, Cloudinary, backend y parámetros de tarifa (pricing.js)
├── constants/         Opciones de las listas, estados del viaje y llaves de AsyncStorage
├── context/           RegisterContext (registro) y DriverSessionContext (sesión y viaje activo)
├── hooks/             useDriverLocation, useTripRequests, useSimulatedDrive, useDriverTrips, useRegisterSubmit
├── navigation/        RootStack (flujo general y del viaje), RegisterTabs (registro) y MainDrawer
├── screens/           register/ (pestañas), main/ (Drawer), trip/ (viaje y cobro)
├── services/          Firestore, Cloudinary, AsyncStorage, rutas (OSRM), pagos y simulador
├── theme/             Colores
└── utils/             Funciones puras: validaciones, calculateFare, ganancias, fechas y formatos
backend/
├── src/               Servidor Express, rutas de pagos, webhook, Firebase Admin y Mercado Pago
└── scripts/           Viaje de prueba (createTestTrip) y prueba de calculateFare (checkFare)
docs/AI_LOG.md         Bitácora de uso de IA
```

Cada carpeta tiene una sola responsabilidad: las pantallas no hablan directamente con Firestore, sino a través de los servicios, y la lógica de negocio (tarifas, ganancias, validaciones) está en funciones puras que se pueden probar sin abrir la app.

---

## Flujo de trabajo

- `main` está protegido: solo recibe cambios por **Pull Request** revisado por la otra integrante, fusionado con **commit de fusión**.
- Cada funcionalidad se trabaja en su propia rama, que sale de `main` actualizado.

| Rama | Responsable | Contenido |
|---|---|---|
| `feature/datos-personales` | Camilo | Pestaña 1 y envío del registro |
| `feature/vehiculo` | Sara | Pestaña 2, guardado en Firestore y cuenta pendiente |
| `feature/integracion`, `feature/bienvenida`, `feature/boton-continuar` | Camilo | Envío del registro, pantalla de bienvenida y botón Continuar |
| `feature/navegacion` | Camilo | Drawer y contexto de sesión |
| `feature/inicio-mapa` | Camilo | Mapa, disponibilidad y ubicación en tiempo real |
| `feature/pagos-backend` | Camilo | Backend de pagos con Mercado Pago |
| `feature/viaje` | Camilo | Solicitudes, viaje, recorrido simulado y cobro |
| `feature/prueba-tarifas` | Sara | `calculateFare` y parámetros de tarifa |
| `feature/documentos` | Sara | Pestaña 3: documentos y pagos |
| `feature/ganancias-historial` | Sara | Ganancias, historial con detalle y perfil |

---

## Uso de IA

Todo uso de herramientas de IA está registrado en **[docs/AI_LOG.md](docs/AI_LOG.md)**, con el prompt completo, qué se usó o descartó, los commits y cómo se verificó. La versión en PDF se adjunta en la entrega.

Los bloques de código asistidos llevan el comentario `// AI-assisted: see docs/AI_LOG.md #N`.