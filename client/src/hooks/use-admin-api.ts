import { useCallback } from 'react';
import { ADMIN_API, makeAdminApiCall } from '@/lib/api-config';
import { useToast } from '@/hooks/use-toast';

// Hook to interact with admin API endpoints
export function useAdminApi() {
  const { toast } = useToast();

  // Fetch dashboard statistics
  const fetchDashboardStats = useCallback(async () => {
    try {
      return await makeAdminApiCall(ADMIN_API.DASHBOARD);
    } catch (error) {
      toast({
        title: 'Error fetching dashboard data',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Fetch users
  const fetchUsers = useCallback(async (page = 1, perPage = 20, search = '') => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      
      if (search) {
        queryParams.append('search', search);
      }
      
      return await makeAdminApiCall(`${ADMIN_API.USERS}?${queryParams.toString()}`);
    } catch (error) {
      toast({
        title: 'Error fetching users',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Fetch user details
  const fetchUserDetails = useCallback(async (userId: string) => {
    try {
      return await makeAdminApiCall(`${ADMIN_API.USERS}/${userId}`);
    } catch (error) {
      toast({
        title: 'Error fetching user details',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    try {
      return await makeAdminApiCall(ADMIN_API.TEMPLATES);
    } catch (error) {
      toast({
        title: 'Error fetching templates',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Fetch template details
  const fetchTemplateDetails = useCallback(async (templateId: string) => {
    try {
      return await makeAdminApiCall(`${ADMIN_API.TEMPLATES}/${templateId}`);
    } catch (error) {
      toast({
        title: 'Error fetching template details',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Create template
  const createTemplate = useCallback(async (templateData: any) => {
    try {
      return await makeAdminApiCall(ADMIN_API.TEMPLATES, {
        method: 'POST',
        body: JSON.stringify(templateData),
      });
    } catch (error) {
      toast({
        title: 'Error creating template',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Update template
  const updateTemplate = useCallback(async (templateId: string, templateData: any) => {
    try {
      return await makeAdminApiCall(`${ADMIN_API.TEMPLATES}/${templateId}`, {
        method: 'PUT',
        body: JSON.stringify(templateData),
      });
    } catch (error) {
      toast({
        title: 'Error updating template',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Delete template
  const deleteTemplate = useCallback(async (templateId: string) => {
    try {
      return await makeAdminApiCall(`${ADMIN_API.TEMPLATES}/${templateId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      toast({
        title: 'Error deleting template',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async (type: 'templates' | 'users') => {
    try {
      return await makeAdminApiCall(type === 'templates' ? ADMIN_API.ANALYTICS.TEMPLATES : ADMIN_API.ANALYTICS.USERS);
    } catch (error) {
      toast({
        title: `Error fetching ${type} analytics`,
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  return {
    fetchDashboardStats,
    fetchUsers,
    fetchUserDetails,
    fetchTemplates,
    fetchTemplateDetails,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    fetchAnalytics,
  };
}
