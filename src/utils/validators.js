// Validaciones del registro del conductor. Funciones puras: reciben un valor y devuelven
// el mensaje de error, o '' si el valor es válido. Así se pueden reutilizar y probar fácil.
// AI-assisted: see docs/AI_LOG.md #1
import { CATEGORIES } from '../constants/options';

const ONLY_LETTERS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PLATE_CAR = /^[A-Z]{3}[0-9]{3}$/; // formato colombiano para carro: ABC123

// Ningún campo puede quedar vacío
export const required = (value, message = 'Este campo es obligatorio') => {
  if (value === null || value === undefined) return message;
  if (typeof value === 'string' && value.trim() === '') return message;
  return '';
};

// Edad cumplida a hoy, a partir de la fecha de nacimiento
export const getAge = (birthDate) => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayNotYet =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
  if (birthdayNotYet) age = age - 1;
  return age;
};

// La placa se pasa a mayúsculas y sin espacios ANTES de validar
export const normalizePlate = (plate) => plate.toUpperCase().replace(/\s/g, '');

// ---------- Pestaña 1: Datos personales ----------

export const validateFullName = (value) => {
  const name = value.trim();
  if (!name) return 'Escribe tu nombre completo';
  if (name.length > 50) return 'Máximo 50 caracteres';
  if (!ONLY_LETTERS.test(name)) return 'Solo se permiten letras y espacios';
  return '';
};

export const validateDocumentId = (value) => {
  if (!value) return 'Escribe tu documento de identidad';
  if (!/^[0-9]+$/.test(value)) return 'Solo se permiten números';
  if (value.length < 6 || value.length > 10) return 'Debe tener entre 6 y 10 dígitos';
  return '';
};

export const validatePhone = (value) => {
  if (!value) return 'Escribe tu número de celular';
  if (!/^[0-9]{10}$/.test(value)) return 'Debe tener 10 dígitos';
  return '';
};

export const validateBirthDate = (value) => {
  if (!value) return 'Selecciona tu fecha de nacimiento';
  if (getAge(value) < 18) return 'Debes ser mayor de 18 años';
  return '';
};

export const validateEmail = (value) => {
  const email = value.trim();
  if (!email) return 'Escribe tu correo electrónico';
  if (!EMAIL.test(email)) return 'Escribe un correo válido, por ejemplo nombre@correo.com';
  return '';
};

// Devuelve un objeto con el error de cada campo de la pestaña 1
export const validatePersonal = (data) => ({
  photo: required(data.photo, 'Agrega una foto de perfil'),
  fullName: validateFullName(data.fullName),
  documentId: validateDocumentId(data.documentId),
  phone: validatePhone(data.phone),
  birthDate: validateBirthDate(data.birthDate),
  gender: required(data.gender, 'Selecciona un género'),
  email: validateEmail(data.email),
  language: required(data.language, 'Selecciona un idioma'),
});

// ---------- Pestaña 2: Vehículo ----------

export const validatePlate = (value) => {
  const plate = normalizePlate(value);
  if (!plate) return 'Escribe la placa';
  if (!PLATE_CAR.test(plate)) return 'Formato de placa: ABC123';
  return '';
};

export const validateShortText = (value, field) => {
  const text = value.trim();
  if (!text) return `Escribe la ${field}`;
  if (text.length > 30) return 'Máximo 30 caracteres';
  return '';
};

export const validateYear = (value) => {
  if (!value) return 'Escribe el año del vehículo';
  if (!/^[0-9]{4}$/.test(value)) return 'Debe tener 4 dígitos';
  const year = Number(value);
  // Indicación de la profe: se acepta hasta un año más que el actual,
  // porque los carros nuevos se venden con el modelo del año siguiente (ej. en 2026 un modelo 2027)
  const maxYear = new Date().getFullYear() + 1;
  if (year > maxYear) return `No puede ser mayor a ${maxYear}`;
  if (year < 1950) return 'Escribe un año válido';
  return '';
};

export const validateCapacity = (value, category) => {
  if (!value) return 'Escribe la capacidad de pasajeros';
  if (!/^[0-9]+$/.test(value)) return 'Solo se permiten números';
  const capacity = Number(value);
  if (capacity < 1) return 'Debe ser al menos 1';
  const selected = CATEGORIES.find((item) => item.value === category);
  if (selected && capacity < selected.minCapacity) {
    return `La categoría ${selected.label} exige mínimo ${selected.minCapacity} pasajeros`;
  };
  return '';
};

// Devuelve un objeto con el error de cada campo de la pestaña 2
export const validateVehicle = (data) => ({
  category: required(data.category, 'Selecciona una categoría'),
  plate: validatePlate(data.plate),
  brand: validateShortText(data.brand, 'marca'),
  model: validateShortText(data.model, 'línea o modelo'),
  year: validateYear(data.year),
  color: required(data.color, 'Selecciona un color'),
  capacity: validateCapacity(data.capacity, data.category),
  vehiclePhoto: required(data.vehiclePhoto, 'Agrega una foto del vehículo donde se vea la placa'),
});

// ---------- Pestaña 3: Documentos y pagos ----------
// AI-assisted: see docs/AI_LOG.md #8

// Un carro particular en Colombia hace su primera revisión técnico-mecánica a los 5 años de matriculado
export const TECH_REVIEW_AFTER_YEARS = 5;

// ¿El vehículo necesita revisión técnico-mecánica según su año?
export const needsTechReview = (vehicleYear) => {
  const year = Number(vehicleYear);
  if (!year) return false; // si aún no escribe el año, no la pedimos
  return new Date().getFullYear() - year >= TECH_REVIEW_AFTER_YEARS;
};

// La fecha de vencimiento debe ser posterior a hoy (desde mañana en adelante)
export const validateExpiryDate = (value, document) => {
  if (!value) return `Selecciona la fecha de vencimiento ${document}`;
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  if (value <= endOfToday) return 'Está vencido o vence hoy: la fecha debe ser posterior a hoy';
  return '';
};

export const validateLicenseNumber = (value) => {
  if (!value) return 'Escribe el número de la licencia';
  if (!/^[0-9]+$/.test(value)) return 'Solo se permiten números';
  if (value.length < 6 || value.length > 12) return 'Debe tener entre 6 y 12 dígitos';
  return '';
};

// Devuelve un objeto con el error de cada campo de la pestaña 3.
// vehicleYear viene de la pestaña 2: decide si la revisión técnico-mecánica es obligatoria.
export const validateDocuments = (data, vehicleYear) => {
  const techReviewRequired = needsTechReview(vehicleYear);
  return {
    licenseNumber: validateLicenseNumber(data.licenseNumber),
    licenseExpiry: validateExpiryDate(data.licenseExpiry, 'de la licencia'),
    licensePhoto: required(data.licensePhoto, 'Agrega una foto de la licencia'),
    soatExpiry: validateExpiryDate(data.soatExpiry, 'del SOAT'),
    soatPhoto: required(data.soatPhoto, 'Agrega una foto del SOAT'),
    techReviewExpiry: techReviewRequired ? validateExpiryDate(data.techReviewExpiry, 'de la revisión') : '',
    techReviewPhoto: techReviewRequired ? required(data.techReviewPhoto, 'Agrega una foto de la revisión técnico-mecánica') : '',
    mercadoPagoEmail: validateEmail(data.mercadoPagoEmail),
    termsAccepted: data.termsAccepted ? '' : 'Debes aceptar los términos para continuar',
  };
};

// Un objeto de errores es válido si ninguno tiene mensaje
export const isValid = (errors) => Object.values(errors).every((message) => message === '');