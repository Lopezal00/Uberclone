// Pestaña 1 - Datos personales.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';

export default function PersonalDataScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Datos personales: en construcción</Text>
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
