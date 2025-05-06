import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCVForm } from '@/contexts/cv-form-context';
import { useCVRequest } from '@/contexts/cv-request-context';
import DirectTemplateRenderer from '@/components/DirectTemplateRenderer';
import { getAllTemplates, getTemplateById } from '@/lib/templates-registry';
import { X, Download, Printer, Mail, CheckCircle, ArrowLeft, Edit, RefreshCw, ChevronRight } from 'lucide-react';
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
    
    // Reset any existing request
    resetRequest();
    
    try {
      // Ensure form data has the most current template ID
      if (currentTemplateId !== formData.templateId) {
        console.log('Updating template ID before download:', currentTemplateId);
        updateFormField('templateId', currentTemplateId);
      }
      
      console.log("Initiating payment with template ID:", currentTemplateId);
      // Initiating payment using the current template ID and updated form data
      const updatedFormData = {
        ...formData,
        templateId: currentTemplateId // Ensure consistent template ID
      };
      
      try {
        // First attempt: try to initiate payment via API
        const paymentInitiated = await initiatePayment(currentTemplateId, updatedFormData);
        
        if (paymentInitiated) {
          toast({
            title: "Payment Initiated",
            description: "Redirecting to payment verification page",
          });
          // Redirect to USSD payment page for manual payment verification
          navigate('/ussd-payment');
          return;
        }
      } catch (apiError) {
        // Log the API error but continue to fallback
        console.warn("Payment API error:", apiError);
      }
      
      // If we reach here, API call failed - proceed to fallback
      console.log("Using fallback payment flow");
      
      // Create a local storage key for CV data that we'll use later
      const storageKey = `cv_data_${Date.now()}`;
      const localStorageData = { templateId: currentTemplateId, cvData: updatedFormData };
      localStorage.setItem(storageKey, JSON.stringify(localStorageData));
      
      // Generate a request ID using timestamp
      const fallbackRequestId = `local-${Date.now()}`;
      localStorage.setItem('cv_request_id', fallbackRequestId);
      localStorage.setItem(`cv_data_${fallbackRequestId}`, JSON.stringify(localStorageData));
      
      // Use the dialog to ask user what to do
      toast({
        title: "Connection Issue",
        description: "Would you like to proceed with manual payment verification anyway?",
        action: (
          <Button 
            variant="default" 
            onClick={() => navigate('/ussd-payment')}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Proceed
          </Button>
        ),
        duration: 10000, // 10 seconds
      });
      
      setIsDownloading(false);
    } catch (error) {
      console.error("Error in payment flow:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to initiate payment",
        variant: "destructive",
        action: (
          <Button 
            variant="outline" 
            onClick={() => navigate('/ussd-payment')}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Try Anyway
          </Button>
        ),
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
          
          <button 
            className="py-3 flex flex-col items-center text-sm text-blue-600 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
            <span className="mt-1">Size</span>
          </button>
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
        <div className={`flex-grow overflow-auto flex justify-center items-start ${isMobile ? 'p-1 pt-3' : 'p-4'} bg-gray-100`}>
          <div className="bg-white shadow-md overflow-hidden max-w-screen-md w-full aspect-[210/297] print:shadow-none" 
            style={isMobile ? {maxHeight: 'calc(100vh - 220px)'} : {}}
          >
            <DirectTemplateRenderer
              templateId={currentTemplateId}
              cvData={formData}
              height={isMobile ? 600 : 800}
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
