// Crea un viaje FINALIZADO de prueba en Firestore para probar el cobro sin tener todavía el flujo del viaje.
// Uso: npm run test-trip
import 'dotenv/config';

import { db, TRIPS } from '../src/firebaseAdmin.js';

const trip = {
  driverId: 'conductor-de-prueba',
  passengerId: 'pasajero-de-prueba',
  origin: { lat: 6.2442, lng: -75.5812, address: 'Parque Berrío, Medellín' },
  destination: { lat: 6.2006, lng: -75.5783, address: 'El Poblado, Medellín' },
  distanceKm: 8.5,
  durationMin: 22,
  category: 'economy',
  // Valores del ejemplo del PDF (calculateFare)
  fare: 19200,
  commission: 3840,
  tip: 0,
  driverEarnings: 15360,
  commissionRate: 0.2,
  paymentMethod: 'mercadopago',
  paymentStatus: 'pending',
  status: 'completed',
  isTest: true,
  createdAt: new Date(),
  completedAt: new Date(),
};

const ref = await db.collection(TRIPS).add(trip);
console.log(`Viaje de prueba creado: ${ref.id}`);
console.log(`Ahora: curl -X POST http://localhost:3000/payments/preference -H "Content-Type: application/json" -d "{\\"tripId\\":\\"${ref.id}\\"}"`);
process.exit(0);
