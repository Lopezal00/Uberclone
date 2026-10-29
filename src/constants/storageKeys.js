// Llaves de AsyncStorage. Solo preferencias y sesión, nunca datos sensibles.

export const STORAGE_KEYS = {
  DRIVER_ID: '@uberclone/driverId', // id del conductor registrado (sesión)
  LANGUAGE: '@uberclone/language', // idioma elegido: 'es' | 'en'
  LAST_AVAILABILITY: '@uberclone/lastAvailability', // último estado Disponible / No disponible
};
