// Campo de texto con etiqueta y mensaje de error DEBAJO del campo (nunca en un Alert).
// Recibe las mismas props de un TextInput (keyboardType, maxLength, autoCapitalize...).
// AI-assisted: see docs/AI_LOG.md #1
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import useAnnounceError from '../../hooks/useAnnounceError';
import { colors } from '../../theme/colors';

// ref: se pasa al TextInput para poder enfocar el campo desde la pantalla (botón Siguiente del teclado)
export default function FormField({ label, error, value, onChangeText, ref, ...inputProps }) {
  useAnnounceError(error);

  return (
    <View style={styles.container}>
      {/* La etiqueta visual ya la lee el TextInput, así que se oculta para VoiceOver */}
      <Text style={styles.label} importantForAccessibility="no" accessibilityElementsHidden>
        {label}
      </Text>
      <TextInput
        ref={ref}
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.textSoft}
        accessibilityLabel={label}
        accessibilityHint={error || undefined}
        {...inputProps}
      />
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
  input: {
    // minHeight (no height) para que el texto no se corte con letra grande (Dynamic Type)
    minHeight: 48,
    paddingVertical: 12,
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
