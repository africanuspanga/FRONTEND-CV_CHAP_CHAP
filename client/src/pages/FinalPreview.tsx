import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCVForm } from '@/contexts/cv-form-context';
import DirectTemplateRenderer from '@/components/DirectTemplateRenderer';
import { getAllTemplates, getTemplateById } from '@/lib/templates-registry';
import { sortTemplatesByPriority } from '@/lib/template-priority';
import { X, Download, Printer, Mail, CheckCircle, Edit } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDynamicScale, A4_WIDTH_PX, A4_HEIGHT_PX } from '@/hooks/use-dynamic-scale';

// Add CSS styles for improved mobile experience
import '../styles/cvPreview.css';

// CV Preview Area Component with dynamic scaling
interface CVPreviewAreaProps {
  templateId: string;
  formData: any;
  isMobile: boolean;
}

const CVPreviewArea: React.FC<CVPreviewAreaProps> = ({ templateId, formData, isMobile }) => {
  // Create ref for the container to measure
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use dynamic scaling hook to calculate the optimal scale factor
  const { scale } = useDynamicScale(containerRef, [templateId, isMobile]);
  
  console.log("Dynamic scale factor calculated:", scale);
  
  // Set a fixed scale factor for desktop
  const displayScale = isMobile ? 0.5 : 0.55;
  
  if (isMobile) {
    const { personalInfo = {} } = formData;
    const { firstName = "", lastName = "" } = personalInfo;
    // Extract initials for avatar
    const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
    
    return (
      <div className="mobile-cv-wrapper" ref={containerRef}>
        <div className="mobile-cv-header">
          <h2>Finalize Resume</h2>
          <div className="action-buttons">
            <button onClick={() => window.location.href = '/cv/select-template'}>
              Change Template
            </button>
            <button onClick={() => window.location.href = '/cv/personal-info'}>
              <Edit size={16} /> Edit Resume
            </button>
          </div>
        </div>

        <div className="mobile-cv-card">
          <div className="scaled-preview">
            <DirectTemplateRenderer
              templateId={templateId}
              cvData={formData}
              width={A4_WIDTH_PX}
              height={A4_HEIGHT_PX}
              scaleFactor={1} // No internal scaling, we scale with CSS
            />
          </div>
          <div className="mobile-cv-watermark">
            Preview
          </div>
        </div>

        <div className="download-button">
          <button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Download Now
              </>
            )}
          </button>
        </div>
      </div>
    );
  }
  
  // For desktop, render the full CV with proper scaling
  return (
    <div 
      ref={containerRef}
      className="cv-preview-container"
    >
      <div className="cv-container-wrapper">
        <div 
          className="cv-template-container"
          style={{ 
            transform: `scale(${displayScale})`,
            width: `${A4_WIDTH_PX}px`,
            minHeight: `${A4_HEIGHT_PX}px`,
            transformOrigin: 'center center',
            margin: '0 auto',
            backgroundColor: 'white',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <DirectTemplateRenderer
            templateId={templateId}
            cvData={formData}
            height="auto"
            width="100%"
            scaleFactor={1}
          />
        </div>
      </div>
    </div>
  );
};

const FinalPreview = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { formData, updateFormField } = useCVForm();
  
  // State for template sidebar (default closed on both mobile and desktop)
  const [templateSidebarOpen, setTemplateSidebarOpen] = useState(false);
  // Get all available templates with priority ordering
  const allTemplates = sortTemplatesByPriority(getAllTemplates());
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
    <div className="w-full h-screen flex flex-col bg-[#f5f5f5]">
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
            <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-4 w-4" />
              <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Mobile Header & Actions */}
      {isMobile && (
        <>
          <div className="mobile-header fixed top-0 left-0 right-0 z-50 p-4 bg-[#1a2e5c] text-white text-center font-semibold text-xl">
            Finalize Resume
          </div>
          
          <div className="mobile-actions pt-16 pb-3 px-4">
            <div className="flex gap-4 justify-between">
              <button 
                className="mobile-action-button flex-1 py-3 px-4 bg-white text-[#1a2e5c] rounded-full border border-[#1a2e5c] font-medium flex items-center justify-center"
                onClick={() => setTemplateSidebarOpen(true)}
              >
                Change Template
              </button>
              
              <button 
                className="mobile-action-button flex-1 py-3 px-4 bg-white text-[#1a2e5c] rounded-full border border-[#1a2e5c] font-medium flex items-center justify-center"
                onClick={handleUpdateContent}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Resume
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Main Content Area */}
      <div className="flex-grow flex overflow-hidden bg-[#f5f5f5]">
        {/* Template Sidebar */}
        {templateSidebarOpen && (
          <div className={isMobile ? 'fixed inset-0 z-50 bg-[#f0f2f8]' : 'templates-sidebar'}>
            <div className="p-4 bg-[#1a2e5c] text-white flex justify-between items-center">
              <h3 className="font-semibold text-lg">Change Template</h3>
              <button 
                onClick={() => setTemplateSidebarOpen(false)}
                className="bg-white/20 rounded-full p-1"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            
            <div className="templates-list p-4">
              <div className={isMobile ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-1 gap-4'}>
                {allTemplates.map((template) => (
                  <div 
                    key={template.id}
                    onClick={() => {
                      handleSelectTemplate(template.id);
                      if (isMobile) setTemplateSidebarOpen(false);
                    }}
                    className={`cursor-pointer overflow-hidden relative bg-white rounded-lg shadow-sm transition-all ${
                      currentTemplateId === template.id 
                        ? 'ring-2 ring-[#3850a2] scale-[1.02]' 
                        : 'hover:scale-[1.01]'
                    }`}
                  >
                    <div className="aspect-[210/297] bg-white">
                      <img 
                        src={template.previewImage} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm font-medium text-center py-2 px-2 truncate border-t">
                      {template.name}
                    </div>
                    {currentTemplateId === template.id && (
                      <div className="absolute top-2 right-2 bg-[#3850a2] text-white rounded-full p-1">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* CV Preview Area */}
        <CVPreviewArea
          templateId={currentTemplateId}
          formData={formData}
          isMobile={isMobile}
        />
      </div>
      
      {/* Mobile Action Button */}
      {isMobile && (
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="mobile-download-button fixed bottom-6 left-6 right-6 z-50 py-4 bg-[#3850a2] text-white font-semibold flex items-center justify-center gap-2 rounded-full shadow-lg text-lg"
        >
          <Download className="h-5 w-5" />
          {isDownloading ? 'Processing...' : 'Download Now'}
        </button>
      )}
    </div>
  );
};

export default FinalPreview;
