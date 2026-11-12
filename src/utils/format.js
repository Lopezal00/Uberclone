// Formatos para mostrar valores en pantalla.
// AI-assisted: see docs/AI_LOG.md #10

// 19200 -> "$19.200" (pesos colombianos, sin decimales)
export const formatCOP = (value) => `$${Math.round(value ?? 0).toLocaleString('es-CO')}`;

// 8.5 -> "8,5 km"
export const formatKm = (value) => `${String(value ?? 0).replace('.', ',')} km`;

// 22 -> "22 min"
export const formatMin = (value) => `${value ?? 0} min`;
