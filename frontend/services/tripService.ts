import api from './api';
import { DUMMY_MODE } from '@/constants/config';

export interface Trip {
  id: number;
  title: string;
  description: string;
  destination: string;
  start_date: string;
  end_date: string;
  carbon_footprint: number;
  created_at: string;
}

export interface CreateTripPayload {
  title: string;
  description: string;
  destination: string;
  start_date: string;
  end_date: string;
}

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    if (DUMMY_MODE) return [];
    const res = await api.get<Trip[]>('/trips');
    return res.data;
  },

  async getTrip(id: number): Promise<Trip> {
    if (DUMMY_MODE) {
      return {
        id,
        title: 'Dummy Trip',
        description: '',
        destination: 'Dummy Destination',
        start_date: '2026-01-01',
        end_date: '2026-01-02',
        carbon_footprint: 0,
        created_at: '2026-01-01',
      };
    }
    const res = await api.get<Trip>(`/trips/${id}`);
    return res.data;
  },

  async createTrip(payload: CreateTripPayload): Promise<Trip> {
    if (DUMMY_MODE) {
      return {
        id: Date.now(),
        ...payload,
        carbon_footprint: 0,
        created_at: new Date().toISOString(),
      };
    }
    const res = await api.post<Trip>('/trips', payload);
    return res.data;
  },

  async deleteTrip(id: number): Promise<void> {
    if (DUMMY_MODE) return;
    await api.delete(`/trips/${id}`);
  },
};
