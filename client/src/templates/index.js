// This file is intentionally left as .js instead of .ts to fix import cycles

// Import the actual template components dynamically to avoid JSX in JS file issues
import { MoonlightSonataTemplate } from './moonlightSonata';
import { KaziFastaTemplate } from './kaziFasta';
import { JijengeClassicTemplate } from './jijengeClassic';
import { KilimanjaroTemplate } from './kilimanjaro';
import { BrightDiamondTemplate } from './brightDiamond';
import { MjenziWaTaifaTemplate } from './mjenziWaTaifa';
import { StreetHustlerTemplate } from './streetHustler';
import { SafariOriginalTemplate } from './safariOriginal';
import { BigBossTemplate } from './bigBoss';
import { TanzaniteProTemplate } from './tanzanitePro';
import { MwalimuOneTemplate } from './mwalimuOne';
import { SerengetiFlowTemplate } from './serengetiFlow';
import { SmartBongoTemplate } from './smartBongo';
import { MadiniMobTemplate } from './madiniMob';
import { MkaliModernTemplate } from './mkaliModern';
// Import the HOC to wrap templates with safe data handling
import withSafeTemplateData from '../lib/withSafeTemplateData';

// Import template preview images from correct paths
import moonlightSonataImg from '../assets/moonlight-sonata-preview.png';
import kaziFastaImg from '../assets/kazi-fasta-preview.png';
import jijengeClassicImg from '../assets/jijenge-classic-preview.png';
import kilimanjaroImg from '../assets/kilimanjaro-preview.png';
import brightDiamondImg from '../assets/bright-diamond-preview.png';
import mjenziWaTaifaImg from '../assets/mjenzi-wa-taifa-preview.png';
import streetHustlerImg from '../assets/street-hustler-preview.png';
import safariOriginalImg from '../assets/safari-original-preview.png';
import bigBossImg from '../assets/big-boss-preview.png';
import tanzaniteProImg from '../assets/tanzanite-pro-preview.png';
import mwalimuOneImg from '../assets/mwalimu-one-preview.png';
import serengetiFlowImg from '../assets/serengeti-flow-preview.png';
import smartBongoImg from '../assets/smart-bongo-preview.png';
import madiniMobImg from '../assets/madini-mob-preview.png';
import mkaliModernImg from '../assets/mkali-modern-preview.png';

// Template definition
export const templates = {
  moonlightSonata: {
    id: 'moonlightSonata',
    name: 'Moonlight Sonata',
    previewImage: moonlightSonataImg,
    category: 'Professional',
    render: withSafeTemplateData(MoonlightSonataTemplate)
  },
  kaziFasta: {
    id: 'kaziFasta',
    name: 'Kazi Fasta',
    previewImage: kaziFastaImg,
    category: 'Modern',
    render: withSafeTemplateData(KaziFastaTemplate)
  },
  jijengeClassic: {
    id: 'jijengeClassic',
    name: 'Jijenge Classic',
    previewImage: jijengeClassicImg,
    category: 'Classic',
    render: withSafeTemplateData(JijengeClassicTemplate)
  },
  kilimanjaro: {
    id: 'kilimanjaro',
    name: 'Kilimanjaro',
    previewImage: kilimanjaroImg,
    category: 'Professional',
    render: withSafeTemplateData(KilimanjaroTemplate)
  },
  brightDiamond: {
    id: 'brightDiamond',
    name: 'Bright Diamond',
    previewImage: brightDiamondImg,
    category: 'Elegant',
    render: withSafeTemplateData(BrightDiamondTemplate)
  },
  mjenziWaTaifa: {
    id: 'mjenziWaTaifa',
    name: 'Mjenzi wa Taifa',
    previewImage: mjenziWaTaifaImg,
    category: 'Technical',
    render: withSafeTemplateData(MjenziWaTaifaTemplate)
  },
  streetHustler: {
    id: 'streetHustler',
    name: 'Street Hustler',
    previewImage: streetHustlerImg,
    category: 'Creative',
    render: withSafeTemplateData(StreetHustlerTemplate)
  },
  safariOriginal: {
    id: 'safariOriginal',
    name: 'Safari Original',
    previewImage: safariOriginalImg,
    category: 'Modern',
    render: withSafeTemplateData(SafariOriginalTemplate)
  },
  bigBoss: {
    id: 'bigBoss',
    name: 'Big Boss',
    previewImage: bigBossImg,
    category: 'Executive',
    render: withSafeTemplateData(BigBossTemplate)
  },
  tanzanitePro: {
    id: 'tanzanitePro',
    name: 'Tanzanite Pro',
    previewImage: tanzaniteProImg,
    category: 'Premium',
    render: withSafeTemplateData(TanzaniteProTemplate)
  },
  mwalimuOne: {
    id: 'mwalimuOne',
    name: 'Mwalimu One',
    previewImage: mwalimuOneImg,
    category: 'Education',
    render: withSafeTemplateData(MwalimuOneTemplate)
  },
  serengetiFlow: {
    id: 'serengetiFlow',
    name: 'Serengeti Flow',
    previewImage: serengetiFlowImg,
    category: 'Modern',
    render: withSafeTemplateData(SerengetiFlowTemplate)
  },
  smartBongo: {
    id: 'smartBongo',
    name: 'Smart Bongo',
    previewImage: smartBongoImg,
    category: 'Technology',
    render: withSafeTemplateData(SmartBongoTemplate)
  },
  madiniMob: {
    id: 'madiniMob',
    name: 'Madini Mob',
    previewImage: madiniMobImg,
    category: 'Industry',
    render: withSafeTemplateData(MadiniMobTemplate)
  },
  mkaliModern: {
    id: 'mkaliModern',
    name: 'Mkali Modern',
    previewImage: mkaliModernImg,
    category: 'Creative',
    render: withSafeTemplateData(MkaliModernTemplate)
  }
};

// Export functions
export function getTemplateByID(id) {
  return templates[id];
}

export function getAllTemplates() {
  return Object.values(templates);
}
