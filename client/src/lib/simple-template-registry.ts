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

// Define the priority order for visible templates
const PRIORITY_TEMPLATE_ORDER = [
  'brightDiamond',
  'madiniMob', 
  'mjenziWaTaifa',
  'bigBoss',
  'mwalimuOne',
  'serengetiFlow'
];

/**
 * Get all available templates (filtered to show only priority templates)
 */
export function getAllTemplates(): CVTemplate[] {
  const allTemplates = getAllTemplatesBase();
  
  // Filter to only include priority templates
  const priorityTemplates = allTemplates.filter(template => 
    PRIORITY_TEMPLATE_ORDER.includes(template.id)
  );
  
  // Sort by priority order
  return priorityTemplates.sort((a, b) => {
    const aIndex = PRIORITY_TEMPLATE_ORDER.indexOf(a.id);
    const bIndex = PRIORITY_TEMPLATE_ORDER.indexOf(b.id);
    return aIndex - bIndex;
  });
}

/**
 * Get a template by ID
 */
export function getTemplateByID(id: string): CVTemplate | undefined {
  return getTemplateByIDBase(id);
}

/**
 * Get ALL templates including archived ones (for rendering existing CVs)
 */
export function getAllTemplatesIncludingArchived(): CVTemplate[] {
  return getAllTemplatesBase();
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
