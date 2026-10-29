// Servicio de base de datos para los conductores (colección drivers en Firestore).
// Separado del servicio de imágenes: este solo habla con la base de datos.
// AI-assisted: see docs/AI_LOG.md #1
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { DRIVER_STATUS } from '../constants/options';

// CONCEPTO: nombre de la colección en una constante en mayúscula
// Si la colección no existe, Firestore la crea la primera vez que guardamos.
const DRIVERS = 'drivers';

// Crea el conductor con estado Pendiente de aprobación. Devuelve el id del documento.
export const createDriver = async (driver) => {
  // Referencia a un documento nuevo: Firestore genera el id
  const reference = doc(collection(db, DRIVERS));

  await setDoc(reference, {
    ...driver,
    status: DRIVER_STATUS.PENDING,
    createdAt: new Date(), // campo de fecha para poder ordenar
  });

  return reference.id;
};

// Trae un solo conductor por su id. Si no existe, devuelve null.
export const getDriver = async (driverId) => {
  const snap = await getDoc(doc(db, DRIVERS, driverId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// Cambia el estado de la cuenta (para simular la aprobación desde la app si se necesita)
export const updateDriverStatus = async (driverId, status) => {
  await updateDoc(doc(db, DRIVERS, driverId), { status });
};
