// Contexto del registro: guarda los datos de las pestañas para que todas los compartan
// y para que el botón Enviar registro sepa si todo está completo.

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { isValid, validateDocuments, validatePersonal, validateVehicle } from '../utils/validators';

// CONCEPTO: useContext. Se crea el contexto y un Provider que envuelve la app.
export const RegisterContext = createContext(null);

const INITIAL_PERSONAL = {
  photo: null, // uri local de la foto
  fullName: '',
  documentId: '',
  phone: '',
  birthDate: null, // objeto Date
  gender: '',
  email: '',
  language: 'es',
};

const INITIAL_VEHICLE = {
  category: '',
  plate: '',
  brand: '',
  model: '',
  year: '',
  color: '',
  capacity: '',
  vehiclePhoto: null,
};

// AI-assisted: see docs/AI_LOG.md #8
const INITIAL_DOCUMENTS = {
  licenseNumber: '',
  licenseExpiry: null, // objeto Date
  licensePhoto: null,
  soatExpiry: null,
  soatPhoto: null,
  techReviewExpiry: null, // solo si el vehículo tiene 5 años o más
  techReviewPhoto: null,
  mercadoPagoEmail: '', // correo donde recibiría sus pagos (nunca números de cuenta ni tarjeta)
  termsAccepted: false,
};

export function RegisterProvider({ children }) {
  // CONCEPTO: useState para los formularios
  const [personal, setPersonal] = useState(INITIAL_PERSONAL);
  const [vehicle, setVehicle] = useState(INITIAL_VEHICLE);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  // Campos que el usuario ya tocó: solo a esos les mostramos el error
  const [touched, setTouched] = useState({});
  // Si intentó enviar, mostramos todos los errores
  const [showAllErrors, setShowAllErrors] = useState(false);

  // Cambia un campo de la pestaña 1 y lo marca como tocado
  const updatePersonal = useCallback((field, value) => {
    setPersonal((previous) => ({ ...previous, [field]: value }));
    setTouched((previous) => ({ ...previous, [field]: true }));
  }, []);

  // Cambia un campo de la pestaña 2 y lo marca como tocado
  const updateVehicle = useCallback((field, value) => {
    setVehicle((previous) => ({ ...previous, [field]: value }));
    setTouched((previous) => ({ ...previous, [field]: true }));
  }, []);

  // Cambia un campo de la pestaña 3 y lo marca como tocado
  const updateDocuments = useCallback((field, value) => {
    setDocuments((previous) => ({ ...previous, [field]: value }));
    setTouched((previous) => ({ ...previous, [field]: true }));
  }, []);

  // CONCEPTO: useMemo. Los errores solo se recalculan cuando cambian los datos.
  const personalErrors = useMemo(() => validatePersonal(personal), [personal]);
  const vehicleErrors = useMemo(() => validateVehicle(vehicle), [vehicle]);
  // La pestaña 3 depende del año del vehículo (revisión técnico-mecánica)
  const documentsErrors = useMemo(() => validateDocuments(documents, vehicle.year), [documents, vehicle.year]);

  const isPersonalValid = isValid(personalErrors);
  const isVehicleValid = isValid(vehicleErrors);
  const isDocumentsValid = isValid(documentsErrors);

  // Error que se muestra debajo de un campo (vacío si aún no lo ha tocado)
  const getError = useCallback(
    (errors, field) => (showAllErrors || touched[field] ? errors[field] : ''),
    [showAllErrors, touched]
  );

  const value = useMemo(
    () => ({
      personal,
      vehicle,
      documents,
      updatePersonal,
      updateVehicle,
      updateDocuments,
      personalErrors,
      vehicleErrors,
      documentsErrors,
      isPersonalValid,
      isVehicleValid,
      isDocumentsValid,
      getError,
      setShowAllErrors,
    }),
    [
      personal, vehicle, documents, updatePersonal, updateVehicle, updateDocuments,
      personalErrors, vehicleErrors, documentsErrors, isPersonalValid, isVehicleValid, isDocumentsValid, getError,
    ]
  );

  return <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>;
}; // fin RegisterProvider

// Hook para usar el contexto en cualquier pantalla: const { personal } = useRegister();
export const useRegister = () => useContext(RegisterContext);