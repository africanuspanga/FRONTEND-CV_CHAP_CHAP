import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getTemplates } from '@/lib/templates';
import { useCVData } from '@/hooks/useCVData';

const TemplateSelection = () => {
  const [, navigate] = useLocation();
  const { cvData, setTemplate } = useCVData();

  // Fetch templates
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['/api/templates'],
    queryFn: getTemplates
  });

  // Select template and proceed
  const handleSelectTemplate = (templateId: string) => {
    setTemplate(templateId);
    navigate('/create/method');
  };

  // Check if there's existing CV data in progress
  useEffect(() => {
    // If template already selected, show creation method
    if (cvData.templateId) {
      navigate('/create/method');
    }
  }, [cvData.templateId, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-darkText mb-6">Choose a Template</h1>
        <p className="text-lightText mb-12">Select a professional template for your CV</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-darkText mb-6">Something went wrong</h1>
        <p className="text-lightText mb-6">We couldn't load the templates. Please try again later.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-darkText mb-6">Choose a Template</h1>
      <p className="text-lightText mb-12">Select a professional template for your CV</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {templates?.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div className="h-64 bg-gray-50 flex items-center justify-center p-4">
              {template.id === 'moonlightSonata' && (
                <div className="w-full h-full rounded border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1/3 h-full bg-orange-400"></div>
                  <div className="absolute top-4 left-4 right-4 text-white">
                    <div className="text-lg font-bold">JOHN DOE</div>
                    <div className="text-xs mt-1 border-t border-white pt-1">WEB DEVELOPER</div>
                  </div>
                </div>
              )}
              
              {template.id === 'tanzanite' && (
                <div className="w-full h-full bg-blue-50 rounded border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-16 bg-primary"></div>
                  <div className="absolute top-20 left-4 right-4">
                    <div className="text-lg font-bold text-darkText">JOHN DOE</div>
                    <div className="text-xs text-primary mt-1">Web Developer</div>
                  </div>
                </div>
              )}
              
              {template.id === 'safariPro' && (
                <div className="w-full h-full bg-amber-50 rounded border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-24 bg-amber-700"></div>
                  <div className="absolute top-8 left-0 w-32 h-32 rounded-full bg-white ml-4 border-4 border-amber-700"></div>
                  <div className="absolute top-28 left-40 right-4">
                    <div className="text-lg font-bold text-darkText">John Doe</div>
                    <div className="text-xs text-amber-700 mt-1">Web Developer</div>
                  </div>
                </div>
              )}
              
              {template.id === 'mwalimuClassic' && (
                <div className="w-full h-full bg-gray-100 rounded border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 text-center pt-8">
                    <div className="text-xl font-bold text-darkText uppercase">John Doe</div>
                    <div className="text-sm text-gray-600 mt-1">Web Developer</div>
                    <div className="mx-auto w-16 h-0.5 bg-primary mt-2"></div>
                  </div>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSelectTemplate(template.id)}
              >
                Select Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelection;
