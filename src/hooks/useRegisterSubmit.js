// Hook que envía el registro: sube las fotos a Cloudinary, guarda el conductor en Firestore
// con estado Pendiente y guarda su id en AsyncStorage (sesión).
// AI-assisted: see docs/AI_LOG.md #3
// AI-assisted: see docs/AI_LOG.md #8 (pestaña 3: fotos y datos de documentos)
import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { PRICING } from '../config/pricing';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { useRegister } from '../context/RegisterContext';
import { saveData } from '../services/asyncStorage';
import { uploadImage } from '../services/cloudinaryService';
import { createDriver } from '../services/driverService';
import { needsTechReview, normalizePlate } from '../utils/validators';

export default function useRegisterSubmit() {
  const navigation = useNavigation();
  const {
    personal, vehicle, documents, isPersonalValid, isVehicleValid, isDocumentsValid, setShowAllErrors,
  } = useRegister();

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // CONCEPTO: useCallback. La función solo se vuelve a crear si cambian sus dependencias.
  const submit = useCallback(async () => {
    // Si algo falta, mostramos todos los errores debajo de los campos y no enviamos
    setShowAllErrors(true);
    if (!isPersonalValid || !isVehicleValid || !isDocumentsValid) return;

    setLoading(true);
    setSubmitError('');

    try {
      const techReviewRequired = needsTechReview(vehicle.year);

      // 1. Subir todas las fotos al mismo tiempo; Cloudinary devuelve sus URL.
      //    La de la revisión técnico-mecánica solo se sube si aplica (si no, queda null).
      const [photoUrl, vehiclePhotoUrl, licensePhotoUrl, soatPhotoUrl, techReviewPhotoUrl] = await Promise.all([
        uploadImage(personal.photo, 'perfil'),
        uploadImage(vehicle.vehiclePhoto, 'vehiculo'),
        uploadImage(documents.licensePhoto, 'documentos'),
        uploadImage(documents.soatPhoto, 'documentos'),
        techReviewRequired ? uploadImage(documents.techReviewPhoto, 'documentos') : Promise.resolve(null),
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
        documents: {
          licenseNumber: documents.licenseNumber,
          licenseExpiry: documents.licenseExpiry,
          licensePhotoUrl,
          soatExpiry: documents.soatExpiry,
          soatPhotoUrl,
          techReviewRequired,
          techReviewExpiry: techReviewRequired ? documents.techReviewExpiry : null,
          techReviewPhotoUrl,
        },
        // Pagos: solo el correo de Mercado Pago (nunca cuentas bancarias ni tarjetas)
        mercadoPagoEmail: documents.mercadoPagoEmail.trim().toLowerCase(),
        // Comisión que aceptó al registrarse y cuándo la aceptó
        commissionRate: PRICING.COMMISSION_RATE,
        termsAcceptedAt: new Date(),
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
  }, [personal, vehicle, documents, isPersonalValid, isVehicleValid, isDocumentsValid, setShowAllErrors, navigation]);

  return { submit, loading, submitError };
};