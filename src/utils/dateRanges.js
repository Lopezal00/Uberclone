// Rangos de fechas para los filtros de Ganancias e Historial (Hoy, Semana, Mes, Rango).
// Funciones puras: reciben fechas y devuelven fechas, sin tocar nada afuera.
// AI-assisted: see docs/AI_LOG.md #10

// 00:00 del día de la fecha
export const startOfDay = (date = new Date()) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

// 23:59:59 del día de la fecha
export const endOfDay = (date = new Date()) => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

// La semana empieza el lunes (como en Colombia)
export const startOfWeek = (date = new Date()) => {
  const result = startOfDay(date);
  const day = result.getDay(); // 0 = domingo, 1 = lunes...
  const daysSinceMonday = (day + 6) % 7;
  result.setDate(result.getDate() - daysSinceMonday);
  return result;
};

export const startOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), 1);

// Rango { from, to } de cada filtro. Para 'range' se usan las fechas que eligió el conductor.
export const PERIODS = {
  today: { label: 'Hoy', getRange: () => ({ from: startOfDay(), to: endOfDay() }) },
  week: { label: 'Semana', getRange: () => ({ from: startOfWeek(), to: endOfDay() }) },
  month: { label: 'Mes', getRange: () => ({ from: startOfMonth(), to: endOfDay() }) },
};

export const isInRange = (date, { from, to }) => Boolean(date) && date >= from && date <= to;
