// Lee y revisa las variables del .env al arrancar el servidor.
// Si falta algo obligatorio, el servidor no arranca y dice qué falta.
import 'dotenv/config';

const required = ['MP_ACCESS_TOKEN', 'GOOGLE_APPLICATION_CREDENTIALS'];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`Faltan variables en backend/.env: ${missing.join(', ')}. Mira backend/.env.example`);
  process.exit(1);
};

// Sin barra al final, para poder armar direcciones como `${PUBLIC_URL}/webhooks/mercadopago`
const publicUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '');

export const config = {
  port: Number(process.env.PORT) || 3000,
  mpAccessToken: process.env.MP_ACCESS_TOKEN,
  mpWebhookSecret: process.env.MP_WEBHOOK_SECRET || '',
  publicUrl,
  // Mercado Pago solo envía webhooks a direcciones HTTPS públicas
  hasPublicHttps: publicUrl.startsWith('https://'),
};
