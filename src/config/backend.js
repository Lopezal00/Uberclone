// Dirección del backend de pagos. Va en el .env de la app como EXPO_PUBLIC_BACKEND_URL
// No es un secreto: las llaves de Mercado Pago están solo en backend/.env.
export const BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL ?? '').replace(/\/$/, '');
