import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Admin {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const API_BASE_URL = '';

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the admin is already logged in
    const checkAdminAuth = async () => {
      const adminData = localStorage.getItem('admin_info');
      const token = localStorage.getItem('admin_access_token');

      if (adminData && token) {
        try {
          setAdmin(JSON.parse(adminData));
        } catch (error) {
          console.error('Failed to parse admin data:', error);
          localStorage.removeItem('admin_info');
          localStorage.removeItem('admin_access_token');
          localStorage.removeItem('admin_refresh_token');
        }
      }
      setIsLoading(false);
    };

    checkAdminAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store the tokens and admin info
      localStorage.setItem('admin_access_token', data.access_token);
      localStorage.setItem('admin_refresh_token', data.refresh_token);
      localStorage.setItem('admin_info', JSON.stringify(data.admin));
      
      setAdmin(data.admin);
      toast({
        title: 'Login successful',
        description: 'Welcome to the admin dashboard',
        variant: 'default',
      });
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_info');
    setAdmin(null);
    toast({
      title: 'Logged out',
      description: 'Successfully logged out from admin dashboard',
      variant: 'default',
    });
  };

  const value = {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    logout,
    error,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
