// Servicio de AsyncStorage: guardar, obtener y eliminar datos locales del celular.
// Solo para preferencias y sesión (idioma, id del conductor, disponibilidad). Nunca datos sensibles.
// AI-assisted: see docs/AI_LOG.md #1
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key, value) => {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
  } catch (error) {
    console.log('Error al guardar', error);
  };
};

export const getData = async (key) => {
  try {
    const json = await AsyncStorage.getItem(key);
    return json != null ? JSON.parse(json) : null;
  } catch (error) {
    console.log('Error al obtener', error);
    return null;
  };
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Error al eliminar', error);
  };
};
