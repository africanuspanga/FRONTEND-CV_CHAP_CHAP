// This file is intentionally left as .js instead of .ts to fix import cycles

// Template definition
export const templates = {
  moonlightSonata: {
    id: 'moonlightSonata',
    name: 'Moonlight Sonata',
    previewImage: '/images/templates/moonlightSonata.png',
    category: 'Professional',
    render: () => null // Placeholder
  },
  kaziFasta: {
    id: 'kaziFasta',
    name: 'Kazi Fasta',
    previewImage: '/images/templates/kaziFasta.png',
    category: 'Modern',
    render: () => null // Placeholder
  },
  jijengeClassic: {
    id: 'jijengeClassic',
    name: 'Jijenge Classic',
    previewImage: '/static/templates-preview.png',
    category: 'Classic',
    render: () => null // Placeholder
  },
  kilimanjaro: {
    id: 'kilimanjaro',
    name: 'Kilimanjaro',
    previewImage: '/static/templates-preview.png',
    category: 'Professional',
    render: () => null // Placeholder
  },
  brightDiamond: {
    id: 'brightDiamond',
    name: 'Bright Diamond',
    previewImage: '/static/templates-preview.png',
    category: 'Elegant',
    render: () => null // Placeholder
  },
  mjenziWaTaifa: {
    id: 'mjenziWaTaifa',
    name: 'Mjenzi wa Taifa',
    previewImage: '/static/templates-preview.png',
    category: 'Technical',
    render: () => null // Placeholder
  },
  streetHustler: {
    id: 'streetHustler',
    name: 'Street Hustler',
    previewImage: '/static/templates-preview.png',
    category: 'Creative',
    render: () => null // Placeholder
  },
  safariOriginal: {
    id: 'safariOriginal',
    name: 'Safari Original',
    previewImage: '/static/templates-preview.png',
    category: 'Modern',
    render: () => null // Placeholder
  },
  bigBoss: {
    id: 'bigBoss',
    name: 'Big Boss',
    previewImage: '/static/templates-preview.png',
    category: 'Executive',
    render: () => null // Placeholder
  },
  tanzanitePro: {
    id: 'tanzanitePro',
    name: 'Tanzanite Pro',
    previewImage: '/static/templates-preview.png',
    category: 'Premium',
    render: () => null // Placeholder
  },
  mwalimuOne: {
    id: 'mwalimuOne',
    name: 'Mwalimu One',
    previewImage: '/static/templates-preview.png',
    category: 'Education',
    render: () => null // Placeholder
  },
  serengetiFlow: {
    id: 'serengetiFlow',
    name: 'Serengeti Flow',
    previewImage: '/static/templates-preview.png',
    category: 'Modern',
    render: () => null // Placeholder
  },
  smartBongo: {
    id: 'smartBongo',
    name: 'Smart Bongo',
    previewImage: '/static/templates-preview.png',
    category: 'Technology',
    render: () => null // Placeholder
  },
  madiniMob: {
    id: 'madiniMob',
    name: 'Madini Mob',
    previewImage: '/static/templates-preview.png',
    category: 'Industry',
    render: () => null // Placeholder
  },
  mkaliModern: {
    id: 'mkaliModern',
    name: 'Mkali Modern',
    previewImage: '/static/templates-preview.png',
    category: 'Creative',
    render: () => null // Placeholder
  }
};

// Export functions
export function getTemplateByID(id) {
  return templates[id];
}

export function getAllTemplates() {
  return Object.values(templates);
}
