/**
 * PDF Export Button Component
 * This component provides a button for exporting CVs to PDF
 */

import { Button } from '@/components/ui/button';
import { useCVExport } from '@/hooks/use-cv-export';
import { CVData } from '@shared/schema';
import { Loader2, Download } from 'lucide-react';
import React from 'react';

interface PDFExportButtonProps {
  cvData: CVData;
  templateId: string;
  filename?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Button component for exporting CVs to PDF
 */
const PDFExportButton: React.FC<PDFExportButtonProps> = ({
  cvData,
  templateId,
  filename,
  className = '',
  children = 'Download CV',
}) => {
  const { exportToPDF, isExporting } = useCVExport();

  const handleExport = async () => {
    try {
      await exportToPDF(cvData, templateId, filename);
    } catch (error) {
      // Error handling is done in the hook
      console.error('Export failed:', error);
    }
  };

  return (
    <Button
      type="button"
      className={`${className}`}
      onClick={handleExport}
      disabled={isExporting}
      variant="default"
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          {children}
        </>
      )}
    </Button>
  );
};

export default PDFExportButton;
