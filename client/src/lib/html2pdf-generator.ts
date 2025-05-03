/**
 * Direct PDF generator using html2pdf.js
 * This module provides a more direct approach for PDF generation
 * that addresses issues with blank pages in the generated PDFs.
 */

import html2pdf from 'html2pdf.js';
import { getTemplateByID } from '@/lib';

/**
 * Generate a PDF directly from an HTML element
 */
export async function generatePDFFromHTML(templateId: string, cvData: any): Promise<Blob> {
  try {
    // Create a container for rendering the template
    const container = document.createElement('div');
    container.style.width = '210mm'; // A4 width
    container.style.minHeight = '297mm'; // A4 height
    container.style.backgroundColor = '#ffffff';
    container.style.margin = '0';
    container.style.padding = '0';
    container.style.overflow = 'hidden';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    
    // Append to body
    document.body.appendChild(container);
    
    // Get the template
    const template = getTemplateByID(templateId);
    if (!template) {
      throw new Error(`Template with ID '${templateId}' not found`);
    }
    
    // Get React and ReactDOM for direct rendering
    const React = await import('react');
    const ReactDOM = await import('react-dom');
    
    // Normalize the data
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
    
    // Render the template component directly to the container
    ReactDOM.render(
      React.createElement(template.render, safeData),
      container
    );
    
    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if rendering worked
    console.log('Template rendered with content length:', container.innerHTML.length);
    
    // Use html2pdf directly - use correct types to avoid TS errors
    // We need to explicitly type the orientation as 'portrait' | 'landscape'
    const pdfOptions: any = {
      margin: 0,
      filename: 'cv.pdf',
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
        orientation: 'portrait' as const,
        compress: true
      }
    };
    
    // Create PDF with promise pattern
    const blob = await new Promise<Blob>((resolve, reject) => {
      try {
        const worker = html2pdf()
          .from(container)
          .set(pdfOptions);
          
        worker.save().then(() => {
          // After save, generate blob directly
          worker.output('blob').then((blob: Blob) => {
            resolve(blob);
          }).catch(err => reject(err));
        }).catch(err => reject(err));
      } catch (error) {
        reject(error);
      }
    });
    
    return blob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Generate and download a PDF
 */
export async function generateAndDownloadPDF(templateId: string, cvData: any): Promise<void> {
  try {
    console.log('Generating PDF for template:', templateId);
    
    // Generate the PDF
    const blob = await generatePDFFromHTML(templateId, cvData);
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cv-${Date.now()}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Failed to generate or download PDF:', error);
    throw error;
  }
}
