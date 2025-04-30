import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCVForm } from '@/contexts/cv-form-context';
import { ClientSideTemplateRenderer } from '@/components/ClientSideTemplateRenderer';
import { getAllTemplates, getTemplateById } from '@/lib/templates-registry';
import { X, Download, Printer, Mail, CheckCircle, ArrowLeft, Edit, RefreshCw, ChevronRight } from 'lucide-react';
import { generatePDF } from '@/lib/pdf-generator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/auth-context';

const FinalPreview = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { formData } = useCVForm();
  const { isAuthenticated } = useAuth();
  
  // State for template sidebar
  const [templateSidebarOpen, setTemplateSidebarOpen] = useState(!isMobile);
  // Get all available templates
  const allTemplates = getAllTemplates();
  // Currently selected template for preview
  const [currentTemplateId, setCurrentTemplateId] = useState(templateId || formData.templateId);
  // Track download in progress
  const [isDownloading, setIsDownloading] = useState(false);
  // Template color options
  const colors = [
    '#E5E7EB', // gray
    '#4B5563', // dark gray
    '#1E40AF', // blue
    '#3B82F6', // light blue
    '#10B981', // green
    '#059669', // dark green
    '#B91C1C', // red
    '#7C2D12', // brown
    '#F59E0B', // yellow
    '#D97706'  // orange
  ];
  
  // Get current template name
  const currentTemplateName = getTemplateById(currentTemplateId)?.name || 'Template';
  
  // Handle template selection
  const handleSelectTemplate = (id: string) => {
    setCurrentTemplateId(id);
  };
  
  // Handle PDF download
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generatePDF(formData, currentTemplateId);
      toast({
        title: 'Success!',
        description: 'Your CV has been downloaded successfully.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Download failed',
        description: 'There was an error downloading your CV. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Handle print
  const handlePrint = () => {
    // This will open the print dialog
    window.print();
  };
  
  // Handle email
  const handleEmail = () => {
    toast({
      title: 'Coming Soon',
      description: 'Email functionality will be available soon!',
      variant: 'default',
    });
  };
  
  // Handle color change - shows toast for now
  const handleColorChange = (color: string) => {
    toast({
      title: 'Color Selected',
      description: `Theme color ${color} will be applied in the next update.`,
      variant: 'default',
    });
  };
  
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
            
            {/* Color Selection */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-2 justify-center">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className="w-6 h-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    style={{ backgroundColor: color }}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
            </div>
            
            {/* All Templates */}
            <div className="p-4 overflow-y-auto" style={isMobile ? {maxHeight: 'calc(100vh - 130px)'} : {}}>
              <h4 className="text-sm font-medium text-gray-500 mb-3">All templates</h4>
              <div className="space-y-4">
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
        <div className={`flex-grow overflow-auto flex justify-center items-start ${isMobile ? 'p-2' : 'p-4'} bg-gray-100`}>
          <div className="bg-white shadow-md overflow-hidden max-w-screen-md w-full aspect-[210/297] print:shadow-none">
            <ClientSideTemplateRenderer
              templateId={currentTemplateId}
              cvData={formData}
              className="w-full h-full"
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
            {isDownloading ? 'Downloading...' : 'Get My Resume'}
          </Button>
          
          <Button 
            onClick={handleUpdateContent}
            variant="outline" 
            className="w-full py-6 border-2 border-blue-900 text-blue-900 text-lg rounded-md"
          >
            Update Content
          </Button>
        </div>
      )}
    </div>
  );
};

export default FinalPreview;
