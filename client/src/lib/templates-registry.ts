/**
 * Client-side template registry for CV Chap Chap
 * 
 * This module provides access to all available CV templates without any backend dependencies.
 * Templates are loaded dynamically from the templates directory and cached for performance.
 */

import { CVTemplate, getAllTemplates, getTemplateByID } from '@/templates/index';

// Define color scheme options
export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

// Define template with additional metadata
export interface TemplateWithMetadata extends CVTemplate {
  description: string;
  colorSchemes: ColorScheme[];
  previewImage?: string;
  isPopular?: boolean;
  isNew?: boolean;
  isPro?: boolean;
}

// Color scheme presets that can be applied to any template
const colorSchemes: Record<string, ColorScheme[]> = {
  standard: [
    {
      id: 'blue',
      name: 'Professional Blue',
      primary: '#034694',
      secondary: '#f8f9fa',
      accent: '#6c757d',
      background: '#ffffff',
      text: '#212529'
    },
    {
      id: 'green',
      name: 'Forest Green',
      primary: '#2E7D32',
      secondary: '#f1f8e9',
      accent: '#689f38',
      background: '#ffffff',
      text: '#212529'
    },
    {
      id: 'red',
      name: 'Bold Red',
      primary: '#c62828',
      secondary: '#ffebee',
      accent: '#ef5350',
      background: '#ffffff',
      text: '#212529'
    },
    {
      id: 'purple',
      name: 'Royal Purple',
      primary: '#6a1b9a',
      secondary: '#f3e5f5',
      accent: '#ab47bc',
      background: '#ffffff',
      text: '#212529'
    },
    {
      id: 'teal',
      name: 'Teal Accent',
      primary: '#00796b',
      secondary: '#e0f2f1',
      accent: '#26a69a',
      background: '#ffffff',
      text: '#212529'
    },
    {
      id: 'orange',
      name: 'Vibrant Orange',
      primary: '#ef6c00',
      secondary: '#fff3e0',
      accent: '#ff9800',
      background: '#ffffff',
      text: '#212529'
    },
    {
      id: 'grey',
      name: 'Classic Grey',
      primary: '#455a64',
      secondary: '#eceff1',
      accent: '#78909c',
      background: '#ffffff',
      text: '#212529'
    },
  ],
  modern: [
    {
      id: 'monochrome',
      name: 'Monochrome',
      primary: '#212529',
      secondary: '#f8f9fa',
      accent: '#495057',
      background: '#ffffff',
      text: '#212529'
    },
    {
      id: 'sepia',
      name: 'Sepia',
      primary: '#6d4c41',
      secondary: '#efebe9',
      accent: '#8d6e63',
      background: '#fffcf7',
      text: '#3e2723'
    },
  ]
};

// Get template metadata
const getTemplateMetadata = (templateId: string): Partial<TemplateWithMetadata> => {
  // Default descriptions and metadata
  const defaultMetadata: Record<string, Partial<TemplateWithMetadata>> = {
    moonlightSonata: {
      description: 'Elegant and modern design with subtle accents and clean layout.',
      colorSchemes: colorSchemes.standard,
      isPopular: true,
    },
    kaziFasta: {
      description: 'Bold, attention-grabbing design that showcases your achievements.',
      colorSchemes: colorSchemes.standard,
      isNew: true,
    },
    jijengeClassic: {
      description: 'Traditional CV layout with a professional appearance.',
      colorSchemes: colorSchemes.standard,
    },
    kilimanjaro: {
      description: 'Impressive and standout design inspired by Tanzania\'s highest peak.',
      colorSchemes: colorSchemes.standard,
      isPopular: true,
    },
    brightDiamond: {
      description: 'Clean, sparkling design that makes your skills shine.',
      colorSchemes: colorSchemes.standard,
    },
    mjenziWaTaifa: {
      description: 'Strong, structured layout ideal for construction and engineering professionals.',
      colorSchemes: colorSchemes.standard,
    },
    streetHustler: {
      description: 'Urban, dynamic design for creative professionals.',
      colorSchemes: colorSchemes.standard,
      isNew: true,
    },
    safariOriginal: {
      description: 'Adventure-inspired design that takes your career journey to new heights.',
      colorSchemes: colorSchemes.standard,
    },
    bigBoss: {
      description: 'Executive-level design that commands attention.',
      colorSchemes: colorSchemes.standard,
      isPro: true,
    },
    tanzanitePro: {
      description: 'Rare and valuable like the gemstone, this design makes you stand out.',
      colorSchemes: colorSchemes.standard,
      isPro: true,
    },
    mwalimuOne: {
      description: 'Scholarly design perfect for education professionals.',
      colorSchemes: colorSchemes.standard,
    },
    serengetiFlow: {
      description: 'Natural, flowing design inspired by Tanzania\'s famous plains.',
      colorSchemes: colorSchemes.standard,
    },
    smartBongo: {
      description: 'Intelligent design with a modern twist for tech professionals.',
      colorSchemes: colorSchemes.standard,
      isNew: true,
    },
    madiniMob: {
      description: 'Resource-rich design showcasing your valuable skills and experience.',
      colorSchemes: colorSchemes.standard,
    },
    mkaliModern: {
      description: 'Sharp, contemporary design for the modern professional.',
      colorSchemes: colorSchemes.standard,
      isPopular: true,
    }
  };
  
  return defaultMetadata[templateId] || {};
};

// Get all templates with metadata
export const getAllTemplatesWithMetadata = (): TemplateWithMetadata[] => {
  const templates = getAllTemplates();
  
  return templates.map(template => {
    const metadata = getTemplateMetadata(template.id);
    return {
      ...template,
      description: metadata.description || 'Professional CV template with clean design.',
      colorSchemes: metadata.colorSchemes || colorSchemes.standard,
      isPopular: metadata.isPopular || false,
      isNew: metadata.isNew || false,
      isPro: metadata.isPro || false,
    };
  });
};

// Get template by ID with metadata
export const getTemplateWithMetadata = (id: string): TemplateWithMetadata | undefined => {
  const template = getTemplateByID(id);
  if (!template) return undefined;
  
  const metadata = getTemplateMetadata(id);
  return {
    ...template,
    description: metadata.description || 'Professional CV template with clean design.',
    colorSchemes: metadata.colorSchemes || colorSchemes.standard,
    isPopular: metadata.isPopular || false,
    isNew: metadata.isNew || false,
    isPro: metadata.isPro || false,
  };
};

// Get popular templates
export const getPopularTemplates = (): TemplateWithMetadata[] => {
  return getAllTemplatesWithMetadata().filter(template => template.isPopular);
};

// Get new templates
export const getNewTemplates = (): TemplateWithMetadata[] => {
  return getAllTemplatesWithMetadata().filter(template => template.isNew);
};

// Get pro templates
export const getProTemplates = (): TemplateWithMetadata[] => {
  return getAllTemplatesWithMetadata().filter(template => template.isPro);
};

// Apply a color scheme to a template (for preview purposes)
export const applyColorScheme = (templateId: string, colorSchemeId: string): TemplateWithMetadata | undefined => {
  const template = getTemplateWithMetadata(templateId);
  if (!template) return undefined;
  
  const colorScheme = template.colorSchemes.find(scheme => scheme.id === colorSchemeId);
  if (!colorScheme) return template;
  
  // Here we could modify the template render function to apply the color scheme
  // This is a placeholder for actual implementation
  return template;
};
