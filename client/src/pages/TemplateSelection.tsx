import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCVData } from '@/hooks/useCVData';
import TemplateSelectionGrid from '@/components/TemplateSelectionGrid';
import { getAllTemplates } from '@/lib/templates-registry';

const TemplateSelection = () => {
  const [, navigate] = useLocation();
  const { cvData, setTemplate } = useCVData();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get templates directly from registry
  const templates = getAllTemplates();

  // Filter templates by category if one is selected
  const filteredTemplates = selectedCategory 
    ? templates.filter(template => template.category === selectedCategory)
    : templates;

  // Select template and proceed
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };
  
  // Proceed to next step
  const handleProceed = () => {
    if (selectedTemplateId) {
      setTemplate(selectedTemplateId);
      navigate('/create/method');
    }
  };

  // Check if there's existing CV data in progress
  useEffect(() => {
    if (cvData.templateId) {
      setSelectedTemplateId(cvData.templateId);
    }
  }, [cvData.templateId]);

  // Get unique categories from templates
  const categories = Array.from(new Set(templates.map(template => template.category)));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Choose a Template</h1>
        <p className="text-muted-foreground mb-8">
          Select a professional template that best represents your career goals and personal style.
        </p>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setSelectedCategory(null)}>
              All Templates
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <TemplateSelectionGrid 
              onSelectTemplate={handleSelectTemplate}
              selectedTemplateId={selectedTemplateId || undefined}
            />
          </TabsContent>
          
          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-6">
              <TemplateSelectionGrid 
                onSelectTemplate={handleSelectTemplate}
                selectedTemplateId={selectedTemplateId || undefined}
                filterCategory={category}
              />
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="flex justify-end mt-8">
          <Button 
            size="lg" 
            onClick={handleProceed}
            disabled={!selectedTemplateId}
          >
            Continue with Selected Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;
