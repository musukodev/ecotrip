import api from './api';
import * as SecureStore from 'expo-secure-store';

export type UserRole = 'tourist' | 'business_destination' | 'business_accommodation' | 'superadmin';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  approval_status?: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface UserPreferences {
  language: 'id' | 'en' | 'zh';
  interests: string[];
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', payload);
    await SecureStore.setItemAsync('token', res.data.token);
    await SecureStore.setItemAsync('user_role', res.data.user?.role || 'tourist');
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', payload);
    if (res.data.token) {
      await SecureStore.setItemAsync('token', res.data.token);
      await SecureStore.setItemAsync('user_role', res.data.user?.role || payload.role || 'tourist');
    }
    return res.data;
  },

  async getProfile(): Promise<UserProfile> {
    const res = await api.get<UserProfile>('/user/me');
    if (res.data?.role) {
      await SecureStore.setItemAsync('user_role', res.data.role);
    }
    return res.data;
  },

  async updatePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    const res = await api.put<{ message: string }>('/user/password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return res.data;
  },

  async updateEmail(newEmail: string): Promise<{ message: string }> {
    const res = await api.put<{ message: string }>('/user/email', {
      new_email: newEmail,
    });
    return res.data;
  },

  async getPreferences(): Promise<UserPreferences> {
    const res = await api.get<UserPreferences>('/user/preferences');
    return res.data;
  },

  async updatePreferences(prefs: UserPreferences): Promise<UserPreferences> {
    const res = await api.put<UserPreferences>('/user/preferences', prefs);
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Abaikan error
    } finally {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user_role');
    }
  },

  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync('token');
  },

  async getRole(): Promise<UserRole | null> {
    return (await SecureStore.getItemAsync('user_role')) as UserRole | null;
  },
};
