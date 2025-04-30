import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { CVData } from '@shared/schema';
import { getTemplateByID } from '@/templates';
import ReactDOMServer from 'react-dom/server';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import html2pdf from 'html2pdf.js';

interface CVPreviewProps {
  cvData: CVData;
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  isFormComplete: boolean;
}

const CVPreview: React.FC<CVPreviewProps> = ({
  cvData,
  selectedTemplate,
  onTemplateChange,
  isFormComplete
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  // Generate preview HTML
  useEffect(() => {
    if (!iframeRef.current) return;

    setIsLoading(true);
    
    const template = getTemplateByID(selectedTemplate);
    if (!template) {
      setIsLoading(false);
      return;
    }

    try {
      const templateElement = template.render(cvData);
      const html = ReactDOMServer.renderToString(templateElement);
      
      // Create a full HTML document
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
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
      
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(fullHtml);
        doc.close();
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error rendering CV template:', error);
      setIsLoading(false);
    }
  }, [cvData, selectedTemplate]);

  const generatePDF = async () => {
    if (!iframeRef.current || !isFormComplete) return;
    
    try {
      setPdfGenerating(true);
      
      const iframe = iframeRef.current;
      const iframeDocument = iframe.contentDocument;
      
      if (!iframeDocument) {
        throw new Error('Cannot access iframe document');
      }
      
      // Clone the body content to avoid modifying the original
      const content = iframeDocument.body.cloneNode(true) as HTMLElement;
      
      // Configure PDF options
      const options = {
        margin: [0, 0, 0, 0],
        filename: `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Generate PDF
      await html2pdf().from(content).set(options).save();
      
      setPdfGenerating(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-medium text-darkText mb-4">CV Preview</h2>
      <p className="text-lightText mb-4">This is how your CV will look. The preview updates as you fill in the form.</p>
      
      {/* Template Selector */}
      <div className="flex items-center mb-6">
        <span className="text-sm font-medium text-darkText mr-4">Template:</span>
        <Select 
          value={selectedTemplate} 
          onValueChange={onTemplateChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="moonlightSonata">Moonlight Sonata</SelectItem>
            <SelectItem value="tanzanite">Tanzanite</SelectItem>
            <SelectItem value="safariPro">Safari Pro</SelectItem>
            <SelectItem value="mwalimuClassic">Mwalimu Classic</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Preview Container */}
      <div className="cv-preview-container bg-gray-100 rounded border border-gray-200 relative" style={{ height: '600px', overflow: 'hidden' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-darkText">Loading preview...</span>
          </div>
        )}
        
        <iframe 
          ref={iframeRef}
          title="CV Preview" 
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
      
      {/* Download button */}
      <div className="mt-6">
        <Button
          className="w-full py-6"
          onClick={generatePDF}
          disabled={!isFormComplete || pdfGenerating}
          variant={!isFormComplete ? "secondary" : "default"}
        >
          {pdfGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              {isFormComplete ? 'Download CV' : 'Complete all sections first'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CVPreview;
