/**
 * CORS Proxy for handling cross-origin requests to external APIs
 *
 * This module implements a client-side approach to handling CORS issues
 * by providing methods to make requests to the external CV Screener API.
 * It now uses our server-side proxy for better CORS handling.
 */

// Original direct API URL (for reference only)
// const CV_SCREENER_API = 'https://cv-screener-africanuspanga.replit.app';

// Our server-side proxy URL
const CV_SCREENER_PROXY = '/cv-screener-proxy';

type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  headers?: Record<string, string>;
  body?: any;
  responseType?: 'json' | 'blob' | 'text';
  includeCredentials?: boolean;
};

/**
 * Make a CORS-friendly API request to the CV Screener API through our server proxy
 * 
 * @param endpoint The API endpoint path (without the base URL)
 * @param options Request options
 * @returns Promise with the response
 */
export async function fetchFromCVScreener<T>(
  endpoint: string,
  options: RequestOptions
): Promise<T> {
  // Ensure endpoint starts with / for proper URL construction
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  const url = `${CV_SCREENER_PROXY}/${normalizedEndpoint}`;
  
  // Set up headers
  const headers = {
    'Content-Type': 'application/json',
    'Accept': options.responseType === 'blob' ? 'application/pdf' : 'application/json',
    ...(options.headers || {})
  };

  try {
    console.log(`Making ${options.method} request through proxy to: ${normalizedEndpoint}`);
    
    // Make the request through our proxy
    const response = await fetch(url, {
      method: options.method,
      headers,
      credentials: options.includeCredentials ? 'include' : 'same-origin',
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: 'no-store', // Don't cache responses for API calls
    });

    // Handle error responses
    if (!response.ok) {
      console.error(`Error response from proxy: ${response.status} ${response.statusText}`);
      let errorMessage;
      try {
        // Try to get detailed error message from JSON response
        const errorData = await response.json();
        errorMessage = errorData.error || `Server responded with status ${response.status}`;
      } catch (e) {
        // If not JSON, use status text
        errorMessage = `Server responded with status ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Return the appropriate response format
    if (options.responseType === 'blob') {
      return await response.blob() as unknown as T;
    } else if (options.responseType === 'text') {
      return await response.text() as unknown as T;
    } else {
      // Default to JSON
      return await response.json() as T;
    }
  } catch (error) {
    console.error('Error making request to CV Screener API through proxy:', error);
    throw error;
  }
}
