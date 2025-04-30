import { useQuery } from '@tanstack/react-query';
import { apiRequest } from './queryClient';

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

/**
 * Fetches all available templates from the API
 * @returns Promise with template data
 */
export const getTemplates = async (): Promise<Template[]> => {
  try {
    const response = await apiRequest('GET', '/api/templates', undefined);
    return await response.json();
  } catch (error) {
    console.error('Error fetching templates:', error);
    
    // Fallback to default templates if API fails
    return [
      {
        id: "moonlightSonata",
        name: "Moonlight Sonata",
        description: "A modern template with a warm orange sidebar and clean layout",
        thumbnail: "/templates/moonlight-sonata-thumbnail.svg"
      },
      {
        id: "tanzanite",
        name: "Tanzanite",
        description: "Professional template with blue accents and structured sections",
        thumbnail: "/templates/tanzanite-thumbnail.svg"
      },
      {
        id: "safariPro",
        name: "Safari Pro",
        description: "Bold design with earthy tones inspired by African landscapes",
        thumbnail: "/templates/safari-pro-thumbnail.svg"
      },
      {
        id: "mwalimuClassic",
        name: "Mwalimu Classic",
        description: "Traditional academic-style template for educational professionals",
        thumbnail: "/templates/mwalimu-classic-thumbnail.svg"
      }
    ];
  }
};

/**
 * Hook to fetch templates with React Query
 */
export const useTemplates = () => {
  return useQuery({
    queryKey: ['/api/templates'],
    queryFn: getTemplates
  });
};
