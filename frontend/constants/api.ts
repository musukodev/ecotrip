import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = (): string => {
  // 1. Prioritaskan jika diset manual di .env
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Jika di Android Emulator atau Device
  if (Platform.OS === 'android') {
    // Jika Expo Go mendeteksi hostUri jaringan lokal komputer (HP fisik)
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri && !hostUri.startsWith('localhost') && !hostUri.startsWith('127.0.0.1')) {
      const ip = hostUri.split(':')[0];
      return `http://${ip}:8080`;
    }
    // Loopback khusus Android Emulator ke Komputer Host
    return 'http://10.0.2.2:8080';
  }

  // 3. iOS Simulator & Web Browser
  return 'http://localhost:8080';
};

export const API_URL = getBaseUrl();
