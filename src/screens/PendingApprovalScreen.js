// Pantalla de cuenta pendiente de aprobación.
// Escucha el conductor en tiempo real: si en Firestore se cambia status a 'approved', la pantalla se actualiza sola.
// Mientras no esté aprobado, el interruptor Disponible está bloqueado.
// AI-assisted: see docs/AI_LOG.md #3
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import AppButton from '../components/AppButton';
import { DRIVER_STATUS } from '../constants/options';
import { useDriverSession } from '../context/DriverSessionContext'
import { colors } from '../theme/colors';

// Texto e ícono de cada estado de la cuenta
const STATUS_INFO = {
  [DRIVER_STATUS.PENDING]: {
    icon: 'time-outline',
    color: colors.textSoft,
    title: 'Pendiente de aprobación',
    text: 'Recibimos tu registro. Cuando lo aprobemos podrás ponerte Disponible y recibir viajes.',
  },
  [DRIVER_STATUS.APPROVED]: {
    icon: 'checkmark-circle-outline',
    color: colors.accent,
    title: 'Cuenta aprobada',
    text: 'Ya puedes ponerte Disponible para recibir solicitudes de viaje.',
  },
  [DRIVER_STATUS.REJECTED]: {
    icon: 'close-circle-outline',
    color: colors.error,
    title: 'Registro rechazado',
    text: 'Revisa tus datos y documentos, y vuelve a registrarte.',
  },
};

export default function PendingApprovalScreen() {
  const navigation = useNavigation();

  const {driver, isApproved, reloadSession, endSession } = useDriverSession();

   // Al llegar desde el registro, la sesión se vuelve a leer para empezar a escuchar al conductor nuevo
  useEffect(() => {
    reloadSession();
  }, [reloadSession]);

  // Cuando la cuenta está aprobada, pasa al inicio (Drawer) y ya no se puede volver a esta pantalla
  function goHome() {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  // Solo para pruebas: borra la sesión y vuelve a la bienvenida
  async function registerAgain() {
    await endSession();
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  const loading = !driver;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.text}>Consultando tu cuenta...</Text>
      </View>
    );
  };

  const info = STATUS_INFO[driver?.status] ?? STATUS_INFO[DRIVER_STATUS.PENDING];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name={info.icon} size={56} color={info.color} />
        <Text style={styles.title}>{info.title}</Text>
        {driver?.fullName ? <Text style={styles.name}>{driver.fullName}</Text> : null}
        <Text style={styles.text}>{info.text}</Text>
      </View>

      <View style={styles.availability}>
        <View style={styles.flex}>
          <Text style={styles.availabilityTitle}>Disponible</Text>
          <Text style={styles.availabilityText}>
            {isApproved ? 'Se activa en la pantalla de inicio.' : 'Bloqueado hasta que tu cuenta sea aprobada.'}
          </Text>
        </View>
        <Switch
          value={false}
          disabled
          accessibilityLabel="Disponible"
          accessibilityHint={isApproved ? 'Se activa en la pantalla de inicio.' : 'Bloqueado hasta que tu cuenta sea aprobada.'}
        />
      </View>

      {isApproved ? <AppButton title="Ir al inicio" onPress={goHome} /> : null}

      <AppButton title="Registrar otro conductor (pruebas)" variant="outline" onPress={registerAgain} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  card: {
    alignItems: 'center',
    gap: 8,
    padding: 24,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  text: {
    fontSize: 15,
    color: colors.textSoft,
    textAlign: 'center',
  },
  availability: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  availabilityText: {
    fontSize: 13,
    color: colors.textSoft,
    marginTop: 2,
  },
});