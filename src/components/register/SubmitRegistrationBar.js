// Barra fija con el botón Enviar registro, visible en todas las pestañas.
// El botón solo se habilita cuando las pestañas están completas y válidas.
// AI-assisted: see docs/AI_LOG.md #3
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AppButton from '../AppButton';
import { useRegister } from '../../context/RegisterContext';
import { colors } from '../../theme/colors';

// onSubmit: función que envía el registro. loading: muestra el indicador. submitError: error al enviar.
export default function SubmitRegistrationBar({ onSubmit, loading, submitError }) {
  const { isPersonalValid, isVehicleValid, isDocumentsValid } = useRegister();

  // AI-assisted: see docs/AI_LOG.md #8
  // Solo se puede enviar cuando las TRES pestañas están completas y válidas
  const canSubmit = isPersonalValid && isVehicleValid && isDocumentsValid;

  // Le dice al conductor qué pestañas le faltan, por ejemplo: "Completa Vehículo y Documentos"
  const pending = [];
  if (!isPersonalValid) pending.push('Datos personales');
  if (!isVehicleValid) pending.push('Vehículo');
  if (!isDocumentsValid) pending.push('Documentos');
  let missing = '';
  if (pending.length === 1) missing = `Completa ${pending[0]}`;
  if (pending.length > 1) missing = `Completa ${pending.slice(0, -1).join(', ')} y ${pending[pending.length - 1]}`;

  return (
    <View style={styles.bar}>
      {submitError ? <Text style={styles.error}>{submitError}</Text> : null}
      {!canSubmit ? <Text style={styles.hint}>{missing}</Text> : null}
      <AppButton title="Enviar registro" onPress={onSubmit} disabled={!canSubmit} loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  hint: {
    fontSize: 13,
    color: colors.textSoft,
    textAlign: 'center',
  },
  error: {
    fontSize: 13,
    color: colors.error,
    textAlign: 'center',
  },
});