// API configuration for admin backend integration

// API base URL - adjust this to match your external API
const API_BASE_URL = 'https://cv-screener-africanuspanga.replit.app';

// API endpoints for admin functionality
export const ADMIN_API = {
  // Auth endpoints
  LOGIN: '/api/admin/auth/login',
  LOGOUT: '/api/admin/auth/logout',
  CURRENT_USER: '/api/admin/auth/me',
  
  // Dashboard endpoints
  DASHBOARD: '/api/admin/dashboard',
  
  // User management
  USERS: '/api/admin/users',
  
  // Template management
  TEMPLATES: '/api/admin/templates',
  
  // Payment management
  PAYMENTS: '/api/admin/payments',
  PAYMENT_VERIFICATION: '/api/admin/payments/verify',
  
  // Analytics
  ANALYTICS: {
    USERS: '/api/admin/analytics/users',
    TEMPLATES: '/api/admin/analytics/templates',
    PAYMENTS: '/api/admin/analytics/payments',
  }
};

// Function to make API calls with authentication
export async function makeAdminApiCall(endpoint: string, options?: RequestInit): Promise<any> {
  try {
    // Get auth token from localStorage
    const token = localStorage.getItem('admin_access_token');
    
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options?.headers || {})
    });
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      // Try to parse error response
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
      } catch (parseError) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
    }
    
    // Return JSON response or null for 204 No Content
    return response.status === 204 ? null : await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
