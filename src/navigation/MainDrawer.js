// Navegación Drawer del conductor aprobado: Inicio, Historial, Ganancias y Perfil.
// El flujo del viaje (solicitud, viaje en curso, cobro) va en el Stack de RootStack, encima del Drawer.
// AI-assisted: see docs/AI_LOG.md #6
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDriverSession } from '../context/DriverSessionContext';
import EarningsScreen from '../screens/main/EarningsScreen';
import HistoryScreen from '../screens/main/HistoryScreen';
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { colors } from '../theme/colors';

// CONCEPTO: la constante se llama Drawer, como en la documentación
const Drawer = createDrawerNavigator();

// Ícono de cada sección según el nombre de la ruta
const ICONS = {
  Home: 'map-outline',
  History: 'time-outline',
  Earnings: 'cash-outline',
  Profile: 'person-circle-outline',
};

// Contenido del menú lateral: datos del conductor arriba, secciones y Cerrar sesión abajo
function DrawerContent(props) {
  const { driver, endSession } = useDriverSession();
  const insets = useSafeAreaInsets();

  async function logout() {
    await endSession();
    // getParent() = el Stack de RootStack; reiniciamos la app en la bienvenida
    props.navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  return (
    <View style={styles.flex}>
      <DrawerContentScrollView {...props}>
        <View style={styles.header}>
          {driver?.photoUrl ? (
            <Image source={{ uri: driver.photoUrl }} style={styles.avatar} accessibilityIgnoresInvertColors />
          ) : (
            <View style={[styles.avatar, styles.avatarEmpty]}>
              <Ionicons name="person" size={28} color={colors.textSoft} />
            </View>
          )}
          <Text style={styles.name} numberOfLines={1}>{driver?.fullName ?? 'Conductor'}</Text>
          {driver?.vehicle ? (
            <Text style={styles.vehicle} numberOfLines={1}>
              {driver.vehicle.plate} · {driver.vehicle.brand} {driver.vehicle.model}
            </Text>
          ) : null}
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <Pressable
        onPress={logout}
        accessibilityRole="button"
        style={({ pressed }) => [styles.logout, { paddingBottom: insets.bottom + 16 }, pressed && styles.pressed]}
      >
        <Ionicons name="log-out-outline" size={22} color={colors.error} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
};

export default function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSoft,
        drawerIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
      })}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Drawer.Screen name="History" component={HistoryScreen} options={{ title: 'Historial' }} />
      <Drawer.Screen name="Earnings" component={EarningsScreen} options={{ title: 'Ganancias' }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil y configuración' }} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  avatarEmpty: {
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  vehicle: {
    fontSize: 14,
    color: colors.textSoft,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
});
