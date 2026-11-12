// Hook de RECORRIDO SIMULADO (pruebas): mueve el carro por los puntos de la ruta, uno por segundo.
// Sirve para mostrar el viaje en el video aunque el conductor no se mueva de verdad.
// AI-assisted: see docs/AI_LOG.md #9
import { useEffect, useState } from 'react';

import { updateDriverLocation } from '../services/driverService';

const TOTAL_STEPS = 25; // el recorrido completo dura unos 25 segundos

export default function useSimulatedDrive({ coordinates, running, driverId }) {
  const [index, setIndex] = useState(0);

  // Si cambia la ruta (por ejemplo, de "ir por el pasajero" a "ir al destino"), empieza de nuevo
  useEffect(() => {
    setIndex(0);
  }, [coordinates]);

  // CONCEPTO: setInterval con limpieza. Avanza mientras running sea true.
  useEffect(() => {
    if (!running || !coordinates?.length) return undefined;

    const step = Math.max(1, Math.ceil(coordinates.length / TOTAL_STEPS));
    const interval = setInterval(() => {
      setIndex((previous) => Math.min(previous + step, coordinates.length - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [running, coordinates]);

  const position = coordinates?.[index] ?? null;
  const finished = Boolean(coordinates?.length) && index >= coordinates.length - 1;

  // La ubicación simulada también se guarda en Firestore (cada 3 pasos), como la real
  useEffect(() => {
    if (!running || !position || !driverId || index % 3 !== 0) return;
    updateDriverLocation(driverId, { lat: position.latitude, lng: position.longitude }).catch(() => null);
  }, [index]);

  return { position, finished };
};
