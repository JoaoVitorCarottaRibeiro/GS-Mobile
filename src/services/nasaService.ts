import { nasaApi } from './api';
import { ApodData, NeoFeedResponse } from '../types/nasa';
import { getTodayISO, getDatePlusdays } from '../utils/formatters';

export const NasaService = {
  async getApod(date?: string): Promise<ApodData> {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    const response = await nasaApi.get<ApodData>('/planetary/apod', { params });
    return response.data;
  },

  async getApodRange(startDate: string, endDate: string): Promise<ApodData[]> {
    const response = await nasaApi.get<ApodData[]>('/planetary/apod', {
      params: { start_date: startDate, end_date: endDate },
    });
    return Array.isArray(response.data) ? response.data.reverse() : [response.data];
  },

  async getNeoFeed(
    startDate = getTodayISO(),
    endDate = getDatePlusdays(7)
  ): Promise<NeoFeedResponse> {
    const response = await nasaApi.get<NeoFeedResponse>('/neo/rest/v1/feed', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },
};
