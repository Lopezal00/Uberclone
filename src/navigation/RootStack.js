// Navegación Stack principal. Por ahora: registro y cuenta pendiente.
// En la entrega final aquí  agregariamos el Drawer y el flujo del viaje.
// AI-assisted: see docs/AI_LOG.md #1
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterTabs from './RegisterTabs';
import PendingApprovalScreen from '../screens/PendingApprovalScreen';

// CONCEPTO: la constante se llama Stack, como en la documentación
const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="Register" component={RegisterTabs} options={{ title: 'Registro del conductor' }} />
      <Stack.Screen
        name="PendingApproval"
        component={PendingApprovalScreen}
        options={{ title: 'Cuenta en revisión', headerBackVisible: false, gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};
