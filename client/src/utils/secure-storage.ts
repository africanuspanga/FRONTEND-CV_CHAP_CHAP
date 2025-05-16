/**
 * Secure Storage Utility
 * Provides enhanced security for localStorage and sessionStorage
 * by implementing obfuscation, data validation, and sanitization
 */

// Generate a simple key for obfuscation (not true encryption)
// This is just to prevent casual inspection of data
const STORAGE_KEY = 'cv_chap_chap_v1';

/**
 * Securely store data in localStorage with obfuscation
 * @param key - Storage key
 * @param data - Data to store
 */
export function secureSetItem(key: string, data: any): void {
  try {
    // Sanitize the data to prevent XSS attacks
    const sanitizedData = sanitizeData(data);
    
    // Serialize and obfuscate the data
    const serialized = JSON.stringify(sanitizedData);
    const obfuscated = obfuscateData(serialized);
    
    // Store the data
    localStorage.setItem(key, obfuscated);
  } catch (error) {
    console.error(`Error in secureSetItem for key ${key}:`, error);
    // Fallback to regular storage in case of error
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (fallbackError) {
      console.error('Fallback storage also failed:', fallbackError);
    }
  }
}

/**
 * Securely retrieve data from localStorage with deobfuscation
 * @param key - Storage key
 * @returns - Retrieved data or null if not found
 */
export function secureGetItem<T>(key: string): T | null {
  try {
    // Get the data
    const obfuscated = localStorage.getItem(key);
    if (!obfuscated) return null;
    
    // Deobfuscate and parse the data
    try {
      const serialized = deobfuscateData(obfuscated);
      return JSON.parse(serialized) as T;
    } catch (parseError) {
      // If deobfuscation fails, try to parse it directly
      // (in case it was stored without obfuscation)
      return JSON.parse(obfuscated) as T;
    }
  } catch (error) {
    console.error(`Error in secureGetItem for key ${key}:`, error);
    return null;
  }
}

/**
 * Securely store data in sessionStorage with obfuscation
 * @param key - Storage key
 * @param data - Data to store
 */
export function secureSessionSetItem(key: string, data: any): void {
  try {
    // Sanitize the data to prevent XSS attacks
    const sanitizedData = sanitizeData(data);
    
    // Serialize and obfuscate the data
    const serialized = JSON.stringify(sanitizedData);
    const obfuscated = obfuscateData(serialized);
    
    // Store the data
    sessionStorage.setItem(key, obfuscated);
  } catch (error) {
    console.error(`Error in secureSessionSetItem for key ${key}:`, error);
    // Fallback to regular storage in case of error
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (fallbackError) {
      console.error('Fallback session storage also failed:', fallbackError);
    }
  }
}

/**
 * Securely retrieve data from sessionStorage with deobfuscation
 * @param key - Storage key
 * @returns - Retrieved data or null if not found
 */
export function secureSessionGetItem<T>(key: string): T | null {
  try {
    // Get the data
    const obfuscated = sessionStorage.getItem(key);
    if (!obfuscated) return null;
    
    // Deobfuscate and parse the data
    try {
      const serialized = deobfuscateData(obfuscated);
      return JSON.parse(serialized) as T;
    } catch (parseError) {
      // If deobfuscation fails, try to parse it directly
      // (in case it was stored without obfuscation)
      return JSON.parse(obfuscated) as T;
    }
  } catch (error) {
    console.error(`Error in secureSessionGetItem for key ${key}:`, error);
    return null;
  }
}

/**
 * Simple obfuscation using XOR with a key
 * This is NOT secure encryption, just basic obfuscation to prevent casual inspection
 * @param data - Data to obfuscate
 * @returns - Obfuscated data
 */
function obfuscateData(data: string): string {
  try {
    // For simplicity, just use base64 encoding
    // For a real app, consider using the Web Crypto API
    return btoa(data);
  } catch (error) {
    console.error('Error in obfuscateData:', error);
    return data; // Return original on error
  }
}

/**
 * Deobfuscate data (reverse of obfuscateData)
 * @param obfuscated - Obfuscated data
 * @returns - Original data
 */
function deobfuscateData(obfuscated: string): string {
  try {
    // Decode base64
    return atob(obfuscated);
  } catch (error) {
    console.error('Error in deobfuscateData:', error);
    return obfuscated; // Return original on error
  }
}

/**
 * Sanitize data to prevent XSS attacks
 * @param data - Data to sanitize
 * @returns - Sanitized data
 */
function sanitizeData(data: any): any {
  if (!data) return data;
  
  // Create a deep copy to avoid mutating the original
  const sanitized = JSON.parse(JSON.stringify(data));
  
  // Helper function to recursively sanitize strings
  const sanitizeRecursive = (obj: any) => {
    if (!obj) return;
    
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        // Remove potentially dangerous HTML/JS content
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+=/gi, '')
          .replace(/eval\(/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeRecursive(obj[key]);
      }
    });
  };
  
  sanitizeRecursive(sanitized);
  return sanitized;
}

/**
 * Validate that the data doesn't contain suspicious content
 * @param data - Data to validate
 * @returns - True if data is safe, false otherwise
 */
export function validateSafeData(data: any): boolean {
  if (!data) return true;
  
  // Helper function to check for suspicious patterns
  const hasSuspiciousContent = (value: string): boolean => {
    const suspicious = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
      /javascript:/i,
      /data:text\/html/i,
      /on\w+=/i,
      /eval\(/i,
      /expression\(/i
    ];
    
    return suspicious.some(pattern => pattern.test(value));
  };
  
  // Helper function to recursively check data
  const checkRecursive = (obj: any): boolean => {
    if (!obj) return true;
    
    if (typeof obj === 'string') {
      return !hasSuspiciousContent(obj);
    }
    
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        return obj.every(item => checkRecursive(item));
      }
      
      return Object.values(obj).every(value => checkRecursive(value));
    }
    
    return true;
  };
  
  return checkRecursive(data);
}