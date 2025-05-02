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
    
    // Check if using mock admin (email will be admin@cvchapchap.com)
    if (user?.email === 'admin@cvchapchap.com') {
      // Return mock dashboard data
      return {
        total_users: 127,
        total_cvs: 215,
        total_templates: 15,
        total_payments: 89,
        cv_completion_rate: 78,
        payment_success_rate: 92,
        total_revenue: 1250000,
        currency: 'TSh',
        recent_users: [
          {
            id: '1',
            username: 'sarah_j',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            username: 'john_doe',
            created_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '3',
            username: 'maria85',
            created_at: new Date(Date.now() - 7200000).toISOString()
          }
        ],
        recent_payments: [
          {
            id: 'pay_123',
            user_id: 'sarah_j',
            amount: 15000,
            currency: 'TSh',
            status: 'completed',
            created_at: new Date().toISOString()
          },
          {
            id: 'pay_122',
            user_id: 'john_doe',
            amount: 15000,
            currency: 'TSh',
            status: 'completed',
            created_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 'pay_121',
            user_id: 'alex22',
            amount: 15000,
            currency: 'TSh',
            status: 'pending',
            created_at: new Date(Date.now() - 7200000).toISOString()
          }
        ]
      };
    }
    
    // Otherwise use the real API
    return await makeAdminApiCall(ADMIN_API.DASHBOARD);
  }, [isAuthenticated, user]);
  
  // User management
  const fetchUsers = useCallback(async (page = 1, perPage = 10, search = '') => {
    if (!isAuthenticated) {
      throw new Error('Authentication required');
    }
    
    // Check if using mock admin
    if (user?.email === 'admin@cvchapchap.com') {
      // Generate mock users data
      const totalUsers = 127;
      const startIndex = (page - 1) * perPage;
      const endIndex = Math.min(startIndex + perPage, totalUsers);
      
      const mockUsers = [];
      
      for (let i = startIndex; i < endIndex; i++) {
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - i % 30);
        
        mockUsers.push({
          id: `user_${i + 1}`,
          username: `user${i + 1}`,
          email: `user${i + 1}@example.com`,
          fullName: `User ${i + 1}`,
          createdAt: createdDate.toISOString(),
          cvCount: Math.floor(Math.random() * 5),
          isActive: Math.random() > 0.1, // 90% of users are active
        });
      }
      
      // Filter by search term if provided
      const filteredUsers = search 
        ? mockUsers.filter(user => 
            user.username.includes(search) || 
            user.email.includes(search) || 
            user.fullName.includes(search)
          )
        : mockUsers;
      
      return {
        users: filteredUsers,
        total: totalUsers,
        page,
        perPage,
        totalPages: Math.ceil(totalUsers / perPage)
      };
    }
    
    // Otherwise use the real API
    const queryParams = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
      ...(search ? { search } : {})
    }).toString();
    
    return await makeAdminApiCall(`${ADMIN_API.USERS}?${queryParams}`);
  }, [isAuthenticated, user]);
  
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
    
    // Check if using mock admin
    if (user?.email === 'admin@cvchapchap.com') {
      // Return mock templates data
      return {
        templates: [
          {
            id: 'brightDiamond',
            name: 'Bright Diamond',
            description: 'A clean and professional template with a colored banner',
            thumbnail: '/templates/brightDiamond.png',
            usageCount: 87,
            createdAt: '2023-12-01T00:00:00.000Z',
            updatedAt: '2024-04-15T00:00:00.000Z',
            category: 'Professional',
            isActive: true
          },
          {
            id: 'classicBlue',
            name: 'Classic Blue',
            description: 'A traditional template with blue accents',
            thumbnail: '/templates/classicBlue.png',
            usageCount: 65,
            createdAt: '2023-12-05T00:00:00.000Z',
            updatedAt: '2024-04-10T00:00:00.000Z',
            category: 'Professional',
            isActive: true
          },
          {
            id: 'modernMinimal',
            name: 'Modern Minimal',
            description: 'A sleek and minimal modern design',
            thumbnail: '/templates/modernMinimal.png',
            usageCount: 93,
            createdAt: '2023-12-10T00:00:00.000Z',
            updatedAt: '2024-04-15T00:00:00.000Z',
            category: 'Creative',
            isActive: true
          },
          {
            id: 'elegantSerif',
            name: 'Elegant Serif',
            description: 'An elegant template with serif typography',
            thumbnail: '/templates/elegantSerif.png',
            usageCount: 42,
            createdAt: '2024-01-15T00:00:00.000Z',
            updatedAt: '2024-04-01T00:00:00.000Z',
            category: 'Executive',
            isActive: true
          },
          {
            id: 'creativeAccent',
            name: 'Creative Accent',
            description: 'A template with creative color accents',
            thumbnail: '/templates/creativeAccent.png',
            usageCount: 56,
            createdAt: '2024-01-25T00:00:00.000Z',
            updatedAt: '2024-03-20T00:00:00.000Z',
            category: 'Creative',
            isActive: true
          }
        ],
        total: 15
      };
    }
    
    return await makeAdminApiCall(ADMIN_API.TEMPLATES);
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
