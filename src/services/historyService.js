// Servicio del historial: viajes del conductor (colección trips).
// AI-assisted: see docs/AI_LOG.md #10
import { collection, onSnapshot, query, where } from 'firebase/firestore';

import { db } from '../config/firebase';
import { TRIPS } from './tripService';

// CONCEPTO: onSnapshot. Escucha en tiempo real todos los viajes del conductor.
// Se filtra solo por driverId (una igualdad) para no necesitar índices compuestos en Firestore;
// el orden, los filtros y la paginación de a 20 se hacen en la app.
export const listenDriverTrips = (driverId, onChange) =>
  onSnapshot(
    query(collection(db, TRIPS), where('driverId', '==', driverId)),
    (snapshot) => onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    (error) => console.log('Error escuchando el historial', error)
  );
