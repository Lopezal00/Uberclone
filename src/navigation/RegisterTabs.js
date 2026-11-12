// Navegación Tab del registro: Datos personales, Vehículo y Documentos.
// AI-assisted: see docs/AI_LOG.md
import React from 'react';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import PersonalDataScreen from '../screens/register/PersonalDataScreen';
import VehicleScreen from '../screens/register/VehicleScreen';
import DocumentsScreen from '../screens/register/DocumentsScreen';
import SubmitRegistrationBar from '../components/register/SubmitRegistrationBar';
import { useRegister } from '../context/RegisterContext';
import useRegisterSubmit from '../hooks/useRegisterSubmit';
import { colors } from '../theme/colors';

// CONCEPTO: la constante se llama Tab, como en la documentación
const Tab = createBottomTabNavigator();

// Ícono de cada pestaña según su nombre
const ICONS = {
  PersonalData: 'person-outline',
  Vehicle: 'car-outline',
  Documents: 'document-text-outline',
};

// Título de cada pestaña (se usa también para lo que lee VoiceOver)
const TITLES = {
  PersonalData: 'Datos personales',
  Vehicle: 'Vehículo',
  Documents: 'Documentos',
};

export default function RegisterTabs() {
  // AI-assisted: see docs/AI_LOG.md #3
  const { isPersonalValid, isVehicleValid, isDocumentsValid } = useRegister();
  const { submit, loading, submitError } = useRegisterSubmit();

  // Una pestaña completa y válida muestra un check verde en lugar de su ícono
  const isComplete = { PersonalData: isPersonalValid, Vehicle: isVehicleValid, Documents: isDocumentsValid };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSoft,
        // El check verde solo es visual: VoiceOver también debe decir que la pestaña está completa
        tabBarAccessibilityLabel: isComplete[route.name] ? `${TITLES[route.name]}, completo` : TITLES[route.name],
        tabBarIcon: ({ color, size }) =>
          isComplete[route.name] ? (
            <Ionicons name="checkmark-circle" size={size} color={colors.accent} />
          ) : (
            <Ionicons name={ICONS[route.name]} size={size} color={color} />
          ),
      })}
      // El botón Enviar registro va justo encima de la barra de pestañas, en todas las pestañas
      tabBar={(props) => (
        <>
          <SubmitRegistrationBar onSubmit={submit} loading={loading} submitError={submitError} />
          <BottomTabBar {...props} />
        </>
      )}
    >
      <Tab.Screen name="PersonalData" component={PersonalDataScreen} options={{ title: TITLES.PersonalData }} />
      <Tab.Screen name="Vehicle" component={VehicleScreen} options={{ title: TITLES.Vehicle }} />
      <Tab.Screen name="Documents" component={DocumentsScreen} options={{ title: TITLES.Documents }} />
    </Tab.Navigator>
  );
};