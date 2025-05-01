import { useState, useCallback } from 'react';
import { ADMIN_API, makeAdminApiCall } from '@/lib/api-config';
import { useAdminAuth } from '@/contexts/admin-auth-context';

// Hook for managing admin API operations
export function useAdminApi() {
  const { isAuthenticated } = useAdminAuth();
  
  // Dashboard
  const fetchDashboardStats = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    return await makeAdminApiCall(ADMIN_API.DASHBOARD);
  }, [isAuthenticated]);
  
  // User management
  const fetchUsers = useCallback(async (page = 1, perPage = 10, search = '') => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    const queryParams = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
      ...(search ? { search } : {})
    }).toString();
    
    return await makeAdminApiCall(`${ADMIN_API.USERS}?${queryParams}`);
  }, [isAuthenticated]);
  
  const fetchUserDetails = useCallback(async (userId: string) => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    return await makeAdminApiCall(`${ADMIN_API.USERS}/${userId}`);
  }, [isAuthenticated]);
  
  // Template management
  const fetchTemplates = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    return await makeAdminApiCall(ADMIN_API.TEMPLATES);
  }, [isAuthenticated]);
  
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
