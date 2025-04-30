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
  },
  {
    id: 'kilimanjaro',
    name: 'Kilimanjaro',
    description: 'Modern left-sidebar CV with tag-style skills and detailed education section',
    contentPath: '/templates/kilimanjaro.html',
    isLocal: true,
    category: 'Creative',
    popularity: 5,
    previewImage: templateImages.kilimanjaro
  },
  {
    id: 'brightDiamond',
    name: 'Bright Diamond',
    description: 'Clean modern template with teal accents and multi-column skills section',
    contentPath: '/templates/bright-diamond.html',
    isLocal: true,
    category: 'Modern',
    popularity: 5,
    previewImage: templateImages.brightDiamond
  },
  {
    id: 'mjenziWaTaifa',
    name: 'Mjenzi wa Taifa',
    description: 'Elegant beige-header template with three-column layout and skill progress bars',
    contentPath: '/templates/mjenzi-wa-taifa.html',
    isLocal: true,
    category: 'Professional',
    popularity: 5,
    previewImage: templateImages.mjenziWaTaifa
  },
  {
    id: 'streetHustler',
    name: 'Street Hustler',
    description: 'Clean professional template with centered header and detailed work experience sections',
    contentPath: '/templates/street-hustler.html',
    isLocal: true,
    category: 'Professional',
    popularity: 5,
    previewImage: templateImages.streetHustler
  },
  {
    id: 'safariOriginal',
    name: 'Safari Original',
    description: 'Professional template with sidebar layout and detailed experience sections',
    contentPath: '/templates/safari-original.html',
    isLocal: true,
    category: 'Professional',
    popularity: 5,
    previewImage: templateImages.safariOriginal
  },
  {
    id: 'bigBoss',
    name: 'Big Boss',
    description: 'Bold template with dark header and elegant two-column top section',
    contentPath: '/templates/big-boss.html',
    isLocal: true,
    category: 'Modern',
    popularity: 5,
    previewImage: templateImages.bigBoss
  },
  {
    id: 'tanzanitePro',
    name: 'Tanzanite Pro',
    description: 'Elegant template with clean circular initials and professional two-column layout',
    contentPath: '/templates/tanzanite-pro.html',
    isLocal: true,
    category: 'Professional',
    popularity: 5,
    previewImage: templateImages.tanzanitePro
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