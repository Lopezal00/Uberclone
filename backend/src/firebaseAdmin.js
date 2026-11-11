// Firebase Admin: el backend lee y actualiza los viajes en Firestore.
// Usa la clave de la cuenta de servicio (serviceAccountKey.json), que NUNCA se sube a GitHub.

import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// applicationDefault() lee la ruta de GOOGLE_APPLICATION_CREDENTIALS del .env
initializeApp({ credential: applicationDefault() });

export const db = getFirestore();

// Mismo nombre de colección que usa la app
export const TRIPS = 'trips';
