// Cálculo de tarifa, comisión y ganancia neta del conductor.
// CONCEPTO: función pura = con los mismos datos siempre devuelve lo mismo y no modifica nada afuera.
// Se usa igual en la estimación (solicitud) y al cerrar el viaje.
// AI-assisted: see docs/AI_LOG.md #7
// Se importa con .js para poder probar el archivo con Node (scripts/checkFare.mjs); en la app funciona igual
import { CATEGORY_MULTIPLIER, PRICING } from '../config/pricing.js';

// Redondea al múltiplo de 100 COP más cercano (19.249 -> 19.200; 26.880 -> 26.900)
const roundToNearest = (value, step) => Math.round(value / step) * step;

export const calculateFare = ({ distanceKm, durationMin, category, tip = 0, commissionRate = PRICING.COMMISSION_RATE }) => {
  const multiplier = CATEGORY_MULTIPLIER[category];

  if (multiplier === undefined) {
    throw new Error(`Categoría no válida: ${category}`);
  };
  if (distanceKm < 0 || durationMin < 0 || tip < 0) {
    throw new Error('La distancia, la duración y la propina no pueden ser negativas');
  };

  // 1. Base + distancia + tiempo
  const subtotal = PRICING.BASE_FARE + distanceKm * PRICING.PER_KM + durationMin * PRICING.PER_MIN;

  // 2. Multiplicador de la categoría, redondeo a 100 y tarifa mínima
  const fare = Math.max(roundToNearest(subtotal * multiplier, PRICING.ROUND_TO), PRICING.MIN_FARE);

  // 3. Comisión sobre la tarifa (la propina NO paga comisión: va completa al conductor)
  const commission = Math.round(fare * commissionRate);
  const driverEarnings = fare - commission + Math.round(tip);

  return { fare, commission, tip: Math.round(tip), driverEarnings, commissionRate };
};