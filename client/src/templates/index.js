// This file is intentionally left as .js instead of .ts to fix import cycles

// Template definition
export const templates = {
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
  },
  kilimanjaro: {
    id: 'kilimanjaro',
    name: 'Kilimanjaro',
    render: () => null // Placeholder
  },
  brightDiamond: {
    id: 'brightDiamond',
    name: 'Bright Diamond',
    render: () => null // Placeholder
  },
  mjenziWaTaifa: {
    id: 'mjenziWaTaifa',
    name: 'Mjenzi wa Taifa',
    render: () => null // Placeholder
  },
  streetHustler: {
    id: 'streetHustler',
    name: 'Street Hustler',
    render: () => null // Placeholder
  },
  safariOriginal: {
    id: 'safariOriginal',
    name: 'Safari Original',
    render: () => null // Placeholder
  },
  bigBoss: {
    id: 'bigBoss',
    name: 'Big Boss',
    render: () => null // Placeholder
  },
  tanzanitePro: {
    id: 'tanzanitePro',
    name: 'Tanzanite Pro',
    render: () => null // Placeholder
  },
  mwalimuOne: {
    id: 'mwalimuOne',
    name: 'Mwalimu One',
    render: () => null // Placeholder
  },
  serengetiFlow: {
    id: 'serengetiFlow',
    name: 'Serengeti Flow',
    render: () => null // Placeholder
  },
  smartBongo: {
    id: 'smartBongo',
    name: 'Smart Bongo',
    render: () => null // Placeholder
  },
  madiniMob: {
    id: 'madiniMob',
    name: 'Madini Mob',
    render: () => null // Placeholder
  },
  mkaliModern: {
    id: 'mkaliModern',
    name: 'Mkali Modern',
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
