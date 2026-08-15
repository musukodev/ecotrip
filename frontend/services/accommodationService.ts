import api from './api';

export interface Accommodation {
  id: number;
  name: string;
  category: 'hotel' | 'resort' | 'homestay';
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  price_per_night: number;
  facilities: string[];
  photos: string[];
  phone: string;
  environmental_impact: string;
  eco_score: number;
  is_favorite?: boolean;
  ratings?: any[];
}

export const accommodationService = {
  async getAccommodations(category?: string): Promise<Accommodation[]> {
    const params = category ? { category: category.toLowerCase() } : {};
    const res = await api.get<{ accommodations: Accommodation[]; count: number }>('/accommodations', { params });
    return res.data.accommodations || [];
  },

  async getAccommodationById(id: number | string): Promise<Accommodation> {
    const res = await api.get<Accommodation>(`/accommodations/${id}`);
    return res.data;
  },

  async toggleFavorite(id: number | string): Promise<{ message: string; is_favorite: boolean }> {
    const res = await api.post<{ message: string; is_favorite: boolean }>(`/accommodations/${id}/favorite`);
    return res.data;
  },

  async getFavorites(): Promise<any[]> {
    const res = await api.get<{ favorites: any[]; count: number }>('/accommodations/favorites');
    return res.data.favorites || [];
  },
};
