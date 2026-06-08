import { weatherApi } from './api';
import { OpenMeteoResponse, CITIES, CityInfo } from '../types/weather';

const CURRENT_PARAMS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
].join(',');

export const WeatherService = {
  getCityInfo(cityName: string): CityInfo {
    return CITIES.find((c) => c.name === cityName) ?? CITIES[0];
  },

  async getWeather(cityName: string): Promise<OpenMeteoResponse> {
    const city = WeatherService.getCityInfo(cityName);
    const response = await weatherApi.get<OpenMeteoResponse>('/forecast', {
      params: {
        latitude: city.lat,
        longitude: city.lon,
        current: CURRENT_PARAMS,
        timezone: 'America/Sao_Paulo',
      },
    });
    return response.data;
  },

  async getWeatherByCoords(lat: number, lon: number): Promise<OpenMeteoResponse> {
    const response = await weatherApi.get<OpenMeteoResponse>('/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current: CURRENT_PARAMS,
        timezone: 'auto',
      },
    });
    return response.data;
  },
};
