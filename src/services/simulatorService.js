// SIMULADOR DE PASAJERO (solo para pruebas).
// Como no existe la app del pasajero, esta función hace lo que haría el pasajero:
// crea una solicitud de viaje cerca del conductor en la colección trips.
// Si la profe entrega una API para pedir viajes, solo se cambia este archivo.
// AI-assisted: see docs/AI_LOG.md #9
import * as Location from 'expo-location';

import { PAYMENT_METHODS } from '../constants/options';
import { calculateFare } from '../utils/calculateFare';
import { getRoute } from './routeService';
import { createTripRequest } from './tripService';

// Nombres inventados (nunca datos reales)
const PASSENGER_NAMES = ['Pasajero de prueba A', 'Pasajero de prueba B', 'Pasajero de prueba C', 'Pasajero de prueba D'];

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

// Punto al azar a cierta distancia (en km) de otro punto
const randomPointNear = (center, minKm, maxKm) => {
  const distanceKm = minKm + Math.random() * (maxKm - minKm);
  const angle = Math.random() * 2 * Math.PI;
  const dLat = (distanceKm / 111) * Math.cos(angle); // 1° de latitud ≈ 111 km
  const dLng = (distanceKm / (111 * Math.cos((center.lat * Math.PI) / 180))) * Math.sin(angle);
  return { lat: center.lat + dLat, lng: center.lng + dLng };
};

// Nombre de la calle de un punto (si falla, un texto genérico)
const addressOf = async (point, fallback) => {
  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude: point.lat, longitude: point.lng });
    const street = [place?.street, place?.streetNumber].filter(Boolean).join(' # ');
    return street || place?.name || place?.district || fallback;
  } catch {
    return fallback;
  };
};

// Crea la solicitud. driverLocation: { lat, lng } del conductor; category: la de su vehículo
export const simulatePassengerRequest = async ({ driverLocation, category }) => {
  const origin = randomPointNear(driverLocation, 0.3, 1.2); // el pasajero está cerca del conductor
  const destination = randomPointNear(origin, 2, 6); // el viaje es de 2 a 6 km

  const [originAddress, destinationAddress, route] = await Promise.all([
    addressOf(origin, 'Punto de recogida'),
    addressOf(destination, 'Destino'),
    getRoute(origin, destination),
  ]);

  // Estimación que ve el conductor en la tarjeta (con la misma función del cobro final)
  const estimate = calculateFare({ distanceKm: route.distanceKm, durationMin: route.durationMin, category });

  return createTripRequest({
    passengerName: pickRandom(PASSENGER_NAMES),
    origin: { ...origin, address: originAddress },
    destination: { ...destination, address: destinationAddress },
    category,
    paymentMethod: pickRandom([PAYMENT_METHODS.CASH, PAYMENT_METHODS.MERCADOPAGO]),
    estimatedDistanceKm: route.distanceKm,
    estimatedDurationMin: route.durationMin,
    estimatedFare: estimate.fare,
    estimatedEarnings: estimate.driverEarnings,
    // Calificación del pasajero de prueba, de 4,0 a 5,0 (se ve en el detalle del historial)
    rating: Math.round((4 + Math.random()) * 10) / 10,
    isSimulated: true,
  });
};
