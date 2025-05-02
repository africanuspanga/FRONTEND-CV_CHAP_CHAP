// This file is intentionally left as .js instead of .ts to fix import cycles

// Template definition
export const templates = {
  moonlightSonata: {
    id: 'moonlightSonata',
    name: 'Moonlight Sonata',
    previewImage: '/template-previews/moonlight-sonata.png',
    category: 'Professional',
    render: () => null // Placeholder
  },
  kaziFasta: {
    id: 'kaziFasta',
    name: 'Kazi Fasta',
    previewImage: '/template-previews/kazi-fasta.png',
    category: 'Modern',
    render: () => null // Placeholder
  },
  jijengeClassic: {
    id: 'jijengeClassic',
    name: 'Jijenge Classic',
    previewImage: '/template-previews/jijenge-classic.png',
    category: 'Classic',
    render: () => null // Placeholder
  },
  kilimanjaro: {
    id: 'kilimanjaro',
    name: 'Kilimanjaro',
    previewImage: '/template-previews/kilimanjaro.png',
    category: 'Professional',
    render: () => null // Placeholder
  },
  brightDiamond: {
    id: 'brightDiamond',
    name: 'Bright Diamond',
    previewImage: '/template-previews/bright-diamond.png',
    category: 'Elegant',
    render: () => null // Placeholder
  },
  mjenziWaTaifa: {
    id: 'mjenziWaTaifa',
    name: 'Mjenzi wa Taifa',
    previewImage: '/template-previews/mjenzi-wa-taifa.png',
    category: 'Technical',
    render: () => null // Placeholder
  },
  streetHustler: {
    id: 'streetHustler',
    name: 'Street Hustler',
    previewImage: '/template-previews/street-hustler.png',
    category: 'Creative',
    render: () => null // Placeholder
  },
  safariOriginal: {
    id: 'safariOriginal',
    name: 'Safari Original',
    previewImage: '/template-previews/safari-original.png',
    category: 'Modern',
    render: () => null // Placeholder
  },
  bigBoss: {
    id: 'bigBoss',
    name: 'Big Boss',
    previewImage: '/template-previews/big-boss.png',
    category: 'Executive',
    render: () => null // Placeholder
  },
  tanzanitePro: {
    id: 'tanzanitePro',
    name: 'Tanzanite Pro',
    previewImage: '/template-previews/tanzanite-pro.png',
    category: 'Premium',
    render: () => null // Placeholder
  },
  mwalimuOne: {
    id: 'mwalimuOne',
    name: 'Mwalimu One',
    previewImage: '/template-previews/mwalimu-one.png',
    category: 'Education',
    render: () => null // Placeholder
  },
  serengetiFlow: {
    id: 'serengetiFlow',
    name: 'Serengeti Flow',
    previewImage: '/template-previews/serengeti-flow.png',
    category: 'Modern',
    render: () => null // Placeholder
  },
  smartBongo: {
    id: 'smartBongo',
    name: 'Smart Bongo',
    previewImage: '/template-previews/smart-bongo.png',
    category: 'Technology',
    render: () => null // Placeholder
  },
  madiniMob: {
    id: 'madiniMob',
    name: 'Madini Mob',
    previewImage: '/template-previews/madini-mob.png',
    category: 'Industry',
    render: () => null // Placeholder
  },
  mkaliModern: {
    id: 'mkaliModern',
    name: 'Mkali Modern',
    previewImage: '/template-previews/mkali-modern.png',
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
