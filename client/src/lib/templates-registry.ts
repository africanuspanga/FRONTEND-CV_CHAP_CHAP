import { templateImages } from './template-images';

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  contentPath: string;
  isLocal: boolean;
  category: 'Modern' | 'Professional' | 'Creative' | 'Academic';
  popularity: 1 | 2 | 3 | 4 | 5;
  previewImage: string;
}

export const templateRegistry: TemplateDefinition[] = [
  {
    id: 'moonlightSonata',
    name: 'Moonlight Sonata',
    description: 'A modern template with a warm orange sidebar and clean layout',
    contentPath: '/templates/moonlight-sonata.html',
    isLocal: true,
    category: 'Modern',
    popularity: 5,
    previewImage: templateImages.moonlightSonata
  },
  {
    id: 'kaziFasta',
    name: 'Kazi Fasta',
    description: 'Clean two-column layout with skill bars and detailed professional experience sections',
    contentPath: '/templates/kazi-fasta.html',
    isLocal: true,
    category: 'Professional',
    popularity: 5,
    previewImage: templateImages.kaziFasta
  },
  {
    id: 'jijengeClassic',
    name: 'Jijenge Classic',
    description: 'Professional template with clean layout and subtle gray sidebar',
    contentPath: '/templates/jijenge-classic.html',
    isLocal: true,
    category: 'Professional',
    popularity: 5,
    previewImage: templateImages.jijengeClassic
  }
];

/**
 * Retrieve a template by its ID
 * @param id The template ID to look up
 * @returns The template definition or undefined if not found
 */
export function getTemplateById(id: string): TemplateDefinition | undefined {
  return templateRegistry.find(template => template.id === id);
}

/**
 * Get all available templates
 * @returns Array of all template definitions
 */
export function getAllTemplates(): TemplateDefinition[] {
  return templateRegistry;
}

/**
 * Filter templates by category
 * @param category The category to filter by
 * @returns Array of template definitions in that category
 */
export function getTemplatesByCategory(category: string): TemplateDefinition[] {
  return templateRegistry.filter(template => template.category === category);
}