import api from './api';
import { Destination } from './destinationService';
import { Accommodation } from './accommodationService';

export interface CreateDestinationInput {
  name: string;
  category: 'nature' | 'culture' | 'culinary' | 'shopping' | 'adventure' | 'relaxation';
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  opening_hours?: string;
  ticket_price?: number;
  best_visit_time?: string;
  facilities?: string[];
  photos?: string[];
  phone?: string;
  conservation_contribution_pct?: number;
}

export interface CreateAccommodationInput {
  name: string;
  category: 'hotel' | 'resort' | 'homestay';
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  price_per_night: number;
  facilities?: string[];
  photos?: string[];
  phone?: string;
  environmental_impact?: string;
}

export const businessService = {
  // Destinasi
  async createDestination(input: CreateDestinationInput): Promise<Destination> {
    const res = await api.post<{ destination: Destination }>('/business/destinations', input);
    return res.data.destination;
  },
  async getMyDestinations(): Promise<Destination[]> {
    const res = await api.get<{ destinations: Destination[] }>('/business/destinations/my');
    return res.data.destinations || [];
  },
  async updateDestination(id: number | string, input: CreateDestinationInput): Promise<Destination> {
    const res = await api.put<{ destination: Destination }>(`/business/destinations/${id}`, input);
    return res.data.destination;
  },
  async deleteDestination(id: number | string): Promise<void> {
    await api.delete(`/business/destinations/${id}`);
  },

  // Akomodasi
  async createAccommodation(input: CreateAccommodationInput): Promise<Accommodation> {
    const res = await api.post<{ accommodation: Accommodation }>('/business/accommodations', input);
    return res.data.accommodation;
  },
  async getMyAccommodations(): Promise<Accommodation[]> {
    const res = await api.get<{ accommodations: Accommodation[] }>('/business/accommodations/my');
    return res.data.accommodations || [];
  },
  async updateAccommodation(id: number | string, input: CreateAccommodationInput): Promise<Accommodation> {
    const res = await api.put<{ accommodation: Accommodation }>(`/business/accommodations/${id}`, input);
    return res.data.accommodation;
  },
  async deleteAccommodation(id: number | string): Promise<void> {
    await api.delete(`/business/accommodations/${id}`);
  },
};
