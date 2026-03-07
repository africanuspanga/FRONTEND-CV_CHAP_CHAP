// Original 7 templates
export { CharlesPDF } from './charles';
export { KathleenPDF } from './kathleen';
export { OliverPDF } from './oliver';
export { AparnaPDF } from './aparna';
export { GracePDF } from './grace';
export { ClassicElegantPDF } from './classic-elegant';
export { HexagonBluePDF } from './hexagon-blue';

// New dedicated PDF templates (Group A - Charles aliases replaced)
export { ThomasPDF } from './thomas';
export { DenicePDF } from './denice';
export { NellyPurplePDF } from './nelly-purple';
export { NellySidebarPDF } from './nelly-sidebar';
export { ModernHeaderPDF } from './modern-header';

// New dedicated PDF templates (Group B - Kathleen aliases replaced)
export { LesleyPDF } from './lesley';
export { KellyPDF } from './kelly';
export { RichardPDF } from './richard';
export { NellyMintPDF } from './nelly-mint';
export { NellyGrayPDF } from './nelly-gray';
export { TealAccentPDF } from './teal-accent';
export { CreativeYellowPDF } from './creative-yellow';
export { DiamondMonogramPDF } from './diamond-monogram';
export { TimelineGrayPDF } from './timeline-gray';
export { ProfessionalSidebarPDF } from './professional-sidebar';

// New dedicated PDF templates (Group C - Oliver aliases replaced)
export { LaurenOrangePDF } from './lauren-orange';
export { LaurenIconsPDF } from './lauren-icons';

// Color variants that share the same layout (these are intentional aliases)
import { AparnaPDF } from './aparna';
import { GracePDF } from './grace';

export const AparnaDarkPDF = AparnaPDF;
export const AparnaGoldPDF = AparnaPDF;

export const GraceMinimalPDF = GracePDF;
export const GraceNavyPDF = GracePDF;
export const GraceTealPDF = GracePDF;
export const GraceMintPDF = GracePDF;
export const GraceCoralPDF = GracePDF;

// Classic Elegant variant
import { ClassicElegantPDF } from './classic-elegant';
export const CenteredTraditionalPDF = ClassicElegantPDF;
