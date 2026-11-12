// Detalle de un viaje del historial: ruta en el mapa (Polyline), duración, distancia,
// tarifa, comisión, propina, ganancia y calificación del pasajero.
// AI-assisted: see docs/AI_LOG.md #10
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { categoryLabel, formatDateTime, paymentInfo } from '../../components/history/TripListItem';
import { PAYMENT_METHOD_LABELS } from '../../constants/options';
import { getRoute } from '../../services/routeService';
import { listenTrip, toDate } from '../../services/tripService';
import { colors } from '../../theme/colors';
import { formatCOP, formatKm, formatMin } from '../../utils/format';

const toMapPoint = ({ lat, lng }) => ({ latitude: lat, longitude: lng });

function Row({ label, value, bold, negative }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.bold, negative && styles.negative]}>{value}</Text>
    </View>
  );
};

export default function TripDetailScreen() {
  const { tripId } = useRoute().params;
  const mapRef = useRef(null);
  const [trip, setTrip] = useState(null);
  const [routePoints, setRoutePoints] = useState(null);

  // CONCEPTO: onSnapshot con limpieza
  useEffect(() => {
    const unsubscribe = listenTrip(tripId, setTrip);
    return () => unsubscribe();
  }, [tripId]);

  // Ruta: la guardada en el viaje. Si es un viaje viejo sin ruta, se pide UNA vez a OSRM.
  useEffect(() => {
    if (!trip) return;
    if (trip.route?.length) {
      setRoutePoints(trip.route.map(toMapPoint));
      return;
    };
    getRoute(trip.origin, trip.destination).then((result) => setRoutePoints(result.coordinates));
  }, [trip?.id]);

  // Ajusta el mapa para que se vea toda la ruta
  useEffect(() => {
    if (routePoints?.length) {
      mapRef.current?.fitToCoordinates(routePoints, {
        edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
        animated: false,
      });
    };
  }, [routePoints]);

  if (!trip) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  const payment = paymentInfo(trip);
  const finishedAt = toDate(trip.completedAt) ?? toDate(trip.createdAt);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.mapBox}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={{ ...toMapPoint(trip.origin), latitudeDelta: 0.05, longitudeDelta: 0.05 }}
          scrollEnabled={false}
          accessibilityLabel="Mapa con la ruta del viaje"
        >
          {routePoints ? <Polyline coordinates={routePoints} strokeWidth={4} strokeColor={colors.primary} /> : null}
          <Marker coordinate={toMapPoint(trip.origin)} title="Recogida" pinColor="black" />
          <Marker coordinate={toMapPoint(trip.destination)} title="Destino" pinColor="green" />
        </MapView>
      </View>

      <View style={styles.card}>
        <Text style={styles.date}>{formatDateTime(finishedAt)}</Text>
        <Text style={styles.route}>{trip.origin?.address} → {trip.destination?.address}</Text>
        <Text style={styles.soft}>
          {categoryLabel(trip.category)} · {formatKm(trip.distanceKm)} · {formatMin(trip.durationMin)}
        </Text>
        <View style={styles.rating} accessible accessibilityLabel={`Calificación del pasajero: ${trip.rating ?? 'sin calificación'}`}>
          <Ionicons name="star" size={16} color="#F5A623" />
          <Text style={styles.soft}>{trip.rating ? `${String(trip.rating).replace('.', ',')} · ${trip.passengerName}` : `Sin calificación · ${trip.passengerName}`}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Row label="Tarifa" value={formatCOP(trip.fare)} />
        <Row label={`Comisión (${Math.round((trip.commissionRate ?? 0) * 100)} %)`} value={`-${formatCOP(trip.commission)}`} negative />
        <Row label="Propina" value={formatCOP(trip.tip)} />
        <View style={styles.divider} />
        <Row label="Tu ganancia" value={formatCOP(trip.driverEarnings)} bold />
      </View>

      <View style={styles.card}>
        <Row label="Método de pago" value={PAYMENT_METHOD_LABELS[trip.paymentMethod]} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Estado del pago</Text>
          <Text style={[styles.rowValue, styles.bold, { color: payment.color }]}>{payment.text}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 14,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBox: {
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
  },
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  date: {
    fontSize: 13,
    color: colors.textSoft,
  },
  route: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  soft: {
    fontSize: 14,
    color: colors.textSoft,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowLabel: {
    fontSize: 15,
    color: colors.text,
  },
  rowValue: {
    fontSize: 15,
    color: colors.text,
  },
  bold: {
    fontWeight: 'bold',
  },
  negative: {
    color: colors.error,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
});
