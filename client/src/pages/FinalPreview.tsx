import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCVForm } from '@/contexts/cv-form-context';
import { useCVRequest } from '@/contexts/cv-request-context';
import DirectTemplateRenderer from '@/components/DirectTemplateRenderer';
import { getAllTemplates, getTemplateById } from '@/lib/templates-registry';
import { X, Download, Printer, Mail, CheckCircle } from 'lucide-react';
import { directDownloadCVAsPDF } from '@/lib/pdf-generator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/auth-context';
import '../styles/cv-simple-preview.css';

const FinalPreview = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { formData, updateFormField } = useCVForm();
  const { isAuthenticated } = useAuth();
  
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
  const handleSelectTemplate = (id: string) => {
    setCurrentTemplateId(id);
    navigate(`/cv/${id}/final-preview`, { replace: true });
    updateFormField('templateId', id);
  };
  
  // Handle CV download (initiate payment and redirect to payment page)
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Ensure form data has the current template ID
      if (currentTemplateId !== formData.templateId) {
        updateFormField('templateId', currentTemplateId);
      }
      
      // Store the selected template ID for the payment page
      sessionStorage.setItem('cv_template_id', currentTemplateId);
      
      // Navigate to payment page
      navigate('/ussd-payment');
    } catch (error) {
      console.error("Error proceeding to payment:", error);
      toast({
        title: "Error",
        description: "There was a problem proceeding to payment. Please try again.",
        variant: "destructive"
      });
      setIsDownloading(false);
    }
  };
  
  // Handle print (disabled)
  const handlePrint = () => {
    // Functionality disabled
  };
  
  // Handle email (disabled)
  const handleEmail = () => {
    // Functionality disabled
  };
  
  // Handle content update
  const handleUpdateContent = () => {
    navigate(`/cv/${currentTemplateId}/personal`);
  };
  
  // Sync template ID from URL params
  useEffect(() => {
    if (templateId && templateId !== formData.templateId) {
      updateFormField('templateId', templateId);
    }
  }, [templateId, formData.templateId, updateFormField]);

  // Redirect if no template selected
  useEffect(() => {
    if (!currentTemplateId) {
      navigate('/templates');
    }
  }, [currentTemplateId, navigate]);

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Desktop Header */}
      {!isMobile && (
        <div className="bg-white border-b border-gray-200 py-3 px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Your CV Preview
            </h2>
            <div className="text-sm text-gray-500">
              {currentTemplateName}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setTemplateSidebarOpen(!templateSidebarOpen)}
            >
              Templates
            </Button>
            
            <Button 
              onClick={handleEmail}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </Button>
            
            <Button 
              onClick={handlePrint}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
            
            <Button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-[#1E2F5C] text-white py-4 px-4 flex justify-center items-center">
          <h1 className="text-2xl font-bold">Finalize Resume</h1>
        </div>
      )}
      
      {/* Mobile Actions */}
      {isMobile && (
        <div className="flex justify-between px-4 py-3 bg-[#1E2F5C]">
          <button 
            onClick={() => setTemplateSidebarOpen(true)}
            className="flex-1 mr-2 py-3 px-4 bg-transparent border-2 border-white rounded-full text-white font-medium"
          >
            Change Template
          </button>
          
          <button 
            onClick={handleUpdateContent}
            className="flex-1 ml-2 py-3 px-4 bg-transparent border-2 border-white rounded-full text-white font-medium flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5C19.3284 2.5 20 3.17157 20 4C20 4.82843 19.3284 5.5 18.5 5.5L11.5 12.5L8.5 13.5L9.5 10.5L16.5 3.5C17.0304 2.96956 17.4696 2.96956 18 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit Resume
          </button>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex-grow flex overflow-hidden">
        {/* Template Sidebar */}
        {templateSidebarOpen && (
          <div className={`${isMobile ? 'fixed inset-0 z-50 bg-white' : 'templates-sidebar'}`}>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">Templates</h3>
              <button 
                onClick={() => setTemplateSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Templates List */}
            <div className="templates-grid">
              {allTemplates.map((template) => (
                <div 
                  key={template.id}
                  onClick={() => {
                    handleSelectTemplate(template.id);
                    if (isMobile) setTemplateSidebarOpen(false);
                  }}
                  className={`cursor-pointer border rounded-md overflow-hidden relative ${currentTemplateId === template.id ? 'ring-2 ring-teal-500' : 'hover:border-teal-500'}`}
                >
                  {/* Template Preview Image */}
                  <div className="aspect-[210/297] bg-white relative">
                    <img 
                      src={template.previewImage} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Selected Indicator */}
                    {currentTemplateId === template.id && (
                      <div className="absolute top-1 right-1 bg-teal-500 rounded-full p-0.5">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Template Name */}
                  <div className="text-xs font-medium text-center py-1 px-2 truncate">
                    {template.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* CV Preview Area */}
        <div className={`flex-grow ${isMobile ? 'cv-preview-mobile' : 'p-4'}`}>
          {/* "Scroll to view" message for mobile */}
          {isMobile && (
            <div className="scroll-notice">
              ○ Scroll to view the full CV
            </div>
          )}
          
          {/* CV Preview */}
          <div className={isMobile ? 'mobile-cv-container' : 'cv-preview-wrapper'}>
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
            disabled={isDownloading}
            className="w-full py-4 bg-[#2563EB] text-white text-lg font-semibold"
          >
            {isDownloading ? 'Downloading...' : 'Download My CV'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FinalPreview;
