import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '@/services/authService';

interface AuthContextValue {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  const value = useMemo(
    () => ({ isAuthenticated, setIsAuthenticated, logout }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}