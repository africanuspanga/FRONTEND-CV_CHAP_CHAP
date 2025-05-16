/**
 * Error handler utility
 * Provides consistent error handling and reporting
 */

/**
 * Standard error structure
 */
export interface AppError {
  message: string;
  code?: string;
  details?: any;
  originalError?: any;
}

/**
 * Create a standardized error object
 * @param message - Error message
 * @param code - Error code
 * @param details - Additional error details
 * @param originalError - Original error object
 * @returns - Standardized error object
 */
export function createError(
  message: string,
  code?: string,
  details?: any,
  originalError?: any
): AppError {
  return {
    message,
    code,
    details,
    originalError,
  };
}

/**
 * Handle API error responses
 * @param error - Error from API call
 * @returns - Standardized error object
 */
export function handleApiError(error: any): AppError {
  console.error('API Error:', error);
  
  // Check if it's a response error
  if (error.response) {
    // Server responded with an error status code
    const serverError = error.response.data || {};
    
    return createError(
      serverError.message || 'An error occurred with the server',
      serverError.code || String(error.response.status),
      serverError.details,
      error
    );
  }
  
  // Network error
  if (error.request) {
    return createError(
      'Could not connect to the server. Please check your internet connection.',
      'NETWORK_ERROR',
      undefined,
      error
    );
  }
  
  // Unknown error
  return createError(
    error.message || 'An unexpected error occurred',
    'UNKNOWN_ERROR',
    undefined,
    error
  );
}

/**
 * Handle form submission errors
 * @param error - Error from form submission
 * @returns - Standardized error object
 */
export function handleFormError(error: any): AppError {
  console.error('Form Error:', error);
  
  // Check if it's a validation error
  if (error.errors) {
    return createError(
      'Please fix the errors in the form',
      'VALIDATION_ERROR',
      error.errors,
      error
    );
  }
  
  // Unknown form error
  return createError(
    error.message || 'An error occurred while submitting the form',
    'FORM_ERROR',
    undefined,
    error
  );
}

/**
 * Log errors to console with enhanced formatting
 * @param error - Error to log
 * @param context - Context where the error occurred
 */
export function logError(error: any, context: string = 'General'): void {
  console.group(`Error in ${context}`);
  console.error('Error message:', error.message || 'No message');
  
  if (error.code) {
    console.error('Error code:', error.code);
  }
  
  if (error.details) {
    console.error('Error details:', error.details);
  }
  
  if (error.stack) {
    console.error('Stack trace:', error.stack);
  }
  
  console.groupEnd();
}

/**
 * Get user-friendly error message
 * @param error - Error object
 * @returns - User-friendly error message
 */
export function getUserFriendlyMessage(error: AppError | any): string {
  // Common error types
  const errorTypesMap: Record<string, string> = {
    'NETWORK_ERROR': 'Unable to connect to the server. Please check your internet connection and try again.',
    'VALIDATION_ERROR': 'Please correct the errors in the form and try again.',
    'AUTH_ERROR': 'There was a problem with your login. Please try again.',
    'SERVER_ERROR': 'The server encountered an error. Please try again later.',
    'STORAGE_ERROR': 'Unable to save your data. Please make sure your device has enough storage.',
  };
  
  // If it's our AppError type
  if (error && 'code' in error && typeof error.code === 'string') {
    const appError = error as AppError;
    
    // Return mapped message if available
    if (appError.code && errorTypesMap[appError.code]) {
      return errorTypesMap[appError.code];
    }
    
    // Otherwise return the error message
    return appError.message || 'An unexpected error occurred. Please try again.';
  }
  
  // If it's a generic error
  return error?.message || 'An unexpected error occurred. Please try again.';
}