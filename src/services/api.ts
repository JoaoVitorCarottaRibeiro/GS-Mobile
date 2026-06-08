import axios from 'axios';

export const NASA_API_KEY = 'DEMO_KEY';

export const nasaApi = axios.create({
  baseURL: 'https://api.nasa.gov',
  timeout: 15000,
  params: {
    api_key: NASA_API_KEY,
  },
});

export const weatherApi = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000,
});

nasaApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[NASA API Error]', error.response?.status, error.response?.data?.error?.message || error.message);
    return Promise.reject(error);
  }
);

weatherApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[Weather API Error]', error.response?.status, error.message);
    return Promise.reject(error);
  }
);
