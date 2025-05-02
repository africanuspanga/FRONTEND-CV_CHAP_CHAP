/**
 * Simplified template registry to fix import/export issues
 * This file provides a stable API for accessing templates
 */

// Import from .js file (template data)
import { templates, getAllTemplates as getAllTemplatesBase, getTemplateByID as getTemplateByIDBase } from '../templates/index.js';

// Define the interface
export interface CVTemplate {
  id: string;
  name: string;
  previewImage?: string;
  category?: string;
  render: (data: any) => JSX.Element | null;
}

/**
 * Get all available templates
 */
export function getAllTemplates(): CVTemplate[] {
  return getAllTemplatesBase();
}

/**
 * Get a template by ID
 */
export function getTemplateByID(id: string): CVTemplate | undefined {
  return getTemplateByIDBase(id);
}

/**
 * Get a template by category
 */
export function getTemplatesByCategory(category: string): CVTemplate[] {
  // Filter templates by category
  return getAllTemplatesBase().filter(template => 
    (template as any).category === category
  );
}
