import React from 'react';
import { CVData } from '@shared/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { generatePDF } from '@/lib/pdf-generator';
import { getAllTemplates } from '@/lib/templates-registry';
import ClientSideTemplateRenderer from './ClientSideTemplateRenderer';

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

  return (
    <div className="cv-preview h-full flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h3 className="font-medium">Preview</h3>
          <Select value={selectedTemplate} onValueChange={onTemplateChange}>
            <SelectTrigger className="w-[200px]">
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
        >
          Export PDF
        </Button>
      </div>
      
      <div className="flex-grow overflow-auto">
        <ClientSideTemplateRenderer
          templateId={selectedTemplate}
          cvData={cvData}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default CVPreview;