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

// Import template preview images
import moonlightSonataImg from '../assets/images/templates/moonlightSonata.png';
import kaziFastaImg from '../assets/images/templates/kaziFasta.png';
import jijengeClassicImg from '../assets/images/templates/jijengeClassic.png';
import kilimanjaroImg from '../assets/images/templates/kilimanjaro.png';
import brightDiamondImg from '../assets/images/templates/brightDiamond.png';
import mjenziWaTaifaImg from '../assets/images/templates/mjenziWaTaifa.png';
import streetHustlerImg from '../assets/images/templates/streetHustler.png';
import safariOriginalImg from '../assets/images/templates/safariOriginal.png';
import bigBossImg from '../assets/images/templates/bigBoss.png';
import tanzaniteProImg from '../assets/images/templates/tanzanitePro.png';
import mwalimuOneImg from '../assets/images/templates/mwalimuOne.png';
import serengetiFlowImg from '../assets/images/templates/serengetiFlow.png';
import smartBongoImg from '../assets/images/templates/smartBongo.png';
import madiniMobImg from '../assets/images/templates/madiniMob.png';
import mkaliModernImg from '../assets/images/templates/mkaliModern.png';

// Template definition
export const templates = {
  moonlightSonata: {
    id: 'moonlightSonata',
    name: 'Moonlight Sonata',
    previewImage: moonlightSonataImg,
    category: 'Professional',
    render: MoonlightSonataTemplate
  },
  kaziFasta: {
    id: 'kaziFasta',
    name: 'Kazi Fasta',
    previewImage: kaziFastaImg,
    category: 'Modern',
    render: KaziFastaTemplate
  },
  jijengeClassic: {
    id: 'jijengeClassic',
    name: 'Jijenge Classic',
    previewImage: jijengeClassicImg,
    category: 'Classic',
    render: JijengeClassicTemplate
  },
  kilimanjaro: {
    id: 'kilimanjaro',
    name: 'Kilimanjaro',
    previewImage: kilimanjaroImg,
    category: 'Professional',
    render: KilimanjaroTemplate
  },
  brightDiamond: {
    id: 'brightDiamond',
    name: 'Bright Diamond',
    previewImage: brightDiamondImg,
    category: 'Elegant',
    render: BrightDiamondTemplate
  },
  mjenziWaTaifa: {
    id: 'mjenziWaTaifa',
    name: 'Mjenzi wa Taifa',
    previewImage: mjenziWaTaifaImg,
    category: 'Technical',
    render: MjenziWaTaifaTemplate
  },
  streetHustler: {
    id: 'streetHustler',
    name: 'Street Hustler',
    previewImage: streetHustlerImg,
    category: 'Creative',
    render: StreetHustlerTemplate
  },
  safariOriginal: {
    id: 'safariOriginal',
    name: 'Safari Original',
    previewImage: safariOriginalImg,
    category: 'Modern',
    render: SafariOriginalTemplate
  },
  bigBoss: {
    id: 'bigBoss',
    name: 'Big Boss',
    previewImage: bigBossImg,
    category: 'Executive',
    render: BigBossTemplate
  },
  tanzanitePro: {
    id: 'tanzanitePro',
    name: 'Tanzanite Pro',
    previewImage: tanzaniteProImg,
    category: 'Premium',
    render: TanzaniteProTemplate
  },
  mwalimuOne: {
    id: 'mwalimuOne',
    name: 'Mwalimu One',
    previewImage: mwalimuOneImg,
    category: 'Education',
    render: MwalimuOneTemplate
  },
  serengetiFlow: {
    id: 'serengetiFlow',
    name: 'Serengeti Flow',
    previewImage: serengetiFlowImg,
    category: 'Modern',
    render: SerengetiFlowTemplate
  },
  smartBongo: {
    id: 'smartBongo',
    name: 'Smart Bongo',
    previewImage: smartBongoImg,
    category: 'Technology',
    render: SmartBongoTemplate
  },
  madiniMob: {
    id: 'madiniMob',
    name: 'Madini Mob',
    previewImage: madiniMobImg,
    category: 'Industry',
    render: MadiniMobTemplate
  },
  mkaliModern: {
    id: 'mkaliModern',
    name: 'Mkali Modern',
    previewImage: mkaliModernImg,
    category: 'Creative',
    render: MkaliModernTemplate
  }
};

// Export functions
export function getTemplateByID(id) {
  return templates[id];
}

export function getAllTemplates() {
  return Object.values(templates);
}
