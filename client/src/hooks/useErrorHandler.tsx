import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
  silent?: boolean;
}

interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback((error: Error | ApiError, options: ErrorOptions = {}) => {
    // Don't show toast if silent mode is enabled
    if (options.silent) {
      console.error('Silent error:', error);
      return;
    }

    // Log error for debugging
    console.error('Handled error:', error);

    // Determine error title and message
    let title = options.title || 'Error';
    let description = options.description || 'An unexpected error occurred';

    // Handle different types of errors
    if (error instanceof Error) {
      // API Error with status
      if ('status' in error) {
        const apiError = error as ApiError;
        
        switch (apiError.status) {
          case 400:
            title = 'Invalid Request';
            description = apiError.message || 'The request contains invalid data';
            break;
          case 401:
            title = 'Authentication Required';
            description = 'Please log in to continue';
            break;
          case 403:
            title = 'Access Denied';
            description = 'You do not have permission to perform this action';
            break;
          case 404:
            title = 'Not Found';
            description = 'The requested resource was not found';
            break;
          case 429:
            title = 'Too Many Requests';
            description = 'Please wait a moment before trying again';
            break;
          case 500:
            title = 'Server Error';
            description = 'An internal server error occurred';
            break;
          case 503:
            title = 'Service Unavailable';
            description = 'The service is temporarily unavailable';
            break;
          default:
            title = 'Network Error';
            description = apiError.message || 'A network error occurred';
        }
      } else {
        // Generic JavaScript Error
        title = options.title || 'Application Error';
        description = error.message || description;
      }
    }

    // Network errors
    if (error.message?.includes('fetch') || error.message?.includes('NetworkError')) {
      title = 'Connection Error';
      description = 'Please check your internet connection and try again';
    }

    // Validation errors
    if (error.message?.includes('validation') || error.message?.includes('invalid')) {
      title = 'Validation Error';
      description = error.message || 'Please check your input and try again';
    }

    // Show toast notification
    toast({
      title,
      description,
      variant: options.variant || 'destructive',
      duration: options.duration || 5000,
    });
  }, [toast]);

  const handleApiError = useCallback(async (response: Response) => {
    let errorMessage = 'An API error occurred';
    let errorDetails: any = null;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      errorDetails = errorData;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }

    const apiError = new Error(errorMessage) as ApiError;
    apiError.status = response.status;
    apiError.details = errorDetails;

    return apiError;
  }, []);

  const withErrorHandling = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    options: ErrorOptions = {}
  ) => {
    return async (...args: T): Promise<R | null> => {
      try {
        return await fn(...args);
      } catch (error) {
        handleError(error as Error, options);
        return null;
      }
    };
  }, [handleError]);

  const createAsyncHandler = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    options: ErrorOptions = {}
  ) => {
    return (...args: T) => withErrorHandling(fn, options)(...args);
  }, [withErrorHandling]);

  return {
    handleError,
    handleApiError,
    withErrorHandling,
    createAsyncHandler,
  };
}