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
    popularity: 4,
    previewImage: '/images/moonlight-sonata.png'
  },
  {
    id: 'kaziFasta',
    name: 'Kazi Fasta',
    description: 'Clean two-column layout with skill bars and detailed professional experience sections',
    contentPath: '/templates/kazi-fasta.html',
    isLocal: true,
    category: 'Professional',
    popularity: 5,
    previewImage: '/images/kazi-fasta.png'
  },
  {
    id: 'tanzanite',
    name: 'Tanzanite',
    description: 'A professional, clean CV template with structured sections and a touch of blue. Perfect for administrative roles and business professionals.',
    contentPath: '/templates/tanzanite.html',
    isLocal: true,
    category: 'Professional',
    popularity: 5,
    previewImage: '/templates/previews/tanzanite.png'
  },
  {
    id: 'safariPro',
    name: 'Safari Pro',
    description: 'Bold design with earthy tones inspired by African landscapes',
    contentPath: '/templates/safari-pro.html',
    isLocal: true,
    category: 'Creative',
    popularity: 4,
    previewImage: '/templates/previews/safari-pro.png'
  },
  {
    id: 'mwalimuClassic',
    name: 'Mwalimu Classic',
    description: 'Traditional academic-style template for educational professionals',
    contentPath: '/templates/mwalimu-classic.html',
    isLocal: true,
    category: 'Academic',
    popularity: 4,
    previewImage: '/templates/previews/mwalimu-classic.png'
  },
  {
    id: 'mtaaHustler',
    name: 'Mtaa Hustler',
    description: 'A clean, modern CV template with a two-column layout. Perfect for professionals seeking a straightforward yet stylish presentation.',
    contentPath: '/templates/mtaa-hustler.html',
    isLocal: true,
    category: 'Modern',
    popularity: 4,
    previewImage: '/templates/previews/mtaa-hustler.png'
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