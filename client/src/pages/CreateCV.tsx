import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Eye, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCVForm, CVFormProvider } from '@/contexts/cv-form-context';
import CVFormStepper from '@/components/CVFormStepper';
import ClientSideTemplateRenderer from '@/components/ClientSideTemplateRenderer';
import { useIsMobile } from '@/hooks/use-mobile';

// Create placeholder components for now
// We'll implement the actual functionality step by step
const PersonalInfoStep = () => <div>Personal Info Step (Coming Soon)</div>;
const WorkExperienceStep = () => <div>Work Experience Step (Coming Soon)</div>;
const EducationStep = () => <div>Education Step (Coming Soon)</div>;
const SkillsStep = () => <div>Skills Step (Coming Soon)</div>;
const SummaryStep = () => <div>Summary Step (Coming Soon)</div>;
const LanguagesStep = () => <div>Languages Step (Coming Soon)</div>;
const ReferencesStep = () => <div>References Step (Coming Soon)</div>;
const PreviewStep = () => <div>Preview Step (Coming Soon)</div>;

// Form Steps Mapping
const stepComponents = [
  { id: 'template', component: null }, // Handled by TemplateSelection page
  { id: 'personal', component: PersonalInfoStep },
  { id: 'experience', component: WorkExperienceStep },
  { id: 'education', component: EducationStep },
  { id: 'skills', component: SkillsStep },
  { id: 'summary', component: SummaryStep },
  { id: 'languages', component: LanguagesStep },
  { id: 'references', component: ReferencesStep },
  { id: 'preview', component: PreviewStep },
];

// Navigation button component for consistency
const NavigationButton = ({ 
  onClick, 
  disabled = false, 
  variant = 'default',
  direction = 'next',
  children 
}: { 
  onClick: () => void; 
  disabled?: boolean; 
  variant?: 'default' | 'outline' | 'secondary'; 
  direction?: 'next' | 'prev';
  children: React.ReactNode;
}) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    variant={variant}
    className="px-6 py-2 flex items-center gap-2"
  >
    {direction === 'prev' && <ChevronLeft className="h-4 w-4" />}
    {children}
    {direction === 'next' && <ChevronRight className="h-4 w-4" />}
  </Button>
);

