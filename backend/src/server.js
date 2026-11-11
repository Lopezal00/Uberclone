// Servidor del backend de pagos (Node + Express).
// Las llaves secretas (Access Token de Mercado Pago, cuenta de servicio de Firebase) viven SOLO aquí,
// en backend/.env, nunca en la app.
import express from 'express';

import { config } from './config.js';
import { paymentsRouter } from './routes/payments.js';
import { webhooksRouter } from './routes/webhooks.js';

const app = express();
app.use(express.json());

// Para revisar desde el navegador del celular que el backend responde
app.get('/health', (req, res) => {
  res.json({ ok: true, webhook: config.hasPublicHttps });
});

app.use('/payments', paymentsRouter);
app.use('/webhooks', webhooksRouter);

// Manejo de errores: la app recibe un mensaje claro y nunca detalles internos
app.use((error, req, res, next) => {
  const status = error.status ?? 500;
  if (status === 500) console.error(error);
  res.status(status).json({ error: status === 500 ? 'Error interno del servidor' : error.message });
});

// 0.0.0.0: escucha en la red local para que el iPhone lo pueda llamar con la IP del computador
app.listen(config.port, '0.0.0.0', () => {
  console.log(`Backend de pagos en http://localhost:${config.port}`);
  console.log(config.hasPublicHttps
    ? `Webhook activo en ${config.publicUrl}/webhooks/mercadopago`
    : 'Sin PUBLIC_URL: no hay webhook, el pago se verifica desde la app');
});
