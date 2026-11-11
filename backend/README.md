# Backend de pagos - UberClone Conductor

Servidor Node + Express que cobra los viajes con **Mercado Pago Checkout Pro** (modo de prueba).
Las llaves secretas viven solo aquí, en `backend/.env`, nunca en la app.

## Cómo funciona

```
App ──POST /payments/preference {tripId}──> Backend ──> Mercado Pago (crea el checkout)
App <────────── checkoutUrl ─────────────── Backend
App abre checkoutUrl → el pasajero paga con tarjeta de prueba
Mercado Pago ──webhook──> Backend ──> Firestore: trip.paymentStatus / paymentId / status 'paid'
(sin webhook) App ──GET /payments/status/:tripId──> Backend consulta el pago y actualiza Firestore
```

- El **monto lo lee el backend** del viaje en Firestore; la app solo envía el `tripId`.
- El `tripId` viaja en `external_reference` para saber a qué viaje pertenece cada pago.
- El webhook vuelve a consultar el pago a Mercado Pago (no confía en el aviso) y valida la firma si hay `MP_WEBHOOK_SECRET`.

## Puesta en marcha

1. `cd backend` y `npm install`
2. Copia `.env.example` como `.env` y llena:
   - `MP_ACCESS_TOKEN`: Mercado Pago Developers → Tus integraciones → tu aplicación → **Credenciales de prueba** → Access Token.
   - `GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json`: Firebase → Configuración del proyecto → **Cuentas de servicio** → Generar nueva clave privada. Guarda el JSON en `backend/` con ese nombre.
3. `npm run dev`
4. En el `.env` de la **app** (raíz del proyecto): `EXPO_PUBLIC_BACKEND_URL=http://TU_IP:3000` (IP con `ipconfig`). El iPhone y el computador deben estar en el mismo wifi.
5. Prueba desde el navegador del iPhone: `http://TU_IP:3000/health` → `{"ok":true}`.

`.env` y `serviceAccountKey.json` están en `.gitignore`: **nunca se suben**.

## Probar un cobro sin la app

1. `npm run test-trip` → crea un viaje finalizado de prueba (19.200 COP) y muestra su id.
2. Crear el checkout (PowerShell):
   ```
   Invoke-RestMethod -Method Post -Uri http://localhost:3000/payments/preference -ContentType "application/json" -Body '{"tripId":"ID_DEL_VIAJE"}'
   ```
3. Abre el `checkoutUrl` y paga con un **usuario comprador de prueba** y una **tarjeta de prueba** de Mercado Pago.
4. `http://localhost:3000/payments/status/ID_DEL_VIAJE` → `paymentStatus: approved` y en Firestore el viaje queda `status: paid`.

## Webhook (opcional)

Mercado Pago solo envía webhooks a una dirección **HTTPS pública**. Para probarlo, expón el puerto 3000 con un túnel y pon esa dirección en `PUBLIC_URL`. Sin `PUBLIC_URL`, la app verifica el pago con `GET /payments/status/:tripId`.
