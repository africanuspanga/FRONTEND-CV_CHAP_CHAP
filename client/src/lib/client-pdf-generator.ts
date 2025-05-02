/**
 * Client-side PDF generator using html2pdf.js
 * This module handles the generation of PDFs in the browser without
 * any backend dependencies
 */

import html2pdf from 'html2pdf.js';
import { getTemplateByID } from '@/lib';
import { CVData } from '@shared/schema';
import React from 'react';

// Configuration options for PDF generation
const pdfOptions = {
  margin: 10,
  filename: 'cv-chap-chap.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as 'portrait' }
};

/**
 * Generate a PDF from a template and CV data
 */
export async function generatePDF(templateId: string, cvData: CVData): Promise<Blob> {
  // Create a container for rendering the template
  const container = document.createElement('div');
  container.style.width = '210mm'; // A4 width
  container.style.height = 'auto';
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  try {
    // Get the template component
    const template = getTemplateByID(templateId);
    if (!template) {
      throw new Error(`Template "${templateId}" not found`);
    }

    // Create a React root and render the template
    const { createRoot } = await import('react-dom/client');
    const root = createRoot(container);
    
    // Render the template with CV data
    const TemplateComponent = template.render;
    root.render(React.createElement(TemplateComponent, cvData));

    // Wait for any images to load
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate the PDF
    const pdf = await html2pdf().from(container).set(pdfOptions).outputPdf('blob');

    return pdf;
  } finally {
    // Clean up the container
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Generate and download a PDF from a template and CV data
 */
export async function generateAndDownloadPDF(templateId: string, cvData: CVData, filename?: string): Promise<void> {
  try {
    // Generate the PDF
    const pdf = await generatePDF(templateId, cvData);

    // Create a download link
    const url = URL.createObjectURL(pdf);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${cvData.personalInfo?.firstName || 'cv'}-${cvData.personalInfo?.lastName || 'chap-chap'}.pdf`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
