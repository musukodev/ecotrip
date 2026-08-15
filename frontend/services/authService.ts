import api from './api';
import * as SecureStore from 'expo-secure-store';
import { DUMMY_MODE } from '@/constants/config';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (DUMMY_MODE) {
      const token = `dummy-token-${Date.now()}`;
      await SecureStore.setItemAsync('token', token);
      return { token, user: { id: 1, name: 'Demo User', email: payload.email } };
    }
    const res = await api.post<AuthResponse>('/auth/login', payload);
    await SecureStore.setItemAsync('token', res.data.token);
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (DUMMY_MODE) {
      const token = `dummy-token-${Date.now()}`;
      await SecureStore.setItemAsync('token', token);
      return { token, user: { id: 1, name: payload.name, email: payload.email } };
    }
    const res = await api.post<AuthResponse>('/auth/register', payload);
    await SecureStore.setItemAsync('token', res.data.token);
    return res.data;
  },

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('token');
  },

  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync('token');
  },
};
