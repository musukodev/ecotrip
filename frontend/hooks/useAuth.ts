import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    authService.getToken().then((token) => {
      setIsAuthenticated(!!token);
    });
  }, []);

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, setIsAuthenticated, logout };
}
