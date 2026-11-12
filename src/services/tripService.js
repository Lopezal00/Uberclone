// Servicio de viajes (colección trips en Firestore): solicitudes, aceptar, estados y cobro.
// AI-assisted: see docs/AI_LOG.md 9
import {
  addDoc, collection, doc, onSnapshot, query, runTransaction, updateDoc, where,
} from 'firebase/firestore';

import { db } from '../config/firebase';
import { TRIP_STATUS } from '../constants/options';
import { calculateFare } from '../utils/calculateFare';

// CONCEPTO: nombre de la colección en una constante en mayúscula
export const TRIPS = 'trips';

// Los timestamps de Firestore se convierten a Date; si ya es Date, se deja igual
export const toDate = (value) => (value?.toDate ? value.toDate() : value ?? null);

const withId = (snapshot) => ({ id: snapshot.id, ...snapshot.data() });

// ---------- Solicitudes ----------

// Crea una solicitud (la usa el simulador de pasajero). Devuelve el id del viaje.
export const createTripRequest = async (trip) => {
  const reference = await addDoc(collection(db, TRIPS), {
    ...trip,
    status: TRIP_STATUS.REQUESTED,
    driverId: null,
    createdAt: new Date(),
  });
  return reference.id;
};

// CONCEPTO: onSnapshot = escuchar en tiempo real. Devuelve la función para dejar de escuchar.
// Solo las solicitudes de la categoría del vehículo del conductor.
export const listenRequestedTrips = (category, onChange) => {
  const requestsQuery = query(
    collection(db, TRIPS),
    where('status', '==', TRIP_STATUS.REQUESTED),
    where('category', '==', category)
  );
  return onSnapshot(
    requestsQuery,
    (snapshot) => onChange(snapshot.docs.map(withId)),
    (error) => console.log('Error escuchando solicitudes', error)
  );
};

// Escucha un viaje en tiempo real (pantalla del viaje y del cobro)
export const listenTrip = (tripId, onChange) =>
  onSnapshot(doc(db, TRIPS, tripId), (snapshot) => onChange(snapshot.exists() ? withId(snapshot) : null));

// CONCEPTO: transacción. Si dos conductores aceptan al mismo tiempo, solo uno se queda con el viaje:
// la transacción lee el viaje y SOLO lo asigna si todavía está en 'requested'.
export const acceptTrip = async (tripId, driver) => {
  const reference = doc(db, TRIPS, tripId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists() || snapshot.data().status !== TRIP_STATUS.REQUESTED) {
      throw new Error('Esta solicitud ya no está disponible');
    };
    transaction.update(reference, {
      status: TRIP_STATUS.ACCEPTED,
      driverId: driver.id,
      driverName: driver.fullName,
      vehicle: {
        plate: driver.vehicle?.plate ?? '',
        brand: driver.vehicle?.brand ?? '',
        model: driver.vehicle?.model ?? '',
        color: driver.vehicle?.color ?? '',
      },
      acceptedAt: new Date(),
    });
  });
};

// Rechazar (o se acabaron los 15 s): solo si sigue en 'requested'
export const rejectTrip = async (tripId, driverId) => {
  const reference = doc(db, TRIPS, tripId);
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists() || snapshot.data().status !== TRIP_STATUS.REQUESTED) return;
    transaction.update(reference, { status: TRIP_STATUS.REJECTED, rejectedBy: driverId, rejectedAt: new Date() });
  });
};

// ---------- Viaje en curso ----------

// Cambia el estado del viaje y guarda la fecha del cambio (ej. startedAt)
export const updateTripStatus = async (tripId, status, extra = {}) => {
  await updateDoc(doc(db, TRIPS, tripId), { status, ...extra });
};

// Finaliza el viaje: calcula tarifa, comisión y ganancia con calculateFare y las guarda
export const completeTrip = async (trip, { distanceKm, durationMin }) => {
  // La comisión vigente (20 %) sale de config/pricing.js y queda guardada en el viaje
  const result = calculateFare({ distanceKm, durationMin, category: trip.category });
  await updateDoc(doc(db, TRIPS, trip.id), {
    status: TRIP_STATUS.COMPLETED,
    distanceKm,
    durationMin,
    ...result, // fare, commission, tip, driverEarnings, commissionRate
    paymentStatus: 'pending',
    completedAt: new Date(),
  });
  return result;
};

// Propina: no paga comisión, va completa al conductor
export const setTripTip = async (trip, tip) => {
  await updateDoc(doc(db, TRIPS, trip.id), {
    tip,
    driverEarnings: trip.fare - trip.commission + tip,
  });
};

// Pago en efectivo: el conductor confirma que recibió la plata
export const confirmCashPayment = async (tripId) => {
  await updateDoc(doc(db, TRIPS, tripId), {
    status: TRIP_STATUS.PAID,
    paymentStatus: 'approved',
    paidAt: new Date(),
  });
};
