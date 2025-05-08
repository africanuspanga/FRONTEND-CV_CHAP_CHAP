import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCVForm } from '@/contexts/cv-form-context';
import DirectTemplateRenderer from '@/components/DirectTemplateRenderer';
import { getAllTemplates, getTemplateById } from '@/lib/templates-registry';
import { X, Download, Printer, Mail, CheckCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const FinalPreview = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { formData, updateFormField } = useCVForm();
  
  // State for template sidebar
  const [templateSidebarOpen, setTemplateSidebarOpen] = useState(!isMobile);
  // Get all available templates
  const allTemplates = getAllTemplates();
  // Currently selected template for preview
  const [currentTemplateId, setCurrentTemplateId] = useState(templateId || formData.templateId);
  // Track download in progress
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Get current template name
  const currentTemplateName = getTemplateById(currentTemplateId)?.name || 'Template';
  
  // Handle template selection
  const handleSelectTemplate = (id) => {
    setCurrentTemplateId(id);
    navigate(`/cv/${id}/final-preview`, { replace: true });
    updateFormField('templateId', id);
  };
  
  // Handle CV download (initiate payment and redirect to payment page)
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (currentTemplateId !== formData.templateId) {
        updateFormField('templateId', currentTemplateId);
      }
      sessionStorage.setItem('cv_template_id', currentTemplateId);
      navigate('/ussd-payment');
    } catch (error) {
      console.error("Error proceeding to payment:", error);
      toast({
        title: "Error",
        description: "There was a problem proceeding to payment.",
        variant: "destructive"
      });
      setIsDownloading(false);
    }
  };
  
  // Simple placeholder functions
  const handlePrint = () => {};
  const handleEmail = () => {};
  const handleUpdateContent = () => {
    navigate(`/cv/${currentTemplateId}/personal`);
  };
  
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Desktop Header */}
      {!isMobile && (
        <div className="bg-white border-b py-3 px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">Your CV Preview</h2>
            <div className="text-sm text-gray-500">{currentTemplateName}</div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setTemplateSidebarOpen(!templateSidebarOpen)}
            >
              Templates
            </Button>
            <Button variant="outline"><Mail className="h-4 w-4" /><span>Email</span></Button>
            <Button variant="outline"><Printer className="h-4 w-4" /><span>Print</span></Button>
            <Button onClick={handleDownload} className="bg-teal-600 text-white">
              <Download className="h-4 w-4" />
              <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex-grow flex overflow-hidden">
        {/* Template Sidebar */}
        {templateSidebarOpen && (
          <div className={isMobile ? 'fixed inset-0 z-50 bg-white' : 'w-64 bg-white border-r'}>
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">Templates</h3>
              <button onClick={() => setTemplateSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3">All templates</h4>
                <div className={isMobile ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-1 gap-4'}>
                  {allTemplates.map((template) => (
                    <div 
                      key={template.id}
                      onClick={() => {
                        handleSelectTemplate(template.id);
                        if (isMobile) setTemplateSidebarOpen(false);
                      }}
                      className="cursor-pointer border rounded-md overflow-hidden relative"
                    >
                      <div className="aspect-[210/297] bg-white">
                        <img 
                          src={template.previewImage} 
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs font-medium text-center py-1 px-2 truncate">
                        {template.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* CV Preview Area */}
        <div className="flex-grow p-4 flex justify-center">
          <div className="max-w-[794px] w-full bg-white shadow-sm border rounded-sm">
            <DirectTemplateRenderer
              templateId={currentTemplateId}
              cvData={formData}
              height="auto"
              width="100%" 
              scaleFactor={1}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile Action Button */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0">
          <button 
            onClick={handleDownload}
            className="w-full py-4 bg-blue-600 text-white text-lg font-semibold"
          >
            {isDownloading ? 'Downloading...' : 'Download My CV'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FinalPreview;
