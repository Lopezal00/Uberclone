// Configuración de Cloudinary (fotos de perfil, vehículo y documentos).
// Usamos un "upload preset" sin firma, así la app no necesita la llave secreta.

export const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// CONCEPTO: constante con la URL base de la API
export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
