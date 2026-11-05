// Pestaña 1 - Datos personales.
//Ai- assisted: see docs/AI_LOG.md #
import React, { useRef } from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';

import DateField from '../../components/form/DateField';
import FormField from '../../components/form/FormField';
import ImageField from '../../components/form/ImageField';
import SelectField from '../../components/form/SelectField';
import {GENDERS, LANGUAGES} from '../../constants/options';
import {STORAGE_KEYS} from '../../constants/storageKeys';
import { useRegister } from '../../context/RegisterContext';
import { saveData } from '../../services/asyncStorage';
import { colors } from '../../theme/colors';

// Se deja solo los numeros de lo que escriba  el usuario
const onlyDigits = (text) => text.replace(/[^0-9]/g,'');

export default function PersonalDataScreen(){
  //CONCEPTO:  useContext: Leemos  y cambiamos  los datos  compartidos del registro.
  const { personal, updatePersonal, personalErrors, getError } = useRegister();

  //Error de un campo: solo se muestra  si ya lo tocó o si lo intentó enviar 
  const  errorOf  = (field) => getError(personalErrors,field);

  // Referencias para pasar al siguiente campo con el botón "Siguiente" del teclado
  const documentRef = useRef(null);
  const phoneRef = useRef(null);

  // El idioma es una preferencia: además del registro, se guarda   en AsyncStorage
  function handleLanguage(value) {
    updatePersonal('language', value);
    if (value)saveData(STORAGE_KEYS.LANGUAGE, value);
  };
  return(
      // iOS ajusta solo el scroll cuando aparece el teclado; se puede cerrar arrastrando hacia abajo
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
      >
        <Text style={styles.title} accessibilityRole="header">Datos personales</Text>
        <Text style={styles.subtitle}>Todos los campos son obligatorios.</Text>

        <ImageField
          label="Foto de perfil"
          hint="Una foto clara de tu cara, sin gafas oscuras."
          value={personal.photo}
          onChange={(uri) => updatePersonal('photo', uri)}
          error={errorOf('photo')}
          round
        />

        <FormField
          label="Nombre completo"
          placeholder="Ej. Laura Gómez Ríos"
          value={personal.fullName}
          onChangeText={(text) => updatePersonal('fullName', text)}
          error={errorOf('fullName')}
          maxLength={50}
          autoCapitalize="words"
          textContentType="name"
          autoComplete="name"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => documentRef.current?.focus()}
        />

        <FormField
          ref={documentRef}
          label="Documento de identidad"
          placeholder="Entre 6 y 10 dígitos"
          value={personal.documentId}
          onChangeText={(text) => updatePersonal('documentId', onlyDigits(text))}
          error={errorOf('documentId')}
          keyboardType="number-pad"
          maxLength={10}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => phoneRef.current?.focus()}
        />

        <FormField
          ref={phoneRef}
          label="Número de celular"
          placeholder="Ej. 3001234567"
          value={personal.phone}
          onChangeText={(text) => updatePersonal('phone', onlyDigits(text))}
          error={errorOf('phone')}
          keyboardType="phone-pad"
          maxLength={10}
          textContentType="telephoneNumber"
          autoComplete="tel"
        />

        <DateField
          label="Fecha de nacimiento"
          value={personal.birthDate}
          onChange={(date) => updatePersonal('birthDate', date)}
          error={errorOf('birthDate')}
          maximumDate={new Date()}
          minimumDate={new Date(1940, 0, 1)}
        />

        <SelectField
          label="Género"
          value={personal.gender}
          onChange={(value) => updatePersonal('gender', value)}
          options={GENDERS}
          error={errorOf('gender')}
        />

        <FormField
          label="Correo electrónico"
          placeholder="nombre@correo.com"
          value={personal.email}
          onChangeText={(text) => updatePersonal('email', text.trim())}
          error={errorOf('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          autoComplete="email"
          returnKeyType="done"
        />

        <SelectField
          label="Idioma"
          value={personal.language}
          onChange={handleLanguage}
          options={LANGUAGES}
          error={errorOf('language')}
        />
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
    marginBottom: 20,
  },
});