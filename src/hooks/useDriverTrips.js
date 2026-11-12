// Hook: viajes terminados del conductor, del más reciente al más antiguo.
// Lo usan Ganancias e Historial.
// AI-assisted: see docs/AI_LOG.md #10
import { useEffect, useMemo, useState } from 'react';

import { TRIP_STATUS } from '../constants/options';
import { useDriverSession } from '../context/DriverSessionContext';
import { listenDriverTrips } from '../services/historyService';
import { toDate } from '../services/tripService';

// Viajes que van al historial: los que llegaron al destino (cobrados o pendientes de cobro)
const FINISHED = [TRIP_STATUS.COMPLETED, TRIP_STATUS.PAID];

export default function useDriverTrips() {
  const { driverId } = useDriverSession();
  const [rawTrips, setRawTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // CONCEPTO: useEffect con limpieza: deja de escuchar al salir o cerrar sesión
  useEffect(() => {
    if (!driverId) return undefined;
    const unsubscribe = listenDriverTrips(driverId, (trips) => {
      setRawTrips(trips);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [driverId]);

  // CONCEPTO: useMemo. Solo se recalcula cuando llegan datos nuevos de Firestore.
  const trips = useMemo(
    () => rawTrips
      .filter((trip) => FINISHED.includes(trip.status))
      .map((trip) => ({ ...trip, finishedAt: toDate(trip.completedAt) ?? toDate(trip.createdAt) }))
      .sort((a, b) => b.finishedAt - a.finishedAt),
    [rawTrips]
  );

  return { trips, loading };
};
