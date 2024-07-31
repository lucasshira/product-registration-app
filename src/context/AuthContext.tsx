import { toast } from '@/components/ui/use-toast';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextProps {
  user: UserInfo | null;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
  isLoading: boolean;
}

interface UserInfo {
  given_name: string;
  family_name?: string;
  email: string;
  picture?: string;
  sub: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('userInfo');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userInfo: UserInfo) => {
    setUser(userInfo);
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    toast({
      description: 'Login realizado com sucesso, carregando produtos...',
    });
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('userInfo');
    toast({
      description: 'Logout realizado com sucesso.',
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
