// Rutas de pagos que llama la app.
//   POST /payments/preference      -> crea el pago en Mercado Pago y devuelve el link del checkout
//   GET  /payments/status/:tripId  -> pregunta a Mercado Pago cómo va el pago y lo guarda en el viaje
import { Router } from 'express';

import { config } from '../config.js';
import { paymentClient, preferenceClient } from '../mercadoPago.js';
import { getPayableTrip, HttpError, markPaymentPending, savePaymentInTrip } from '../tripPayments.js';

export const paymentsRouter = Router();

// Crea la "preferencia" de Checkout Pro. El MONTO lo lee el backend del viaje en Firestore:
// la app solo manda el tripId, así nadie puede cambiar el precio desde el celular.
paymentsRouter.post('/preference', async (req, res, next) => {
  try {
    const { tripId } = req.body ?? {};
    if (typeof tripId !== 'string' || !tripId) throw new HttpError(400, 'Falta el tripId');

    const trip = await getPayableTrip(tripId);
    const total = trip.fare + (trip.tip ?? 0); // el pasajero paga tarifa + propina

    const body = {
      items: [
        {
          id: trip.id,
          title: 'Viaje UberClone',
          description: `${trip.origin?.address ?? 'Origen'} → ${trip.destination?.address ?? 'Destino'}`,
          quantity: 1,
          unit_price: total,
          currency_id: 'COP',
        },
      ],
      external_reference: trip.id, // para saber a qué viaje pertenece el pago
      statement_descriptor: 'UBERCLONE',
    };

    // Webhook y regreso automático solo si el backend tiene una dirección HTTPS pública
    if (config.hasPublicHttps) {
      body.notification_url = `${config.publicUrl}/webhooks/mercadopago`;
      body.back_urls = {
        success: `${config.publicUrl}/payments/return`,
        pending: `${config.publicUrl}/payments/return`,
        failure: `${config.publicUrl}/payments/return`,
      };
      body.auto_return = 'approved';
    };

    const preference = await preferenceClient.create({ body });

    // Marcamos el viaje como pendiente de pago mientras el pasajero paga
    await markPaymentPending(trip.id, preference.id);

    res.status(201).json({ preferenceId: preference.id, checkoutUrl: preference.init_point, total });
  } catch (error) {
    next(error);
  };
});

// Verificación manual (cuando no hay webhook): busca el último pago de ese viaje en Mercado Pago
paymentsRouter.get('/status/:tripId', async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const search = await paymentClient.search({
      options: { external_reference: tripId, sort: 'date_created', criteria: 'desc' },
    });
    const lastPayment = search.results?.[0];

    if (!lastPayment) {
      res.json({ tripId, paymentStatus: 'pending', message: 'Todavía no hay un pago para este viaje' });
      return;
    };

    const saved = await savePaymentInTrip(lastPayment);
    res.json(saved);
  } catch (error) {
    next(error);
  };
});

// Página a la que vuelve el navegador después de pagar (solo con PUBLIC_URL)
paymentsRouter.get('/return', (req, res) => {
  res.send(`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pago recibido</title><body style="font-family:system-ui;padding:32px;text-align:center">
<h1>Listo</h1><p>Ya puedes cerrar esta ventana y volver a la app.</p></body></html>`);
});
