import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/constants/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

// Attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user_role');
    }
    return Promise.reject(error);
  }
);

export default api;
