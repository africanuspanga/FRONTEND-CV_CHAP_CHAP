import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ADMIN_API, makeAdminApiCall } from '@/lib/api-config';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
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

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('admin_access_token');
        
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        try {
          const userData = await makeAdminApiCall(ADMIN_API.CURRENT_USER);
          if (userData) {
            setUser(userData);
          } else {
            // Invalid token
            localStorage.removeItem('admin_access_token');
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching admin user:', error);
          localStorage.removeItem('admin_access_token');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth status check error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await makeAdminApiCall(ADMIN_API.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      
      if (response && response.token) {
        localStorage.setItem('admin_access_token', response.token);
        setUser(response.user);
        toast({
          title: 'Login successful',
          description: `Welcome back, ${response.user.username}!`,
        });
        return true;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Try to call logout endpoint
      try {
        await makeAdminApiCall(ADMIN_API.LOGOUT, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Logout API error:', error);
        // Continue with local logout even if API call fails
      }
      
      // Local logout
      localStorage.removeItem('admin_access_token');
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout issue',
        description: 'There was an issue during logout, but you\'ve been logged out locally',
        variant: 'default',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
