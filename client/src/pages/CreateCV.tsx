import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Eye, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formSteps, useCVForm, CVFormProvider } from '@/contexts/cv-form-context';
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
      const defaultTemplate = 'moonlightSonata';
      updateFormField('templateId', defaultTemplate);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-7">
          <Card className="p-6 mb-6">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-darkText mb-2">Create Your CV</h1>
              <p className="text-lightText mb-6">Complete each section to create your professional CV</p>
              
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Step {currentStep} of {formSteps.length - 1}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2 bg-gray-100" />
              </div>
              
              {/* Step Navigation (Desktop) */}
              <div className="hidden md:block mb-8">
                <CVFormStepper
                  steps={formSteps}
                  currentStep={currentStep}
                  onStepClick={(idx) => {
                    // Only allow clicking on completed steps or current step
                    if (idx <= currentStep) {
                      setCurrentStep(idx);
                      window.scrollTo(0, 0);
                    }
                  }}
                />
              </div>

              {/* Current Form Step Title */}
              <h2 className="text-xl font-medium text-darkText mb-6">
                {formSteps[currentStep].title}
              </h2>
            </div>
            
            {/* Current Form Step Content */}
            {renderCurrentStep()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
              <NavigationButton 
                onClick={handlePrevStep} 
                variant="outline" 
                direction="prev"
              >
                Back
              </NavigationButton>
              
              {currentStep < formSteps.length - 1 ? (
                <NavigationButton 
                  onClick={handleNextStep}
                  direction="next"
                >
                  Continue
                </NavigationButton>
              ) : (
                <Button 
                  onClick={handleComplete}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Complete & Download
                </Button>
              )}
            </div>
          </Card>
          
          {/* Mobile Preview Toggle */}
          {isMobile && (
            <Button
              variant="outline"
              className="w-full mb-6 flex items-center justify-center gap-2"
              onClick={togglePreview}
            >
              <Eye className="h-4 w-4" />
              {previewVisible ? 'Hide Preview' : 'Show Preview'}
            </Button>
          )}
          
          {/* Mobile Preview (conditionally rendered) */}
          {isMobile && previewVisible && formData.templateId && (
            <Card className="p-4 mb-6 overflow-hidden">
              <h3 className="font-medium mb-2">Live Preview</h3>
              <div className="border rounded overflow-hidden">
                <ClientSideTemplateRenderer
                  templateId={formData.templateId}
                  cvData={formData}
                  height={400}
                />
              </div>
            </Card>
          )}
        </div>
        
        {/* Preview Section (Desktop only) */}
        {!isMobile && formData.templateId && (
          <div className="hidden lg:block lg:col-span-5 sticky top-4 self-start">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Live Preview</h3>
              <div className="border rounded-md overflow-hidden">
                <ClientSideTemplateRenderer
                  templateId={formData.templateId}
                  cvData={formData}
                  height={700}
                />
              </div>
            </Card>
            
            {/* Tips Card */}
            <Card className="p-4 mt-6">
              <h3 className="text-lg font-medium mb-4">CV Writing Tips</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Keep your CV concise and tailored to the job</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Use action verbs to describe achievements</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Quantify results with numbers when possible</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Ensure consistent formatting throughout</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Proofread carefully for errors</span>
                </li>
              </ul>
            </Card>
          </div>
        )}
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
