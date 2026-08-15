import api from './api';
import * as SecureStore from 'expo-secure-store';

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
    const res = await api.post<AuthResponse>('/auth/login', payload);
    await SecureStore.setItemAsync('token', res.data.token);
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
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
