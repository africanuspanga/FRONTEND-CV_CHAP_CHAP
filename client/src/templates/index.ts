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
import { CVData } from '@shared/schema';

export interface CVTemplate {
  id: string;
  name: string;
  render: (data: CVData) => JSX.Element;
}

export const templates: Record<string, CVTemplate> = {
  moonlightSonata: {
    id: 'moonlightSonata',
    name: 'Moonlight Sonata',
    render: MoonlightSonataTemplate
  },
  kaziFasta: {
    id: 'kaziFasta',
    name: 'Kazi Fasta',
    render: KaziFastaTemplate
  },
  jijengeClassic: {
    id: 'jijengeClassic',
    name: 'Jijenge Classic',
    render: JijengeClassicTemplate
  },
  kilimanjaro: {
    id: 'kilimanjaro',
    name: 'Kilimanjaro',
    render: KilimanjaroTemplate
  },
  brightDiamond: {
    id: 'brightDiamond',
    name: 'Bright Diamond',
    render: BrightDiamondTemplate
  },
  mjenziWaTaifa: {
    id: 'mjenziWaTaifa',
    name: 'Mjenzi wa Taifa',
    render: MjenziWaTaifaTemplate
  },
  streetHustler: {
    id: 'streetHustler',
    name: 'Street Hustler',
    render: StreetHustlerTemplate
  },
  safariOriginal: {
    id: 'safariOriginal',
    name: 'Safari Original',
    render: SafariOriginalTemplate
  },
  bigBoss: {
    id: 'bigBoss',
    name: 'Big Boss',
    render: BigBossTemplate
  },
  tanzanitePro: {
    id: 'tanzanitePro',
    name: 'Tanzanite Pro',
    render: TanzaniteProTemplate
  },
  mwalimuOne: {
    id: 'mwalimuOne',
    name: 'Mwalimu One',
    render: MwalimuOneTemplate
  },
  serengetiFlow: {
    id: 'serengetiFlow',
    name: 'Serengeti Flow',
    render: SerengetiFlowTemplate
  },
  smartBongo: {
    id: 'smartBongo',
    name: 'Smart Bongo',
    render: SmartBongoTemplate
  },
  madiniMob: {
    id: 'madiniMob',
    name: 'Madini Mob',
    render: MadiniMobTemplate
  },
  mkaliModern: {
    id: 'mkaliModern',
    name: 'Mkali Modern',
    render: MkaliModernTemplate
  }
};

export function getTemplateByID(id: string): CVTemplate | undefined {
  return templates[id];
}

export function getAllTemplates(): CVTemplate[] {
  return Object.values(templates);
}
