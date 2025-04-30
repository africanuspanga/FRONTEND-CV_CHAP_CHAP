import React from 'react';
import { Button } from '@/components/ui/button';
import { CVData } from '@shared/schema';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Download, Pencil } from 'lucide-react';
import { generatePDF } from '@/lib/pdf-generator';

interface FinalPreviewFormProps {
  cvData: CVData;
  templateId: string;
  onBack: () => void;
  onEdit: (step: number) => void;
  onComplete: () => void;
  isComplete: boolean;
}

const FinalPreviewForm: React.FC<FinalPreviewFormProps> = ({
  cvData,
  templateId,
  onBack,
  onEdit,
  onComplete,
  isComplete
}) => {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await generatePDF(cvData, templateId);
      onComplete();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  // Function to check if a section is complete
  const isSectionComplete = (section: keyof CVData): boolean => {
    const data = cvData[section];
    
    if (!data) return false;
    
    if (Array.isArray(data)) {
      return data.length > 0;
    }
    
    if (typeof data === 'object') {
      return Object.keys(data).length > 0;
    }
    
    if (typeof data === 'string') {
      return data.trim().length > 0;
    }
    
    return false;
  };

  // Check completeness of required sections
  const personalInfoComplete = cvData.personalInfo && 
    cvData.personalInfo.firstName && 
    cvData.personalInfo.lastName && 
    cvData.personalInfo.email &&
    cvData.personalInfo.phone;

  const hasWorkExperience = isSectionComplete('workExperience');
  const hasEducation = isSectionComplete('education');
  const hasSkills = isSectionComplete('skills');

  // Evaluate the overall CV completeness
  const isRecommendedComplete = personalInfoComplete && hasWorkExperience && hasEducation && hasSkills;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-darkText mb-4">Final Review</h2>
      <p className="text-lightText mb-6">Review your CV before downloading. You can go back to edit any section.</p>
      
      {!isRecommendedComplete && (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Your CV is not complete</AlertTitle>
          <AlertDescription>
            We recommend completing all essential sections (Personal Info, Work Experience, Education, and Skills) for a comprehensive CV.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h3 className="font-medium mb-4">CV Content Review</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
            <div>
              <h4 className="font-medium">Personal Information</h4>
              <p className="text-sm text-gray-500">
                {personalInfoComplete ? 'Complete' : 'Incomplete'}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(0)}
              className="text-primary"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
            <div>
              <h4 className="font-medium">Work Experience</h4>
              <p className="text-sm text-gray-500">
                {hasWorkExperience ? `${cvData.workExperience?.length} entries` : 'No entries'}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(1)}
              className="text-primary"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
            <div>
              <h4 className="font-medium">Education</h4>
              <p className="text-sm text-gray-500">
                {hasEducation ? `${cvData.education?.length} entries` : 'No entries'}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(2)}
              className="text-primary"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
            <div>
              <h4 className="font-medium">Skills</h4>
              <p className="text-sm text-gray-500">
                {hasSkills ? `${cvData.skills?.length} skills` : 'No skills'}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(3)}
              className="text-primary"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
            <div>
              <h4 className="font-medium">Professional Summary</h4>
              <p className="text-sm text-gray-500">
                {cvData.summary ? 'Complete' : 'Not added'}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(4)}
              className="text-primary"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
            <div>
              <h4 className="font-medium">Languages</h4>
              <p className="text-sm text-gray-500">
                {isSectionComplete('languages') ? `${cvData.languages?.length} languages` : 'Not added'}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(5)}
              className="text-primary"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
            <div>
              <h4 className="font-medium">References</h4>
              <p className="text-sm text-gray-500">
                {isSectionComplete('references') ? `${cvData.references?.length} references` : 'Not added'}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(6)}
              className="text-primary"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
            <div>
              <h4 className="font-medium">Additional Information</h4>
              <p className="text-sm text-gray-500">
                {cvData.hobbies ? 'Added' : 'Not added'}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(7)}
              className="text-primary"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h3 className="font-medium mb-2">Selected Template</h3>
        <p className="text-sm text-gray-500 mb-4">
          {templateId === 'moonlightSonata' ? 'Moonlight Sonata' : templateId}
          <Button 
            variant="link" 
            size="sm" 
            className="ml-2 p-0 h-auto"
            onClick={() => onEdit(-1)} // Special value to edit template
          >
            Change
          </Button>
        </p>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="gap-2"
        >
          {downloading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download CV
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FinalPreviewForm;
