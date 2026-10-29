// Punto de entrada de la app.
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RegisterProvider } from './src/context/RegisterContext';
import RootStack from './src/navigation/RootStack';
import { colors } from './src/theme/colors';

// Tema del navegador: fondo y colores de la app
const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background, primary: colors.primary },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        {/* CONCEPTO: el Provider del contexto envuelve el StatusBar y la navegación */}
        <RegisterProvider>
          <StatusBar style="dark" />
          <RootStack />
        </RegisterProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
