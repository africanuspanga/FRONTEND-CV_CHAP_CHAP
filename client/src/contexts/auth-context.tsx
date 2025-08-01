import { createContext, useContext, ReactNode } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Define User interface
export interface User {
  id: number;
  username: string;
  email?: string;
  full_name?: string;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
}

// Login data interface
interface LoginData {
  identifier: string;  // Email or phone number
  password: string;
}

// Register data interface
interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone_number?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch the current user data
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) return null;

        // Create headers with authorization token
        const headers = {
          Authorization: `Bearer ${token}`
        };

        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: headers,
          credentials: 'include',
        });

        if (response.status === 401) {
          localStorage.removeItem('jwt_token');
          return null;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        return userData;
      } catch (err) {
        console.error('Error fetching user:', err);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      // Store token in localStorage with correct key
      localStorage.setItem('jwt_token', data.token);
      
      // Update user data
      queryClient.setQueryData(['user'], data.user);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${data.user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      // Store token in localStorage with correct key
      localStorage.setItem('jwt_token', data.token);
      
      // Update user data
      queryClient.setQueryData(['user'], data.user);
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created successfully!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('jwt_token');
      
      if (token) {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          console.error('Logout failed with status:', response.status);
        }
      }
      
      return null;
    },
    onSuccess: () => {
      // Remove token from localStorage with correct key
      localStorage.removeItem('jwt_token');
      
      // Clear user data
      queryClient.setQueryData(['user'], null);
      
      toast({
        title: 'Logged Out',
        description: 'You have been logged out successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive',
      });
      
      // Clear local data anyway to prevent being stuck in a bad state
      localStorage.removeItem('jwt_token');
      queryClient.setQueryData(['user'], null);
    },
  });

  // Login function
  const login = async (data: LoginData) => {
    await loginMutation.mutateAsync(data);
  };

  // Register function
  const register = async (data: RegisterData) => {
    await registerMutation.mutateAsync(data);
  };

  // Logout function
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
        isAuthenticated: !!user,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}