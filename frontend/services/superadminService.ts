import api from './api';
import { UserProfile } from './authService';
import { Destination } from './destinationService';
import { Accommodation } from './accommodationService';

export interface SuperadminStats {
  total_pending_business_users: number;
  total_approved_business: number;
  total_destinations: number;
  total_accommodations: number;
}

export const superadminService = {
  async getStats(): Promise<SuperadminStats> {
    const res = await api.get<SuperadminStats>('/superadmin/stats');
    return res.data;
  },

  async getPendingBusinessUsers(): Promise<UserProfile[]> {
    const res = await api.get<{ users: UserProfile[]; count: number }>('/superadmin/business-users/pending');
    return res.data.users || [];
  },

  async approveBusinessUser(userId: number): Promise<{ message: string }> {
    const res = await api.post<{ message: string }>(`/superadmin/business-users/${userId}/approve`);
    return res.data;
  },

  async rejectBusinessUser(userId: number): Promise<{ message: string }> {
    const res = await api.post<{ message: string }>(`/superadmin/business-users/${userId}/reject`);
    return res.data;
  },

  async getAllDestinations(): Promise<Destination[]> {
    const res = await api.get<{ destinations: Destination[]; count: number }>('/superadmin/destinations');
    return res.data.destinations || [];
  },

  async getAllAccommodations(): Promise<Accommodation[]> {
    const res = await api.get<{ accommodations: Accommodation[]; count: number }>('/superadmin/accommodations');
    return res.data.accommodations || [];
  },
};
