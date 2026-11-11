// Lógica de pagos de un viaje: validar el viaje y guardar en Firestore lo que responde Mercado Pago.
// La usan la ruta de pagos (verificación desde la app) y el webhook.
import { db, TRIPS } from './firebaseAdmin.js';
import { toPaymentStatus } from './mercadoPago.js';

// Error con código HTTP para responderle a la app con un mensaje claro
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  };
};

// Trae el viaje y revisa que se pueda cobrar con Mercado Pago
export const getPayableTrip = async (tripId) => {
  const snapshot = await db.collection(TRIPS).doc(tripId).get();
  if (!snapshot.exists) throw new HttpError(404, 'El viaje no existe');

  const trip = { id: snapshot.id, ...snapshot.data() };
  if (trip.paymentMethod !== 'mercadopago') throw new HttpError(400, 'Este viaje no se paga con Mercado Pago');
  if (trip.status === 'paid') throw new HttpError(409, 'Este viaje ya está pagado');
  if (trip.status !== 'completed') throw new HttpError(400, 'Solo se cobra un viaje finalizado');
  if (!Number.isInteger(trip.fare) || trip.fare <= 0) throw new HttpError(400, 'El viaje no tiene una tarifa válida');

  return trip;
};

// Guarda en el viaje el resultado de un pago de Mercado Pago.
// El tripId viaja en external_reference: así sabemos a qué viaje pertenece el pago.
export const savePaymentInTrip = async (payment) => {
  const tripId = payment.external_reference;
  if (!tripId) return null;

  const paymentStatus = toPaymentStatus(payment.status);
  const update = {
    paymentStatus,
    paymentId: String(payment.id),
    paymentUpdatedAt: new Date(),
  };
  // Solo un pago aprobado cambia el estado del viaje a 'paid'
  if (paymentStatus === 'approved') {
    update.status = 'paid';
    update.paidAt = new Date();
  };

  await db.collection(TRIPS).doc(tripId).update(update);
  return { tripId, ...update };
};

// Al crear el checkout el pago queda pendiente hasta que Mercado Pago responda
export const markPaymentPending = async (tripId, preferenceId) => {
  await db.collection(TRIPS).doc(tripId).update({
    paymentStatus: 'pending',
    preferenceId,
    paymentUpdatedAt: new Date(),
  });
};
