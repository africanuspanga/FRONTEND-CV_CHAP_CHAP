import html2pdf from 'html2pdf.js';
import { CVData } from '@shared/schema';
import { getTemplateByID } from '@/templates';
import ReactDOMServer from 'react-dom/server';

/**
 * Generates a PDF from the provided CV data and template
 * @param cvData The CV data to render
 * @param templateId The ID of the template to use
 * @returns Promise that resolves when the PDF has been generated
 */
export const generatePDF = async (cvData: CVData, templateId: string): Promise<void> => {
  try {
    // Get the template component
    const template = getTemplateByID(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    // Render the template with the CV data
    const templateElement = template.render(cvData);
    const html = ReactDOMServer.renderToString(templateElement);
    
    // Create a complete HTML document with necessary styles
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName} - CV</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
          <style>
            body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
    
    // Create a temporary div to hold the HTML content
    const container = document.createElement('div');
    container.innerHTML = fullHtml;
    document.body.appendChild(container);
    
    // Configure PDF options
    const options = {
      margin: [0, 0, 0, 0],
      filename: `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generate and download the PDF
    await html2pdf().from(container).set(options).save();
    
    // Clean up
    document.body.removeChild(container);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
