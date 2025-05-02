import { useState, useEffect } from 'react';

/**
 * Hook for checking the AI service availability
 * @returns Status of AI services
 */
export function useAIStatus() {
  const [hasOpenAI, setHasOpenAI] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check API keys status from server
    async function checkAPIStatus() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/keys/status');
        
        if (!response.ok) {
          throw new Error('Failed to check API status');
        }

        const data = await response.json();
        setHasOpenAI(data.openai === true);
      } catch (err) {
        console.error('Error checking API status:', err);
        setError(err instanceof Error ? err.message : 'Failed to check API status');
        setHasOpenAI(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAPIStatus();
  }, []);

  return { hasOpenAI, isLoading, error };
}
