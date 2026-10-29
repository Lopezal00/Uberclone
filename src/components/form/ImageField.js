// Foto obligatoria desde cámara o galería, con vista previa y error debajo.
// Devuelve la uri local; la subida a Cloudinary se hace al enviar el registro.
// AI-assisted: see docs/AI_LOG.md #1
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { colors } from '../../theme/colors';

const PICKER_OPTIONS = { mediaTypes: ['images'], quality: 0.6, allowsEditing: true };

export default function ImageField({ label, hint, error, value, onChange, round = false }) {
  const [permissionError, setPermissionError] = useState('');

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setPermissionError('Activa el permiso de cámara en la configuración del celular');
      return;
    };
    setPermissionError('');
    const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  async function pickFromGallery() {
    const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  const message = permissionError || error;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}

      <View style={styles.row}>
        {/* CONCEPTO: Image remota o local con width y height explícitos */}
        {value ? (
          <Image source={{ uri: value }} style={[styles.preview, round && styles.round]} />
        ) : (
          <View style={[styles.preview, styles.empty, round && styles.round, message ? styles.emptyError : null]}>
            <Text style={styles.emptyText}>Sin foto</Text>
          </View>
        )}

        <View style={styles.buttons}>
          <Pressable onPress={takePhoto} style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}>
            <Text style={styles.smallButtonText}>Tomar foto</Text>
          </Pressable>
          <Pressable onPress={pickFromGallery} style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}>
            <Text style={styles.smallButtonText}>Elegir de la galería</Text>
          </Pressable>
        </View>
      </View>

      {message ? <Text style={styles.error}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    color: colors.textSoft,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preview: {
    width: 96,
    height: 96,
    borderRadius: 12,
  },
  round: {
    borderRadius: 48,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  emptyError: {
    borderColor: colors.error,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textSoft,
  },
  buttons: {
    flex: 1,
    gap: 8,
  },
  smallButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  smallButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  error: {
    marginTop: 4,
    fontSize: 13,
    color: colors.error,
  },
});
