import ReactPDF from '@react-pdf/renderer';
import { CharlesPDF } from '@/components/templates/pdf/charles';
import { KathleenPDF } from '@/components/templates/pdf/kathleen';

const templateColors: Record<string, string> = {
  'charles': '#0891B2',
  'kathleen': '#E5B94E',
  'oliver': '#E07A38',
  'thomas': '#8ECFC8',
  'denice': '#9B7B7B',
  'nelly-purple': '#8B7BB5',
  'aparna-dark': '#1E3A5F',
  'aparna-gold': '#D4A056',
  'grace-minimal': '#6B7280',
  'lauren-orange': '#E07A38',
  'grace-navy': '#1E4A6D',
  'grace-teal': '#2AAA9E',
  'lesley': '#2B4764',
  'kelly': '#1F2937',
  'richard': '#111827',
  'grace-mint': '#6BBFAB',
  'grace-coral': '#E85A5A',
  'nelly-mint': '#3EB489',
  'nelly-gray': '#4B5563',
  'nelly-sidebar': '#374151',
  'lauren-icons': '#374151',
};

const pdfTemplates: Record<string, React.FC<{ data: any; colorOverride?: string | null }>> = {
  'charles': CharlesPDF,
  'kathleen': KathleenPDF,
  'oliver': CharlesPDF,
  'thomas': CharlesPDF,
  'denice': CharlesPDF,
  'nelly-purple': CharlesPDF,
  'aparna-dark': CharlesPDF,
  'aparna-gold': CharlesPDF,
  'grace-minimal': KathleenPDF,
  'lauren-orange': KathleenPDF,
  'grace-navy': KathleenPDF,
  'grace-teal': KathleenPDF,
  'lesley': KathleenPDF,
  'kelly': KathleenPDF,
  'richard': KathleenPDF,
  'grace-mint': KathleenPDF,
  'grace-coral': KathleenPDF,
  'nelly-mint': KathleenPDF,
  'nelly-gray': KathleenPDF,
  'nelly-sidebar': KathleenPDF,
  'lauren-icons': KathleenPDF,
};

export interface PDFGeneratorOptions {
  templateId: string;
  data: any;
  colorOverride?: string | null;
}

export async function generatePDF(options: PDFGeneratorOptions): Promise<Buffer> {
  const { templateId, data, colorOverride } = options;
  
  const defaultColor = templateColors[templateId] || '#0891B2';
  const finalColor = colorOverride || defaultColor;
  
  console.log('PDF Generator - templateId:', templateId, '| color:', finalColor);
  
  const PDFTemplate = pdfTemplates[templateId] || pdfTemplates['charles'];
  
  const element = PDFTemplate({ data, colorOverride: finalColor });
  
  const pdfStream = await ReactPDF.renderToStream(element as any);

  const chunks: Uint8Array[] = [];
  for await (const chunk of pdfStream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  
  return Buffer.concat(chunks);
}

export function getTemplate(templateId: string) {
  return pdfTemplates[templateId] || pdfTemplates['charles'];
}
