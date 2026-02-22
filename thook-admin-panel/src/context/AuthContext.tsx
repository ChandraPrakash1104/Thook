import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('thook_auth') === 'true'
  );
  const [adminEmail, setAdminEmail] = useState(
    () => localStorage.getItem('thook_admin_email')
  );

  const login = (email: string, password: string): boolean => {
    // Mock auth — will be replaced with Firebase Auth
    if (email && password.length >= 6) {
      setIsAuthenticated(true);
      setAdminEmail(email);
      localStorage.setItem('thook_auth', 'true');
      localStorage.setItem('thook_admin_email', email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminEmail(null);
    localStorage.removeItem('thook_auth');
    localStorage.removeItem('thook_admin_email');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
