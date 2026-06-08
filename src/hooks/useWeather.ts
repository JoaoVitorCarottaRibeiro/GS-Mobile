import { useState, useEffect, useCallback } from 'react';
import { OpenMeteoResponse, CITIES } from '../types/weather';
import { WeatherService } from '../services/weatherService';
import { StorageService } from '../storage/storage';

export function useWeather() {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [city, setCity] = useState<string>('São Paulo');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (targetCity?: string) => {
    try {
      setLoading(true);
      setError(null);
      const cityName = targetCity ?? city;
      const result = await WeatherService.getWeather(cityName);
      setData(result);
      if (targetCity && targetCity !== city) {
        setCity(targetCity);
        await StorageService.saveDefaultCity(targetCity);
      }
    } catch {
      setError('Não foi possível carregar o clima.');
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    const init = async () => {
      const saved = await StorageService.getDefaultCity();
      setCity(saved);
      await fetchWeather(saved);
    };
    init();
  }, []);

  return { data, city, loading, error, refresh: fetchWeather };
}
