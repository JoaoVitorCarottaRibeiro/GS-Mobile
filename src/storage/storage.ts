import AsyncStorage from '@react-native-async-storage/async-storage';
import { City, Simulation } from '../types/cityorbit';

const KEYS = {
  FAVORITES:   '@cityorbit:favorites_v2',
  CITIES:      '@cityorbit:cities_v2',
  SIMULATIONS: '@cityorbit:simulations_v2',
  THEME:       '@cityorbit:theme',
} as const;

async function get<T>(key: string): Promise<T[]> {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

async function set<T>(key: string, value: T[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`StorageService set(${key}):`, e);
  }
}

export class StorageService {

  static getFavorites   = () => get<Simulation>(KEYS.FAVORITES);
  static saveFavorites  = (v: Simulation[]) => set(KEYS.FAVORITES, v);

  static getCities      = () => get<City>(KEYS.CITIES);
  static saveCities     = (v: City[]) => set(KEYS.CITIES, v);

  static getSimulations = () => get<Simulation>(KEYS.SIMULATIONS);
  static saveSimulations= (v: Simulation[]) => set(KEYS.SIMULATIONS, v);

  static async getTheme(): Promise<'dark' | 'light' | null> {
    try {
      const val = await AsyncStorage.getItem(KEYS.THEME);
      return val === 'light' ? 'light' : val === 'dark' ? 'dark' : null;
    } catch { return null; }
  }
  static async saveTheme(theme: 'dark' | 'light'): Promise<void> {
    try { await AsyncStorage.setItem(KEYS.THEME, theme); }
    catch (e) { console.error('StorageService.saveTheme:', e); }
  }

  static async clearAll(): Promise<void> {
    try { await AsyncStorage.multiRemove(Object.values(KEYS)); }
    catch (e) { console.error('StorageService.clearAll:', e); }
  }
}
