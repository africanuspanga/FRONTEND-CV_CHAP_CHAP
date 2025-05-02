import html2pdf from 'html2pdf.js';
import { CVData } from '@shared/schema';
import { getTemplateByID } from '@/templates/index';
import React from 'react';

/**
 * Generate PDF directly from React components
 * This approach renders the template component to a DOM node and converts it to PDF
 * without relying on server-side HTML templates
 */
export const generateClientSidePDF = async (cvData: CVData, templateId: string): Promise<void> => {
  try {
    // Get the template component
    const template = getTemplateByID(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    
    // Create a container for the rendered template
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);
    
    // Use React to render the template to the container
    const { createRoot } = await import('react-dom/client');
    const root = createRoot(container);
    
    // Wait for template to render
    await new Promise<void>(resolve => {
      const TemplateComponent = template.render;
      // @ts-ignore - This is correct usage but TypeScript doesn't know about JSX here
      root.render(React.createElement(TemplateComponent, cvData));
      
      // Give it a moment to render completely
      setTimeout(resolve, 500);
    });
    
    // Configure PDF options
    const options = {
      margin: [0, 0, 0, 0],
      filename: `${cvData.personalInfo?.firstName || 'CV'}_${cvData.personalInfo?.lastName || 'ChapChap'}_CV.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        width: 595, // A4 width in pixels at 72dpi
        height: 842 // A4 height
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' as 'portrait' | 'landscape' 
      }
    };
    
    // Generate and download the PDF
    await html2pdf().from(container).set(options).save();
    
    // Clean up
    setTimeout(() => {
      root.unmount();
      document.body.removeChild(container);
    }, 1000);
    
  } catch (error) {
    console.error('Error generating PDF from client-side:', error);
    throw error;
  }
};
