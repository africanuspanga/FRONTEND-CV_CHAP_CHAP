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

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEducation: Education = {
      id: currentEducationId || Date.now().toString(),
      institution,
      degree,
      field,
      location: schoolLocation,
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
    // Navigate to skills form using utility for smooth scroll reset
    navigateWithScrollReset(navigate, `/cv/${templateId}/skills`);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="flex-1 px-4 py-8 lg:px-8 xl:px-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Education Details</h1>
          
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
                    placeholder="Start typing university name..."
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
                    placeholder="Start typing location name..."
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
                    <Input
                      id="field"
                      value={field}
                      onChange={(e) => setField(e.target.value)}
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
                    <Input
                      id="gradMonth"
                      value={gradMonth}
                      onChange={(e) => setGradMonth(e.target.value)}
                      placeholder="e.g. May"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gradYear" className="block mb-2 font-medium">
                      Graduation Year
                    </Label>
                    <Input
                      id="gradYear"
                      value={gradYear}
                      onChange={(e) => setGradYear(e.target.value)}
                      placeholder="e.g. 2020"
                      className="w-full"
                    />
                  </div>
                </div>

                {!isMobile && (
                  <div className="mb-6">
                    <div className="flex justify-between">
                      <Label htmlFor="additionalCourses" className="font-semibold text-indigo-900">
                        ADD ANY ADDITIONAL COURSEWORK YOU'RE PROUD TO SHOWCASE
                      </Label>
                      <div className="text-sm text-blue-600 mb-2 cursor-pointer">
                        Look here for sample CV references
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-md border border-amber-100 mb-6 mt-2">
                      <div className="flex gap-2">
                        <LightbulbIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-amber-800 text-sm">
                          Not enough work experience? This section can help you stand out. If your bachelor's degree is in-progress,
                          you may include international schooling, educational achievements or any other certification that corresponds
                          to the job you want.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {!isMobile && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Educational Achievements</h3>
                      <p className="text-gray-600 mb-4">Would you like to include any honors or achievements?</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {!showGpaInput ? (
                          <Button
                            type="button"
                            variant="outline"
                            className="flex items-center justify-center py-6 bg-white text-blue-700 border-gray-200 hover:bg-gray-50"
                            onClick={() => setShowGpaInput(true)}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            GPA
                          </Button>
                        ) : (
                          <div className="border border-gray-200 rounded-md p-4 bg-white">
                            <Label htmlFor="gpa" className="block mb-2 text-sm font-medium">GPA Value</Label>
                            <div className="flex gap-2">
                              <Input
                                id="gpa"
                                value={gpaValue}
                                onChange={(e) => setGpaValue(e.target.value)}
                                placeholder="e.g. 3.8"
                                className="flex-grow"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setShowGpaInput(false);
                                  setGpaValue('');
                                }}
                                className="h-9 w-9"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {!showHonorsInput ? (
                          <Button
                            type="button"
                            variant="outline"
                            className="flex items-center justify-center py-6 bg-white text-blue-700 border-gray-200 hover:bg-gray-50"
                            onClick={() => setShowHonorsInput(true)}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Honors
                          </Button>
                        ) : (
                          <div className="border border-gray-200 rounded-md p-4 bg-white">
                            <Label htmlFor="honors" className="block mb-2 text-sm font-medium">Honors</Label>
                            <div className="flex gap-2">
                              <Input
                                id="honors"
                                value={honorsValue}
                                onChange={(e) => setHonorsValue(e.target.value)}
                                placeholder="e.g. Cum Laude"
                                className="flex-grow"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setShowHonorsInput(false);
                                  setHonorsValue('');
                                }}
                                className="h-9 w-9"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex items-center justify-center py-6 w-full bg-white text-blue-700 border-gray-200 hover:bg-gray-50"
                          onClick={() => {}}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          International Grade to GPA Equivalent
                        </Button>
                      </div>
                      
                      <div className="mb-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex items-center justify-center py-6 w-full bg-white text-blue-700 border-gray-200 hover:bg-gray-50"
                          onClick={() => {}}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Achievement Tests
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex items-center justify-center py-6 bg-white text-blue-700 border-gray-200 hover:bg-gray-50"
                          onClick={() => {}}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Min Average
                        </Button>
                        
                        <Button
                          type="button"
                          variant="outline"
                          className="flex items-center justify-center py-6 bg-white text-blue-700 border-gray-200 hover:bg-gray-50"
                          onClick={() => {}}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Dean's List
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-3">EDUCATION DESCRIPTION</h3>
                      <div className="bg-white p-6 rounded-md min-h-[200px] border border-gray-200">
                        {/* Empty education description field */}
                      </div>
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