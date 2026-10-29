// Navegación Tab del registro: Datos personales, Vehículo y Documentos.
// AI-assisted: see docs/AI_LOG.md #1
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import PersonalDataScreen from '../screens/register/PersonalDataScreen';
import VehicleScreen from '../screens/register/VehicleScreen';
import DocumentsScreen from '../screens/register/DocumentsScreen';
import { colors } from '../theme/colors';

// CONCEPTO: la constante se llama Tab, como en la documentación
const Tab = createBottomTabNavigator();

// Ícono de cada pestaña según su nombre
const ICONS = {
  PersonalData: 'person-outline',
  Vehicle: 'car-outline',
  Documents: 'document-text-outline',
};

export default function RegisterTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSoft,
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="PersonalData" component={PersonalDataScreen} options={{ title: 'Datos personales' }} />
      <Tab.Screen name="Vehicle" component={VehicleScreen} options={{ title: 'Vehículo' }} />
      <Tab.Screen name="Documents" component={DocumentsScreen} options={{ title: 'Documentos' }} />
    </Tab.Navigator>
  );
};
