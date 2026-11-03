// Hook que envía el registro: sube las fotos a Cloudinary, guarda el conductor en Firestore
// con estado Pendiente y guarda su id en AsyncStorage (sesión).
// AI-assisted: see docs/AI_LOG.md #3
import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { STORAGE_KEYS } from '../constants/storageKeys';
import { useRegister } from '../context/RegisterContext';
import { saveData } from '../services/asyncStorage';
import { uploadImage } from '../services/cloudinaryService';
import { createDriver } from '../services/driverService';
import { normalizePlate } from '../utils/validators';

export default function useRegisterSubmit() {
  const navigation = useNavigation();
  const { personal, vehicle, isPersonalValid, isVehicleValid, setShowAllErrors } = useRegister();

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // CONCEPTO: useCallback. La función solo se vuelve a crear si cambian sus dependencias.
  const submit = useCallback(async () => {
    // Si algo falta, mostramos todos los errores debajo de los campos y no enviamos
    setShowAllErrors(true);
    if (!isPersonalValid || !isVehicleValid) return;

    setLoading(true);
    setSubmitError('');

    try {
      // 1. Subir las dos fotos al mismo tiempo; Cloudinary devuelve sus URL
      const [photoUrl, vehiclePhotoUrl] = await Promise.all([
        uploadImage(personal.photo, 'perfil'),
        uploadImage(vehicle.vehiclePhoto, 'vehiculo'),
      ]);

      // 2. Guardar en Firestore solo URL y datos limpios (nunca la imagen)
      const driverId = await createDriver({
        fullName: personal.fullName.trim(),
        documentId: personal.documentId,
        phone: personal.phone,
        birthDate: personal.birthDate,
        gender: personal.gender,
        email: personal.email.trim().toLowerCase(),
        language: personal.language,
        photoUrl,
        vehicle: {
          category: vehicle.category,
          plate: normalizePlate(vehicle.plate),
          brand: vehicle.brand.trim(),
          model: vehicle.model.trim(),
          year: Number(vehicle.year),
          color: vehicle.color,
          capacity: Number(vehicle.capacity),
          photoUrl: vehiclePhotoUrl,
        },
      });

      // 3. Sesión: guardamos el id para que al abrir la app vaya directo a la cuenta pendiente
      await saveData(STORAGE_KEYS.DRIVER_ID, driverId);

      // 4. Reemplazamos el registro por la pantalla de cuenta pendiente (no se puede volver atrás)
      navigation.reset({ index: 0, routes: [{ name: 'PendingApproval' }] });
    } catch (error) {
      console.log('Error al enviar el registro', error);
      setSubmitError('No pudimos enviar el registro. Revisa tu conexión e intenta de nuevo.');
    } finally {
      setLoading(false);
    };
  }, [personal, vehicle, isPersonalValid, isVehicleValid, setShowAllErrors, navigation]);

  return { submit, loading, submitError };
};