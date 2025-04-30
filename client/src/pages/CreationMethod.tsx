import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCVData } from '@/hooks/useCVData';
import { FileText, Upload } from 'lucide-react';

const CreationMethod = () => {
  const [, navigate] = useLocation();
  const { cvData, setTemplate } = useCVData();

  const handleCreateNew = () => {
    // Always set a default template (Moonlight Sonata)
    setTemplate('moonlightSonata');
    
    // Proceed directly to the CV creation form
    navigate('/create/1');
  };

  const handleUploadExisting = () => {
    // This would be implemented with file upload functionality
    // For now, just show a notification and proceed to create
    alert('File upload feature will be implemented in a future update. Proceeding to create a new CV.');
    navigate('/create');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-darkText mb-4">How would you like to create your CV?</h1>
        <p className="text-lightText">Choose an option to get started with your professional CV</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-darkText mb-4">Create a New CV</h2>
            <p className="text-lightText mb-8">
              Start from scratch with our step-by-step guided process to create a professional CV.
            </p>
            <Button 
              size="lg" 
              className="w-full py-6" 
              onClick={handleCreateNew}
            >
              Create New CV
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
              <Upload className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-darkText mb-4">Upload Existing CV</h2>
            <p className="text-lightText mb-8">
              Upload your current CV and we'll extract the information to enhance it.
            </p>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full py-6" 
              onClick={handleUploadExisting}
            >
              Upload CV
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
