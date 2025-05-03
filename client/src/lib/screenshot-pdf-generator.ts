/**
 * Screenshot-based PDF generator
 * This approach captures the visible CV component as an image
 * and then converts it to a PDF.
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getTemplateByID } from '@/lib';
import { logDOMInfo, logTemplateRenderingInfo } from './debugUtils';
import ClientSideTemplateRenderer from '@/components/ClientSideTemplateRenderer';

/**
 * Find a rendered CV preview element in the DOM
 */
function findCVPreviewElement(): HTMLElement | null {
  // Try to find the ClientSideTemplateRenderer component in the DOM
  const previewElements = document.querySelectorAll('.template-container');
  if (previewElements.length > 0) {
    return previewElements[0] as HTMLElement;
  }
  return null;
}

/**
 * Create a temporary CV preview element if none exists
 */
async function createTemporaryCVPreview(templateId: string, cvData: any): Promise<HTMLElement> {
  console.log('Creating temporary CV preview for PDF generation');
  
  // Create a container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '210mm';
  container.style.minHeight = '297mm';
  container.style.backgroundColor = 'white';
  container.style.zIndex = '9999';
  container.style.overflow = 'visible';
  // Actually show the container for screenshot, but position it off-screen
  container.style.opacity = '1';
  container.style.border = '5px solid red';
  container.style.boxSizing = 'border-box';
  container.style.transform = 'translateX(-1000px)';
  document.body.appendChild(container);
  
  // Get the template component
  const template = getTemplateByID(templateId);
  if (!template) {
    throw new Error(`Template with ID '${templateId}' not found`);
  }
  
  // Inject styles to ensure Tailwind works
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Make container visible for screenshot but not to user */
    @media print {
      body * { visibility: hidden; }
      .temporary-cv-container, .temporary-cv-container * { visibility: visible; }
    }
  `;
  container.appendChild(styleElement);
  
  // Add class for styling
  container.className = 'temporary-cv-container';
  
  // Set innerHTML directly (this is more reliable than React rendering)
  const React = await import('react');
  const ReactDOM = await import('react-dom/client');
  
  // Create root and render template
  const root = ReactDOM.createRoot(container);
  root.render(
    React.createElement(template.render, cvData)
  );
  
  // Give more time for rendering (critical for Tailwind styles to be applied)
  console.log('Waiting for template to render completely...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Add a debug message to the container to verify it's working
  const debugElement = document.createElement('div');
  debugElement.textContent = 'CV Chap Chap PDF Generator';
  debugElement.style.position = 'absolute';
  debugElement.style.bottom = '10px';
  debugElement.style.right = '10px';
  debugElement.style.background = 'rgba(255, 0, 0, 0.2)';
  debugElement.style.padding = '5px';
  debugElement.style.color = 'red';
  debugElement.style.fontSize = '12px';
  container.appendChild(debugElement);
  
  console.log('Template rendered, ready for screenshot');
  
  return container;
}

/**
 * Generate PDF by taking a screenshot of the CV preview
 */
export async function generateScreenshotPDF(templateId: string, cvData: any): Promise<Blob> {
  console.log('Starting screenshot-based PDF generation');
  
  let container: HTMLElement | null = null;
  let temporaryContainer = false;
  
  try {
    // Log template rendering info for debugging
    logTemplateRenderingInfo(templateId, cvData);
    
    // Try to find existing CV preview
    container = findCVPreviewElement();
    console.log('Found existing CV element:', !!container);
    
    // If not found, create a temporary one
    if (!container) {
      container = await createTemporaryCVPreview(templateId, cvData);
      temporaryContainer = true;
      console.log('Created temporary container');
    }
    
    // Log information about the container
    logDOMInfo(container, 'CV Container');
    
    console.log('Taking screenshot of CV preview');
    
    // Take screenshot of the container
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true,
      removeContainer: false,
    });
    
    console.log('Screenshot captured, dimensions:', canvas.width, 'x', canvas.height);
    
    // Calculate PDF dimensions (A4)
    const imgWidth = 210; // mm (A4 width)
    const pageHeight = 297; // mm (A4 height)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Calculate number of pages
    const pageCount = Math.ceil(imgHeight / pageHeight);
    console.log('PDF will have', pageCount, 'pages');
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
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
        const imgData = tempCanvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, (height * imgWidth) / canvas.width);
      }
    }
    
    // Add a footer with CV Chap Chap branding
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150); // Gray
      pdf.text('Generated with CV Chap Chap', 10, 290);
      pdf.text(`Page ${i} of ${pageCount}`, 180, 290);
    }
    
    // Generate the PDF as a blob
    const pdfBlob = pdf.output('blob');
    console.log('PDF blob created with size:', pdfBlob.size);
    
    return pdfBlob;
  } catch (error) {
    console.error('Error generating screenshot PDF:', error);
    throw error;
  } finally {
    // Clean up temporary container if we created one
    if (temporaryContainer && container && container.parentNode) {
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
    const pdfBlob = await generateScreenshotPDF(templateId, cvData);
    
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