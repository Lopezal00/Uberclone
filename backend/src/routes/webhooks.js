// Webhook de Mercado Pago: Mercado Pago avisa aquí cuando un pago cambia de estado.
// Nunca confiamos en lo que trae el aviso: con el id volvemos a consultar el pago a Mercado Pago.
import { Router } from 'express';
import { InvalidWebhookSignatureError, WebhookSignatureValidator } from 'mercadopago';

import { config } from '../config.js';
import { paymentClient } from '../mercadoPago.js';
import { savePaymentInTrip } from '../tripPayments.js';

export const webhooksRouter = Router();

webhooksRouter.post('/mercadopago', async (req, res) => {
  // El id del pago puede venir en la URL (?data.id=) o en el cuerpo (data.id)
  const dataId = req.query['data.id'] ?? req.body?.data?.id;
  const type = req.query.type ?? req.body?.type;

  // 1. Si configuramos la clave secreta, verificamos que el aviso venga de verdad de Mercado Pago
  if (config.mpWebhookSecret) {
    try {
      WebhookSignatureValidator.validate({
        xSignature: req.headers['x-signature'],
        xRequestId: req.headers['x-request-id'],
        dataId,
        secret: config.mpWebhookSecret,
        toleranceSeconds: 300,
      });
    } catch (error) {
      if (error instanceof InvalidWebhookSignatureError) {
        console.warn('Webhook rechazado:', error.reason);
        res.sendStatus(401);
        return;
      };
      throw error;
    };
  };

  // 2. Respondemos rápido: Mercado Pago reintenta si no recibe 200/201
  res.sendStatus(200);

  // 3. Solo nos interesan los avisos de pagos
  if (type !== 'payment' || !dataId) return;

  try {
    const payment = await paymentClient.get({ id: dataId });
    const saved = await savePaymentInTrip(payment);
    console.log('Pago actualizado desde el webhook:', saved);
  } catch (error) {
    console.error('Error procesando el webhook:', error.message);
  };
});
