// Campo de texto con etiqueta y mensaje de error DEBAJO del campo (nunca en un Alert).
// Recibe las mismas props de un TextInput (keyboardType, maxLength, autoCapitalize...).
// AI-assisted: see docs/AI_LOG.md #1
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../../theme/colors';

export default function FormField({ label, error, value, onChangeText, ...inputProps }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.textSoft}
        {...inputProps}
      />
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
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    marginTop: 4,
    fontSize: 13,
    color: colors.error,
  },
});
