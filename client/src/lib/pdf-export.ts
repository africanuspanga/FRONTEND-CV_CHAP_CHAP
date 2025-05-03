import { CVFormData } from '@/types/cv-form';

/**
 * Export a CV to PDF format
 * @param formData CV form data
 */
export async function exportCvToPdf(formData: CVFormData): Promise<void> {
  try {
    // Call the API to generate and download the PDF
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }
    
    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.personalInfo.firstName || 'CV'}_${formData.personalInfo.lastName || 'ChapChap'}.pdf`;
    
    // Append the link to the document
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting CV to PDF:', error);
    throw error;
  }
}