// Un viaje en la lista del historial: fecha y hora, origen → destino, categoría, tarifa, ganancia y pago.
// AI-assisted: see docs/AI_LOG.md #10
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CATEGORIES, PAYMENT_METHOD_LABELS, TRIP_STATUS } from '../../constants/options';
import { colors } from '../../theme/colors';
import { formatCOP } from '../../utils/format';

export const categoryLabel = (value) => CATEGORIES.find((item) => item.value === value)?.label ?? value;

export const formatDateTime = (date) =>
  date
    ? date.toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit' })
    : '';

// Texto y color del estado del pago
export const paymentInfo = (trip) => {
  if (trip.status === TRIP_STATUS.PAID) return { text: 'Pagado', color: colors.accent };
  if (trip.paymentStatus === 'rejected') return { text: 'Pago rechazado', color: colors.error };
  return { text: 'Pago pendiente', color: '#B26A00' };
};

// CONCEPTO: React.memo. La FlatList no vuelve a pintar los elementos que no cambiaron.
function TripListItem({ trip, onPress }) {
  const payment = paymentInfo(trip);

  return (
    <Pressable
      onPress={() => onPress(trip)}
      accessibilityRole="button"
      accessibilityHint="Abre el detalle del viaje"
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <View style={styles.top}>
        <Text style={styles.date}>{formatDateTime(trip.finishedAt)}</Text>
        <Text style={styles.fare}>{formatCOP(trip.fare)}</Text>
      </View>
      <Text style={styles.route} numberOfLines={2}>
        {trip.origin?.address} → {trip.destination?.address}
      </Text>
      <View style={styles.bottom}>
        <Text style={styles.soft}>
          {categoryLabel(trip.category)} · {PAYMENT_METHOD_LABELS[trip.paymentMethod]} ·{' '}
          <Text style={{ color: payment.color, fontWeight: 'bold' }}>{payment.text}</Text>
        </Text>
        <Text style={styles.earnings}>+{formatCOP(trip.driverEarnings)}</Text>
      </View>
    </Pressable>
  );
};

export default React.memo(TripListItem);

const styles = StyleSheet.create({
  item: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 13,
    color: colors.textSoft,
  },
  fare: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  route: {
    fontSize: 15,
    color: colors.text,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  soft: {
    flex: 1,
    fontSize: 13,
    color: colors.textSoft,
  },
  earnings: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.accent,
  },
});
