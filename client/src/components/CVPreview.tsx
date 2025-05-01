import React from 'react';
import { CVData } from '@shared/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { generatePDF } from '@/lib/pdf-generator';
import { getAllTemplates } from '@/lib/templates-registry';
import ClientSideTemplateRenderer from './ClientSideTemplateRenderer';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const templates = getAllTemplates();
  
  const handleExportPDF = async () => {
    try {
      await generatePDF(cvData, selectedTemplate);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Could add toast notification here
    }
  };

  // Use the mobile detection hook
  const isMobile = useIsMobile();
  
  return (
    <div className="cv-preview h-full flex flex-col">
      {/* Desktop controls */}
      <div className="bg-gray-50 border-b border-gray-200 p-3 sm:p-4 flex flex-wrap sm:flex-nowrap justify-between items-center gap-2">
        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
          <h3 className="font-medium text-sm sm:text-base">Preview</h3>
          <Select value={selectedTemplate} onValueChange={onTemplateChange}>
            <SelectTrigger className="w-full sm:w-[200px] text-xs sm:text-sm h-8 sm:h-10">
              <SelectValue placeholder="Select Template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleExportPDF}
          disabled={!isFormComplete}
          variant="secondary"
          size="sm"
          className="w-full sm:w-auto text-xs sm:text-sm mt-2 sm:mt-0"
        >
          Export PDF
        </Button>
      </div>
      
      {/* Mobile note - helpful for small screens */}
      <div className="bg-blue-50 border-b border-blue-100 px-3 py-2 text-xs text-blue-700 md:hidden">
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <p>Pinch to zoom the preview. Rotate your device for a better view.</p>
        </div>
      </div>
      
      <div className="flex-grow overflow-auto">
        <ClientSideTemplateRenderer
          templateId={selectedTemplate}
          cvData={cvData}
          className="h-full mx-auto"
        />
      </div>
    </div>
  );
};

export default CVPreview;