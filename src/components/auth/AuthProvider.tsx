'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { userStorage } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for the application
const DEMO_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@richezzamegavalue.com',
    role: 'admin',
    department: 'Management',
    avatar: undefined
  },
  {
    id: '2',
    name: 'HR Manager',
    email: 'hr@richezzamegavalue.com',
    role: 'manager',
    department: 'Human Resources',
    avatar: undefined
  },
  {
    id: '3',
    name: 'John Employee',
    email: 'john@richezzamegavalue.com',
    role: 'employee',
    department: 'Accounts',
    avatar: undefined
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = userStorage.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Demo login - in production, this would be an API call
    const foundUser = DEMO_USERS.find(u => u.email === email);
    
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      userStorage.setCurrentUser(foundUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    userStorage.logout();
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}