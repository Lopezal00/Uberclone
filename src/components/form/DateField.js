// Selector de fecha con etiqueta y error debajo.
// En Android abre el calendario del sistema; en iPhone muestra la rueda con un botón Listo.
// AI-assisted: see docs/AI_LOG.md #1
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors } from '../../theme/colors';

const formatDate = (date) =>
  date.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' });

export default function DateField({ label, error, value, onChange, maximumDate, minimumDate }) {
  const [open, setOpen] = useState(false);

  // En Android el calendario se cierra solo al elegir; en iPhone lo cierra el botón Listo
  function handleValueChange(event, selectedDate) {
    if (Platform.OS === 'android') setOpen(false);
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.box, error ? styles.boxError : null, pressed && styles.pressed]}
      >
        <Text style={value ? styles.value : styles.placeholder}>
          {value ? formatDate(value) : 'Seleccionar fecha'}
        </Text>
      </Pressable>

      {open && (
        <View>
          <DateTimePicker
            value={value ?? maximumDate ?? new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            onValueChange={handleValueChange}
            onDismiss={() => setOpen(false)}
          />
          {Platform.OS === 'ios' && (
            <Pressable onPress={() => setOpen(false)} style={styles.doneButton}>
              <Text style={styles.doneText}>Listo</Text>
            </Pressable>
          )}
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  box: {
    height: 48,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
  },
  boxError: {
    borderColor: colors.error,
  },
  pressed: {
    opacity: 0.7,
  },
  value: {
    fontSize: 16,
    color: colors.text,
  },
  placeholder: {
    fontSize: 16,
    color: colors.textSoft,
  },
  doneButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  doneText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  error: {
    marginTop: 4,
    fontSize: 13,
    color: colors.error,
  },
});
