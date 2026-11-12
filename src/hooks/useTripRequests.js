// Hook: escucha en tiempo real las solicitudes de viaje para el conductor Disponible.
// Devuelve la solicitud más antigua que todavía tiene tiempo para aceptarse.
// AI-assisted: see docs/AI_LOG.md #9
import { useEffect, useMemo, useState } from 'react';

import { REQUEST_TIMEOUT_SECONDS } from '../constants/options';
import { listenRequestedTrips, toDate } from '../services/tripService';

export default function useTripRequests({ enabled, category }) {
  const [requests, setRequests] = useState([]);

  // CONCEPTO: useEffect con limpieza. Solo escuchamos mientras está Disponible (enabled).
  useEffect(() => {
    if (!enabled || !category) {
      setRequests([]);
      return undefined;
    };
    const unsubscribe = listenRequestedTrips(category, setRequests);
    return () => unsubscribe(); // al ponerse No disponible o salir, deja de escuchar
  }, [enabled, category]);

  // CONCEPTO: useMemo. Ordenamos por antigüedad y descartamos las que ya pasaron los 15 s
  // (esas se rechazan solas desde la tarjeta).
  const currentRequest = useMemo(() => {
    const limit = Date.now() - (REQUEST_TIMEOUT_SECONDS + 5) * 1000;
    return [...requests]
      .filter((trip) => (toDate(trip.createdAt)?.getTime() ?? 0) > limit)
      .sort((a, b) => toDate(a.createdAt) - toDate(b.createdAt))[0] ?? null;
  }, [requests]);

  return { currentRequest, pendingCount: requests.length };
};
