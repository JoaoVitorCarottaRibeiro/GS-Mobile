export interface OpenMeteoCurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: OpenMeteoCurrentWeather;
}

export interface CityInfo {
  name: string;
  lat: number;
  lon: number;
  state?: string;
}

export const CITIES: CityInfo[] = [
  { name: 'São Paulo', lat: -23.55, lon: -46.64, state: 'SP' },
  { name: 'Rio de Janeiro', lat: -22.91, lon: -43.17, state: 'RJ' },
  { name: 'Brasília', lat: -15.78, lon: -47.93, state: 'DF' },
  { name: 'Salvador', lat: -12.97, lon: -38.51, state: 'BA' },
  { name: 'Manaus', lat: -3.12, lon: -60.02, state: 'AM' },
  { name: 'Porto Alegre', lat: -30.03, lon: -51.23, state: 'RS' },
  { name: 'Curitiba', lat: -25.43, lon: -49.27, state: 'PR' },
  { name: 'Recife', lat: -8.05, lon: -34.88, state: 'PE' },
  { name: 'Fortaleza', lat: -3.72, lon: -38.54, state: 'CE' },
  { name: 'Belo Horizonte', lat: -19.92, lon: -43.94, state: 'MG' },
];

export const WMO_WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0:  { description: 'Céu limpo', icon: '☀️' },
  1:  { description: 'Predominantemente limpo', icon: '🌤️' },
  2:  { description: 'Parcialmente nublado', icon: '⛅' },
  3:  { description: 'Nublado', icon: '☁️' },
  45: { description: 'Névoa', icon: '🌫️' },
  48: { description: 'Névoa com gelo', icon: '🌫️' },
  51: { description: 'Garoa leve', icon: '🌦️' },
  53: { description: 'Garoa moderada', icon: '🌦️' },
  55: { description: 'Garoa intensa', icon: '🌧️' },
  61: { description: 'Chuva leve', icon: '🌧️' },
  63: { description: 'Chuva moderada', icon: '🌧️' },
  65: { description: 'Chuva intensa', icon: '⛈️' },
  71: { description: 'Neve leve', icon: '❄️' },
  73: { description: 'Neve moderada', icon: '❄️' },
  75: { description: 'Neve intensa', icon: '❄️' },
  80: { description: 'Pancadas leves', icon: '🌦️' },
  81: { description: 'Pancadas moderadas', icon: '🌧️' },
  82: { description: 'Pancadas violentas', icon: '⛈️' },
  95: { description: 'Tempestade', icon: '⛈️' },
  96: { description: 'Tempestade com granizo', icon: '⛈️' },
  99: { description: 'Tempestade severa', icon: '🌪️' },
};
