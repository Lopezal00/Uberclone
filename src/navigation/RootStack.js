// Navegación Stack principal: bienvenida, registro, cuenta pendiente y el Drawer del conductor aprobado.
// Aquí también irán las pantallas del flujo del viaje (solicitud, viaje en curso, cobro).
// AI-assisted: see docs/AI_LOG.md #1
// AI-assisted: see docs/AI_LOG.md #6 (la sesión ahora viene de DriverSessionContext)
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainDrawer from './MainDrawer';
import RegisterTabs from './RegisterTabs';
import { useDriverSession } from '../context/DriverSessionContext';
import PendingApprovalScreen from '../screens/PendingApprovalScreen';
import WelcomeScreen from '../screens/WelcomeScreens';
import { colors } from '../theme/colors';

// CONCEPTO: la constante se llama Stack, como en la documentación
const Stack = createNativeStackNavigator();

// AI-assisted: see docs/AI_LOG.md #5 (sin sesión abre la bienvenida)
// Pantalla con la que abre la app según la sesión guardada
const getInitialRoute = (driverId, isApproved) => {
  if (!driverId) return 'Welcome'; // nunca se ha registrado en este celular
  if (isApproved) return 'Main'; // aprobado: va al Drawer (Inicio)
  return 'PendingApproval'; // registrado pero aún en revisión o rechazado
};

export default function RootStack() {
  const { driverId, isApproved, loadingSession } = useDriverSession();

  // Mientras leemos la sesión y el estado del conductor mostramos un indicador
  if (loadingSession) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  // Cuando ya sabemos la sesión, mostramos la navegación
  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute(driverId, isApproved)}
      screenOptions={{ headerTitleAlign: 'center' }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterTabs} options={{ title: 'Registro del conductor' }} />
      <Stack.Screen
        name="PendingApproval"
        component={PendingApprovalScreen}
        options={{ title: 'Cuenta en revisión', headerBackVisible: false, gestureEnabled: false }}
      />
      {/* El Drawer tiene su propio header con el botón de menú */}
      <Stack.Screen name="Main" component={MainDrawer} options={{ headerShown: false, gestureEnabled: false }} />
    </Stack.Navigator>
  );
};