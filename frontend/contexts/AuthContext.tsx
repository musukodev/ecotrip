import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService, UserRole } from '@/services/authService';

interface AuthContextValue {
  isAuthenticated: boolean | null;
  userRole: UserRole | null;
  setIsAuthenticated: (value: boolean) => void;
  setUserRole: (role: UserRole | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    Promise.all([authService.getToken(), authService.getRole()]).then(([token, role]) => {
      setIsAuthenticated(!!token);
      if (token) {
        setUserRole(role || 'tourist');
      } else {
        setUserRole(null);
      }
    });
  }, []);

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const value = useMemo(
    () => ({ isAuthenticated, userRole, setIsAuthenticated, setUserRole, logout }),
    [isAuthenticated, userRole]
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