// CreateCV component with form steps
const CreateCVContent = () => {
  const { step } = useParams<{ step?: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [previewVisible, setPreviewVisible] = useState(false);
  
  // Get context values
  const { 
    currentStep, 
    setCurrentStep, 
    formData, 
    formSteps,
    updateFormField,
    isFormValid,
    goToNextStep,
    goToPreviousStep,
  } = useCVForm();

  // Calculate progress percentage
  const progress = ((currentStep) / (formSteps.length - 1)) * 100;

  // Set a default template if none is selected
  useEffect(() => {
    if (!formData.templateId) {
      // Use a default template (first time load)
      updateFormField('templateId', 'moonlightSonata');
    }
  }, [formData.templateId, updateFormField]);

  // Handle URL-based navigation
  useEffect(() => {
    if (step) {
      const stepIndex = parseInt(step);
      if (!isNaN(stepIndex) && stepIndex >= 0 && stepIndex < formSteps.length) {
        setCurrentStep(stepIndex);
      } else {
        navigate('/create/1', { replace: true });
      }
    }
  }, [step, navigate, setCurrentStep]);

  // Update URL when step changes
  useEffect(() => {
    navigate(`/create/${currentStep}`, { replace: true });
  }, [currentStep, navigate]);

  // Handle form submission
  const handleComplete = () => {
    toast({
      title: "CV Created Successfully!",
      description: "Your CV has been generated. You can now download it.",
    });
  };

  // Navigate to previous step
  const handlePrevStep = () => {
    if (currentStep === 1) {
      // First step - go back to template selection
      navigate('/templates');
    } else {
      goToPreviousStep();
      window.scrollTo(0, 0);
    }
  };

  // Navigate to next step
  const handleNextStep = () => {
    if (isFormValid(currentStep)) {
      goToNextStep();
      window.scrollTo(0, 0);
    } else {
      toast({
        title: "Please complete all required fields",
        variant: "destructive",
      });
    }
  };

  // Render current step component
  const renderCurrentStep = () => {
    const CurrentStepComponent = stepComponents[currentStep]?.component;

    if (!CurrentStepComponent) {
      return <div>Loading...</div>;
    }

    return (
      <CurrentStepComponent />
    );
  };

  // Toggle mobile preview visibility
  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar with Steps */}
      <div className="hidden md:block w-64 bg-[#10243e] text-white">
        <div className="p-4">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="text-[#e94f37]">my</span>perfect<span>resume</span>
          </h2>
        </div>
        
        {/* Step Navigation */}
        <div className="mb-6">
          {formSteps.slice(1).map((step, idx) => (
            <div 
              key={step.id}
              className={`flex items-center px-6 py-3 ${currentStep === idx + 1 ? 'bg-[#1a3a5f]' : ''} ${idx + 1 < currentStep ? 'text-gray-300' : 'text-white'}`}
              onClick={() => {
                if (idx + 1 <= currentStep) {
                  setCurrentStep(idx + 1);
                  window.scrollTo(0, 0);
                }
              }}
            >
              <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${currentStep === idx + 1 ? 'bg-[#e94f37]' : 'bg-gray-600'}`}>
                {idx + 1}
              </div>
              <span className="text-sm">{step.title}</span>
            </div>
          ))}
        </div>
        
        {/* Resume Completeness */}
        <div className="px-4 mt-auto">
          <div className="mb-1 text-xs uppercase">RESUME COMPLETENESS</div>
          <div className="w-full bg-gray-700 h-2 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-[#3cba92] to-[#3cba92] rounded-full" 
              style={{ width: `${Math.round(progress)}%` }}
            ></div>
          </div>
          <div className="text-right text-xs mt-1">{Math.round(progress)}%</div>
        </div>
        
        {/* Footer with links */}
        <div className="mt-8 px-4 text-xs text-gray-400">
          <div className="flex flex-col space-y-2">
            <a href="#" className="hover:text-white">Terms & Conditions</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Accessibility</a>
            <a href="#" className="hover:text-white">Contact Us</a>
          </div>
          <div className="mt-4 text-[10px]">
            © 2025, CV Chap Chap, All rights reserved.
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 bg-white">
        <div className="flex min-h-screen">
          {/* Form Section */}
          <div className="flex-1 p-10">
            {/* Back button */}
            <button 
              onClick={handlePrevStep}
              className="text-blue-600 flex items-center mb-6" 
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Go Back
            </button>
            
            {/* Form heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Great, let's work on your
              </h1>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {formSteps[currentStep].title}
              </h2>
              
              <div className="text-gray-600">
                <p className="mb-1">Here's what you need to know:</p>
                <p>Employers quickly scan the {formSteps[currentStep].title.toLowerCase()} section.</p>
                <p>We'll take care of the formatting so it's easy to find.</p>
              </div>
            </div>
            
            {/* Current Form Step Content */}
            <div className="mb-8">
              {renderCurrentStep()}
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12">
              <Button 
                variant="outline"
                className="border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50"
                onClick={() => {
                  // TODO: Preview functionality 
                  toast({
                    title: "Preview functionality",
                    description: "Preview in a new tab will be implemented soon."
                  });
                }}
              >
                Preview
              </Button>
              
              {currentStep < formSteps.length - 1 ? (
                <Button 
                  className="bg-[#37889e] hover:bg-[#2a6a7a] text-white px-10 py-2 rounded-full"
                  onClick={handleNextStep}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white px-10 py-2 rounded-full"
                  onClick={handleComplete}
                >
                  Complete
                </Button>
              )}
            </div>
          </div>
          
          {/* Preview Section (Desktop only) */}
          {!isMobile && formData.templateId && (
            <div className="w-[400px] border-l border-gray-200 p-4 flex flex-col items-center">
              <div className="border rounded-md overflow-hidden mb-2 shadow-sm w-full">
                <ClientSideTemplateRenderer
                  templateId={formData.templateId}
                  cvData={formData}
                  height={600}
                />
              </div>
              <a href="#" className="text-blue-600 text-sm mt-2" onClick={(e) => {
                e.preventDefault();
                // TODO: Template change functionality
                toast({
                  title: "Template change",
                  description: "Template switch functionality will be implemented soon."
                });
              }}>
                Change template
              </a>
            </div>
          )}
          
          {/* Mobile Preview Toggle and View */}
          {isMobile && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <Button
                variant="outline"
                className="w-full mb-2 flex items-center justify-center gap-2"
                onClick={togglePreview}
              >
                <Eye className="h-4 w-4" />
                {previewVisible ? 'Hide Preview' : 'Show Preview'}
              </Button>
              
              {previewVisible && formData.templateId && (
                <div className="border rounded overflow-hidden">
                  <ClientSideTemplateRenderer
                    templateId={formData.templateId}
                    cvData={formData}
                    height={300}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Wrap the component with the CV Form Provider
const CreateCV = () => {
  return (
    <CVFormProvider>
      <CreateCVContent />
    </CVFormProvider>
  );
};

export default CreateCV;
