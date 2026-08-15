import api from './api';

export interface FerryRoute {
  id: number;
  origin_country: 'singapore' | 'malaysia';
  origin_port: string;
  destination_port: string;
  operator_name: string;
  price_one_way: number;
  price_round_trip: number;
  currency: string;
  duration_minutes: number;
  source_url: string;
}

export const ferryService = {
  async getRoutes(originCountry?: string, originPort?: string): Promise<FerryRoute[]> {
    const params: Record<string, string> = {};
    if (originCountry) params.origin_country = originCountry.toLowerCase();
    if (originPort) params.origin_port = originPort;
    const res = await api.get<{ routes: FerryRoute[]; count: number }>('/ferry/routes', { params });
    return res.data.routes || [];
  },

  async getRouteById(id: number | string): Promise<FerryRoute> {
    const res = await api.get<FerryRoute>(`/ferry/routes/${id}`);
    return res.data;
  },
};
