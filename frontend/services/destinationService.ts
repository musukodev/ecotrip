import api from './api';

export type DestinationCategory = 'nature' | 'culture' | 'culinary' | 'shopping' | 'adventure' | 'relaxation';

export interface Destination {
  id: number;
  name: string;
  category: DestinationCategory;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  opening_hours: string;
  ticket_price: number;
  best_visit_time: string;
  facilities: string[];
  photos: string[];
  phone: string;
  eco_score: number;
  conservation_contribution_pct: number;
  ratings?: any[];
  directions_url?: string;
  share_url?: string;
}

export const destinationService = {
  async getDestinations(category?: string): Promise<Destination[]> {
    const params = category ? { category: category.toLowerCase() } : {};
    const res = await api.get<{ destinations: Destination[]; count: number }>('/destinations', { params });
    return res.data.destinations || [];
  },

  async getDestinationById(id: number | string): Promise<Destination> {
    const res = await api.get<Destination>(`/destinations/${id}`);
    return res.data;
  },
};
