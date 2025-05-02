import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useCVData } from '@/hooks/useCVData';
import TemplateSelectionGrid from '@/components/TemplateSelectionGrid';
import { getAllTemplates } from '@/lib/templates-registry';

const TemplateSelection = () => {
  const [, navigate] = useLocation();
  const { cvData, setTemplate } = useCVData();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  // Get templates directly from registry
  const templates = getAllTemplates();

  // Select template and immediately proceed to Personal Information form
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setTemplate(templateId);
    navigate(`/cv/${templateId}/personal`); // Go directly to Personal Information form with templateId in URL
  };
  
  // Proceed to next step (for the "Continue with Selected Template" button)
  const handleProceed = () => {
    if (selectedTemplateId) {
      setTemplate(selectedTemplateId);
      navigate(`/cv/${selectedTemplateId}/personal`); // Go directly to Personal Information form with templateId in URL
    }
  };

  // Check if there's existing CV data in progress
  useEffect(() => {
    if (cvData.templateId) {
      setSelectedTemplateId(cvData.templateId);
    }
  }, [cvData.templateId]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">Choose a Template</h1>
        <p className="text-muted-foreground mb-6 md:mb-8 text-lg">
          Select a professional template that best represents your career goals and personal style.
        </p>
        
        <div className="mb-8">
          <div className="inline-flex items-center rounded-md border px-3 py-2 mb-8 border-input bg-background text-sm font-medium">
            All Templates
          </div>
          
          <TemplateSelectionGrid 
            onSelectTemplate={handleSelectTemplate}
            selectedTemplateId={selectedTemplateId || undefined}
          />
        </div>
        
        <div className="flex justify-end mt-10 md:mt-12">
          <Button 
            size="lg" 
            onClick={handleProceed}
            disabled={!selectedTemplateId}
            className="px-6 py-6 text-base"
          >
            Continue with Selected Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;