// Servicio de Cloudinary: sube una foto y devuelve su URL.
// En Firestore no se guarda la imagen, solo la URL que entrega Cloudinary.
// AI-assisted: see docs/AI_LOG.md #1
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_URL } from '../config/cloudinary';

// CONCEPTO: método asincrónico con async/await y fetch
// uri: ruta local de la foto (la que da expo-image-picker); folder: carpeta en Cloudinary
export const uploadImage = async (uri, folder) => {
  const formData = new FormData();
  formData.append('file', { uri, type: 'image/jpeg', name: `${folder}-${Date.now()}.jpg` });
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', `uberclone/${folder}`);

  const response = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });

  // CONCEPTO: si la respuesta no es ok, lanzamos una excepción con el código de response.status
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status} al subir la imagen`);
  };

  const data = await response.json();
  return data.secure_url;
};
