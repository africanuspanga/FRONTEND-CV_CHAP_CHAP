/**
 * Authentication Token Management Utility
 * Provides secure handling of authentication tokens
 */

import { secureSessionSetItem, secureSessionGetItem } from './secure-storage';

// Token storage key
const TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'auth_user';

/**
 * Set authentication token in secure storage
 * @param token - JWT token to store
 */
export function setAuthToken(token: string): void {
  if (!token) {
    console.warn('Attempted to store empty token');
    return;
  }
  
  try {
    // Store in session storage for better security
    secureSessionSetItem(TOKEN_KEY, token);
    
    // Set default Authorization header for API calls
    setupAuthHeaders(token);
  } catch (error) {
    console.error('Error storing auth token:', error);
  }
}

/**
 * Get authentication token from secure storage
 * @returns - Stored JWT token or null if not found
 */
export function getAuthToken(): string | null {
  try {
    return secureSessionGetItem<string>(TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
}

/**
 * Remove authentication token from storage (logout)
 */
export function removeAuthToken(): void {
  try {
    // Remove from session storage
    sessionStorage.removeItem(TOKEN_KEY);
    
    // Remove user data
    sessionStorage.removeItem(USER_DATA_KEY);
    
    // Clear Authorization header
    removeAuthHeaders();
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
}

/**
 * Check if user is authenticated
 * @returns - True if valid auth token exists, false otherwise
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token) return false;
  
  // Check if token is expired
  try {
    const payload = parseToken(token);
    if (!payload || !payload.exp) return false;
    
    // Check if token is expired
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() < expirationTime;
  } catch (error) {
    console.error('Error validating auth token:', error);
    return false;
  }
}

/**
 * Get user data from secure storage
 * @returns - Stored user data or null if not found
 */
export function getAuthUser<T>(): T | null {
  try {
    return secureSessionGetItem<T>(USER_DATA_KEY);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
}

/**
 * Set user data in secure storage
 * @param userData - User data to store
 */
export function setAuthUser(userData: any): void {
  if (!userData) {
    console.warn('Attempted to store empty user data');
    return;
  }
  
  try {
    secureSessionSetItem(USER_DATA_KEY, userData);
  } catch (error) {
    console.error('Error storing user data:', error);
  }
}

/**
 * Set up default Authorization header for API calls
 * @param token - JWT token
 */
function setupAuthHeaders(token: string): void {
  // This would set headers for fetch or axios
  // If using a custom API client, configure it there
  console.log('Auth token set up for API calls');
}

/**
 * Remove Authorization header for API calls
 */
function removeAuthHeaders(): void {
  // This would remove headers for fetch or axios
  // If using a custom API client, configure it there
  console.log('Auth token removed from API calls');
}

/**
 * Parse JWT token and extract payload
 * @param token - JWT token to parse
 * @returns - Decoded token payload or null if invalid
 */
function parseToken(token: string): any {
  try {
    // JWT format: header.payload.signature
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    // Replace characters for parsing
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode and parse
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
}