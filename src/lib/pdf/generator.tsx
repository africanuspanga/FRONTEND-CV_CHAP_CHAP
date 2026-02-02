import ReactPDF from '@react-pdf/renderer';
import { CharlesPDF } from '@/components/templates/pdf/charles';
import { KathleenPDF } from '@/components/templates/pdf/kathleen';

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
  
  const PDFTemplate = pdfTemplates[templateId] || pdfTemplates['charles'];
  
  const element = PDFTemplate({ data, colorOverride });
  
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
