import api from './api';

export interface Activity {
  id: number;
  day_id: number;
  sort_order: number;
  start_time: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  distance_km: number;
  duration_minutes: number;
  estimated_cost: number;
  carbon_kg: number;
  is_validated: boolean;
  destination_id?: number | null;
  accommodation_id?: number | null;
  destination?: any;
  accommodation?: any;
}

export interface ItineraryDay {
  id: number;
  trip_id: number;
  day_number: number;
  label: string;
  weather_summary?: string;
  weather_temp_c?: number;
  crowd_density?: string;
  activities: Activity[];
}

export interface Trip {
  id: number;
  user_id: number;
  title: string;
  destination: string;
  origin_country: 'singapore' | 'malaysia';
  origin_port: string;
  duration_days: number;
  pax: number;
  budget: number;
  interests: string[];
  start_date?: string;
  end_date?: string;
  ferry_cost_round_trip: number;
  total_estimated_cost: number;
  total_carbon_kg: number;
  sustainability_score: number;
  carbon_ferry_pct: number;
  carbon_accom_pct: number;
  carbon_activity_pct: number;
  current_version: number;
  status: 'draft' | 'active' | 'completed' | 'archived' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateTripPayload {
  title: string;
  origin_country?: string;
  origin_port?: string;
  duration_days: number;
  pax: number;
  budget?: number;
  interests?: string[];
  accommodation_preference?: string;
  notes?: string;
  start_date?: string;
  end_date?: string;
}

export interface TripFullResponse {
  trip: Trip;
  days: ItineraryDay[];
}

export interface CarbonReport {
  trip_id: number;
  total_carbon_kg: number;
  ferry_pct: number;
  accommodation_pct: number;
  activity_pct: number;
  ferry_kg: number;
  accommodation_kg: number;
  activity_kg: number;
  sustainability_score: number;
}

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    const res = await api.get<{ trips: Trip[]; count: number }>('/trips');
    return res.data.trips || [];
  },

  async getTrip(id: number | string): Promise<Trip> {
    const res = await api.get<Trip>(`/trips/${id}`);
    return res.data;
  },

  async getTripFull(id: number | string): Promise<TripFullResponse> {
    const res = await api.get<TripFullResponse>(`/trips/${id}/full`);
    return res.data;
  },

  async createTrip(payload: CreateTripPayload): Promise<TripFullResponse | { trip: Trip; warning?: string }> {
    const res = await api.post<TripFullResponse | { trip: Trip; warning?: string }>('/trips', payload);
    return res.data;
  },

  async updateStatus(id: number | string, status: 'active' | 'completed' | 'archived' | 'cancelled'): Promise<{ message: string; trip: Trip }> {
    const res = await api.patch<{ message: string; trip: Trip }>(`/trips/${id}/status`, { status });
    return res.data;
  },

  async getCarbonReport(id: number | string): Promise<CarbonReport> {
    const res = await api.get<CarbonReport>(`/trips/${id}/carbon`);
    return res.data;
  },

  async deleteTrip(id: number | string): Promise<void> {
    await api.delete(`/trips/${id}`);
  },

  async donateOffset(tripId: number, amountIDR: number): Promise<any> {
    const res = await api.post('/carbon-offset', { trip_id: tripId, amount_idr: amountIDR });
    return res.data;
  },
};
