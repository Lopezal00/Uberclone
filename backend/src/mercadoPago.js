// Cliente de Mercado Pago (SDK oficial) y traducción de sus estados a los de la app.
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

import { config } from './config.js';

const client = new MercadoPagoConfig({ accessToken: config.mpAccessToken });

export const preferenceClient = new Preference(client);
export const paymentClient = new Payment(client);

// Estado de Mercado Pago -> paymentStatus que guardamos en el viaje
// (la app los muestra como Aprobado, Pendiente o Rechazado)
export const toPaymentStatus = (mpStatus) => {
  if (mpStatus === 'approved') return 'approved';
  if (['rejected', 'cancelled', 'refunded', 'charged_back'].includes(mpStatus)) return 'rejected';
  return 'pending'; // pending, in_process, authorized, in_mediation
};
