// Pestaña 3 - Documentos y pagos.
// Los datos se guardan en el contexto del registro; las validaciones vienen de utils/validators.js.
// No se piden números de cuenta ni de tarjeta: los datos sensibles los maneja la pasarela de pago.
// AI-assisted: see docs/AI_LOG.md #8
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import CheckboxField from '../../components/form/CheckboxField';
import DateField from '../../components/form/DateField';
import FormField from '../../components/form/FormField';
import ImageField from '../../components/form/ImageField';
import { PRICING } from '../../config/pricing';
import { useRegister } from '../../context/RegisterContext';
import { colors } from '../../theme/colors';
import { needsTechReview, TECH_REVIEW_AFTER_YEARS } from '../../utils/validators';

const onlyDigits = (text) => text.replace(/[^0-9]/g, '');

// La comisión se lee de config/pricing.js: si cambia allá, cambia aquí también
const COMMISSION_PERCENT = Math.round(PRICING.COMMISSION_RATE * 100);

// Mañana: la primera fecha de vencimiento válida
const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
};

export default function DocumentsScreen() {
  // CONCEPTO: useContext. Leemos y cambiamos los datos compartidos del registro.
  const { documents, vehicle, updateDocuments, documentsErrors, getError } = useRegister();

  const errorOf = (field) => getError(documentsErrors, field);

  // La revisión técnico-mecánica depende del año que escribió en la pestaña Vehículo
  const techReviewRequired = needsTechReview(vehicle.year);

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      automaticallyAdjustKeyboardInsets
    >
      <Text style={styles.title} accessibilityRole="header">Documentos y pagos</Text>
      <Text style={styles.subtitle}>Las fechas de vencimiento deben ser posteriores a hoy.</Text>

      {/* ---------- Licencia de conducción ---------- */}
      <Text style={styles.section} accessibilityRole="header">Licencia de conducción</Text>

      <FormField
        label="Número de licencia"
        placeholder="Ej. 1023456789"
        value={documents.licenseNumber}
        onChangeText={(text) => updateDocuments('licenseNumber', onlyDigits(text))}
        error={errorOf('licenseNumber')}
        keyboardType="number-pad"
        maxLength={12}
      />

      <DateField
        label="Vencimiento de la licencia"
        value={documents.licenseExpiry}
        onChange={(date) => updateDocuments('licenseExpiry', date)}
        minimumDate={tomorrow()}
        error={errorOf('licenseExpiry')}
      />

      <ImageField
        label="Foto de la licencia"
        hint="Que se lea el número y la fecha."
        value={documents.licensePhoto}
        onChange={(uri) => updateDocuments('licensePhoto', uri)}
        error={errorOf('licensePhoto')}
      />

      {/* ---------- SOAT ---------- */}
      <Text style={styles.section} accessibilityRole="header">SOAT</Text>

      <DateField
        label="Vencimiento del SOAT"
        value={documents.soatExpiry}
        onChange={(date) => updateDocuments('soatExpiry', date)}
        minimumDate={tomorrow()}
        error={errorOf('soatExpiry')}
      />

      <ImageField
        label="Foto del SOAT"
        value={documents.soatPhoto}
        onChange={(uri) => updateDocuments('soatPhoto', uri)}
        error={errorOf('soatPhoto')}
      />

      {/* ---------- Revisión técnico-mecánica (solo si aplica) ---------- */}
      <Text style={styles.section} accessibilityRole="header">Revisión técnico-mecánica</Text>

      {techReviewRequired ? (
        <>
          <DateField
            label="Vencimiento de la revisión"
            value={documents.techReviewExpiry}
            onChange={(date) => updateDocuments('techReviewExpiry', date)}
            minimumDate={tomorrow()}
            error={errorOf('techReviewExpiry')}
          />
          <ImageField
            label="Foto de la revisión"
            value={documents.techReviewPhoto}
            onChange={(uri) => updateDocuments('techReviewPhoto', uri)}
            error={errorOf('techReviewPhoto')}
          />
        </>
      ) : (
        <View style={styles.info}>
          <Text style={styles.infoText}>
            {vehicle.year
              ? `Tu vehículo tiene menos de ${TECH_REVIEW_AFTER_YEARS} años: todavía no necesita revisión técnico-mecánica.`
              : 'Escribe el año del vehículo en la pestaña Vehículo para saber si necesitas la revisión.'}
          </Text>
        </View>
      )}

      {/* ---------- Pagos ---------- */}
      <Text style={styles.section} accessibilityRole="header">Pagos</Text>

      <FormField
        label="Correo de tu cuenta de Mercado Pago"
        placeholder="nombre@correo.com"
        value={documents.mercadoPagoEmail}
        onChangeText={(text) => updateDocuments('mercadoPagoEmail', text)}
        error={errorOf('mercadoPagoEmail')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
      />
      <Text style={styles.note}>Aquí recibirías tus pagos. Nunca te pediremos números de cuenta ni de tarjeta.</Text>

      <CheckboxField
        checked={documents.termsAccepted}
        onChange={(value) => updateDocuments('termsAccepted', value)}
        error={errorOf('termsAccepted')}
      >
        Acepto los términos y condiciones. La plataforma cobra una comisión del{' '}
        <Text style={styles.bold}>{COMMISSION_PERCENT} %</Text> sobre la tarifa de cada viaje; las propinas son
        completas para mí.
      </CheckboxField>
    </ScrollView>
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
    marginBottom: 12,
  },
  section: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 12,
  },
  info: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
  },
  note: {
    fontSize: 13,
    color: colors.textSoft,
    marginTop: -8,
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
});