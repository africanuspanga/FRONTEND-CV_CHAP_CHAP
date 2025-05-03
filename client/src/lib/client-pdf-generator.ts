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
// These are the default options, but we'll create a fresh options object
// in the generatePDF function to avoid any shared reference issues
const defaultPdfOptions = {
  margin: 0,
  filename: 'cv-chap-chap.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { 
    scale: 2, 
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: true
  },
  jsPDF: { 
    unit: 'mm', 
    format: 'a4', 
    orientation: 'portrait',
    compress: true
  }
};

/**
 * Generate a PDF from a template and CV data
 */
export async function generatePDF(templateId: string, cvData: any): Promise<Blob> {
  // Create a container for rendering the template
  const container = document.createElement('div');
  // Set to A4 dimensions with proper scaling
  container.style.width = '210mm'; // A4 width
  container.style.height = '297mm'; // A4 height
  container.style.overflow = 'hidden';
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '0';
  container.style.margin = '0';
  document.body.appendChild(container);

  try {
    console.log('Starting PDF generation for template:', templateId);
    console.log('CV Data keys:', Object.keys(cvData));
    
    // Get the template component
    const template = getTemplateByID(templateId);
    if (!template) {
      console.error('Template not found:', templateId);
      throw new Error(`Template "${templateId}" not found`);
    }
    console.log('Template found:', template.name);

    // Important: Create a safer version of the CV data
    // that includes all necessary fields with defaults
    const safeData = {
      templateId,
      personalInfo: cvData.personalInfo || {},
      workExperience: cvData.workExperience || cvData.workExperiences || [],
      workExperiences: cvData.workExperiences || cvData.workExperience || [],
      education: cvData.education || [],
      skills: cvData.skills || [],
      summary: cvData.summary || cvData.personalInfo?.summary || '',
      languages: cvData.languages || [],
      references: cvData.references || [],
      hobbies: cvData.hobbies || [],
      projects: cvData.projects || [],
      certifications: cvData.certifications || [],
      websites: cvData.websites || [],
      accomplishments: cvData.accomplishments || []
    };
    
    // Ensure personalInfo has a summary
    if (!safeData.personalInfo.summary && safeData.summary) {
      safeData.personalInfo.summary = safeData.summary;
    }
    
    // Create a React root and render the template
    const { createRoot } = await import('react-dom/client');
    const root = createRoot(container);
    
    // Add debugging classes to help identify the template in the DOM
    container.className = 'pdf-container';
    container.setAttribute('data-template-id', templateId);
    
    // Render the template with CV data
    const TemplateComponent = template.render;
    console.log('Rendering template component with data');
    
    root.render(React.createElement(TemplateComponent, safeData));
    
    // Allow time for the template to fully render and styles to apply
    console.log('Waiting for template to render...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Increased timeout for better rendering
    
    // Check if anything was actually rendered
    if (container.innerHTML.trim().length < 50) {
      console.error('Template may have rendered empty content:', container.innerHTML);
    } else {
      console.log('Template rendered successfully with content length:', container.innerHTML.length);
    }

    // Generate the PDF with additional debugging
    console.log('Generating PDF from rendered template...');
    const pdfOptions = {
      margin: 0,
      filename: 'cv-chap-chap.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };
    
    const pdfGenerator = html2pdf().from(container).set(pdfOptions);
    const pdf = await pdfGenerator.outputPdf('blob');
    console.log('PDF generated successfully with size:', pdf.size, 'bytes');

    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
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
export async function generateAndDownloadPDF(templateId: string, cvData: any, filename?: string): Promise<void> {
  console.log('Starting PDF download process for template:', templateId);
  console.log('PDF filename:', filename);
  
  try {
    // If template or data is invalid, provide a fallback
    if (!templateId || !cvData) {
      console.error('Invalid template ID or CV data provided');
      throw new Error('Missing required information for PDF generation');
    }

    // Generate the PDF
    console.log('Generating PDF with template:', templateId);
    const pdf = await generatePDF(templateId, cvData);
    
    // Verify PDF was generated successfully
    if (!pdf || pdf.size < 1000) {
      console.warn('Generated PDF may be empty or too small:', pdf?.size || 0, 'bytes');
    }

    // Create a download link
    console.log('Creating download link for PDF');
    const url = URL.createObjectURL(pdf);
    const link = document.createElement('a');
    link.href = url;
    
    // Set a default filename if needed
    const defaultName = `${cvData.personalInfo?.firstName || 'cv'}-${cvData.personalInfo?.lastName || 'chap-chap'}.pdf`;
    link.download = filename || defaultName;
    
    // Trigger the download
    console.log('Initiating PDF download as:', link.download);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      if (link.parentNode) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
      console.log('PDF download process completed');
    }, 100);
  } catch (error) {
    console.error('Error generating or downloading PDF:', error);
    throw error;
  }
}
