import React, {
  createContext, useContext, useState,
  useEffect, useCallback, ReactNode,
} from 'react';
import { City, Simulation, SimulationType, SimulationStatus } from '../types/cityorbit';
import { StorageService } from '../storage/storage';
import { MOCK_CITIES, MOCK_SIMULATIONS } from '../utils/mockData';

type CityInput = Omit<City, 'id' | 'simulationCount'>;
type SimInput  = Omit<Simulation, 'id' | 'createdAt' | 'city'> & { cityId: string };

interface DataContextData {
  cities:      City[];
  simulations: Simulation[];
  loading:     boolean;

  addCity:     (input: CityInput)      => Promise<void>;
  updateCity:  (city: City)            => Promise<void>;
  deleteCity:  (id: string)            => Promise<void>;

  addSimulation:    (input: SimInput)      => Promise<void>;
  updateSimulation: (sim: Simulation)      => Promise<void>;
  deleteSimulation: (id: string)           => Promise<void>;
}

const DataContext = createContext<DataContextData>({} as DataContextData);

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [cities,      setCities]      = useState<City[]>([]);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    (async () => {
      const savedCities = await StorageService.getCities();
      const savedSims   = await StorageService.getSimulations();
      setCities     (savedCities.length ? savedCities : MOCK_CITIES);
      setSimulations(savedSims.length   ? savedSims   : MOCK_SIMULATIONS);
      setLoading(false);
    })();
  }, []);

  const addCity = useCallback(async (input: CityInput) => {
    const newCity: City = { ...input, id: uid(), simulationCount: 0 };
    const updated = [...cities, newCity];
    setCities(updated);
    await StorageService.saveCities(updated);
  }, [cities]);

  const updateCity = useCallback(async (city: City) => {
    const updated = cities.map((c) => (c.id === city.id ? city : c));
    setCities(updated);
    await StorageService.saveCities(updated);
  }, [cities]);

  const deleteCity = useCallback(async (id: string) => {
    const updatedCities = cities.filter((c) => c.id !== id);
    const updatedSims   = simulations.filter((s) => s.city.id !== id);
    setCities(updatedCities);
    setSimulations(updatedSims);
    await StorageService.saveCities(updatedCities);
    await StorageService.saveSimulations(updatedSims);
  }, [cities, simulations]);

  const addSimulation = useCallback(async (input: SimInput) => {
    const city = cities.find((c) => c.id === input.cityId);
    if (!city) return;
    const { cityId, ...rest } = input;
    const newSim: Simulation = { ...rest, id: uid(), city, createdAt: today() };
    const updated = [newSim, ...simulations];
    setSimulations(updated);

    const updatedCities = cities.map((c) =>
      c.id === city.id ? { ...c, simulationCount: c.simulationCount + 1 } : c
    );
    setCities(updatedCities);
    await StorageService.saveSimulations(updated);
    await StorageService.saveCities(updatedCities);
  }, [cities, simulations]);

  const updateSimulation = useCallback(async (sim: Simulation) => {
    const updated = simulations.map((s) => (s.id === sim.id ? sim : s));
    setSimulations(updated);
    await StorageService.saveSimulations(updated);
  }, [simulations]);

  const deleteSimulation = useCallback(async (id: string) => {
    const sim = simulations.find((s) => s.id === id);
    const updated = simulations.filter((s) => s.id !== id);
    setSimulations(updated);
    await StorageService.saveSimulations(updated);
    if (sim) {
      const updatedCities = cities.map((c) =>
        c.id === sim.city.id
          ? { ...c, simulationCount: Math.max(0, c.simulationCount - 1) }
          : c
      );
      setCities(updatedCities);
      await StorageService.saveCities(updatedCities);
    }
  }, [simulations, cities]);

  return (
    <DataContext.Provider value={{
      cities, simulations, loading,
      addCity, updateCity, deleteCity,
      addSimulation, updateSimulation, deleteSimulation,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextData {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be inside DataProvider');
  return ctx;
}
