// Contexto de la sesión del conductor: quién es, su estado en tiempo real y el viaje activo.
// Lo usan todas las pantallas después del registro (cuenta pendiente, Drawer, inicio, viaje).
// AI-assisted: see docs/AI_LOG.md #6
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { DRIVER_STATUS } from '../constants/options';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getData, removeData } from '../services/asyncStorage';
import { listenDriver, setDriverAvailability } from '../services/driverService';

// CONCEPTO: useContext. Se crea el contexto y un Provider que envuelve la app.
export const DriverSessionContext = createContext(null);

export function DriverSessionProvider({ children }) {
  // CONCEPTO: useState para la sesión y el viaje activo
  const [driverId, setDriverId] = useState(null); // id guardado en AsyncStorage
  const [driver, setDriver] = useState(null); // documento del conductor en Firestore
  const [loadingSession, setLoadingSession] = useState(true); // true mientras leemos AsyncStorage
  const [activeTrip, setActiveTrip] = useState(null); // viaje que el conductor está atendiendo

  // Lee el id guardado en el celular. Se llama al abrir la app y después de enviar el registro.
  const reloadSession = useCallback(async () => {
    const savedId = await getData(STORAGE_KEYS.DRIVER_ID);
    setDriverId(savedId);
    if (!savedId) {
      setDriver(null);
      setLoadingSession(false);
    };
  }, []);

  // Al abrir la app revisamos si ya hay sesión
  useEffect(() => {
    reloadSession();
  }, [reloadSession]);

  // CONCEPTO: useEffect con función de limpieza. Escuchamos al conductor en tiempo real
  // (si en Firestore cambia status a 'approved', toda la app se entera).
  useEffect(() => {
    if (!driverId) return undefined;

    const unsubscribe = listenDriver(driverId, (data) => {
      // Si borraron el conductor en Firestore, la sesión guardada ya no sirve: la limpiamos
      if (!data) {
        removeData(STORAGE_KEYS.DRIVER_ID);
        setDriverId(null);
      };
      setDriver(data);
      setLoadingSession(false);
    });

    // Al cerrar sesión o cambiar de conductor dejamos de escuchar
    return () => unsubscribe();
  }, [driverId]);

  // Cerrar sesión: borra la sesión y las preferencias del conductor (no el idioma)
  const endSession = useCallback(async () => {
    //AI-assisted: see docs/AI_LOG.md #7 (al cerrar sesión deja de estar Disponible)
    if(driverId) {
      await setDriverAvailability(driverId,false).catch((error) => console.log('Error al cerrar sesión', error));
    }
    await removeData(STORAGE_KEYS.DRIVER_ID);
    await removeData(STORAGE_KEYS.LAST_AVAILABILITY);
    setActiveTrip(null);
    setDriver(null);
    setDriverId(null);
  }, [driverId]);

  const isApproved = driver?.status === DRIVER_STATUS.APPROVED;

  const value = useMemo(
    () => ({ driverId, driver, isApproved, loadingSession, activeTrip, setActiveTrip, reloadSession, endSession }),
    [driverId, driver, isApproved, loadingSession, activeTrip, reloadSession, endSession]
  );

  return <DriverSessionContext.Provider value={value}>{children}</DriverSessionContext.Provider>;
}; // fin DriverSessionProvider

// Hook para usar la sesión en cualquier pantalla: const { driver, isApproved } = useDriverSession();
export const useDriverSession = () => useContext(DriverSessionContext);