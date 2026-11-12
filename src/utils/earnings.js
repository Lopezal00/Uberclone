// Resumen de ganancias (función pura): se usa en la pantalla Ganancias dentro de useMemo.
// AI-assisted: see docs/AI_LOG.md #10
import { PAYMENT_METHODS, TRIP_STATUS } from '../constants/options';

// Solo cuentan los viajes ya cobrados
export const isPaidTrip = (trip) => trip.status === TRIP_STATUS.PAID;

// Número de viajes, total facturado, comisiones, propinas, ganancia neta y promedio por viaje
export const summarizeTrips = (trips) => {
  const paid = trips.filter(isPaidTrip);
  const sum = (field) => paid.reduce((total, trip) => total + (trip[field] ?? 0), 0);

  const count = paid.length;
  const driverEarnings = sum('driverEarnings');
  return {
    count,
    fare: sum('fare'),
    commission: sum('commission'),
    tip: sum('tip'),
    driverEarnings,
    average: count > 0 ? Math.round(driverEarnings / count) : 0,
  };
};

// Saldo del conductor (sección 5 del PDF):
// + ganancias de los viajes que cobró la pasarela (la plataforma tiene ese dinero y se lo debe al conductor)
// - comisiones de los viajes en efectivo (el conductor tiene ese dinero y le debe la comisión a la plataforma)
// Puede quedar negativo.
export const calculateBalance = (trips) =>
  trips.filter(isPaidTrip).reduce((balance, trip) => {
    if (trip.paymentMethod === PAYMENT_METHODS.CASH) return balance - (trip.commission ?? 0);
    return balance + (trip.driverEarnings ?? 0);
  }, 0);
