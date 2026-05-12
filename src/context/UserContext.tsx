'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signIn, signOut, getSession } from 'next-auth/react';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  district?: string;
  sector?: string;
  address?: string;
  role: 'customer' | 'admin' | 'staff';
  createdAt: Date;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  district: string;
  sector: string;
  address: string;
  password: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session?.user) {
        // Get user details from our database
        try {
          const response = await fetch(`/api/auth/user?email=${session.user.email}`);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      } else {
        // Check if user is logged in from localStorage (for manual auth)
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const newUser = await response.json();
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
      // Note: signIn will redirect, so this code might not execute
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await signOut({ callbackUrl: '/' });
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, login, signup, googleLogin, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}