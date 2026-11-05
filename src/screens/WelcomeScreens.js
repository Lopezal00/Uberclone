// Pantalla de bienvenida: es lo primero que ve el conductor antes del registro.
// Explica los 3 pasos (Datos personales, Vehículo, Documentos) y lleva al registro.
// AI-assisted: see docs/AI_LOG.md #6
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';

// Pasos del registro que se muestran en la lista numerada
const STEPS = ['Tus datos personales', 'Tu vehículo', 'Tus documentos'];

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  // CONCEPTO: insets = espacio del notch y de la barra inferior del iPhone
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      {/* Fondo negro: la barra de estado va en blanco solo mientras esta pantalla está visible */}
      {isFocused && <StatusBar style="light" />}

      <View style={styles.brand} accessibilityRole="header">
        <Text style={styles.brandName}>UberClone</Text>
        <Text style={styles.brandTag}>Conductor</Text>
      </View>

      {/* Ilustración de un mapa con una ruta, hecha solo con View (sin imágenes) */}
      <View style={styles.map} accessible={false} importantForAccessibility="no-hide-descendants">
        <View style={[styles.road, styles.roadH, { top: 51 }]} />
        <View style={[styles.road, styles.roadH, { top: 151 }]} />
        <View style={[styles.road, styles.roadV, { left: '25%' }]} />
        <View style={[styles.road, styles.roadV, { left: '72%' }]} />

        <View style={[styles.route, { left: '25%', top: 160, width: 5, height: 30, marginLeft: 6 }]} />
        <View style={[styles.route, { left: '25%', top: 158, width: '47%', height: 5, marginLeft: 6 }]} />
        <View style={[styles.route, { left: '72%', top: 58, width: 5, height: 105, marginLeft: 6 }]} />
        <View style={[styles.route, { left: '72%', top: 58, width: '14%', height: 5, marginLeft: 6 }]} />

        <View style={[styles.startDot, { left: '25%' }]} />
        <View style={[styles.endSquare, { left: '86%' }]} />
      </View>

      <View style={styles.texts}>
        <Text style={styles.title} accessibilityRole="header">Conduce y gana a tu ritmo.</Text>
        <Text style={styles.subtitle}>
          Regístrate en tres pasos. Revisamos tu cuenta y te avisamos cuando puedas recibir viajes.
        </Text>
      </View>

      <View style={styles.steps}>
        {STEPS.map((step, index) => (
          <View key={step} style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={() => navigation.navigate('Register')}
        accessibilityRole="button"
        accessibilityHint="Abre el formulario de registro"
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Registrarme como conductor</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    gap: 28,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  brandTag: {
    color: '#BDBDBD',
    fontSize: 15,
    fontWeight: '500',
  },
  map: {
    height: 210,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    overflow: 'hidden',
  },
  road: {
    position: 'absolute',
    backgroundColor: '#2B2B2B',
  },
  roadH: {
    left: 0,
    right: 0,
    height: 18,
  },
  roadV: {
    top: 0,
    bottom: 0,
    width: 18,
  },
  route: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  startDot: {
    position: 'absolute',
    top: 180,
    width: 18,
    height: 18,
    marginLeft: 0,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
  },
  endSquare: {
    position: 'absolute',
    top: 51,
    width: 18,
    height: 18,
    backgroundColor: colors.accent,
  },
  texts: {
    gap: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 38,
    lineHeight: 42,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#BDBDBD',
    fontSize: 17,
    lineHeight: 24,
  },
  steps: {
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  // CONCEPTO: marginTop 'auto' empuja el botón al final de la pantalla
  button: {
    marginTop: 'auto',
    minHeight: 56,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#000000',
    fontSize: 17,
    fontWeight: 'bold',
  },
});