import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';
import { useCVForm } from '@/contexts/cv-form-context';
import { useCVRequest } from '@/contexts/cv-request-context';
import DirectTemplateRenderer from '@/components/DirectTemplateRenderer';
import { getAllTemplates, getTemplateById } from '@/lib/templates-registry';
import { X, Download, Printer, Mail, CheckCircle, ArrowLeft, Edit, RefreshCw, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { generatePDF, directDownloadCVAsPDF } from '@/lib/pdf-generator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/auth-context';

const FinalPreview = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { formData, updateFormField } = useCVForm();
  const { isAuthenticated } = useAuth();
  const { initiatePayment, resetRequest, paymentStatus } = useCVRequest();
  
  // State for template sidebar
  const [templateSidebarOpen, setTemplateSidebarOpen] = useState(!isMobile);
  // Get all available templates
  const allTemplates = getAllTemplates();
  // Currently selected template for preview
  const [currentTemplateId, setCurrentTemplateId] = useState(templateId || formData.templateId);
  // Track payment/download in progress
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Track scale factor for mobile viewing
  const [scaleFactor, setScaleFactor] = useState(0.65);
  
  // Get current template name
  const currentTemplateName = getTemplateById(currentTemplateId)?.name || 'Template';
  
  // Handle template selection
  const handleSelectTemplate = (id: string) => {
    setCurrentTemplateId(id);
    
    // Also update the URL to reflect the new template
    navigate(`/cv/${id}/final-preview`, { replace: true });
    
    // Most importantly, update the templateId in the form data
    updateFormField('templateId', id);
  };
  
  // Direct download CV without payment
  const handleDirectDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Ensure form data has the most current template ID
      if (currentTemplateId !== formData.templateId) {
        updateFormField('templateId', currentTemplateId);
      }
      
      // Use the direct API download that bypasses payment flow
      await directDownloadCVAsPDF(formData, currentTemplateId);
      
      toast({
        title: "Download Complete",
        description: "Your CV has been downloaded successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error downloading CV:", error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download CV",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Handle CV download (initiate payment and redirect to payment page)
  const handlePaymentFlow = async () => {
    // Set downloading state to true to disable the button
    setIsDownloading(true);
    
    try {
      // Ensure form data has the most current template ID
      if (currentTemplateId !== formData.templateId) {
        console.log('Updating template ID before proceeding to payment:', currentTemplateId);
        updateFormField('templateId', currentTemplateId);
      }
      
      // Store the selected template ID in sessionStorage
      // This will be needed at the payment verification step
      sessionStorage.setItem('cv_template_id', currentTemplateId);
      
      console.log("Proceeding to USSD payment page with templateId:", currentTemplateId);
      
      // IMPORTANT: Go directly to the USSD payment page without initiating payment
      // We'll handle everything on the USSD page itself
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
  
  // Handle the download button click - use payment flow for production
  const handleDownload = async () => {
    // Use the payment flow method for normal operation
    await handlePaymentFlow();
    // Never call direct download here - we always want to go through payment flow
  };
  
  // Handle print - disabled as requested
  const handlePrint = () => {
    // Do nothing - print functionality is disabled
    return;
  };
  
  // Handle email - disabled as requested
  const handleEmail = () => {
    // Do nothing - email functionality is disabled
    return;
  };
  

  
  // Synchronize template ID from URL params when component mounts
  useEffect(() => {
    // If URL has a template ID that's different from form data, update form data
    if (templateId && templateId !== formData.templateId) {
      console.log('Updating template ID from URL:', templateId);
      updateFormField('templateId', templateId);
    }
  }, [templateId, formData.templateId, updateFormField]);

  // Check if we need to redirect
  useEffect(() => {
    // If no template is selected, redirect to template selection
    if (!currentTemplateId) {
      navigate('/templates');
    }
  }, [currentTemplateId, navigate]);

  // Go back to previous step
  const handleBack = () => {
    navigate(`/cv/${currentTemplateId}/additional-sections`);
  };

  // Go to template editing
  const handleEditTemplate = () => {
    setTemplateSidebarOpen(true);
  };
  
  // Handle content update
  const handleUpdateContent = () => {
    navigate(`/cv/${currentTemplateId}/personal`);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Desktop Header */}
      {!isMobile && (
        <div className="bg-white border-b border-gray-200 py-3 px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <span>Your CV Preview</span>
            </h2>
            <div className="text-sm text-gray-500">
              {currentTemplateName}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
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
        <div className="bg-blue-900 text-white py-3 px-4 flex justify-between items-center">
          <button onClick={handleBack} className="text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">FINALIZE</h1>
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>
      )}
      
      {/* Mobile Template Editing Options */}
      {isMobile && (
        <div className="bg-gray-50 border-b border-gray-200 grid grid-cols-3 divide-x divide-gray-200">
          <button 
            onClick={handleEditTemplate}
            className="py-3 flex flex-col items-center text-sm text-blue-600 font-medium"
          >
            <Edit className="h-4 w-4 mb-1" />
            Edit Template
          </button>
          
          <button 
            onClick={() => setTemplateSidebarOpen(true)}
            className="py-3 flex flex-col items-center text-sm text-blue-600 font-medium"
          >
            <RefreshCw className="h-4 w-4 mb-1" />
            Swap Template
          </button>
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="py-3 flex flex-col items-center text-sm text-blue-600 font-medium">
                <ZoomIn className="h-4 w-4 mb-1" />
                <span className="mt-1">Size</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-3">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Adjust Size</h3>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setScaleFactor(prev => Math.max(0.4, prev - 0.1))}
                    className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <div className="text-xs px-2">
                    {Math.round(scaleFactor * 100)}%
                  </div>
                  <button 
                    onClick={() => setScaleFactor(prev => Math.min(1.0, prev + 0.1))}
                    className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex-grow flex overflow-hidden">
        {/* Template Sidebar */}
        {templateSidebarOpen && (
          <div className={`${isMobile ? 'fixed inset-0 z-50 bg-white' : 'w-64 border-r border-gray-200 bg-white flex-shrink-0 overflow-y-auto'}`}>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">Templates</h3>
              <button 
                onClick={() => setTemplateSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            

            
            {/* All Templates */}
            <div className="p-4 overflow-y-auto" style={isMobile ? {maxHeight: 'calc(100vh - 130px)'} : {}}>
              <h4 className="text-sm font-medium text-gray-500 mb-3">All templates</h4>
              <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'space-y-4'}`}>
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
          </div>
        )}
        
        {/* CV Preview Area */}
        <div className={`flex-grow overflow-auto flex justify-center items-start ${isMobile ? 'p-1 pt-2' : 'p-4'} bg-gray-100`}>
          {/* Mobile-friendly message for scaling instructions */}
          {isMobile && (
            <div className="absolute top-[6.5rem] left-0 right-0 bg-blue-50 z-10 py-1 px-2 text-xs text-center text-blue-700 border-y border-blue-100">
              <div className="flex justify-center items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                <span>Scroll to view the full CV</span>
              </div>
            </div>
          )}
          <div className="bg-white shadow-md overflow-hidden max-w-screen-md w-full print:shadow-none" 
            style={isMobile ? {minHeight: 'calc(100vh - 220px)'} : {}}
          >
            <DirectTemplateRenderer
              templateId={currentTemplateId}
              cvData={formData}
              height={isMobile ? "auto" : 800 as const}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile Action Buttons */}
      {isMobile && (
        <div className="bg-white px-4 py-4 space-y-3">
          <Button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-6 bg-teal-600 hover:bg-teal-700 text-white text-lg rounded-md"
          >
            {isDownloading ? 'Downloading...' : 'Get My CV'}
          </Button>
          
          <Button 
            onClick={handleUpdateContent}
            variant="outline" 
            className="w-full py-6 border-2 border-blue-900 text-blue-900 text-lg rounded-md"
          >
            Edit Content
          </Button>
        </div>
      )}
    </div>
  );
};

export default FinalPreview;
