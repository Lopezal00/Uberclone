// Servicio de rutas con OSRM (gratis, sin llave ni tarjeta; alternativa a Google Directions).
// Devuelve los puntos para dibujar la ruta, la distancia en km y la duración en minutos.
// Si OSRM no responde, calcula una ruta en línea recta para que la app nunca se quede bloqueada.
// AI-assisted: see docs/AI_LOG.md #9

const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';

// Distancia en km entre dos puntos { lat, lng } (fórmula de Haversine)
export const distanceBetween = (from, to) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // radio de la Tierra en km
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

const round1 = (value) => Math.round(value * 10) / 10;

// Ruta de respaldo: línea recta, +30 % de distancia (las calles no son rectas) a 25 km/h
const straightLineRoute = (from, to) => {
  const distanceKm = round1(distanceBetween(from, to) * 1.3);
  return {
    coordinates: [
      { latitude: from.lat, longitude: from.lng },
      { latitude: to.lat, longitude: to.lng },
    ],
    distanceKm,
    durationMin: Math.max(1, Math.round((distanceKm / 25) * 60)),
    isEstimate: true,
  };
};

// CONCEPTO: método asincrónico con async/await y fetch
// from y to: { lat, lng }
export const getRoute = async (from, to) => {
  try {
    // OSRM recibe longitud,latitud (en ese orden)
    const url = `${OSRM_URL}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error HTTP ${response.status} de OSRM`);

    const data = await response.json();
    const route = data.routes?.[0];
    if (!route) throw new Error('OSRM no encontró una ruta');

    return {
      // GeoJSON viene como [lng, lat]: lo pasamos al formato de react-native-maps
      coordinates: route.geometry.coordinates.map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
      distanceKm: round1(route.distance / 1000), // metros -> km
      durationMin: Math.max(1, Math.round(route.duration / 60)), // segundos -> minutos
      isEstimate: false,
    };
  } catch (error) {
    console.log('Ruta con OSRM falló, uso línea recta:', error.message);
    return straightLineRoute(from, to);
  };
};
