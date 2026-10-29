// Pantalla de cuenta
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

export default function PendingApprovalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cuenta pendiente: en construcción</Text>
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
