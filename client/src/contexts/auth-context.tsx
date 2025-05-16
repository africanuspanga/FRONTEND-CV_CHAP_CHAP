import React, { createContext, useState, useContext, useEffect } from 'react';

// Define User type
interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  phone_number?: string;
}

// Define AuthContext type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name?: string, phone_number?: string, username?: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (identifier: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

// Token-related functions
const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (using the token)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = getAuthToken();
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token might be invalid, remove it
          removeAuthToken();
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        removeAuthToken();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Login function
  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identifier, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
      }
      
      const data = await response.json();
      
      // Store token
      setAuthToken(data.token);
      
      // Store user data
      setUser(data.user);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, full_name?: string, phone_number?: string, username?: string) => {
    setIsLoading(true);
    try {
      const userData = {
        email,
        password,
        ...(full_name && { full_name }),
        ...(phone_number && { phone_number }),
        ...(username && { username })
      };
      
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
      
      const data = await response.json();
      
      // Store token
      setAuthToken(data.token);
      
      // Store user data
      setUser(data.user);
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      // Call logout endpoint
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Remove token and user data regardless of API response
      removeAuthToken();
      setUser(null);
      setIsLoading(false);
    }
  };
  
  // Forgot password function
  const forgotPassword = async (identifier: string) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identifier })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process forgot password request');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };
  
  // Reset password function
  const resetPassword = async (token: string, new_password: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, new_password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  // Create context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Create hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};