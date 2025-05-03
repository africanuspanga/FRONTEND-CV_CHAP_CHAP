/**
 * Minimal PDF Test Generator
 * 
 * This file creates the most basic PDF possible to test if jsPDF works correctly in our environment.
 * It isolates PDF generation from all other complexities of the application.
 */

import jsPDF from 'jspdf';

/**
 * Generate a minimal test PDF with only basic text
 */
export async function generateMinimalPDF(): Promise<Blob> {
  console.log('Attempting minimal PDF generation...');
  try {
    // Initialize the PDF document with basic settings
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    console.log('jsPDF instance created successfully');

    // Add a red border to make the PDF content area visible
    pdf.setDrawColor(255, 0, 0);
    pdf.rect(5, 5, 200, 287);
    console.log('Border added to PDF');

    // Add basic text
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Hello PDF World!', 20, 30);
    console.log('Main title text added');

    // Add more text elements to test different settings
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 255);
    pdf.text('This is a blue subtitle', 20, 50);

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('This is a test PDF generated with jsPDF', 20, 70);
    pdf.text('If you can see this, basic PDF generation works!', 20, 80);

    // Add some shapes
    pdf.setDrawColor(0, 128, 0);
    pdf.setLineWidth(0.5);
    pdf.line(20, 100, 190, 100);

    pdf.setFillColor(255, 0, 0);
    pdf.circle(50, 130, 10, 'F');

    pdf.setFillColor(0, 0, 255);
    pdf.rect(100, 120, 20, 20, 'F');

    // Add a timestamp
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 200);

    // Add a footer
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('CV Chap Chap PDF Test', 20, 280);
    console.log('All PDF content added successfully');

    // Generate the PDF as a blob
    const pdfBlob = pdf.output('blob');
    console.log('PDF Blob generated:', pdfBlob);
    console.log('PDF Blob size:', pdfBlob.size, 'bytes');
    
    if (pdfBlob.size === 0) {
      console.error('CRITICAL: Generated Blob size is 0!');
    }
    
    return pdfBlob;
  } catch (error) {
    console.error('ERROR during minimal PDF generation:', error);
    throw error; // Re-throw to ensure the error is visible
  }
}

/**
 * Generate and download the minimal test PDF
 */
export async function downloadMinimalTestPDF(): Promise<void> {
  try {
    console.log('Starting minimal PDF test download...');
    
    // Generate the minimal PDF
    const blob = await generateMinimalPDF();
    
    // First try opening in a new tab to test the blob directly
    console.log('Attempting to open PDF in new tab...');
    const viewUrl = URL.createObjectURL(blob);
    window.open(viewUrl, '_blank');
    
    // Also try the download approach
    console.log('Attempting to download PDF...');
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `minimal-test-${Date.now()}.pdf`;
    
    // Append to body and click
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    
    // Clean up object URLs after a delay
    setTimeout(() => {
      URL.revokeObjectURL(viewUrl);
      URL.revokeObjectURL(downloadUrl);
      console.log('Object URLs cleaned up');
    }, 1000);
    
    console.log('Minimal PDF test complete');
  } catch (error) {
    console.error('Failed to generate or download minimal PDF:', error);
    throw error;
  }
}