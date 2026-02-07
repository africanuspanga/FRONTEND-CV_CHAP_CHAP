export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'modern' | 'creative' | 'minimal';
  hasPhoto: boolean;
  primaryColor: string;
  previewImage: string;
}

export const TEMPLATES: TemplateConfig[] = [
  // WITH PHOTO (7 Templates)
  {
    id: 'charles',
    name: 'Charles',
    description: 'Modern teal sidebar with photo - perfect for tech professionals',
    category: 'modern',
    hasPhoto: true,
    primaryColor: '#0891B2',
    previewImage: '/templates/charles.png',
  },
  {
    id: 'denice',
    name: 'Denice',
    description: 'Elegant rose theme with skill progress bars',
    category: 'creative',
    hasPhoto: true,
    primaryColor: '#9B7B7B',
    previewImage: '/templates/denice.png',
  },
  {
    id: 'oliver',
    name: 'Oliver',
    description: 'Clean centered layout with orange accents',
    category: 'professional',
    hasPhoto: true,
    primaryColor: '#E07A38',
    previewImage: '/templates/oliver.png',
  },
  {
    id: 'thomas',
    name: 'Thomas',
    description: 'Fresh mint design with timeline dots',
    category: 'modern',
    hasPhoto: true,
    primaryColor: '#8ECFC8',
    previewImage: '/templates/thomas.png',
  },
  {
    id: 'nelly-purple',
    name: 'Nelly Purple',
    description: 'Creative purple theme with circular skill charts',
    category: 'creative',
    hasPhoto: true,
    primaryColor: '#8B7BB5',
    previewImage: '/templates/nelly-purple.png',
  },
  {
    id: 'aparna-dark',
    name: 'Aparna Dark',
    description: 'Bold dark navy theme for executives',
    category: 'professional',
    hasPhoto: true,
    primaryColor: '#1E3A5F',
    previewImage: '/templates/aparna-dark.png',
  },
  {
    id: 'aparna-gold',
    name: 'Aparna Gold',
    description: 'Warm gold accents with modern layout',
    category: 'modern',
    hasPhoto: true,
    primaryColor: '#D4A056',
    previewImage: '/templates/aparna-gold.png',
  },
  // WITHOUT PHOTO (14 Templates)
  {
    id: 'kathleen',
    name: 'Kathleen',
    description: 'Bold yellow with decorative quote marks',
    category: 'creative',
    hasPhoto: false,
    primaryColor: '#E5B94E',
    previewImage: '/templates/kathleen.png',
  },
  {
    id: 'lauren-orange',
    name: 'Lauren Orange',
    description: 'Vibrant orange sidebar - great for marketing',
    category: 'creative',
    hasPhoto: false,
    primaryColor: '#E07A38',
    previewImage: '/templates/lauren-orange.png',
  },
  {
    id: 'grace-mint',
    name: 'Grace Mint',
    description: 'Fresh mint banner with elegant script name',
    category: 'modern',
    hasPhoto: false,
    primaryColor: '#6BBFAB',
    previewImage: '/templates/grace-mint.png',
  },
  {
    id: 'grace-navy',
    name: 'Grace Navy',
    description: 'Professional navy with bold headings',
    category: 'professional',
    hasPhoto: false,
    primaryColor: '#1E4A6D',
    previewImage: '/templates/grace-navy.png',
  },
  {
    id: 'grace-coral',
    name: 'Grace Coral',
    description: 'Striking coral red with left border accent',
    category: 'creative',
    hasPhoto: false,
    primaryColor: '#E85A5A',
    previewImage: '/templates/grace-coral.png',
  },
  {
    id: 'grace-minimal',
    name: 'Grace Minimal',
    description: 'Clean grayscale with section dividers',
    category: 'minimal',
    hasPhoto: false,
    primaryColor: '#6B7280',
    previewImage: '/templates/grace-minimal.png',
  },
  {
    id: 'grace-teal',
    name: 'Grace Teal',
    description: 'Teal timeline design with left border',
    category: 'modern',
    hasPhoto: false,
    primaryColor: '#2AAA9E',
    previewImage: '/templates/grace-teal.png',
  },
  {
    id: 'nelly-mint',
    name: 'Nelly Mint',
    description: 'Clean mint headers with three-column skills',
    category: 'modern',
    hasPhoto: false,
    primaryColor: '#3EB489',
    previewImage: '/templates/nelly-mint.png',
  },
  {
    id: 'nelly-gray',
    name: 'Nelly Gray',
    description: 'Minimal grayscale with horizontal skill bars',
    category: 'minimal',
    hasPhoto: false,
    primaryColor: '#4B5563',
    previewImage: '/templates/nelly-gray.png',
  },
  {
    id: 'nelly-sidebar',
    name: 'Nelly Sidebar',
    description: 'Clean left sidebar for contact and skills',
    category: 'minimal',
    hasPhoto: false,
    primaryColor: '#374151',
    previewImage: '/templates/nelly-sidebar.png',
  },
  {
    id: 'lesley',
    name: 'Lesley',
    description: 'Navy section labels in left column',
    category: 'professional',
    hasPhoto: false,
    primaryColor: '#2B4764',
    previewImage: '/templates/lesley.png',
  },
  {
    id: 'kelly',
    name: 'Kelly',
    description: 'Classic with boxed section headers',
    category: 'professional',
    hasPhoto: false,
    primaryColor: '#1F2937',
    previewImage: '/templates/kelly.png',
  },
  {
    id: 'lauren-icons',
    name: 'Lauren Icons',
    description: 'Modern two-column with section icons',
    category: 'modern',
    hasPhoto: false,
    primaryColor: '#374151',
    previewImage: '/templates/lauren-icons.png',
  },
  {
    id: 'richard',
    name: 'Richard',
    description: 'Elegant black theme with horizontal lines',
    category: 'professional',
    hasPhoto: false,
    primaryColor: '#111827',
    previewImage: '/templates/richard.png',
  },
  // NEW TEMPLATES (9 Templates)
  {
    id: 'classic-elegant',
    name: 'Classic Elegant',
    description: 'Traditional serif layout with timeless appeal',
    category: 'professional',
    hasPhoto: false,
    primaryColor: '#1F2937',
    previewImage: '/templates/classic-elegant.png',
  },
  {
    id: 'teal-accent',
    name: 'Teal Accent',
    description: 'Modern teal headers with timeline layout',
    category: 'modern',
    hasPhoto: false,
    primaryColor: '#3B9B9B',
    previewImage: '/templates/teal-accent.png',
  },
  {
    id: 'professional-sidebar',
    name: 'Professional Sidebar',
    description: 'Clean two-column layout with accent sidebar',
    category: 'professional',
    hasPhoto: false,
    primaryColor: '#6B7B8C',
    previewImage: '/templates/professional-sidebar.png',
  },
  {
    id: 'centered-traditional',
    name: 'Centered Traditional',
    description: 'Formal centered layout for corporate roles',
    category: 'professional',
    hasPhoto: false,
    primaryColor: '#1F2937',
    previewImage: '/templates/centered-traditional.png',
  },
  {
    id: 'modern-header',
    name: 'Modern Header',
    description: 'Bold header bar with two-column content',
    category: 'modern',
    hasPhoto: false,
    primaryColor: '#4B5563',
    previewImage: '/templates/modern-header.png',
  },
  {
    id: 'creative-yellow',
    name: 'Creative Yellow',
    description: 'Friendly yellow header for creative roles',
    category: 'creative',
    hasPhoto: false,
    primaryColor: '#F5C542',
    previewImage: '/templates/creative-yellow.png',
  },
  {
    id: 'diamond-monogram',
    name: 'Diamond Monogram',
    description: 'Elegant diamond initials with minimal design',
    category: 'minimal',
    hasPhoto: false,
    primaryColor: '#4B5563',
    previewImage: '/templates/diamond-monogram.png',
  },
  {
    id: 'timeline-gray',
    name: 'Timeline Gray',
    description: 'Timeline-style experience with gray header',
    category: 'modern',
    hasPhoto: false,
    primaryColor: '#6B7280',
    previewImage: '/templates/timeline-gray.png',
  },
  {
    id: 'hexagon-blue',
    name: 'Hexagon Blue',
    description: 'Modern hexagon initials with blue accents',
    category: 'modern',
    hasPhoto: false,
    primaryColor: '#2563EB',
    previewImage: '/templates/hexagon-blue.png',
  },
];

export function getTemplateById(id: string): TemplateConfig | undefined {
  return TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: TemplateConfig['category']): TemplateConfig[] {
  return TEMPLATES.filter(t => t.category === category);
}

export function getTemplatesWithPhoto(): TemplateConfig[] {
  return TEMPLATES.filter(t => t.hasPhoto);
}

export function getTemplatesWithoutPhoto(): TemplateConfig[] {
  return TEMPLATES.filter(t => !t.hasPhoto);
}
