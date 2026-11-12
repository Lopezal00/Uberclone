// Inicio del conductor: mapa con su ubicación e interruptor Disponible / No disponible.
// - Solo un conductor aprobado puede ponerse Disponible.
// - Mientras está Disponible (y en esta pantalla) la ubicación se envía a Firestore cada pocos segundos.
// - El último estado se guarda en AsyncStorage para recordarlo al volver a abrir la app.
// AI-assisted: see docs/AI_LOG.md #7
// AI-assisted: see docs/AI_LOG.md #9 (solicitudes de viaje y simulador de pasajero)
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '../../components/AppButton';
import RequestCard from '../../components/trip/RequestCard';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { useDriverSession } from '../../context/DriverSessionContext';
import useDriverLocation from '../../hooks/useDriverLocation';
import useTripRequests from '../../hooks/useTripRequests';
import { getData, saveData } from '../../services/asyncStorage';
import { setDriverAvailability } from '../../services/driverService';
import { simulatePassengerRequest } from '../../services/simulatorService';
import { acceptTrip, rejectTrip } from '../../services/tripService';
import { colors } from '../../theme/colors';

// Si todavía no tenemos la ubicación, el mapa arranca en Medellín
const DEFAULT_REGION = { latitude: 6.2442, longitude: -75.5812, latitudeDelta: 0.05, longitudeDelta: 0.05 };
// Zoom del mapa cuando ya conocemos la ubicación del conductor
const ZOOM = { latitudeDelta: 0.01, longitudeDelta: 0.01 };

export default function HomeScreen() {
  const { driverId, driver, isApproved, activeTrip, setActiveTrip } = useDriverSession();
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // false cuando el conductor está en otra sección del Drawer
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);

  // CONCEPTO: useState para el estado de disponibilidad
  const [isAvailable, setIsAvailable] = useState(false);

  // Solo se sigue la ubicación si está Disponible Y está viendo esta pantalla
  const { location, permissionDenied } = useDriverLocation({ driverId, tracking: isAvailable && isFocused });

  // Solicitudes de viaje en tiempo real: solo si está Disponible, en esta pantalla y sin viaje activo
  const { currentRequest } = useTripRequests({
    enabled: isAvailable && isFocused && !activeTrip,
    category: driver?.vehicle?.category,
  });
  const [accepting, setAccepting] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [notice, setNotice] = useState('');

  // Aceptar: la transacción asegura que solo un conductor se quede con el viaje
  const handleAccept = useCallback(async (trip) => {
    setAccepting(true);
    setNotice('');
    try {
      await acceptTrip(trip.id, { id: driverId, ...driver });
      setActiveTrip(trip.id);
      navigation.navigate('Trip', { tripId: trip.id });
    } catch (error) {
      setNotice(error.message); // por ejemplo: "Esta solicitud ya no está disponible"
    } finally {
      setAccepting(false);
    };
  }, [driverId, driver, navigation, setActiveTrip]);

  // Rechazar (o se acabó el tiempo)
  const handleReject = useCallback(async (trip, timedOut) => {
    setNotice(timedOut ? 'Se acabó el tiempo: la solicitud se rechazó.' : '');
    await rejectTrip(trip.id, driverId).catch((error) => console.log('Error al rechazar', error));
  }, [driverId]);

  // SIMULADOR (pruebas): crea una solicitud como si la pidiera un pasajero cercano
  const simulateRequest = useCallback(async () => {
    if (!location) {
      setNotice('Esperando tu ubicación para simular la solicitud…');
      return;
    };
    setSimulating(true);
    setNotice('');
    try {
      await simulatePassengerRequest({ driverLocation: location, category: driver?.vehicle?.category });
    } catch (error) {
      setNotice(`No se pudo simular la solicitud: ${error.message}`);
    } finally {
      setSimulating(false);
    };
  }, [location, driver]);

  // Al entrar: recuperar el último estado guardado en el celular (solo si la cuenta está aprobada)
  useEffect(() => {
    async function restoreAvailability() {
      const saved = await getData(STORAGE_KEYS.LAST_AVAILABILITY);
      if (saved === true && isApproved) setIsAvailable(true);
    };
    restoreAvailability();
  }, [isApproved]);

  // Si la cuenta deja de estar aprobada, se apaga Disponible
  useEffect(() => {
    if (!isApproved) setIsAvailable(false);
  }, [isApproved]);

  // Cada vez que cambia la disponibilidad se guarda en Firestore (para recibir o no solicitudes)
  useEffect(() => {
    if (!driverId) return;
    setDriverAvailability(driverId, isAvailable).catch((error) => console.log('Error al cambiar disponibilidad', error));
  }, [driverId, isAvailable]);

  // Centrar el mapa cuando llega una ubicación nueva
  useEffect(() => {
    if (!location || !mapRef.current) return;
    mapRef.current.animateToRegion({ latitude: location.lat, longitude: location.lng, ...ZOOM }, 600);
  }, [location]);

  // CONCEPTO: useCallback para no crear la función en cada render
  const toggleAvailability = useCallback((value) => {
    setIsAvailable(value);
    saveData(STORAGE_KEYS.LAST_AVAILABILITY, value); // AsyncStorage: solo la preferencia, nada sensible
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={DEFAULT_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        accessibilityLabel="Mapa con tu ubicación"
      />

      {permissionDenied ? (
        <View style={[styles.banner, { top: 12 }]}>
          <Ionicons name="location-outline" size={20} color={colors.error} />
          <Text style={styles.bannerText}>Activa la ubicación para recibir viajes.</Text>
          <Pressable onPress={() => Linking.openSettings()} accessibilityRole="button" hitSlop={8}>
            <Text style={styles.bannerLink}>Ajustes</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={[styles.card, { paddingBottom: insets.bottom + 16 }]}>
        {currentRequest ? (
          <RequestCard trip={currentRequest} onAccept={handleAccept} onReject={handleReject} accepting={accepting} />
        ) : (
          <>
            <View style={styles.row}>
              <View style={[styles.dot, { backgroundColor: isAvailable ? colors.accent : colors.disabled }]} />
              <View style={styles.flex}>
                <Text style={styles.title} accessibilityRole="header">
                  {isAvailable ? 'Estás disponible' : 'No disponible'}
                </Text>
                <Text style={styles.subtitle}>
                  {!isApproved
                    ? 'Tu cuenta debe estar aprobada para ponerte Disponible.'
                    : isAvailable
                      ? 'Buscando solicitudes de viaje cerca de ti…'
                      : 'Activa Disponible para empezar a recibir viajes.'}
                </Text>
              </View>
              <Switch
                value={isAvailable}
                onValueChange={toggleAvailability}
                disabled={!isApproved || permissionDenied || Boolean(activeTrip)}
                trackColor={{ true: colors.accent }}
                accessibilityLabel="Disponible"
              />
            </View>

            {/* Si salió de la pantalla del viaje, puede volver a ella */}
            {activeTrip ? (
              <AppButton title="Volver al viaje en curso" onPress={() => navigation.navigate('Trip', { tripId: activeTrip })} />
            ) : isAvailable ? (
              <AppButton
                title="Simular solicitud de pasajero (pruebas)"
                variant="outline"
                onPress={simulateRequest}
                loading={simulating}
              />
            ) : null}
          </>
        )}
        {notice ? <Text style={styles.notice} accessibilityLiveRegion="polite">{notice}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  banner: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  bannerLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  notice: {
    fontSize: 14,
    color: colors.textSoft,
    textAlign: 'center',
  },
  card: {
    gap: 14,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSoft,
    marginTop: 2,
  },
});