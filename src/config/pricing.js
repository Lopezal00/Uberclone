// Parámetros de tarifa de la plataforma (valores didácticos del taller, no tarifas reales).
// Todo en pesos colombianos ENTEROS para evitar errores con decimales.
// Si cambia un valor, se cambia solo aquí.
// AI-assisted: see docs/AI_LOG.md #7

export const PRICING = {
  BASE_FARE: 3500, // tarifa base
  PER_KM: 1200, // valor por kilómetro
  PER_MIN: 250, // valor por minuto
  MIN_FARE: 6000, // tarifa mínima
  ROUND_TO: 100, // la tarifa se redondea al múltiplo de 100 más cercano
  COMMISSION_RATE: 0.2, // comisión de la plataforma: 20 %
};

// Multiplicador por categoría (las mismas llaves de CATEGORIES en constants/options.js)
export const CATEGORY_MULTIPLIER = {
  economy: 1.0,
  xl: 1.4,
  premium: 1.8,
};