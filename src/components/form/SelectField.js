// Lista desplegable con etiqueta y error debajo. options = [{ value, label }]
// AI-assisted: see docs/AI_LOG.md #1
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import useAnnounceError from '../../hooks/useAnnounceError';
import { colors } from '../../theme/colors';

export default function SelectField({ label, error, value, onChange, options, placeholder = 'Selecciona una opción' }) {
  useAnnounceError(error);

  return (
    <View style={styles.container}>
      <Text style={styles.label} importantForAccessibility="no" accessibilityElementsHidden>
        {label}
      </Text>
      <View style={[styles.box, error ? styles.boxError : null]}>
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          style={styles.picker}
          accessibilityLabel={error ? `${label}. ${error}` : label}
        >
          {/* Primera opción vacía: obliga a elegir una de verdad */}
          <Picker.Item label={placeholder} value="" color={colors.textSoft} />
          {options.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} color={colors.text} />
          ))}
        </Picker>
      </View>
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
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
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  boxError: {
    borderColor: colors.error,
  },
  picker: {
    color: colors.text,
  },
  error: {
    marginTop: 4,
    fontSize: 13,
    color: colors.error,
  },
});
