// Punto de entrada de la app.
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DriverSessionProvider } from './src/context/DriverSessionContext';
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
    // GestureHandlerRootView: lo pide el Drawer para poder abrir el menú deslizando
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={navTheme}>
          {/* CONCEPTO: los Provider de los contextos envuelven el StatusBar y la navegación */}
          {/* AI-assisted: see docs/AI_LOG.md #6 (DriverSessionProvider: sesión y viaje activo) */}
          <DriverSessionProvider>
            <RegisterProvider>
              <StatusBar style="dark" />
              <RootStack />
            </RegisterProvider>
          </DriverSessionProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
    
};
