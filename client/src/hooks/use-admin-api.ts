import { useState, useCallback } from 'react';
import { ADMIN_API, makeAdminApiCall } from '@/lib/api-config';
import { useAdminAuth } from '@/contexts/admin-auth-context';

// Hook for managing admin API operations
export function useAdminApi() {
  const { isAuthenticated, user } = useAdminAuth();
  
  // Dashboard
  const fetchDashboardStats = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    
    // Use the real API
    const token = localStorage.getItem('admin_access_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch('/api/admin/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401 || response.status === 403) {
      // Token expired or invalid
      localStorage.removeItem('admin_access_token');
      throw new Error('Authentication expired. Please login again.');
    }
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const apiResponse = await response.json();
    
    // Debug logging
    console.log('Dashboard API Response:', apiResponse);
    
    // Map API response to expected dashboard format
    return {
      total_users: apiResponse.users?.total || 0,
      total_cvs: apiResponse.cvs?.total || 0,
      total_templates: 15, // Static number as templates don't change often
      total_payments: apiResponse.payments?.total || 0,
      cv_completion_rate: apiResponse.cvs?.completion_rate || 0,
      payment_success_rate: apiResponse.payments?.success_rate || 0,
      total_revenue: apiResponse.revenue?.total || 0,
      currency: 'TSh',
      recent_users: apiResponse.recent_users || [],
      recent_payments: apiResponse.recent_payments || []
    };
  }, [isAuthenticated, user]);
  
  // User management
  const fetchUsers = useCallback(async (page = 1, perPage = 10, search = '') => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    
    // Use the real API
    const token = localStorage.getItem('admin_access_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
      ...(search ? { search } : {})
    }).toString();
    
    const response = await fetch(`/api/admin/users?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('admin_access_token');
      throw new Error('Authentication expired. Please login again.');
    }
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }, [isAuthenticated, user]);
  
  const fetchUserDetails = useCallback(async (userId: string) => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    
    const token = localStorage.getItem('admin_access_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('admin_access_token');
      throw new Error('Authentication expired. Please login again.');
    }
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }, [isAuthenticated]);
  
  // Template management
  const fetchTemplates = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    
    // Use the real API
    const token = localStorage.getItem('admin_access_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch('/api/admin/templates', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('admin_access_token');
      throw new Error('Authentication expired. Please login again.');
    }
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }, [isAuthenticated, user]);
  
  const fetchTemplateDetails = useCallback(async (templateId: string) => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    return await makeAdminApiCall(`${ADMIN_API.TEMPLATES}/${templateId}`);
  }, [isAuthenticated]);
  
  const createTemplate = useCallback(async (template: { name: string; description: string; thumbnail: string }) => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    return await makeAdminApiCall(ADMIN_API.TEMPLATES, {
      method: 'POST',
      body: JSON.stringify(template)
    });
  }, [isAuthenticated]);
  
  const updateTemplate = useCallback(async (templateId: string, template: any) => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    return await makeAdminApiCall(`${ADMIN_API.TEMPLATES}/${templateId}`, {
      method: 'PUT',
      body: JSON.stringify(template)
    });
  }, [isAuthenticated]);
  
  const deleteTemplate = useCallback(async (templateId: string) => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    return await makeAdminApiCall(`${ADMIN_API.TEMPLATES}/${templateId}`, {
      method: 'DELETE'
    });
  }, [isAuthenticated]);
  
  // Payment management
  const fetchPayments = useCallback(async (page = 1, perPage = 10, status?: string) => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    const queryParams = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
      ...(status ? { status } : {})
    }).toString();
    
    return await makeAdminApiCall(`${ADMIN_API.PAYMENTS}?${queryParams}`);
  }, [isAuthenticated]);
  
  const verifyPayment = useCallback(async (paymentId: string) => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    return await makeAdminApiCall(`${ADMIN_API.PAYMENT_VERIFICATION}/${paymentId}`, {
      method: 'POST'
    });
  }, [isAuthenticated]);
  
  // Analytics
  const fetchUserAnalytics = useCallback(async (period = '30d') => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    return await makeAdminApiCall(`${ADMIN_API.ANALYTICS.USERS}?period=${period}`);
  }, [isAuthenticated]);
  
  const fetchTemplateAnalytics = useCallback(async (period = '30d') => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    return await makeAdminApiCall(`${ADMIN_API.ANALYTICS.TEMPLATES}?period=${period}`);
  }, [isAuthenticated]);
  
  const fetchPaymentAnalytics = useCallback(async (period = '30d') => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    return await makeAdminApiCall(`${ADMIN_API.ANALYTICS.PAYMENTS}?period=${period}`);
  }, [isAuthenticated]);
  
  return {
    // Dashboard
    fetchDashboardStats,
    
    // User management
    fetchUsers,
    fetchUserDetails,
    
    // Template management
    fetchTemplates,
    fetchTemplateDetails,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    
    // Payment management
    fetchPayments,
    verifyPayment,
    
    // Analytics
    fetchUserAnalytics,
    fetchTemplateAnalytics,
    fetchPaymentAnalytics,
  };
}
