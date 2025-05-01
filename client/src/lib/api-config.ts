// API Configuration for CV Chap Chap

export const API_BASE_URL = "https://cv-screener-africanuspanga.replit.app";

// Admin API endpoints
export const ADMIN_API = {
  LOGIN: `${API_BASE_URL}/api/auth/admin/login`,
  VERIFY: `${API_BASE_URL}/api/auth/admin/verify`,
  DASHBOARD: `${API_BASE_URL}/api/admin`,
  USERS: `${API_BASE_URL}/api/admin/users`,
  TEMPLATES: `${API_BASE_URL}/api/admin/templates`,
  ANALYTICS: {
    TEMPLATES: `${API_BASE_URL}/api/admin/analytics/templates`,
    USERS: `${API_BASE_URL}/api/admin/analytics/users`
  }
};

// General API endpoints
export const API = {
  TEMPLATES: `${API_BASE_URL}/api/templates`,
  CV: `${API_BASE_URL}/api/cv`
};

// Helper function to make authenticated admin API calls
export async function makeAdminApiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const adminToken = localStorage.getItem('adminToken');
    
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // If unauthorized, clear token and return error
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        throw new Error('Authentication failed. Please log in again.');
      }
      
      // Handle other errors
      throw new Error(data.message || `Error: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
