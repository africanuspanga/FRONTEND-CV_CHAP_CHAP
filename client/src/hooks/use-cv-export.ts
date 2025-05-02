/**
 * CV Export Hook
 * This hook provides easy-to-use functions for exporting CVs to PDF
 */

import { useState } from 'react';
import { generateAndDownloadPDF } from '@/lib/client-pdf-generator';
import { CVData } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface UseCVExportReturn {
  exportToPDF: (cvData: CVData, templateId: string, filename?: string) => Promise<void>;
  isExporting: boolean;
  error: Error | null;
}

/**
 * Hook for exporting CVs to PDF
 */
export function useCVExport(): UseCVExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const exportToPDF = async (cvData: CVData, templateId: string, filename?: string): Promise<void> => {
    setIsExporting(true);
    setError(null);
    
    try {
      await generateAndDownloadPDF(templateId, cvData, filename);
      
      toast({
        title: 'CV Downloaded',
        description: 'Your CV has been downloaded successfully.',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error exporting CV to PDF:', err);
      
      const exportError = err instanceof Error ? err : new Error('Failed to export CV to PDF');
      setError(exportError);
      
      toast({
        title: 'Download Failed',
        description: 'There was an error downloading your CV. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
      
      throw exportError; // Re-throw for caller handling
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToPDF,
    isExporting,
    error,
  };
}
