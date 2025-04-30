import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCVData } from '@/hooks/useCVData';
import { useFormSteps } from '@/hooks/use-form-steps';
import CVFormStepper from '@/components/CVFormStepper';
import CVPreview from '@/components/CVPreview';
import PersonalInfoForm from '@/components/form/PersonalInfoForm';
import WorkExperienceForm from '@/components/form/WorkExperienceForm';
import EducationForm from '@/components/form/EducationForm';
import SkillsForm from '@/components/form/SkillsForm';
import SummaryForm from '@/components/form/SummaryForm';
import LanguagesForm from '@/components/form/LanguagesForm';
import ReferencesForm from '@/components/form/ReferencesForm';
import AdditionalSectionsForm from '@/components/form/AdditionalSectionsForm';
import FinalPreviewForm from '@/components/form/FinalPreviewForm';
import { Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateCV = () => {
  const { step } = useParams<{ step?: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { cvData, updateCVData, setTemplate, isFormComplete } = useCVData();
  const { steps, currentStepIndex, goToStep, nextStep, prevStep, progress } = useFormSteps();
  const [isMobilePreviewVisible, setMobilePreviewVisible] = useState(false);

  // Ensure we have a template selected
  useEffect(() => {
    if (!cvData.templateId) {
      navigate('/templates');
    }
  }, [cvData.templateId, navigate]);

  // Handle URL-based navigation
  useEffect(() => {
    if (step) {
      const stepIndex = parseInt(step);
      if (!isNaN(stepIndex) && stepIndex >= 0 && stepIndex < steps.length) {
        goToStep(stepIndex);
      } else {
        navigate('/create', { replace: true });
      }
    }
  }, [step, navigate, goToStep, steps.length]);

  // Update URL when step changes
  useEffect(() => {
    navigate(`/create/${currentStepIndex}`, { replace: true });
  }, [currentStepIndex, navigate]);

  const handleNextStep = () => {
    nextStep();
    window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    prevStep();
    window.scrollTo(0, 0);
  };

  const handleCompleteCV = () => {
    toast({
      title: "CV Created Successfully!",
      description: "Your CV has been generated and downloaded successfully.",
    });
    
    // Navigate to home page after a slight delay
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const toggleMobilePreview = () => {
    setMobilePreviewVisible(!isMobilePreviewVisible);
  };

  const renderCurrentStep = () => {
    switch (currentStepIndex) {
      case 0:
        return (
          <PersonalInfoForm
            defaultValues={cvData.personalInfo || {
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              location: '',
              jobTitle: '',
              website: '',
              linkedin: '',
              profilePicture: ''
            }}
            onSubmit={(data) => {
              updateCVData({ personalInfo: data });
              handleNextStep();
            }}
            onBack={() => navigate('/create/method')}
          />
        );
      case 1:
        return (
          <WorkExperienceForm
            defaultValues={cvData.workExperience || []}
            onSubmit={(data) => updateCVData({ workExperience: data })}
            onBack={handlePrevStep}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <EducationForm
            defaultValues={cvData.education || []}
            onSubmit={(data) => updateCVData({ education: data })}
            onBack={handlePrevStep}
            onNext={handleNextStep}
          />
        );
      case 3:
        return (
          <SkillsForm
            defaultValues={cvData.skills || []}
            onSubmit={(data) => updateCVData({ skills: data })}
            onBack={handlePrevStep}
            onNext={handleNextStep}
          />
        );
      case 4:
        return (
          <SummaryForm
            defaultValue={cvData.summary || ''}
            onSubmit={(data) => updateCVData({ summary: data.summary })}
            onBack={handlePrevStep}
            onNext={handleNextStep}
          />
        );
      case 5:
        return (
          <LanguagesForm
            defaultValues={cvData.languages || []}
            onSubmit={(data) => updateCVData({ languages: data })}
            onBack={handlePrevStep}
            onNext={handleNextStep}
          />
        );
      case 6:
        return (
          <ReferencesForm
            defaultValues={cvData.references || []}
            onSubmit={(data) => updateCVData({ references: data })}
            onBack={handlePrevStep}
            onNext={handleNextStep}
          />
        );
      case 7:
        return (
          <AdditionalSectionsForm
            defaultValues={{
              hobbies: cvData.hobbies || '',
              projects: cvData.projects || [],
              certifications: cvData.certifications || []
            }}
            onSubmit={(data) => updateCVData(data)}
            onBack={handlePrevStep}
            onNext={handleNextStep}
          />
        );
      case 8:
        return (
          <FinalPreviewForm
            cvData={cvData}
            templateId={cvData.templateId || 'moonlightSonata'}
            onBack={handlePrevStep}
            onEdit={goToStep}
            onComplete={handleCompleteCV}
            isComplete={isFormComplete}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row">
        {/* Left side: Form */}
        <div className="w-full lg:w-1/2 lg:pr-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-semibold text-darkText mb-2">Create Your CV</h1>
            <p className="text-lightText mb-6">Fill in the form to create your professional CV</p>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-lightText mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="progress-bar-container" />
            </div>
            
            {/* Current Form Step */}
            {renderCurrentStep()}
          </div>
          
          {/* Mobile Preview Toggle (only visible on mobile) */}
          <div className="lg:hidden mb-6">
            <Button
              variant="secondary"
              className="w-full py-3 px-4 flex items-center justify-center"
              onClick={toggleMobilePreview}
            >
              <Eye className="mr-2 h-5 w-5" />
              {isMobilePreviewVisible ? 'Hide Preview' : 'Preview CV'}
            </Button>
          </div>
          
          {/* Mobile Preview (conditionally rendered) */}
          {isMobilePreviewVisible && (
            <div className="lg:hidden mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4 overflow-hidden" style={{ height: '400px' }}>
                <CVPreview
                  cvData={cvData}
                  selectedTemplate={cvData.templateId || 'moonlightSonata'}
                  onTemplateChange={(templateId) => setTemplate(templateId)}
                  isFormComplete={isFormComplete}
                />
              </div>
            </div>
          )}
          
          {/* Mobile Stepper */}
          <div className="lg:hidden">
            <CVFormStepper
              steps={steps}
              currentStep={currentStepIndex}
              onStepClick={(idx) => {
                // Only allow clicking on completed steps
                if (idx < currentStepIndex) {
                  goToStep(idx);
                  window.scrollTo(0, 0);
                }
              }}
            />
          </div>
        </div>
        
        {/* Right side: CV Preview (desktop only) */}
        <div className="hidden lg:block w-1/2 pl-8">
          <CVPreview
            cvData={cvData}
            selectedTemplate={cvData.templateId || 'moonlightSonata'}
            onTemplateChange={(templateId) => setTemplate(templateId)}
            isFormComplete={isFormComplete}
          />
          
          {/* Need Help Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-darkText mb-2">Need Help?</h3>
            <p className="text-lightText mb-4">Some tips for creating an effective CV:</p>
            <ul className="text-sm text-lightText space-y-2">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Keep your CV concise and relevant to the job you're applying for
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Use action verbs to describe your achievements
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Quantify your achievements with numbers where possible
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Tailor your CV for each job application
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Proofread carefully to catch spelling and grammatical errors
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCV;
