// Viaje en curso: mapa con la ruta y botones para avanzar de estado.
//   accepted / driver_arriving -> ruta del conductor al pasajero -> "Pasajero a bordo"
//   in_progress                -> ruta del pasajero al destino  -> "Finalizar viaje" -> Cobro
// AI-assisted: see docs/AI_LOG.md #10
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '../../components/AppButton';
import { PAYMENT_METHOD_LABELS, TRIP_STATUS } from '../../constants/options';
import { useDriverSession } from '../../context/DriverSessionContext';
import useDriverLocation from '../../hooks/useDriverLocation';
import useSimulatedDrive from '../../hooks/useSimulatedDrive';
import { getRoute } from '../../services/routeService';
import { completeTrip, listenTrip, updateTripStatus } from '../../services/tripService';
import { colors } from '../../theme/colors';
import { formatKm, formatMin } from '../../utils/format';

const toMapPoint = (point) => ({ latitude: point.lat, longitude: point.lng });

export default function TripScreen() {
  const navigation = useNavigation();
  const { tripId } = useRoute().params;
  const { driverId, driver } = useDriverSession();
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);

  const [trip, setTrip] = useState(null);
  const [route, setRoute] = useState(null); // { coordinates, distanceKm, durationMin }
  const [simulating, setSimulating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Ubicación real del conductor (se sigue enviando a Firestore durante el viaje)
  const { location } = useDriverLocation({ driverId, tracking: !simulating });

  // CONCEPTO: onSnapshot con limpieza. El viaje se escucha en tiempo real.
  useEffect(() => {
    const unsubscribe = listenTrip(tripId, setTrip);
    return () => unsubscribe();
  }, [tripId]);

  const status = trip?.status;
  const goingToPassenger = status === TRIP_STATUS.ACCEPTED || status === TRIP_STATUS.DRIVER_ARRIVING;

  // Al aceptar, el conductor queda "en camino" hacia el pasajero
  useEffect(() => {
    if (status === TRIP_STATUS.ACCEPTED) {
      updateTripStatus(tripId, TRIP_STATUS.DRIVER_ARRIVING, { arrivingAt: new Date() });
    };
  }, [status, tripId]);

  // Punto de partida de la primera ruta: ubicación real o la última guardada en Firestore
  const driverStart = location ?? driver?.location ?? trip?.origin;

  // Calcula la ruta del tramo actual (una vez por tramo, para no llamar a OSRM a cada rato)
  const leg = goingToPassenger ? 'pickup' : status === TRIP_STATUS.IN_PROGRESS ? 'destination' : null;
  useEffect(() => {
    if (!trip || !leg || !driverStart) return;
    let cancelled = false;
    setRoute(null);
    setSimulating(false);

    const from = leg === 'pickup' ? driverStart : trip.origin;
    const to = leg === 'pickup' ? trip.origin : trip.destination;
    getRoute(from, to).then((result) => {
      if (cancelled) return;
      setRoute(result);
      // Ajusta el mapa para que se vea toda la ruta
      mapRef.current?.fitToCoordinates(result.coordinates, {
        edgePadding: { top: 80, right: 60, bottom: 360, left: 60 },
        animated: true,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [leg, trip?.id, Boolean(driverStart)]);

  // Recorrido simulado sobre la ruta del tramo
  const { position: simulatedPosition, finished } = useSimulatedDrive({
    coordinates: route?.coordinates,
    running: simulating,
    driverId,
  });

  // Si el viaje ya terminó (o se recargó la pantalla), pasa al cobro
  useEffect(() => {
    if (status === TRIP_STATUS.COMPLETED || status === TRIP_STATUS.PAID) {
      navigation.replace('Payment', { tripId });
    };
  }, [status]);

  async function startTrip() {
    setSaving(true);
    try {
      await updateTripStatus(tripId, TRIP_STATUS.IN_PROGRESS, { startedAt: new Date() });
    } finally {
      setSaving(false);
    };
  };

  async function finishTrip() {
    setSaving(true);
    try {
      // Distancia y duración del recorrido (ruta de OSRM del origen al destino)
      await completeTrip(trip, { distanceKm: route.distanceKm, durationMin: route.durationMin });
    } finally {
      setSaving(false);
    };
  };

  if (!trip) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  const carPosition = simulatedPosition ?? (driverStart ? toMapPoint(driverStart) : null);
  const target = goingToPassenger ? trip.origin : trip.destination;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{ ...toMapPoint(trip.origin), latitudeDelta: 0.04, longitudeDelta: 0.04 }}
        accessibilityLabel="Mapa con la ruta del viaje"
      >
        {route ? <Polyline coordinates={route.coordinates} strokeWidth={5} strokeColor={colors.primary} /> : null}
        <Marker coordinate={toMapPoint(trip.origin)} title="Recogida" description={trip.origin.address} pinColor="black" />
        <Marker coordinate={toMapPoint(trip.destination)} title="Destino" description={trip.destination.address} pinColor="green" />
        {carPosition ? (
          <Marker coordinate={carPosition} title="Tú" anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.car}>
              <Ionicons name="car" size={18} color={colors.surface} />
            </View>
          </Marker>
        ) : null}
      </MapView>

      <View style={[styles.panel, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.step}>{goingToPassenger ? 'Ve por el pasajero' : 'Rumbo al destino'}</Text>
        <Text style={styles.title} accessibilityRole="header" numberOfLines={2}>{target.address}</Text>
        <Text style={styles.soft}>
          {route ? `${formatKm(route.distanceKm)} · ${formatMin(route.durationMin)}` : 'Calculando ruta…'}
          {' · '}{trip.passengerName} · {PAYMENT_METHOD_LABELS[trip.paymentMethod]}
        </Text>

        <AppButton
          title={simulating ? (finished ? 'Recorrido simulado terminado' : 'Simulando recorrido…') : 'Simular recorrido (pruebas)'}
          variant="outline"
          onPress={() => setSimulating(true)}
          disabled={!route || simulating}
        />

        {goingToPassenger ? (
          <AppButton title="Pasajero a bordo · Iniciar viaje" onPress={startTrip} loading={saving} />
        ) : (
          <AppButton title="Finalizar viaje" onPress={finishTrip} loading={saving} disabled={!route} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  car: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 10,
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
  step: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accent,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  soft: {
    fontSize: 14,
    color: colors.textSoft,
    marginBottom: 4,
  },
});
