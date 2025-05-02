import { useState, useEffect } from 'react';
import { getAllTemplates, getTemplateByID } from '@/templates/index';

// Note: This file bridges between templates/index.ts and the application components
// It will be eventually replaced by templates-registry.ts

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

/**
 * Converts a template registry definition to the Template interface
 * @returns Array of Template objects from the registry
 */
export const getTemplates = async (): Promise<Template[]> => {
  // Get templates from registry and map to Template interface
  const templates = getAllTemplates().map((template: any) => ({
    id: template.id,
    name: template.name,
    description: 'Professional CV template with a clean and modern design.',
    thumbnail: ''
  }));
  
  return Promise.resolve(templates);
};

/**
 * Hook to fetch templates from the client-side registry
 */
export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await getTemplates();
        setTemplates(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error loading templates'));
        setIsLoading(false);
      }
    };
    
    loadTemplates();
  }, []);
  
  return { data: templates, isLoading, error };
};
