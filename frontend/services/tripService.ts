import api from './api';

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
    const res = await api.get<Trip[]>('/trips');
    return res.data;
  },

  async getTrip(id: number): Promise<Trip> {
    const res = await api.get<Trip>(`/trips/${id}`);
    return res.data;
  },

  async createTrip(payload: CreateTripPayload): Promise<Trip> {
    const res = await api.post<Trip>('/trips', payload);
    return res.data;
  },

  async deleteTrip(id: number): Promise<void> {
    await api.delete(`/trips/${id}`);
  },
};
