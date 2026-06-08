import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Simulation } from '../types/cityorbit';
import { StorageService } from '../storage/storage';

interface FavoritesContextData {
  favorites: Simulation[];
  addFavorite: (sim: Simulation) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    StorageService.getFavorites().then((data) => {
      setFavorites(data);
      setLoading(false);
    });
  }, []);

  const addFavorite = useCallback(
    async (sim: Simulation) => {
      const updated = [sim, ...favorites.filter((f) => f.id !== sim.id)];
      setFavorites(updated);
      await StorageService.saveFavorites(updated);
    },
    [favorites]
  );

  const removeFavorite = useCallback(
    async (id: string) => {
      const updated = favorites.filter((f) => f.id !== id);
      setFavorites(updated);
      await StorageService.saveFavorites(updated);
    },
    [favorites]
  );

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextData {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be inside FavoritesProvider');
  return ctx;
}
