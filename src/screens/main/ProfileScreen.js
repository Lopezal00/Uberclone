// Perfil y configuración: datos editables (correo y celular), vehículo, documentos, idioma y cerrar sesión.
// AI-assisted: see docs/AI_LOG.md #10
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import AppButton from '../../components/AppButton';
import FormField from '../../components/form/FormField';
import FilterChips from '../../components/history/FilterChips';
import { categoryLabel } from '../../components/history/TripListItem';
import { LANGUAGES, VEHICLE_COLORS } from '../../constants/options';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { useDriverSession } from '../../context/DriverSessionContext';
import { saveData } from '../../services/asyncStorage';
import { updateDriverProfile } from '../../services/driverService';
import { toDate } from '../../services/tripService';
import { colors } from '../../theme/colors';
import { validateEmail, validatePhone } from '../../utils/validators';

const colorLabel = (value) => VEHICLE_COLORS.find((item) => item.value === value)?.label ?? value;
const formatDate = (value) => toDate(value)?.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) ?? '—';

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || '—'}</Text>
    </View>
  );
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { driverId, driver, endSession } = useDriverSession();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Cuando llegan los datos del conductor, se llenan los campos editables
  useEffect(() => {
    setEmail(driver?.email ?? '');
    setPhone(driver?.phone ?? '');
  }, [driver?.email, driver?.phone]);

  async function saveProfile() {
    const newErrors = { email: validateEmail(email.trim()), phone: validatePhone(phone) };
    setErrors(newErrors);
    setMessage('');
    if (newErrors.email || newErrors.phone) return;

    setSaving(true);
    try {
      await updateDriverProfile(driverId, { email: email.trim().toLowerCase(), phone });
      setMessage('Datos guardados');
    } catch (error) {
      setMessage(`No se pudo guardar: ${error.message}`);
    } finally {
      setSaving(false);
    };
  };

  // Idioma: preferencia en AsyncStorage (sección 4 del PDF) y en Firestore
  async function changeLanguage(language) {
    await saveData(STORAGE_KEYS.LANGUAGE, language);
    await updateDriverProfile(driverId, { language });
  };

  async function logout() {
    await endSession();
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  const vehicle = driver?.vehicle ?? {};
  const documents = driver?.documents;
  const changed = email.trim() !== (driver?.email ?? '') || phone !== (driver?.phone ?? '');

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
      <View style={styles.header}>
        {driver?.photoUrl ? (
          <Image source={{ uri: driver.photoUrl }} style={styles.avatar} accessibilityIgnoresInvertColors />
        ) : (
          <View style={[styles.avatar, styles.avatarEmpty]}>
            <Ionicons name="person" size={36} color={colors.textSoft} />
          </View>
        )}
        <Text style={styles.name} accessibilityRole="header">{driver?.fullName}</Text>
        <Text style={styles.soft}>Documento {driver?.documentId}</Text>
      </View>

      <Text style={styles.section} accessibilityRole="header">Datos de contacto</Text>
      <FormField
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormField
        label="Número de celular"
        value={phone}
        onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
        error={errors.phone}
        keyboardType="phone-pad"
        maxLength={10}
      />
      {message ? <Text style={styles.message} accessibilityLiveRegion="polite">{message}</Text> : null}
      <AppButton title="Guardar cambios" onPress={saveProfile} loading={saving} disabled={!changed} />

      <Text style={styles.section} accessibilityRole="header">Vehículo</Text>
      <View style={styles.card}>
        <Row label="Placa" value={vehicle.plate} />
        <Row label="Marca y modelo" value={`${vehicle.brand ?? ''} ${vehicle.model ?? ''}`.trim()} />
        <Row label="Año" value={vehicle.year ? String(vehicle.year) : ''} />
        <Row label="Color" value={colorLabel(vehicle.color)} />
        <Row label="Categoría" value={categoryLabel(vehicle.category)} />
        <Row label="Pasajeros" value={vehicle.capacity ? String(vehicle.capacity) : ''} />
      </View>

      <Text style={styles.section} accessibilityRole="header">Documentos</Text>
      <View style={styles.card}>
        {documents ? (
          <>
            <Row label="Licencia vence" value={formatDate(documents.licenseExpiry)} />
            <Row label="SOAT vence" value={formatDate(documents.soatExpiry)} />
            <Row
              label="Revisión técnico-mecánica"
              value={documents.techReviewRequired ? `Vence ${formatDate(documents.techReviewExpiry)}` : 'No aplica'}
            />
          </>
        ) : (
          <Text style={styles.soft}>Este conductor se registró antes de la pestaña Documentos.</Text>
        )}
        <Row label="Comisión de la plataforma" value={`${Math.round((driver?.commissionRate ?? 0.2) * 100)} %`} />
      </View>

      <Text style={styles.section} accessibilityRole="header">Idioma</Text>
      <FilterChips label="Idioma" options={LANGUAGES} value={driver?.language ?? 'es'} onChange={changeLanguage} />

      <View style={styles.logout}>
        <AppButton title="Cerrar sesión" variant="outline" onPress={logout} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 6,
  },
  avatarEmpty: {
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  soft: {
    fontSize: 14,
    color: colors.textSoft,
  },
  section: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: colors.accent,
    textAlign: 'center',
    marginBottom: 8,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.textSoft,
  },
  rowValue: {
    flexShrink: 1,
    fontSize: 15,
    color: colors.text,
    textAlign: 'right',
  },
  logout: {
    marginTop: 28,
  },
});
