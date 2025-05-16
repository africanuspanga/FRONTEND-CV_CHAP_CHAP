/**
 * Form Validation Utility
 * Provides enhanced validation for form inputs
 */

import { z } from 'zod';
import { validateSafeData } from './secure-storage';

/**
 * Email validation regex
 * Follows HTML5 standard with additions for common email formats
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Phone number validation regex
 * Supports international format with optional country code
 */
const PHONE_REGEX = /^(\+\d{1,3}[- ]?)?\d{9,15}$/;

/**
 * URL validation regex
 * Validates common URL formats including https, http, ftp
 */
const URL_REGEX = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

/**
 * Personal information validation schema
 */
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  email: z.string().regex(EMAIL_REGEX, 'Invalid email format'),
  phone: z.string().regex(PHONE_REGEX, 'Invalid phone number').optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  professionalTitle: z.string().optional(),
  location: z.string().optional(),
  jobTitle: z.string().optional(),
  summary: z.string().max(1000, 'Summary is too long').optional(),
});

/**
 * Work experience validation schema
 */
export const workExperienceSchema = z.object({
  id: z.string(),
  jobTitle: z.string().min(1, 'Job title is required').max(100, 'Job title is too long'),
  company: z.string().min(1, 'Company name is required').max(100, 'Company name is too long'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().max(1000, 'Description is too long').optional(),
  achievements: z.array(z.string()).optional(),
});

/**
 * Education validation schema
 */
export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution name is required').max(100, 'Institution name is too long'),
  degree: z.string().min(1, 'Degree is required').max(100, 'Degree is too long'),
  field: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().max(1000, 'Description is too long').optional(),
});

/**
 * Skills validation schema
 */
export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill name is required').max(50, 'Skill name is too long'),
  level: z.number().min(1).max(5).optional(),
});

/**
 * Validate personal information
 * @param data - Personal information to validate
 * @returns - Validation result
 */
export function validatePersonalInfo(data: any): { valid: boolean; errors?: Record<string, string> } {
  try {
    // First check for potential XSS
    if (!validateSafeData(data)) {
      return { 
        valid: false,
        errors: { _form: 'Invalid input detected' }
      };
    }
    
    // Try to validate with schema
    const result = personalInfoSchema.safeParse(data);
    if (!result.success) {
      const formattedErrors = result.error.format();
      const errors: Record<string, string> = {};
      
      // Convert Zod errors to simple string format
      Object.keys(formattedErrors).forEach(key => {
        if (key !== '_errors' && formattedErrors[key]?._errors?.length > 0) {
          errors[key] = formattedErrors[key]._errors[0];
        }
      });
      
      return {
        valid: false,
        errors
      };
    }
    
    return { valid: true };
  } catch (error) {
    console.error('Error validating personal info:', error);
    return {
      valid: false,
      errors: { _form: 'Validation error occurred' }
    };
  }
}

/**
 * Validate work experience
 * @param data - Work experience to validate
 * @returns - Validation result
 */
export function validateWorkExperience(data: any): { valid: boolean; errors?: Record<string, string> } {
  try {
    // First check for potential XSS
    if (!validateSafeData(data)) {
      return { 
        valid: false,
        errors: { _form: 'Invalid input detected' }
      };
    }
    
    // Try to validate with schema
    const result = workExperienceSchema.safeParse(data);
    if (!result.success) {
      const formattedErrors = result.error.format();
      const errors: Record<string, string> = {};
      
      // Convert Zod errors to simple string format
      Object.keys(formattedErrors).forEach(key => {
        if (key !== '_errors' && formattedErrors[key]?._errors?.length > 0) {
          errors[key] = formattedErrors[key]._errors[0];
        }
      });
      
      return {
        valid: false,
        errors
      };
    }
    
    return { valid: true };
  } catch (error) {
    console.error('Error validating work experience:', error);
    return {
      valid: false,
      errors: { _form: 'Validation error occurred' }
    };
  }
}

/**
 * Check for potential XSS vectors in a string
 * @param input - String to check
 * @returns - True if XSS vectors found, false otherwise
 */
export function hasXssVectors(input: string): boolean {
  if (!input) return false;
  
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
    /javascript:/i,
    /data:text\/html/i,
    /on\w+=/i,
    /eval\(/i,
    /expression\(/i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(input));
}