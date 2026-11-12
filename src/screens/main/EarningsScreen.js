// Ganancias: saldo del conductor y totales de hoy, la semana y el mes.
// Los totales se calculan con useMemo sobre el historial (sección 5 del PDF).
// AI-assisted: see docs/AI_LOG.md #10
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import FilterChips from '../../components/history/FilterChips';
import useDriverTrips from '../../hooks/useDriverTrips';
import { colors } from '../../theme/colors';
import { isInRange, PERIODS } from '../../utils/dateRanges';
import { calculateBalance, summarizeTrips } from '../../utils/earnings';
import { formatCOP } from '../../utils/format';

const PERIOD_OPTIONS = Object.entries(PERIODS).map(([value, period]) => ({ value, label: period.label }));

// Una cifra del resumen
function Stat({ label, value, negative }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, negative && styles.negative]}>{value}</Text>
    </View>
  );
};

export default function EarningsScreen() {
  const { trips, loading } = useDriverTrips();
  const [period, setPeriod] = useState('today');

  // CONCEPTO: useMemo. Los totales solo se recalculan si cambian los viajes o el periodo.
  const summary = useMemo(() => {
    const range = PERIODS[period].getRange();
    return summarizeTrips(trips.filter((trip) => isInRange(trip.finishedAt, range)));
  }, [trips, period]);

  // El saldo es de todos los viajes, no solo del periodo
  const balance = useMemo(() => calculateBalance(trips), [trips]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.balanceCard} accessible accessibilityLabel={`Saldo ${formatCOP(balance)}`}>
        <Text style={styles.balanceLabel}>Tu saldo</Text>
        <Text style={[styles.balance, balance < 0 && styles.balanceNegative]}>{formatCOP(balance)}</Text>
        <Text style={styles.balanceHint}>
          Ganancias de viajes pagados con Mercado Pago menos comisiones de viajes en efectivo.
          {balance < 0 ? ' Le debes ese valor a la plataforma.' : ''}
        </Text>
      </View>

      <FilterChips label="Periodo" options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />

      <View style={styles.card}>
        <Text style={styles.cardTitle} accessibilityRole="header">Ganancia neta · {PERIODS[period].label}</Text>
        <Text style={styles.net}>{formatCOP(summary.driverEarnings)}</Text>
        <Text style={styles.soft}>
          {summary.count === 0
            ? 'Todavía no tienes viajes cobrados en este periodo.'
            : `${summary.count} ${summary.count === 1 ? 'viaje' : 'viajes'} · promedio ${formatCOP(summary.average)} por viaje`}
        </Text>
      </View>

      <View style={styles.grid}>
        <Stat label="Total facturado" value={formatCOP(summary.fare)} />
        <Stat label="Comisiones" value={`-${formatCOP(summary.commission)}`} negative />
        <Stat label="Propinas" value={formatCOP(summary.tip)} />
        <Stat label="Viajes" value={String(summary.count)} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.primary,
    gap: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#BDBDBD',
  },
  balance: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.surface,
  },
  balanceNegative: {
    color: '#FF8A80',
  },
  balanceHint: {
    fontSize: 13,
    lineHeight: 18,
    color: '#BDBDBD',
  },
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
  net: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.accent,
  },
  soft: {
    fontSize: 14,
    color: colors.textSoft,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  stat: {
    flexGrow: 1,
    flexBasis: '45%',
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSoft,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  negative: {
    color: colors.error,
  },
});
