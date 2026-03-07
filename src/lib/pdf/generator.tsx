/* eslint-disable @typescript-eslint/no-explicit-any */
import { CharlesPDF } from '@/components/templates/pdf/charles';
import { KathleenPDF } from '@/components/templates/pdf/kathleen';
import { OliverPDF } from '@/components/templates/pdf/oliver';
import { AparnaPDF } from '@/components/templates/pdf/aparna';
import { GracePDF } from '@/components/templates/pdf/grace';
import { ClassicElegantPDF } from '@/components/templates/pdf/classic-elegant';
import { HexagonBluePDF } from '@/components/templates/pdf/hexagon-blue';
import { ThomasPDF } from '@/components/templates/pdf/thomas';
import { DenicePDF } from '@/components/templates/pdf/denice';
import { NellyPurplePDF } from '@/components/templates/pdf/nelly-purple';
import { NellySidebarPDF } from '@/components/templates/pdf/nelly-sidebar';
import { ModernHeaderPDF } from '@/components/templates/pdf/modern-header';
import { LesleyPDF } from '@/components/templates/pdf/lesley';
import { KellyPDF } from '@/components/templates/pdf/kelly';
import { RichardPDF } from '@/components/templates/pdf/richard';
import { NellyMintPDF } from '@/components/templates/pdf/nelly-mint';
import { NellyGrayPDF } from '@/components/templates/pdf/nelly-gray';
import { TealAccentPDF } from '@/components/templates/pdf/teal-accent';
import { CreativeYellowPDF } from '@/components/templates/pdf/creative-yellow';
import { DiamondMonogramPDF } from '@/components/templates/pdf/diamond-monogram';
import { TimelineGrayPDF } from '@/components/templates/pdf/timeline-gray';
import { ProfessionalSidebarPDF } from '@/components/templates/pdf/professional-sidebar';
import { LaurenOrangePDF } from '@/components/templates/pdf/lauren-orange';
import { LaurenIconsPDF } from '@/components/templates/pdf/lauren-icons';

const templateColors: Record<string, string> = {
  'charles': '#0891B2',
  'kathleen': '#E5B94E',
  'oliver': '#E07A38',
  'thomas': '#8ECFC8',
  'denice': '#9B7B7B',
  'nelly-purple': '#8B7BB5',
  'nelly-sidebar': '#374151',
  'aparna-dark': '#1E3A5F',
  'aparna-gold': '#D4A056',
  'grace-minimal': '#6B7280',
  'lauren-orange': '#E07A38',
  'lauren-icons': '#374151',
  'grace-navy': '#1E4A6D',
  'grace-teal': '#2AAA9E',
  'lesley': '#2B4764',
  'kelly': '#1F2937',
  'richard': '#111827',
  'grace-mint': '#6BBFAB',
  'grace-coral': '#E85A5A',
  'nelly-mint': '#3EB489',
  'nelly-gray': '#4B5563',
  'classic-elegant': '#1F2937',
  'teal-accent': '#3B9B9B',
  'professional-sidebar': '#6B7B8C',
  'centered-traditional': '#1F2937',
  'modern-header': '#4B5563',
  'creative-yellow': '#F5C542',
  'diamond-monogram': '#4B5563',
  'timeline-gray': '#6B7280',
  'hexagon-blue': '#2563EB',
};

export function getTemplateColor(templateId: string): string {
  return templateColors[templateId] || '#0891B2';
}

export function getTemplate(templateId: string) {
  switch (templateId) {
    case 'charles':
      return CharlesPDF;
    case 'kathleen':
      return KathleenPDF;
    case 'oliver':
      return OliverPDF;
    case 'aparna-dark':
    case 'aparna-gold':
      return AparnaPDF;
    case 'grace-minimal':
    case 'grace-navy':
    case 'grace-teal':
    case 'grace-mint':
    case 'grace-coral':
      return GracePDF;
    case 'classic-elegant':
    case 'centered-traditional':
      return ClassicElegantPDF;
    case 'hexagon-blue':
      return HexagonBluePDF;
    case 'thomas':
      return ThomasPDF;
    case 'denice':
      return DenicePDF;
    case 'nelly-purple':
      return NellyPurplePDF;
    case 'nelly-sidebar':
      return NellySidebarPDF;
    case 'modern-header':
      return ModernHeaderPDF;
    case 'lesley':
      return LesleyPDF;
    case 'kelly':
      return KellyPDF;
    case 'richard':
      return RichardPDF;
    case 'nelly-mint':
      return NellyMintPDF;
    case 'nelly-gray':
      return NellyGrayPDF;
    case 'teal-accent':
      return TealAccentPDF;
    case 'creative-yellow':
      return CreativeYellowPDF;
    case 'diamond-monogram':
      return DiamondMonogramPDF;
    case 'timeline-gray':
      return TimelineGrayPDF;
    case 'professional-sidebar':
      return ProfessionalSidebarPDF;
    case 'lauren-orange':
      return LaurenOrangePDF;
    case 'lauren-icons':
      return LaurenIconsPDF;
    default:
      return CharlesPDF;
  }
}
