// Tarjeta de solicitud de viaje con temporizador de 15 segundos.
// Si el temporizador llega a 0, la solicitud se rechaza sola.
// AI-assisted: see docs/AI_LOG.md #9
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, StyleSheet, Text, Vibration, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppButton from '../AppButton';
import { CATEGORIES, PAYMENT_METHOD_LABELS, REQUEST_TIMEOUT_SECONDS } from '../../constants/options';
import { toDate } from '../../services/tripService';
import { colors } from '../../theme/colors';
import { formatCOP, formatKm, formatMin } from '../../utils/format';

const categoryLabel = (value) => CATEGORIES.find((item) => item.value === value)?.label ?? value;

// Segundos que le quedan a la solicitud según cuándo se creó
const secondsLeft = (trip) => {
  const elapsed = (Date.now() - (toDate(trip.createdAt)?.getTime() ?? Date.now())) / 1000;
  return Math.max(0, Math.ceil(REQUEST_TIMEOUT_SECONDS - elapsed));
};

export default function RequestCard({ trip, onAccept, onReject, accepting }) {
  const [remaining, setRemaining] = useState(() => secondsLeft(trip));
  const timedOut = useRef(false);

  // Al llegar una solicitud nueva: vibra y VoiceOver la anuncia
  useEffect(() => {
    Vibration.vibrate(400);
    AccessibilityInfo.announceForAccessibility(
      `Nueva solicitud de viaje. ${formatCOP(trip.estimatedFare)}. Tienes ${REQUEST_TIMEOUT_SECONDS} segundos.`
    );
    timedOut.current = false;
    setRemaining(secondsLeft(trip));
  }, [trip.id]);

  // CONCEPTO: temporizador con setInterval y su limpieza
  useEffect(() => {
    const interval = setInterval(() => setRemaining(secondsLeft(trip)), 250);
    return () => clearInterval(interval);
  }, [trip.id]);

  // Si llega a 0 se rechaza sola (una sola vez)
  useEffect(() => {
    if (remaining === 0 && !timedOut.current && !accepting) {
      timedOut.current = true;
      onReject(trip, true);
    };
  }, [remaining, accepting]);

  const progress = remaining / REQUEST_TIMEOUT_SECONDS;

  return (
    <View style={styles.card} accessibilityViewIsModal>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">Nueva solicitud</Text>
        <View style={styles.timer} accessibilityLabel={`${remaining} segundos para aceptar`}>
          <Ionicons name="time-outline" size={16} color={remaining <= 5 ? colors.error : colors.text} />
          <Text style={[styles.timerText, remaining <= 5 && styles.timerUrgent]}>{remaining} s</Text>
        </View>
      </View>
      <View style={styles.progressTrack} accessibilityElementsHidden>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }, remaining <= 5 && styles.progressUrgent]} />
      </View>

      <View style={styles.amounts}>
        <View>
          <Text style={styles.fare}>{formatCOP(trip.estimatedFare)}</Text>
          <Text style={styles.soft}>Tarifa estimada · tú recibes {formatCOP(trip.estimatedEarnings)}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{categoryLabel(trip.category)}</Text>
        </View>
      </View>

      <View style={styles.places}>
        <View style={styles.place}>
          <View style={[styles.dot, styles.dotOrigin]} />
          <Text style={styles.placeText} numberOfLines={1}>{trip.origin?.address}</Text>
        </View>
        <View style={styles.place}>
          <View style={[styles.dot, styles.dotDestination]} />
          <Text style={styles.placeText} numberOfLines={1}>{trip.destination?.address}</Text>
        </View>
      </View>

      <Text style={styles.soft}>
        {formatKm(trip.estimatedDistanceKm)} · {formatMin(trip.estimatedDurationMin)} · {PAYMENT_METHOD_LABELS[trip.paymentMethod]} · {trip.passengerName}
      </Text>

      <View style={styles.buttons}>
        <View style={styles.flex}>
          <AppButton title="Rechazar" variant="outline" onPress={() => onReject(trip, false)} disabled={accepting} />
        </View>
        <View style={styles.flex}>
          <AppButton title="Aceptar" onPress={() => onAccept(trip)} loading={accepting} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  timerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  timerUrgent: {
    color: colors.error,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.primary,
  },
  progressUrgent: {
    backgroundColor: colors.error,
  },
  amounts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fare: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  soft: {
    fontSize: 14,
    color: colors.textSoft,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.surface,
  },
  places: {
    gap: 8,
  },
  place: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
  },
  dotOrigin: {
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  dotDestination: {
    backgroundColor: colors.accent,
  },
  placeText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  flex: {
    flex: 1,
  },
});
