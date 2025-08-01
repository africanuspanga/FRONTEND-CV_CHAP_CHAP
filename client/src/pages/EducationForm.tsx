import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ChevronLeft, PlusCircle, Info, Lightbulb, LightbulbIcon, X } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import LiveCVPreview from '@/components/LiveCVPreview';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EducationSummary from '@/components/EducationSummary';
import { Education } from '@shared/schema';
import { useMediaQuery } from '@/hooks/use-media-query';
import { navigateWithScrollReset } from '@/lib/navigation-utils';
import LocationInput from '@/components/LocationInput';
import UniversityInput from '@/components/UniversityInput';
import FieldOfStudyInput from '@/components/FieldOfStudyInput';
import ReactConfetti from 'react-confetti';

const EducationForm = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData, updateFormField, addItemToArray, removeItemFromArray } = useCVForm();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Generate degree options
  const degreeOptions = [
    'No Degree',
    'Diploma',
    'Bachelor of Arts',
    'Bachelor of Science',
    'Master of Arts',
    'Master of Science',
    'PhD'
  ];
  
  // Generate month options
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  
  // State for education entry
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState(degreeOptions[0]);
  const [field, setField] = useState('');
  const [schoolLocation, setSchoolLocation] = useState('');
  const [gradMonth, setGradMonth] = useState('');
  const [gradYear, setGradYear] = useState('');
  
  // State for educational achievements
  const [showGpaInput, setShowGpaInput] = useState(false);
  const [gpaValue, setGpaValue] = useState('');
  const [showHonorsInput, setShowHonorsInput] = useState(false);
  const [honorsValue, setHonorsValue] = useState('');

  // Show education form or summary
  const [showEducationForm, setShowEducationForm] = useState(true);
  const [showEducationSummary, setShowEducationSummary] = useState(false);
  const [currentEducationId, setCurrentEducationId] = useState<string | null>(null);
  
  // Confetti state
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const templateId = params.templateId || '';

  useEffect(() => {
    // Check if there are education entries to display the summary initially
    if ((formData.education || []).length > 0) {
      setShowEducationForm(false);
      setShowEducationSummary(true);
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [formData.education]);
  
  // Update window dimensions when resized (for confetti)
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Auto-stop confetti after a short duration to prevent performance issues
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 2000); // Stop confetti after 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEducation: Education = {
      id: currentEducationId || Date.now().toString(),
      institution,
      degree,
      field,
      location: schoolLocation,
      startDate: `${gradMonth} ${gradYear}`,  // Using graduation date as start date
      graduationMonth: gradMonth,
      graduationYear: gradYear,
      gpa: gpaValue || undefined,
      honors: honorsValue || undefined
    };

    if (currentEducationId) {
      // Update existing education
      const updatedEducation = (formData.education || []).map(edu => 
        edu.id === currentEducationId ? newEducation : edu
      );
      updateFormField('education', updatedEducation);
    } else {
      // Add new education
      addItemToArray('education', newEducation);
    }

    // Reset form 
    resetEducationForm();
    
    // Show education summary
    setShowEducationForm(false);
    setShowEducationSummary(true);
  };

  const resetEducationForm = () => {
    setInstitution('');
    setDegree(degreeOptions[0]);
    setField('');
    setSchoolLocation('');
    setGradMonth('');
    setGradYear('');
    setGpaValue('');
    setHonorsValue('');
    setShowGpaInput(false);
    setShowHonorsInput(false);
    setCurrentEducationId(null);
  };

  const handleEditEducation = (id: string) => {
    const educationToEdit = (formData.education || []).find(edu => edu.id === id);
    
    if (educationToEdit) {
      setInstitution(educationToEdit.institution || '');
      setDegree(educationToEdit.degree || degreeOptions[0]);
      setField(educationToEdit.field || '');
      setSchoolLocation(educationToEdit.location || '');
      setGradMonth(educationToEdit.graduationMonth || '');
      setGradYear(educationToEdit.graduationYear || '');
      
      if (educationToEdit.gpa) {
        setShowGpaInput(true);
        setGpaValue(educationToEdit.gpa);
      }
      
      if (educationToEdit.honors) {
        setShowHonorsInput(true);
        setHonorsValue(educationToEdit.honors);
      }
      
      setCurrentEducationId(id);
      setShowEducationForm(true);
      setShowEducationSummary(false);
    }
  };

  const handleDeleteEducation = (id: string) => {
    const updatedEducation = (formData.education || []).filter(edu => edu.id !== id);
    updateFormField('education', updatedEducation);
  };

  const handleAddAnotherEducation = () => {
    resetEducationForm();
    setShowEducationForm(true);
    setShowEducationSummary(false);
  };

  const handleContinueToSkills = () => {
    // Directly set window dimensions to ensure confetti has correct size
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    // Show confetti animation first with state update callback to ensure it runs
    setShowConfetti(true);
    console.log('Trying to show confetti');
    
    // Add a longer delay before navigation to allow confetti to display
    setTimeout(() => {
      console.log('Navigation timeout triggered, confetti should be visible');
      // Navigate to skills form using utility for smooth scroll reset
      navigateWithScrollReset(navigate, `/cv/${templateId}/skills`);
    }, 2000); // 2 second delay for confetti to be clearly visible
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Confetti effect - always rendered when triggered */}
      {showConfetti && (
        <ReactConfetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          initialVelocityY={10}
          tweenDuration={5000}
          colors={['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE', '#0D9488', '#14B8A6', '#2DD4BF']}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
            pointerEvents: 'none' // Make sure it doesn't block UI interaction
          }}
        />
      )}
      {/* Debug button to manually trigger confetti */}
      <button 
        onClick={() => {
          console.log('Debug button clicked');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          zIndex: 9999,
          background: '#ddd',
          padding: '5px',
          fontSize: '10px',
          display: 'none' // Hidden in production
        }}
      >
        Debug Confetti
      </button>
      <div className="flex-1 px-4 py-8 lg:px-8 xl:px-12">
        <div className="max-w-3xl mx-auto">
          {/* Heading removed as requested */}
          
          {showEducationForm && (
            <>
              <form onSubmit={handleAddEducation}>
                <div className="mb-6">
                  <Label htmlFor="institution" className="block mb-2 font-medium">
                    School or University*
                  </Label>
                  <UniversityInput
                    value={institution}
                    onChange={(value) => setInstitution(value)}
                    placeholder="University of Dar es Salaam"
                    className="w-full"
                  />
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="schoolLocation" className="block mb-2 font-medium">
                    School Location
                  </Label>
                  <LocationInput
                    value={schoolLocation}
                    onChange={(value) => setSchoolLocation(value)}
                    placeholder="Dar es Salaam, Tanzania"
                    className="w-full"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="degree" className="block mb-2 font-medium">
                      Degree
                    </Label>
                    <Select value={degree} onValueChange={setDegree}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a degree" />
                      </SelectTrigger>
                      <SelectContent>
                        {degreeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="field" className="block mb-2 font-medium">
                      Field of Study
                    </Label>
                    <FieldOfStudyInput
                      value={field}
                      onChange={setField}
                      placeholder="e.g. Computer Science"
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="gradMonth" className="block mb-2 font-medium">
                      Graduation Month
                    </Label>
                    <Select value={gradMonth} onValueChange={setGradMonth}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="gradYear" className="block mb-2 font-medium">
                      Graduation Year
                    </Label>
                    <Select value={gradYear} onValueChange={setGradYear}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Simplified Education Extras Section - Only show on desktop */}
                {!isMobile && (
                  <div className="mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div className="border border-gray-200 rounded-md p-4 bg-white">
                        <Label htmlFor="gpa" className="block mb-2 font-medium">
                          GPA (Optional)
                        </Label>
                        <Input
                          id="gpa"
                          value={gpaValue}
                          onChange={(e) => setGpaValue(e.target.value)}
                          placeholder="4.6"
                          className="w-full"
                        />
                      </div>
                      
                      <div className="border border-gray-200 rounded-md p-4 bg-white">
                        <Label htmlFor="honors" className="block mb-2 font-medium">
                          Honors (Optional)
                        </Label>
                        <Input
                          id="honors"
                          value={honorsValue}
                          onChange={(e) => setHonorsValue(e.target.value)}
                          placeholder="First Class Honors"
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-md p-4 bg-white">
                      <Label htmlFor="educationDescription" className="block mb-2 font-medium">
                        EDUCATION DESCRIPTION (Optional)
                      </Label>
                      <textarea
                        id="educationDescription"
                        rows={6}
                        className="w-full p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add any relevant coursework, projects, or achievements related to your education."
                      ></textarea>
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-8">
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                  >
                    Save education
                  </Button>
                </div>
              </form>
            </>
          )}
          
          {showEducationSummary && (
            <>
              <EducationSummary
                educations={(formData.education || []).map(edu => ({
                  ...edu,
                  id: edu.id || Date.now().toString() // Ensure all education entries have an ID
                }))}
                onEdit={handleEditEducation}
                onDelete={handleDeleteEducation}
                onAddAnother={handleAddAnotherEducation}
              />
              
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => navigateWithScrollReset(navigate, `/cv/${templateId}/work`)}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <Button 
                  onClick={handleContinueToSkills}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                </Button>
              </div>
            </>
          )}
          
          {/* Live CV Preview - Hidden on mobile */}
          {!isMobile && <LiveCVPreview cvData={formData} templateId={templateId} />}
        </div>
      </div>
    </div>
  );
};

export default EducationForm;