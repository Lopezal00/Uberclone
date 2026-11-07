// Pantalla temporal para las secciones del Drawer que todavía no están hechas.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';

export default function PlaceholderScreen({ icon, title, text }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={colors.textSoft} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  text: {
    fontSize: 15,
    color: colors.textSoft,
    textAlign: 'center',
  },
});
