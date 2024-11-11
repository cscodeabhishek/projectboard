import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Simulated authentication functions
  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        provider: 'email',
      };
      
      setState(prev => ({ ...prev, user, isLoading: false }));
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Invalid email or password', 
        isLoading: false 
      }));
    }
  };

  const loginWithProvider = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: `user_${Math.random().toString(36).substr(2, 6)}@example.com`,
        name: 'Abhishek Thakur',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
        provider,
      };
      setState(prev => ({ ...prev, user, isLoading: false }));
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: `Failed to login with ${provider}`, 
        isLoading: false 
      }));
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem('user');
    setState({ user: null, isLoading: false, error: null });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setState(prev => ({ 
        ...prev, 
        user: JSON.parse(storedUser), 
        isLoading: false 
      }));
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      loginWithGoogle: () => loginWithProvider('google'),
      loginWithFacebook: () => loginWithProvider('facebook'),
      loginWithGithub: () => loginWithProvider('github'),
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}