import api from './api';

export interface CurrentWeather {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  updated_at: string;
}

export interface DailyForecast {
  date: string;
  day_name: string;
  temperature: number;
  condition: string;
}

export const weatherService = {
  async getCurrentWeather(): Promise<CurrentWeather> {
    const res = await api.get<CurrentWeather>('/weather/current');
    return res.data;
  },

  async getForecast(): Promise<DailyForecast[]> {
    const res = await api.get<{ forecast: DailyForecast[]; count: number }>('/weather/forecast');
    return res.data.forecast || [];
  },
};
