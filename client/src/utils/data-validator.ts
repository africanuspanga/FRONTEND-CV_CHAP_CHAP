import { z } from "zod";
import { 
  cvDataSchema, 
  personalInfoSchema, 
  workExperienceSchema, 
  educationSchema,
  skillSchema,
  languageSchema,
  referenceSchema,
  websiteSchema,
  hobbySchema
} from "@shared/schema";

/**
 * Validates CV data against the schema and returns validation results
 * @param data The CV data to validate
 * @returns Object containing validation status and any errors
 */
export function validateCVData(data: any) {
  try {
    const result = cvDataSchema.safeParse(data);
    if (!result.success) {
      return {
        valid: false,
        errors: result.error.format(),
        errorMessage: "CV data validation failed"
      };
    }

    return { valid: true, data: result.data };
  } catch (error) {
    console.error("Validation error:", error);
    return {
      valid: false,
      errors: error,
      errorMessage: "Validation system error"
    };
  }
}

/**
 * Validates personal information against the schema
 * @param data Personal info to validate
 */
export function validatePersonalInfo(data: any) {
  return personalInfoSchema.safeParse(data);
}

/**
 * Validates a work experience entry against the schema
 * @param data Work experience entry to validate
 */
export function validateWorkExperience(data: any) {
  return workExperienceSchema.safeParse(data);
}

/**
 * Validates an education entry against the schema
 * @param data Education entry to validate
 */
export function validateEducation(data: any) {
  return educationSchema.safeParse(data);
}

/**
 * Validates a skill entry against the schema
 * @param data Skill entry to validate
 */
export function validateSkill(data: any) {
  return skillSchema.safeParse(data);
}

/**
 * Validates a language entry against the schema
 * @param data Language entry to validate
 */
export function validateLanguage(data: any) {
  return languageSchema.safeParse(data);
}

/**
 * Validates a reference entry against the schema
 * @param data Reference entry to validate
 */
export function validateReference(data: any) {
  return referenceSchema.safeParse(data);
}

/**
 * Validates a website link entry against the schema
 * @param data Website entry to validate
 */
export function validateWebsite(data: any) {
  return websiteSchema.safeParse(data);
}

/**
 * Validates a hobby entry against the schema
 * @param data Hobby entry to validate
 */
export function validateHobby(data: any) {
  return hobbySchema.safeParse(data);
}

/**
 * Validates and sanitizes a list of items against a schema
 * @param items List of items to validate
 * @param schema Zod schema to validate against
 * @returns Object with valid items and any errors
 */
export function validateList<T>(items: any[], schema: z.ZodType<T>) {
  if (!Array.isArray(items)) {
    return { 
      valid: false, 
      validItems: [], 
      errorMessage: "Expected an array but received: " + typeof items 
    };
  }

  const validItems: T[] = [];
  const errors: any[] = [];

  items.forEach((item, index) => {
    const result = schema.safeParse(item);
    if (result.success) {
      validItems.push(result.data);
    } else {
      errors.push({
        index,
        item,
        errors: result.error.format()
      });
    }
  });

  return {
    valid: errors.length === 0,
    validItems,
    errors: errors.length > 0 ? errors : null,
    errorCount: errors.length
  };
}

/**
 * Type guard to check if an object is a valid website link
 */
export function isWebsiteLink(item: any): item is { id: string; name: string; url: string } {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.url === 'string'
  );
}

/**
 * Type guard to check if an object is a valid work experience entry
 */
export function isWorkExperience(item: any): boolean {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.jobTitle === 'string' &&
    typeof item.company === 'string' &&
    typeof item.startDate === 'string'
  );
}

/**
 * Type guard to check if an object is a valid education entry
 */
export function isEducation(item: any): boolean {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.institution === 'string' &&
    typeof item.degree === 'string' &&
    typeof item.startDate === 'string'
  );
}

/**
 * Sanitizes user input for HTML safety
 * @param input Text input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Recovers corrupted array data by ensuring it's an array
 * @param data Data that should be an array
 * @param defaultValue Default value if data cannot be recovered
 * @returns Validated array
 */
export function ensureArray<T>(data: any, defaultValue: T[] = []): T[] {
  if (Array.isArray(data)) {
    return data;
  }

  // If it's a string, try to parse it as JSON
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // Not valid JSON, fall through
    }
  }

  return defaultValue;
}

/**
 * Ensures an object has all required fields or applies defaults
 * @param obj The object to fix
 * @param requiredFields List of required fields
 * @param defaults Default values for fields
 * @returns Fixed object with all required fields
 */
export function ensureObjectFields<T extends object>(
  obj: any,
  requiredFields: (keyof T)[],
  defaults: Partial<T>
): T {
  if (!obj || typeof obj !== 'object') {
    return { ...defaults } as T;
  }

  const result = { ...obj };

  for (const field of requiredFields) {
    if (result[field as string] === undefined || result[field as string] === null) {
      result[field as string] = defaults[field];
    }
  }

  return result as T;
}