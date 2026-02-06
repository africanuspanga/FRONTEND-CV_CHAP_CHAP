import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { CharlesPDF } from '@/components/templates/pdf/charles';
import { KathleenPDF } from '@/components/templates/pdf/kathleen';
import { OliverPDF } from '@/components/templates/pdf/oliver';
import { AparnaPDF } from '@/components/templates/pdf/aparna';
import { GracePDF } from '@/components/templates/pdf/grace';

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

  // Create the appropriate PDF element based on template
  let element: React.ReactElement;

  switch (templateId) {
    case 'kathleen':
    case 'lesley':
    case 'kelly':
    case 'richard':
    case 'nelly-mint':
    case 'nelly-gray':
      element = <KathleenPDF data={data} colorOverride={finalColor} />;
      break;
    case 'oliver':
    case 'lauren-orange':
    case 'lauren-icons':
      element = <OliverPDF data={data} colorOverride={finalColor} />;
      break;
    case 'aparna-dark':
    case 'aparna-gold':
      element = <AparnaPDF data={data} colorOverride={finalColor} />;
      break;
    case 'grace-minimal':
    case 'grace-navy':
    case 'grace-teal':
    case 'grace-mint':
    case 'grace-coral':
      element = <GracePDF data={data} colorOverride={finalColor} />;
      break;
    case 'charles':
    case 'thomas':
    case 'denice':
    case 'nelly-purple':
    case 'nelly-sidebar':
    default:
      element = <CharlesPDF data={data} colorOverride={finalColor} />;
      break;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfStream = await ReactPDF.renderToStream(element as any);

  const chunks: Uint8Array[] = [];
  for await (const chunk of pdfStream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export function getTemplate(templateId: string) {
  switch (templateId) {
    case 'kathleen':
    case 'lesley':
    case 'kelly':
    case 'richard':
    case 'nelly-mint':
    case 'nelly-gray':
      return KathleenPDF;
    case 'oliver':
    case 'lauren-orange':
    case 'lauren-icons':
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
    default:
      return CharlesPDF;
  }
}
