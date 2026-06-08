import { useState, useEffect, useCallback } from 'react';
import { ApodData, NeoObject } from '../types/nasa';
import { NasaService } from '../services/nasaService';

export function useApod() {
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apod = await NasaService.getApod();
      setData(apod);
    } catch {
      setError('Não foi possível carregar a imagem do dia.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refresh: fetch };
}

export function useNeoFeed() {
  const [data, setData] = useState<NeoObject[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await NasaService.getNeoFeed();
      const allNeos = Object.values(response.near_earth_objects).flat();
      const sorted = allNeos.sort(
        (a, b) =>
          Number(b.is_potentially_hazardous_asteroid) -
          Number(a.is_potentially_hazardous_asteroid)
      );
      setData(sorted);
      setTotalCount(response.element_count);
    } catch {
      setError('Não foi possível carregar os dados de asteroides.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const hazardousCount = data.filter((n) => n.is_potentially_hazardous_asteroid).length;

  return { data, totalCount, hazardousCount, loading, error, refresh: fetch };
}
