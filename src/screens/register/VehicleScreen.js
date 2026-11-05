// Pestaña 2 - Vehículo.
// Los datos se guardan en el contexto del registro; las validaciones vienen de utils/validators.js.
// AI-assisted: see docs/AI_LOG.md #3
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

import FormField from '../../components/form/FormField';
import ImageField from '../../components/form/ImageField';
import SelectField from '../../components/form/SelectField';
import { CATEGORIES, VEHICLE_COLORS } from '../../constants/options';
import { useRegister } from '../../context/RegisterContext';
import { colors } from '../../theme/colors';

const onlyDigits = (text) => text.replace(/[^0-9]/g, '');

// La placa se muestra en mayúsculas y sin espacios mientras se escribe
const cleanPlate = (text) => text.toUpperCase().replace(/[^A-Z0-9]/g, '');

export default function VehicleScreen() {
  // CONCEPTO: useContext. Leemos y cambiamos los datos compartidos del registro.
  const { vehicle, updateVehicle, vehicleErrors, getError } = useRegister();

  const errorOf = (field) => getError(vehicleErrors, field);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Vehículo</Text>
        <Text style={styles.subtitle}>Todos los campos son obligatorios.</Text>

        <SelectField
          label="Categoría"
          value={vehicle.category}
          onChange={(value) => updateVehicle('category', value)}
          options={CATEGORIES}
          error={errorOf('category')}
        />

        <FormField
          label="Placa"
          placeholder="ABC123"
          value={vehicle.plate}
          onChangeText={(text) => updateVehicle('plate', cleanPlate(text))}
          error={errorOf('plate')}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={6}
        />

        <FormField
          label="Marca"
          placeholder="Ej. Chevrolet"
          value={vehicle.brand}
          onChangeText={(text) => updateVehicle('brand', text)}
          error={errorOf('brand')}
          maxLength={30}
        />

        <FormField
          label="Modelo"
          placeholder="Ej. Onix"
          value={vehicle.model}
          onChangeText={(text) => updateVehicle('model', text)}
          error={errorOf('model')}
          maxLength={30}
        />

        <FormField
          label="Año"
          placeholder={`Ej. ${new Date().getFullYear() - 3}`}
          value={vehicle.year}
          onChangeText={(text) => updateVehicle('year', onlyDigits(text))}
          error={errorOf('year')}
          keyboardType="number-pad"
          maxLength={4}
        />

        <SelectField
          label="Color"
          value={vehicle.color}
          onChange={(value) => updateVehicle('color', value)}
          options={VEHICLE_COLORS}
          error={errorOf('color')}
        />

        <FormField
          label="Capacidad de pasajeros"
          placeholder={vehicle.category === 'xl' ? 'Mínimo 6' : 'Ej. 4'}
          value={vehicle.capacity}
          onChangeText={(text) => updateVehicle('capacity', onlyDigits(text))}
          error={errorOf('capacity')}
          keyboardType="number-pad"
          maxLength={2}
        />

        <ImageField
          label="Foto del vehículo"
          hint="Toma la foto de modo que se vea la placa."
          value={vehicle.vehiclePhoto}
          onChange={(uri) => updateVehicle('vehiclePhoto', uri)}
          error={errorOf('vehiclePhoto')}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSoft,
    marginTop: 4,
    marginBottom: 20,
  },
});