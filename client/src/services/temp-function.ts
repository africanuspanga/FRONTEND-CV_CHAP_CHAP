/**
 * Download CV using template preview endpoint
 * 
 * This function uses the preview template endpoint which returns a PDF directly
 * after posting the CV data in the required format.
 * 
 * @param templateId The ID of the template to use
 * @param cvData The user's CV data
 * @returns A Promise that resolves to a Blob containing the PDF
 */
export const downloadCVWithPreviewEndpoint = async (templateId: string, cvData: CVData): Promise<Blob> => {
  try {
    // Convert templateId to lowercase to match backend expectations
    const normalizedTemplateId = templateId.toLowerCase();
    console.log(`Attempting PDF download for template: ${normalizedTemplateId}`);
    
    // Use our data transformation function to prepare data in the backend-expected format
    const transformedData = transformCVDataForBackend(cvData);
    
    console.log('Sending transformed data to backend:', transformedData);
    
    // Using retry pattern with our CORS proxy for better reliability
    return await retry(async () => {
      console.log('Attempting to fetch PDF through CORS proxy...');
      
      // Use our CORS proxy to make the request
      const blob = await fetchFromCVScreener<Blob>(
        `/api/preview-template/${normalizedTemplateId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/pdf',
          },
          responseType: 'blob',
          body: transformedData,
          includeCredentials: true
        }
      );
      
      if (blob.size === 0) {
        throw new Error('Received empty PDF file');
      }
      
      console.log('Preview endpoint PDF download successful', { size: blob.size, type: blob.type });
      return blob;
    }, 3, 2000); // 3 retries with increasing delay starting at 2 seconds
  } catch (error) {
    console.error('Error downloading PDF from preview endpoint:', error);
    // Create a more user-friendly error message
    let errorMessage = 'Failed to download PDF';
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('abort')) {
        errorMessage = 'Request timed out. The server took too long to respond.';
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else {
        errorMessage = error.message;
      }
    }
    throw new Error(errorMessage);
  }
};