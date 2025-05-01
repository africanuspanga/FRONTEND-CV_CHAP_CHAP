import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ADMIN_API, makeAdminApiCall } from '@/lib/api-config';

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
      const token = localStorage.getItem('adminToken');

      if (token) {
        try {
          // Verify the token with the backend
          const adminData = await makeAdminApiCall(ADMIN_API.VERIFY);
          setAdmin(adminData.admin);
        } catch (error) {
          console.error('Failed to verify admin token:', error);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminEmail');
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
      
      const response = await fetch(ADMIN_API.LOGIN, {
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
      
      // Store the token and admin email
      localStorage.setItem('adminToken', data.access_token);
      localStorage.setItem('adminEmail', data.email);
      
      // Fetch admin details
      const adminData = await makeAdminApiCall(ADMIN_API.VERIFY);
      setAdmin(adminData.admin);
      
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
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
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
