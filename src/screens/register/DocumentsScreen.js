// Pestaña 3 - Documentos y pagos.
// Se completa en la entrega final (15 de noviembre).
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';

export default function DocumentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Documentos: disponible en la entrega final</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 16,
    color: colors.textSoft,
  },
});
