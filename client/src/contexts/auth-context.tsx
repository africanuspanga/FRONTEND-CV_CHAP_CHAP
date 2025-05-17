import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  QueryClient,
  useQueryClient
} from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Types for our authentication context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

// Type for register data
interface RegisterData {
  username?: string;
  email: string;
  password: string;
  full_name?: string;
  phone_number?: string;
}

// Type for login response
interface LoginResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get token from localStorage
  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  // Set token in localStorage
  const setToken = (token: string): void => {
    localStorage.setItem('token', token);
  };

  // Remove token from localStorage
  const removeToken = (): void => {
    localStorage.removeItem('token');
  };

  // Query to fetch the current user
  const {
    data: user,
    error,
    isLoading,
    refetch
  } = useQuery<User, Error>({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = getToken();
      
      if (!token) {
        return null;
      }
      
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          removeToken();
          return null;
        }
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      return data.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ identifier, password }: { identifier: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identifier, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data: LoginResponse = await response.json();
      setToken(data.token);
      return data.user;
    },
    onSuccess: () => {
      refetch(); // Refresh the user data
      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data: LoginResponse = await response.json();
      setToken(data.token);
      return data.user;
    },
    onSuccess: () => {
      refetch(); // Refresh the user data
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Logout failed');
      }
      
      removeToken();
      return null;
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'user'], null);
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send password reset email');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password reset email sent",
        description: "If your email is registered, you will receive a password reset link",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password reset successful",
        description: "Your password has been reset successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Check token on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Helper functions
  const login = async (identifier: string, password: string) => {
    await loginMutation.mutateAsync({ identifier, password });
  };

  const register = async (userData: RegisterData) => {
    await registerMutation.mutateAsync(userData);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const forgotPassword = async (email: string) => {
    await forgotPasswordMutation.mutateAsync(email);
  };

  const resetPassword = async (token: string, password: string) => {
    await resetPasswordMutation.mutateAsync({ token, password });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};