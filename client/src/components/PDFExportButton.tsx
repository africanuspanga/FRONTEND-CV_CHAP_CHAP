import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { useCVExport } from '@/hooks/use-cv-export';
import { useCVForm } from '@/contexts/cv-form-context';

interface PDFExportButtonProps {
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

/**
 * Button component to export CV data to PDF
 * Uses the local template renderer and HTML2PDF for client-side PDF generation
 */
const PDFExportButton: React.FC<PDFExportButtonProps> = ({
  className = '',
  variant = 'default',
  size = 'default',
  children
}) => {
  const { isExporting, exportToPDF } = useCVExport();
  const { formData } = useCVForm();
  
  const handleExport = async () => {
    // Ensure we have template ID and some data
    if (!formData.templateId || !formData.personalInfo) {
      console.error('Cannot export: missing template ID or personal info');
      return;
    }
    
    await exportToPDF(formData, formData.templateId);
  };
  
  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <FileDown className="mr-2 h-4 w-4" />
          {children || 'Download CV'}
        </>
      )}
    </Button>
  );
};

export default PDFExportButton;
