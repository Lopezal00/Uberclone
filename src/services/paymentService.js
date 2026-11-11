// Servicio de pagos de la app: habla con NUESTRO backend (nunca directo con Mercado Pago).
// La app solo manda el tripId; el monto y las llaves secretas están en el backend.
import { BACKEND_URL } from '../config/backend';

// Lee la respuesta del backend y lanza un error con su mensaje si algo salió mal
const readResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? `Error HTTP ${response.status} del backend`);
  };
  return data;
};

// CONCEPTO: método asincrónico con async/await y fetch
// Crea el pago en Mercado Pago y devuelve { checkoutUrl, total }
export const createPaymentPreference = async (tripId) => {
  const response = await fetch(`${BACKEND_URL}/payments/preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tripId }),
  });
  return readResponse(response);
};

// Pregunta al backend cómo va el pago del viaje: { paymentStatus: 'approved' | 'pending' | 'rejected' }
export const checkPaymentStatus = async (tripId) => {
  const response = await fetch(`${BACKEND_URL}/payments/status/${encodeURIComponent(tripId)}`);
  return readResponse(response);
};
