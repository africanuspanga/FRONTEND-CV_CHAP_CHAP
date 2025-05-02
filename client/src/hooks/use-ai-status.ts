/**
 * AI Status Hook
 * This hook checks the availability of AI features by verifying API keys on the server
 */

import { useQuery } from '@tanstack/react-query';

interface ApiKeyStatus {
  openai: boolean;
}

/**
 * Hook to check the status of AI-related API keys
 */
export function useAIStatus() {
  const { data, isLoading, error } = useQuery<ApiKeyStatus>({
    queryKey: ['/api/keys/status'],
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    retry: 1,
  });

  return {
    isLoading,
    error,
    hasOpenAI: data?.openai || false,
  };
}
