// Opciones de las listas desplegables del registro.
// value = lo que se guarda en la base de datos (en inglés); label = lo que ve el usuario.
// AI-assisted: see docs/AI_LOG.md #1

export const GENDERS = [
  { value: 'female', label: 'Femenino' },
  { value: 'male', label: 'Masculino' },
  { value: 'other', label: 'Otro' },
  { value: 'not_say', label: 'Prefiero no decirlo' },
];

// Mismo selector de idioma que la app del pasajero
export const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
];

// Mismas categorías que elige el pasajero. minCapacity: XL exige mínimo 6 pasajeros.
export const CATEGORIES = [
  { value: 'economy', label: 'Económico', minCapacity: 1 },
  { value: 'xl', label: 'XL', minCapacity: 6 },
  { value: 'premium', label: 'Premium', minCapacity: 1 },
];

export const VEHICLE_COLORS = [
  { value: 'white', label: 'Blanco' },
  { value: 'black', label: 'Negro' },
  { value: 'gray', label: 'Gris' },
  { value: 'silver', label: 'Plateado' },
  { value: 'red', label: 'Rojo' },
  { value: 'blue', label: 'Azul' },
  { value: 'green', label: 'Verde' },
  { value: 'other', label: 'Otro' },
];

// Estados de la cuenta del conductor (campo status en Firestore)
export const DRIVER_STATUS = {
  PENDING: 'pending', // recién registrado, esperando aprobación
  APPROVED: 'approved', // puede ponerse Disponible
  REJECTED: 'rejected',
};

// ---------- Viajes ----------
// AI-assisted: see docs/AI_LOG.md #19

// Estados de un viaje (campo status en la colección trips)
export const TRIP_STATUS = {
  REQUESTED: 'requested', // el pasajero pidió el viaje: les llega a los conductores disponibles
  ACCEPTED: 'accepted', // un conductor lo aceptó
  DRIVER_ARRIVING: 'driver_arriving', // el conductor va hacia el pasajero
  IN_PROGRESS: 'in_progress', // pasajero a bordo, rumbo al destino
  COMPLETED: 'completed', // llegaron al destino: falta cobrar
  PAID: 'paid', // cobrado
  REJECTED: 'rejected', // el conductor la rechazó o se acabaron los 15 s
  CANCELLED: 'cancelled',
};

// Cómo paga el pasajero
export const PAYMENT_METHODS = {
  CASH: 'cash',
  MERCADOPAGO: 'mercadopago',
};

export const PAYMENT_METHOD_LABELS = {
  cash: 'Efectivo',
  mercadopago: 'Mercado Pago',
};

// Segundos que tiene el conductor para aceptar una solicitud
export const REQUEST_TIMEOUT_SECONDS = 15;