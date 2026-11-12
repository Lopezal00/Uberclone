// Cobro del viaje y resumen final.
// - Efectivo: el conductor confirma que recibió el dinero.
// - Mercado Pago: se abre el checkout que crea NUESTRO backend y luego se verifica el pago.
// AI-assisted: see docs/AI_LOG.md #10
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import AppButton from '../../components/AppButton';
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS, TRIP_STATUS } from '../../constants/options';
import { useDriverSession } from '../../context/DriverSessionContext';
import { checkPaymentStatus, createPaymentPreference } from '../../services/paymentService';
import { confirmCashPayment, listenTrip, setTripTip, updateTripStatus } from '../../services/tripService';
import { colors } from '../../theme/colors';
import { formatCOP, formatKm, formatMin } from '../../utils/format';

const TIP_OPTIONS = [0, 2000, 5000];

const PAYMENT_STATUS_TEXT = {
  approved: 'Pago aprobado',
  pending: 'Pago pendiente',
  rejected: 'Pago rechazado',
};

// Una fila del resumen: etiqueta a la izquierda, valor a la derecha
function Row({ label, value, bold, negative }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.bold, negative && styles.negative]}>{value}</Text>
    </View>
  );
};

export default function PaymentScreen() {
  const navigation = useNavigation();
  const { tripId } = useRoute().params;
  const { setActiveTrip } = useDriverSession();

  const [trip, setTrip] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  // CONCEPTO: onSnapshot con limpieza: si el webhook aprueba el pago, la pantalla cambia sola
  useEffect(() => {
    const unsubscribe = listenTrip(tripId, setTrip);
    return () => unsubscribe();
  }, [tripId]);

  // Ejecuta una acción mostrando el indicador y el error (si hay) debajo de los botones
  const run = useCallback(async (action) => {
    setBusy(true);
    setMessage('');
    try {
      await action();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    };
  }, []);

  const verifyPayment = () => run(async () => {
    const result = await checkPaymentStatus(tripId);
    if (result.paymentStatus !== 'approved') setMessage(PAYMENT_STATUS_TEXT[result.paymentStatus] ?? 'Sin pago todavía');
  });

  const payWithMercadoPago = () => run(async () => {
    const { checkoutUrl } = await createPaymentPreference(tripId);
    // Abre el checkout dentro de la app; cuando el usuario lo cierra, verificamos el pago
    await WebBrowser.openBrowserAsync(checkoutUrl);
    const result = await checkPaymentStatus(tripId);
    if (result.paymentStatus !== 'approved') setMessage(PAYMENT_STATUS_TEXT[result.paymentStatus] ?? 'Sin pago todavía');
  });

  const payWithCash = () => run(() => confirmCashPayment(tripId));

  // Si Mercado Pago falla, el pasajero puede pagar en efectivo
  const switchToCash = () => run(() => updateTripStatus(tripId, TRIP_STATUS.COMPLETED, { paymentMethod: PAYMENT_METHODS.CASH }));

  function goHome() {
    setActiveTrip(null);
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  if (!trip) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  const isPaid = trip.status === TRIP_STATUS.PAID;
  const isMercadoPago = trip.paymentMethod === PAYMENT_METHODS.MERCADOPAGO;
  // Después de abrir el checkout ya no se puede cambiar la propina (el monto ya se envió)
  const tipLocked = isPaid || Boolean(trip.preferenceId);
  const total = (trip.fare ?? 0) + (trip.tip ?? 0);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {isPaid ? (
        <View style={styles.success} accessibilityLiveRegion="polite">
          <Ionicons name="checkmark-circle" size={56} color={colors.accent} />
          <Text style={styles.title} accessibilityRole="header">Viaje cobrado</Text>
          <Text style={styles.soft}>Ganaste {formatCOP(trip.driverEarnings)} en este viaje.</Text>
        </View>
      ) : (
        <View style={styles.headerBlock}>
          <Text style={styles.title} accessibilityRole="header">Cobra el viaje</Text>
          <Text style={styles.soft}>{trip.passengerName} paga con {PAYMENT_METHOD_LABELS[trip.paymentMethod]}</Text>
          <Text style={styles.total}>{formatCOP(total)}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumen</Text>
        <Text style={styles.soft}>{trip.origin?.address} → {trip.destination?.address}</Text>
        <Text style={styles.soft}>{formatKm(trip.distanceKm)} · {formatMin(trip.durationMin)}</Text>
        <View style={styles.divider} />
        <Row label="Tarifa" value={formatCOP(trip.fare)} />
        <Row label={`Comisión (${Math.round((trip.commissionRate ?? 0) * 100)} %)`} value={`-${formatCOP(trip.commission)}`} negative />
        <Row label="Propina (sin comisión)" value={formatCOP(trip.tip)} />
        <View style={styles.divider} />
        <Row label="Tu ganancia" value={formatCOP(trip.driverEarnings)} bold />
      </View>

      {!tipLocked ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Propina del pasajero</Text>
          <View style={styles.chips}>
            {TIP_OPTIONS.map((value) => {
              const selected = (trip.tip ?? 0) === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => run(() => setTripTip(trip, value))}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {value === 0 ? 'Sin propina' : formatCOP(value)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      {message ? <Text style={styles.message} accessibilityLiveRegion="polite">{message}</Text> : null}

      {isPaid ? (
        <AppButton title="Volver al inicio" onPress={goHome} />
      ) : isMercadoPago ? (
        <View style={styles.actions}>
          <AppButton title="Cobrar con Mercado Pago" onPress={payWithMercadoPago} loading={busy} />
          <AppButton title="Verificar pago" variant="outline" onPress={verifyPayment} disabled={busy} />
          <AppButton title="El pasajero pagará en efectivo" variant="outline" onPress={switchToCash} disabled={busy} />
        </View>
      ) : (
        <AppButton title={`Recibí ${formatCOP(total)} en efectivo`} onPress={payWithCash} loading={busy} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  success: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  headerBlock: {
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  total: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 4,
  },
  soft: {
    fontSize: 14,
    color: colors.textSoft,
  },
  card: {
    gap: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
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
    fontVariant: ['tabular-nums'],
  },
  negative: {
    color: colors.error,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 15,
    color: colors.text,
  },
  chipTextSelected: {
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },
  actions: {
    gap: 10,
  },
});
