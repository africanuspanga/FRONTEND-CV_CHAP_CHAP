/**
 * Enhanced PDF generator using jsPDF and html2canvas
 * This module combines multiple approaches to fix blank PDF issues:
 * 1. Visible container with longer wait time
 * 2. Static HTML generation via ReactDOMServer
 * 3. Direct style injection
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getTemplateByID } from '@/lib';

/**
 * Generate PDF using enhanced rendering approach
 */
export async function generateDirectPDF(templateId: string, cvData: any): Promise<Blob> {
  // Create a visible container on the page but off-screen
  const container = document.createElement('div');
  container.style.width = '210mm'; // A4 width
  container.style.minHeight = '297mm'; // A4 height
  container.style.padding = '0';
  container.style.margin = '0';
  container.style.backgroundColor = '#ffffff';
  container.style.position = 'absolute'; // Changed from 'fixed' to 'absolute'
  container.style.top = '0'; // Make it visible at the top
  container.style.left = '0';
  container.style.zIndex = '9999'; // Positive z-index to ensure visibility
  container.style.overflow = 'visible'; // Ensure content isn't clipped
  container.style.opacity = '1'; // Ensure it's visible
  container.className = 'pdf-container';
  document.body.appendChild(container);

  try {
    console.log('Enhanced PDF generator starting for template:', templateId);
    
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
    
    // Import React modules
    const React = await import('react');
    const ReactDOMServer = await import('react-dom/server');
    
    // SOLUTION 5: Generate static HTML using ReactDOMServer
    const htmlString = ReactDOMServer.renderToStaticMarkup(
      React.createElement(template.render, safeData)
    );
    
    console.log('Generated static HTML with size:', htmlString.length);
    
    // SOLUTION 6: Inject critical styles
    const criticalStyles = `
      /* Font imports */
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      /* Critical base styles */
      .pdf-container * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Common layout styles */
      .flex { display: flex !important; }
      .flex-col { flex-direction: column !important; }
      .flex-row { flex-direction: row !important; }
      .items-center { align-items: center !important; }
      .justify-between { justify-content: space-between !important; }
      .justify-center { justify-content: center !important; }
      .gap-1 { gap: 0.25rem !important; }
      .gap-2 { gap: 0.5rem !important; }
      .gap-3 { gap: 0.75rem !important; }
      .gap-4 { gap: 1rem !important; }
      
      /* Text styles */
      .text-sm { font-size: 0.875rem !important; }
      .text-base { font-size: 1rem !important; }
      .text-lg { font-size: 1.125rem !important; }
      .text-xl { font-size: 1.25rem !important; }
      .text-2xl { font-size: 1.5rem !important; }
      .font-bold { font-weight: 700 !important; }
      .font-medium { font-weight: 500 !important; }
      .font-semibold { font-weight: 600 !important; }
      .uppercase { text-transform: uppercase !important; }
      
      /* Spacing */
      .p-1 { padding: 0.25rem !important; }
      .p-2 { padding: 0.5rem !important; }
      .p-3 { padding: 0.75rem !important; }
      .p-4 { padding: 1rem !important; }
      .px-1 { padding-left: 0.25rem !important; padding-right: 0.25rem !important; }
      .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
      .px-3 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
      .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
      .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
      .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
      .py-3 { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
      .py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
      .m-1 { margin: 0.25rem !important; }
      .m-2 { margin: 0.5rem !important; }
      .m-3 { margin: 0.75rem !important; }
      .m-4 { margin: 1rem !important; }
      .mt-1 { margin-top: 0.25rem !important; }
      .mt-2 { margin-top: 0.5rem !important; }
      .mt-3 { margin-top: 0.75rem !important; }
      .mt-4 { margin-top: 1rem !important; }
      .mb-1 { margin-bottom: 0.25rem !important; }
      .mb-2 { margin-bottom: 0.5rem !important; }
      .mb-3 { margin-bottom: 0.75rem !important; }
      .mb-4 { margin-bottom: 1rem !important; }
      
      /* Borders */
      .border { border: 1px solid #e2e8f0 !important; }
      .border-t { border-top: 1px solid #e2e8f0 !important; }
      .border-b { border-bottom: 1px solid #e2e8f0 !important; }
      .border-l { border-left: 1px solid #e2e8f0 !important; }
      .border-r { border-right: 1px solid #e2e8f0 !important; }
      .rounded { border-radius: 0.25rem !important; }
      .rounded-lg { border-radius: 0.5rem !important; }
      
      /* Colors */
      .bg-white { background-color: #ffffff !important; }
      .bg-gray-50 { background-color: #f9fafb !important; }
      .bg-gray-100 { background-color: #f3f4f6 !important; }
      .bg-primary { background-color: #3b82f6 !important; }
      .bg-secondary { background-color: #10b981 !important; }
      .text-white { color: #ffffff !important; }
      .text-black { color: #000000 !important; }
      .text-gray-500 { color: #6b7280 !important; }
      .text-gray-700 { color: #374151 !important; }
      .text-primary { color: #3b82f6 !important; }
      
      /* Grid */
      .grid { display: grid !important; }
      .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
      .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
      .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
      
      /* Additional template-specific styles can be added here */
    `;
    
    // Apply the HTML and styles to the container
    container.innerHTML = htmlString;
    
    // Add a debug element to ensure we can see what's happening
    const debugElement = document.createElement('div');
    debugElement.style.backgroundColor = 'red';
    debugElement.style.color = 'white';
    debugElement.style.padding = '10px';
    debugElement.style.margin = '10px';
    debugElement.style.fontWeight = 'bold';
    debugElement.style.fontSize = '16px';
    debugElement.textContent = 'PDF RENDERING AREA - CV CONTENT SHOULD APPEAR BELOW';
    container.insertBefore(debugElement, container.firstChild);
    
    // Create and append style element
    const styleElement = document.createElement('style');
    styleElement.textContent = criticalStyles;
    container.appendChild(styleElement);
    
    // SOLUTION 2 + 3: Increase wait time for rendering
    console.log('Waiting for template and styles to fully render...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Log the actual content now present
    console.log('Content rendered with final size:', container.innerHTML.length);
    
    // Use html2canvas to render the content
    console.log('Starting html2canvas capture...');
    const canvas = await html2canvas(container, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true,
      removeContainer: false, // Keep the container during capture
      imageTimeout: 0, // No timeout for images
      letterRendering: true, // Better text rendering
      foreignObjectRendering: false, // Avoid using foreignObject which can cause issues
      onclone: (clonedDoc) => {
        // Add a debug message to the console
        console.log('HTML2Canvas cloning document for PDF generation');
        
        const clonedElem = clonedDoc.querySelector('.pdf-container') as HTMLElement;
        if (clonedElem) {
          console.log('Preparing cloned element for PDF generation');
          // Make element visible and properly positioned for capture
          clonedElem.style.position = 'relative';
          clonedElem.style.height = 'auto';
          clonedElem.style.minHeight = '100%';
          clonedElem.style.width = '210mm';
          clonedElem.style.visibility = 'visible';
          clonedElem.style.opacity = '1';
        }
        return clonedDoc;
      }
    });
    
    console.log('Canvas generated successfully:', canvas.width, 'x', canvas.height);
    
    // Calculate PDF dimensions
    const imgWidth = 210; // mm (A4 width)
    const pageHeight = 297; // mm (A4 height)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Calculate the number of pages
    const pageCount = Math.ceil(imgHeight / pageHeight);
    console.log('PDF will have', pageCount, 'pages');
    
    // Create PDF document
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
    console.log('Cleaning up PDF generation container');
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
