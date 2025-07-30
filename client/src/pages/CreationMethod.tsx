import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCVData } from '@/hooks/useCVData';
import { FileText } from 'lucide-react';

const CreationMethod = () => {
  const [, navigate] = useLocation();
  const { cvData, setTemplate, resetCVData } = useCVData();

  const handleCreateNew = () => {
    // Reset all form data before starting a new CV
    resetCVData();
    
    // Also clear any form data saved in localStorage by the CV form context
    localStorage.removeItem('cv-form-data');
    localStorage.removeItem('cv-form-step');
    
    // Direct users to template selection first
    navigate('/templates');
  };

  // Upload functionality temporarily disabled
  // Will be implemented in a future update

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-darkText mb-4">How would you like to create your CV?</h1>
        <p className="text-lightText">Choose an option to get started with your professional CV</p>
      </div>
      
      <div className="flex justify-center">
        <Card className="shadow-md hover:shadow-lg transition-shadow max-w-md w-full">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-darkText mb-4">Create Your Professional CV</h2>
            <p className="text-lightText mb-8">
              Start with our step-by-step guided process to create a professional CV using our expert templates.
            </p>
            <Button 
              size="lg" 
              className="w-full py-6" 
              onClick={handleCreateNew}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-sm text-lightText mb-2">
          Already have a template in mind?
        </p>
        <Button 
          variant="link" 
          className="text-primary"
          onClick={() => navigate('/templates')}
        >
          Browse all CV templates
        </Button>
      </div>
    </div>
  );
};

export default CreationMethod;
