/**
 * Security utilities for CV Chap Chap
 * Contains data sanitization and obfuscation functions
 */

// Sanitize data before storage to prevent XSS attacks
export const sanitizeDataForStorage = (data: any): any => {
  if (!data) return data;
  
  // Create a deep copy to avoid mutating the original object
  const sanitized = JSON.parse(JSON.stringify(data));
  
  // Helper function to recursively sanitize strings in the object
  const sanitizeRecursive = (obj: any) => {
    if (!obj) return;
    
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        // Remove potentially dangerous HTML/JS
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
};

// Simple obfuscation function (not secure encryption but adds some protection)
export const obfuscateData = (data: string): string => {
  // Simple transformation to make the data unreadable to casual inspection
  try {
    return btoa(data); // Base64 encode the data
  } catch (e) {
    console.error('Error obfuscating data:', e);
    return data;
  }
};

// Deobfuscation function to retrieve the data
export const deobfuscateData = (data: string): string => {
  try {
    return atob(data); // Base64 decode the data
  } catch (e) {
    // If it's not base64 encoded, just return the original
    console.warn('Error deobfuscating data, returning original:', e);
    return data;
  }
};

// Detect XSS attempts in form submissions
export const hasXSSVector = (input: string): boolean => {
  if (!input) return false;
  
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
    /javascript:/i,
    /data:text\/html/i,
    /on\w+=/i,
    /eval\(/i,
    /expression\(/i
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
};

// Validate input for dangerous content before processing
export const validateSafeInput = (input: any): boolean => {
  // Check if any string fields contain XSS vectors
  const containsVectors = (obj: any): boolean => {
    if (!obj) return false;
    
    if (typeof obj === 'string') {
      return hasXSSVector(obj);
    }
    
    if (typeof obj === 'object') {
      return Object.values(obj).some(value => {
        if (Array.isArray(value)) {
          return value.some(item => containsVectors(item));
        }
        return containsVectors(value);
      });
    }
    
    return false;
  };
  
  return !containsVectors(input);
};