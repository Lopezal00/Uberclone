// Navegación Stack principal. Por ahora: registro y cuenta pendiente.
// En la entrega final aquí  agregariamos el Drawer y el flujo del viaje.
// AI-assisted: see docs/AI_LOG.md #1
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterTabs from './RegisterTabs';
import PendingApprovalScreen from '../screens/PendingApprovalScreen';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getData } from '../services/asyncStorage';
import { colors } from '../theme/colors';

// CONCEPTO: la constante se llama Stack, como en la documentación
const Stack = createNativeStackNavigator();

export default function RootStack() {
  // AI-assisted: see docs/AI_LOG.md #3
  // Si el conductor ya se registró en este celular (hay sesión), la app abre en la cuenta pendiente
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    async function checkSession() {
      const driverId = await getData(STORAGE_KEYS.DRIVER_ID);
      setInitialRoute(driverId ? 'PendingApproval' : 'Register');
    };
    checkSession();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="Register" component={RegisterTabs} options={{ title: 'Registro del conductor' }} />
      <Stack.Screen
        name="PendingApproval"
        component={PendingApprovalScreen}
        options={{ title: 'Cuenta en revisión', headerBackVisible: false, gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};