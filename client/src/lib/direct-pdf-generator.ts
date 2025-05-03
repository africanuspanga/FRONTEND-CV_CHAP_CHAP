/**
 * Direct PDF generator using jsPDF and html2canvas
 * This module provides a low-level direct approach to capturing HTML
 * and converting it to PDF format.
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getTemplateByID } from '@/lib';

/**
 * Generate PDF using direct rendering approach
 */
export async function generateDirectPDF(templateId: string, cvData: any): Promise<Blob> {
  // Create a container for rendering the template
  const container = document.createElement('div');
  container.style.width = '210mm'; // A4 width
  container.style.minHeight = '297mm'; // A4 height
  container.style.padding = '0';
  container.style.margin = '0';
  container.style.backgroundColor = '#ffffff';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.zIndex = '-9999';
  container.className = 'pdf-container';
  document.body.appendChild(container);

  try {
    console.log('Direct PDF generator starting for template:', templateId);
    
    // Get the template component
    const template = getTemplateByID(templateId);
    if (!template) {
      throw new Error(`Template with ID '${templateId}' not found`);
    }
    
    // Normalize the data to ensure all required properties exist
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
    
    // Use direct React DOM rendering
    const React = await import('react');
    const ReactDOM = await import('react-dom');
    
    // Render the template component
    ReactDOM.render(
      React.createElement(template.render, safeData),
      container
    );
    
    // Allow time for rendering and styles to apply
    console.log('Waiting for template to render...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if content rendered
    console.log('Content rendered with size:', container.innerHTML.length);
    
    // Use html2canvas to render the content
    const canvas = await html2canvas(container, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true,
      onclone: (clonedDoc) => {
        const clonedElem = clonedDoc.querySelector('.pdf-container') as HTMLElement;
        if (clonedElem) {
          console.log('Preparing cloned element for PDF generation');
          clonedElem.style.position = 'relative';
          clonedElem.style.height = 'auto';
          clonedElem.style.minHeight = '100%';
          clonedElem.style.width = '210mm';
        }
        return clonedDoc;
      }
    });
    
    console.log('Canvas generated:', canvas.width, 'x', canvas.height);
    
    // Calculate PDF dimensions
    const imgWidth = 210; // mm (A4 width)
    const pageHeight = 297; // mm (A4 height)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Calculate the number of pages
    const pageCount = Math.ceil(imgHeight / pageHeight);
    console.log('PDF will have', pageCount, 'pages');
    
    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;
    
    // Add each page of the canvas to the PDF
    for (let i = 0; i < pageCount; i++) {
      // Add a new page if this isn't the first page
      if (i > 0) {
        pdf.addPage();
      }
      
      // Calculate the slice of the canvas to use for this page
      const srcY = i * (canvas.height / pageCount);
      const height = canvas.height / pageCount;
      
      // Create a temporary canvas for this slice
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(
          canvas,
          0, srcY, canvas.width, height,
          0, 0, canvas.width, height
        );
        
        // Add this slice to the PDF
        const imgData = tempCanvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, (height * imgWidth) / canvas.width);
      }
    }
    
    // Generate the PDF as a blob
    const pdfBlob = pdf.output('blob');
    console.log('PDF blob created with size:', pdfBlob.size);
    
    return pdfBlob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    // Clean up
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Generate and download a PDF
 */
export async function generateAndDownloadPDF(templateId: string, cvData: any): Promise<void> {
  try {
    console.log('Starting PDF download for template:', templateId);
    
    // Generate PDF
    const pdfBlob = await generateDirectPDF(templateId, cvData);
    
    // Create download link
    const url = URL.createObjectURL(pdfBlob);
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
    
    console.log('PDF download initiated successfully');
  } catch (error) {
    console.error('Failed to generate or download PDF:', error);
    throw error;
  }
}
