// Hook de ubicación del conductor.
// - Siempre SE pide permiso y trae la ubicación actual para centrar el mapa.
// - Solo si tracking es true (Disponible y en la pantalla de Inicio): sigue la ubicación y la
//   envía a Firestore cada pocos segundos. Al apagar tracking o salir, el seguimiento se detiene.
// AI-assisted: see docs/AI_LOG.md #7
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

import { updateDriverLocation } from '../services/driverService';

// Cada cuánto se actualiza la ubicación mientras está Disponible
const UPDATE_EVERY_MS = 5000; // 5 segundos
const UPDATE_EVERY_METERS = 10; // o cuando se mueva 10 metros

// Convierte la respuesta de expo-location al formato que usamos en Firestore: { lat, lng }
const toLatLng = (position) => ({ lat: position.coords.latitude, lng: position.coords.longitude });

export default function useDriverLocation({ driverId, tracking }) {
  const [location, setLocation] = useState(null); // { lat, lng }
  const [permissionDenied, setPermissionDenied] = useState(false);

  // 1. Al entrar: pedir permiso y traer la ubicación actual (una sola vez)
  useEffect(() => {
    let cancelled = false; // evita cambiar el estado si la pantalla ya se cerró

    async function loadCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (!cancelled) setPermissionDenied(true);
        return;
      };
      try {
        const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!cancelled) setLocation(toLatLng(position));
      } catch (error) {
        console.log('No se pudo obtener la ubicación', error);
      };
    };

    loadCurrentLocation();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2. CONCEPTO: useEffect con función de limpieza.
  //    Mientras tracking sea true seguimos la ubicación; al volverse false (o salir) la limpieza la detiene.
  useEffect(() => {
    if (!tracking || !driverId || permissionDenied) return undefined;

    let subscription = null;
    let active = true; // false cuando ya se ejecutó la limpieza

    async function startTracking() {
      const watcher = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: UPDATE_EVERY_MS, distanceInterval: UPDATE_EVERY_METERS },
        (position) => {
          const current = toLatLng(position);
          setLocation(current);
          // No esperamos la respuesta: si una actualización falla, la siguiente la corrige
          updateDriverLocation(driverId, current).catch((error) => console.log('Error al enviar la ubicación', error));
        }
      );
      // Si apagaron Disponible mientras arrancaba el seguimiento, lo detenemos de una vez
      if (active) subscription = watcher;
      else watcher.remove();
    };

    startTracking();

    // Limpieza: deja de seguir la ubicación
    return () => {
      active = false;
      if (subscription) subscription.remove();
    };
  }, [tracking, driverId, permissionDenied]);

  return { location, permissionDenied };
};
