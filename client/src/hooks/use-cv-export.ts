import { useState } from 'react';
import { CVData } from '@shared/schema';
import { toast } from '@/hooks/use-toast';
import { generateClientSidePDF } from '@/lib/client-pdf-generator';

/**
 * Hook for handling CV exports
 * Provides PDF generation functionality with loading state management
 */
export const useCVExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Generate and download a PDF of the CV
   */
  const exportToPDF = async (cvData: CVData, templateId: string): Promise<boolean> => {
    setIsExporting(true);
    
    try {
      // Generate and download the PDF
      await generateClientSidePDF(cvData, templateId);
      
      toast({
        title: 'CV Downloaded',
        description: 'Your CV has been successfully generated and downloaded.',
      });
      
      return true;
    } catch (error) {
      console.error('Error exporting CV to PDF:', error);
      
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportToPDF,
  };
};
