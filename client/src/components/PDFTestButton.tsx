import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { downloadMinimalTestPDF } from '@/lib/minimal-pdf-test';
import { Download, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PDFTestButtonProps {
  className?: string;
}

const PDFTestButton: React.FC<PDFTestButtonProps> = ({ className }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleTestPDF = async () => {
    setIsGenerating(true);
    try {
      console.log('Starting minimal PDF test...');
      await downloadMinimalTestPDF();
      toast({
        title: 'Test PDF Generated',
        description: 'Check if the test PDF was downloaded or opened in a new tab.',
        variant: 'default',
      });
    } catch (error: any) {
      console.error('PDF test failed:', error);
      toast({
        title: 'PDF Test Failed',
        description: `Error: ${error?.message || 'Unknown error'}. Check browser console for details.`,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 ${className || ''}`}
      onClick={handleTestPDF}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          Testing PDF...
        </>
      ) : (
        <>
          <AlertCircle className="h-4 w-4" />
          Test Basic PDF
        </>
      )}
    </Button>
  );
};

export default PDFTestButton;