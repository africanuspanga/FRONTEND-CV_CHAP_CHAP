import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCVForm } from '@/contexts/cv-form-context';
import { ClientSideTemplateRenderer } from '@/components/ClientSideTemplateRenderer';
import { getAllTemplates, getTemplateById } from '@/lib/templates-registry';
import { X, Download, Printer, Mail, CheckCircle } from 'lucide-react';
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

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Top Nav Bar with actions */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <span className="hidden md:inline">Your CV Preview</span>
            <span className="md:hidden">Preview</span>
          </h2>
          <div className="text-sm text-gray-500 hidden md:block">
            {currentTemplateName}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="hidden md:flex items-center gap-2"
            onClick={() => setTemplateSidebarOpen(!templateSidebarOpen)}
          >
            Templates
          </Button>
          
          <Button 
            onClick={handleEmail}
            variant="outline" 
            className="hidden md:flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </Button>
          
          <Button 
            onClick={handlePrint}
            variant="outline" 
            className="hidden md:flex items-center gap-2"
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
            <span className="hidden md:inline">{isDownloading ? 'Downloading...' : 'Download'}</span>
            <span className="md:hidden">PDF</span>
          </Button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-grow flex overflow-hidden">
        {/* Template Sidebar */}
        {templateSidebarOpen && (
          <div className="w-64 border-r border-gray-200 bg-white flex-shrink-0 overflow-y-auto">
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
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-3">All templates</h4>
              <div className="space-y-4">
                {allTemplates.map((template) => (
                  <div 
                    key={template.id}
                    onClick={() => handleSelectTemplate(template.id)}
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
        <div className="flex-grow overflow-auto flex justify-center items-start p-4 bg-gray-100">
          <div className="bg-white shadow-md rounded-md overflow-hidden max-w-screen-md w-full aspect-[210/297] print:shadow-none">
            <ClientSideTemplateRenderer
              templateId={currentTemplateId}
              cvData={formData}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Actions */}
      {isMobile && (
        <div className="md:hidden bg-white border-t border-gray-200 p-3 flex justify-around items-center">
          <Button 
            onClick={() => setTemplateSidebarOpen(true)} 
            variant="outline" 
            size="sm"
          >
            Templates
          </Button>
          <Button 
            onClick={handlePrint} 
            variant="outline" 
            size="sm"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleEmail} 
            variant="outline" 
            size="sm"
          >
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FinalPreview;
