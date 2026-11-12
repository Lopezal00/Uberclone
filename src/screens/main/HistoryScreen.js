// Historial de carreras: FlatList del más reciente al más antiguo, con filtros
// Hoy / Semana / Mes / Rango de fechas y método de pago. Muestra de a 20 viajes.
// AI-assisted: see docs/AI_LOG.md #10
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import DateField from '../../components/form/DateField';
import FilterChips from '../../components/history/FilterChips';
import TripListItem from '../../components/history/TripListItem';
import { PAYMENT_METHODS } from '../../constants/options';
import useDriverTrips from '../../hooks/useDriverTrips';
import { colors } from '../../theme/colors';
import { endOfDay, isInRange, PERIODS, startOfDay } from '../../utils/dateRanges';

const PAGE_SIZE = 20; // viajes por carga

const PERIOD_OPTIONS = [
  { value: 'all', label: 'Todos' },
  ...Object.entries(PERIODS).map(([value, period]) => ({ value, label: period.label })),
  { value: 'range', label: 'Rango' },
];

const METHOD_OPTIONS = [
  { value: 'all', label: 'Todos los pagos' },
  { value: PAYMENT_METHODS.CASH, label: 'Efectivo' },
  { value: PAYMENT_METHODS.MERCADOPAGO, label: 'Mercado Pago' },
];

export default function HistoryScreen() {
  const navigation = useNavigation();
  const { trips, loading } = useDriverTrips();

  const [period, setPeriod] = useState('all');
  const [method, setMethod] = useState('all');
  const [rangeFrom, setRangeFrom] = useState(null);
  const [rangeTo, setRangeTo] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // CONCEPTO: useMemo. Filtra solo cuando cambian los viajes o los filtros.
  const filtered = useMemo(() => {
    let range = null;
    if (period === 'range' && rangeFrom && rangeTo) range = { from: startOfDay(rangeFrom), to: endOfDay(rangeTo) };
    else if (PERIODS[period]) range = PERIODS[period].getRange();

    return trips.filter((trip) =>
      (!range || isInRange(trip.finishedAt, range)) && (method === 'all' || trip.paymentMethod === method)
    );
  }, [trips, period, method, rangeFrom, rangeTo]);

  // Al cambiar un filtro, se vuelve a mostrar desde la primera página
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [period, method, rangeFrom, rangeTo]);

  // Paginación: al llegar al final de la lista se muestran 20 más
  const loadMore = useCallback(() => {
    setVisibleCount((count) => (count < filtered.length ? count + PAGE_SIZE : count));
  }, [filtered.length]);

  // CONCEPTO: useCallback para no crear la función en cada render (TripListItem usa React.memo)
  const openDetail = useCallback((trip) => navigation.navigate('TripDetail', { tripId: trip.id }), [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  const header = (
    <View style={styles.filters}>
      <FilterChips label="Periodo" options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />
      {period === 'range' ? (
        <View style={styles.rangeRow}>
          <View style={styles.flex}>
            <DateField label="Desde" value={rangeFrom} onChange={setRangeFrom} maximumDate={rangeTo ?? new Date()} />
          </View>
          <View style={styles.flex}>
            <DateField label="Hasta" value={rangeTo} onChange={setRangeTo} minimumDate={rangeFrom ?? undefined} maximumDate={new Date()} />
          </View>
        </View>
      ) : null}
      <FilterChips label="Método de pago" options={METHOD_OPTIONS} value={method} onChange={setMethod} />
      <Text style={styles.count}>
        {filtered.length} {filtered.length === 1 ? 'viaje' : 'viajes'}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={filtered.slice(0, visibleCount)}
      keyExtractor={(trip) => trip.id}
      renderItem={({ item }) => <TripListItem trip={item} onPress={openDetail} />}
      ListHeaderComponent={header}
      // Mensaje cuando el filtro no tiene viajes (en vez de una lista en blanco)
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="car-outline" size={40} color={colors.textSoft} />
          <Text style={styles.emptyText}>
            {period === 'range' && (!rangeFrom || !rangeTo)
              ? 'Elige las dos fechas del rango.'
              : 'No tienes viajes con estos filtros.'}
          </Text>
        </View>
      }
      ListFooterComponent={
        visibleCount < filtered.length ? <ActivityIndicator style={styles.footer} color={colors.primary} /> : null
      }
      onEndReached={loadMore}
      onEndReachedThreshold={0.4}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  filters: {
    gap: 10,
    marginBottom: 12,
  },
  rangeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  count: {
    fontSize: 13,
    color: colors.textSoft,
  },
  separator: {
    height: 10,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSoft,
    textAlign: 'center',
  },
  footer: {
    marginVertical: 16,
  },
});
