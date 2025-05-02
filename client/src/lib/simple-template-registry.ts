/**
 * Simplified template registry to fix import/export issues
 * This file provides a stable API for accessing templates
 */

// Import from .js file (template dummy data)
const templates = {
  moonlightSonata: {
    id: 'moonlightSonata',
    name: 'Moonlight Sonata',
    render: () => null // Placeholder
  },
  kaziFasta: {
    id: 'kaziFasta',
    name: 'Kazi Fasta',
    render: () => null // Placeholder
  },
  jijengeClassic: {
    id: 'jijengeClassic',
    name: 'Jijenge Classic',
    render: () => null // Placeholder
  }
  // More templates would be defined here
};

// Define the interface
export interface CVTemplate {
  id: string;
  name: string;
  render: (data: any) => JSX.Element | null;
}

/**
 * Get all available templates
 */
export function getAllTemplates(): CVTemplate[] {
  return Object.values(templates);
}

/**
 * Get a template by ID
 */
export function getTemplateByID(id: string): CVTemplate | undefined {
  return templates[id as keyof typeof templates];
}

/**
 * Get a template by category
 */
export function getTemplatesByCategory(category: string): CVTemplate[] {
  // Placeholder for actual category filtering
  return Object.values(templates);
}
