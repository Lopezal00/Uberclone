// Casilla de verificación con texto y error debajo (por ejemplo, aceptar términos).
// AI-assisted: see docs/AI_LOG.md #8
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import useAnnounceError from '../../hooks/useAnnounceError';
import { colors } from '../../theme/colors';

// children: el texto que acompaña la casilla (puede llevar partes en negrita)
export default function CheckboxField({ checked, onChange, error, children }) {
  useAnnounceError(error);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onChange(!checked)}
        // CONCEPTO: accessibilityRole checkbox + accessibilityState para que VoiceOver diga "marcada"
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityHint={error || undefined}
        hitSlop={8}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <Ionicons
          name={checked ? 'checkbox' : 'square-outline'}
          size={26}
          color={error ? colors.error : colors.primary}
        />
        <Text style={styles.text}>{children}</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    minHeight: 44,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    color: colors.text,
  },
  error: {
    marginTop: 4,
    fontSize: 13,
    color: colors.error,
  },
});