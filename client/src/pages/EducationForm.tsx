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
import { ChevronLeft, PlusCircle, Info, Lightbulb, LightbulbIcon } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import LiveCVPreview from '@/components/LiveCVPreview';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EducationSummary from '@/components/EducationSummary';
import { Education } from '@shared/schema';

const EducationForm = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData, updateFormField, addItemToArray, removeItemFromArray } = useCVForm();

  // Generate degree options
  const degreeOptions = [
    'No Degree',
    'High School Diploma',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'MBA',
    'Ph.D.',
    'Other'
  ];
  
  // State for education entry
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState(degreeOptions[0]);
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [schoolLocation, setSchoolLocation] = useState('');
  const [gradMonth, setGradMonth] = useState('');
  const [gradYear, setGradYear] = useState('');
  
  // UI states
  const [showEducationForm, setShowEducationForm] = useState(true);
  const [showEducationSummary, setShowEducationSummary] = useState(false);
  
  // Editing state
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);
  
  // Get the template ID from the URL
  const templateId = params.templateId;
  
  // Reset form fields
  const resetFormFields = () => {
    setInstitution('');
    setDegree(degreeOptions[0]);
    setFieldOfStudy('');
    setSchoolLocation('');
    setGradMonth('');
    setGradYear('');
    setEditingEducationIndex(null);
  };
  
  // Effect to update the live preview as user types
  useEffect(() => {
    // Check if the preview already exists
    const hasPreview = formData.education?.some(edu => edu.id === 'preview-education');
    // Check if we should display a preview
    const shouldShowPreview = institution && degree && editingEducationIndex === null && showEducationForm;
    
    // To prevent infinite loops, only update when the preview status changes
    if (shouldShowPreview !== hasPreview) {
      if (shouldShowPreview) {
        // Create preview entry
        const graduationDate = gradMonth && gradYear ? `${gradMonth} ${gradYear}` : '';
        
        // Filter out any existing preview
        const filteredEducations = (formData.education || []).filter(edu => edu.id !== 'preview-education');
        
        // Add the new preview
        updateFormField('education', [
          {
            id: 'preview-education' as string,
            institution,
            degree,
            fieldOfStudy,
            location: schoolLocation,
            startDate: '',
            endDate: graduationDate,
          },
          ...filteredEducations
        ]);
      } else {
        // Remove any preview items
        const filteredEducations = (formData.education || []).filter(edu => edu.id !== 'preview-education');
        updateFormField('education', filteredEducations);
      }
    }
  }, [institution, degree, fieldOfStudy, schoolLocation, gradMonth, gradYear, showEducationForm, editingEducationIndex, formData.education, updateFormField]);

  // Add a new education to the form data
  const addEducation = () => {
    // Only add if we have at least institution and degree
    if (institution && degree) {
      const graduationDate = gradMonth && gradYear ? `${gradMonth} ${gradYear}` : '';
      
      // Create a new education entry
      const newEducation = {
        id: Date.now().toString() as string,
        institution,
        degree,
        fieldOfStudy,
        location: schoolLocation,
        startDate: '',
        endDate: graduationDate,
      };
      
      // Update education array without the preview
      const filteredEducations = (formData.education || []).filter(edu => edu.id !== 'preview-education');
      updateFormField('education', [...filteredEducations, newEducation]);
      
      // Reset form for adding another education
      resetFormFields();
      
      // Show education summary after adding
      setShowEducationSummary(true);
      setShowEducationForm(false);
    }
  };
  
  // Update an existing education
  const updateExistingEducation = () => {
    if (editingEducationIndex !== null && formData.education && formData.education[editingEducationIndex]) {
      const graduationDate = gradMonth && gradYear ? `${gradMonth} ${gradYear}` : '';
      
      // Get current educations
      const currentEducations = [...(formData.education || [])];
      
      // Update the specific education
      currentEducations[editingEducationIndex] = {
        ...currentEducations[editingEducationIndex],
        institution,
        degree,
        fieldOfStudy,
        location: schoolLocation,
        endDate: graduationDate,
      };
      
      // Update in form context
      updateFormField('education', currentEducations);
      
      // Reset form and editing state
      resetFormFields();
      setShowEducationSummary(true);
      setShowEducationForm(false);
    }
  };
  
  const handleEditEducation = (index: number) => {
    if (formData.education && formData.education[index]) {
      const edu = formData.education[index];
      
      // Fill the form with the education data
      setInstitution(edu.institution || '');
      setDegree(edu.degree || degreeOptions[0]);
      setFieldOfStudy(edu.fieldOfStudy || '');
      setSchoolLocation(edu.location || '');
      
      // Handle date fields
      if (edu.endDate) {
        const [month, year] = edu.endDate.split(' ');
        setGradMonth(month);
        setGradYear(year);
      }
      
      // Set editing state
      setEditingEducationIndex(index);
      
      // Show the education form
      setShowEducationForm(true);
      setShowEducationSummary(false);
    }
  };
  
  const handleDeleteEducation = (index: number) => {
    // Remove the education at the specified index
    removeItemFromArray('education', index);
  };
  
  const handleAddAnotherEducation = () => {
    // Reset form for adding a new education
    resetFormFields();
    setShowEducationForm(true);
    setShowEducationSummary(false);
  };
  
  const handleContinueToSkills = () => {
    // Navigate to the skills form
    navigate(`/cv/${templateId}/skills`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEducationIndex !== null) {
      updateExistingEducation();
    } else {
      addEducation();
    }
  };

  // Generate month and year options for date select
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" style={{ width: '33%' }}></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">33%</div>
      </div>

      <div className="bg-white rounded-lg border p-8">
        {/* Back button */}
        <button
          onClick={() => navigate(`/cv/${templateId}/work`)}
          className="text-blue-600 flex items-center mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        {showEducationForm && (
          <>
            <h1 className="text-2xl font-bold mb-2 text-center">Tell us about your education</h1>
            <p className="text-gray-600 mb-6 text-center">
              Enter your education experience so far, even if you are a current student or did not graduate.
            </p>
            
            <div className="text-sm text-gray-500 mb-4">* indicates a required field</div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <Label htmlFor="institution" className="font-semibold">
                  INSTITUTION <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="institution"
                  placeholder="e.g. University of Dar es Salaam"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="degree" className="font-semibold">DEGREE</Label>
                  <Select
                    value={degree}
                    onValueChange={setDegree}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No Degree" />
                    </SelectTrigger>
                    <SelectContent>
                      {degreeOptions.map(degreeOption => (
                        <SelectItem key={degreeOption} value={degreeOption}>{degreeOption}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="fieldOfStudy" className="font-semibold">FIELD OF STUDY</Label>
                  <Input
                    id="fieldOfStudy"
                    placeholder="e.g. Business"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-6">
                <Label htmlFor="schoolLocation" className="font-semibold">SCHOOL LOCATION</Label>
                <Input
                  id="schoolLocation"
                  placeholder="e.g. Mwanza, Tanzania"
                  value={schoolLocation}
                  onChange={(e) => setSchoolLocation(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <Label htmlFor="graduationDate" className="font-semibold">
                  GRADUATION DATE (OR EXPECTED GRADUATION DATE) <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={gradMonth}
                    onValueChange={setGradMonth}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(month => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={gradYear}
                    onValueChange={setGradYear}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

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
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Educational Achievements</h3>
                    <p className="text-gray-600 mb-4">Would you like to include any honors or achievements?</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center justify-center py-6 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                        onClick={() => {}}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        GPA
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center justify-center py-6 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                        onClick={() => {}}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Honors
                      </Button>
                    </div>
                    
                    <div className="mb-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center justify-center py-6 w-full bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
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
                        className="flex items-center justify-center py-6 w-full bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
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
                        className="flex items-center justify-center py-6 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                        onClick={() => {}}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Min Average
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center justify-center py-6 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                        onClick={() => {}}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Dean's List
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">EDUCATION DESCRIPTION</h3>
                    <div className="bg-blue-100 p-6 rounded-md min-h-[200px]">
                      <ul className="text-blue-900 space-y-4">
                        <li className="flex">
                          <span className="mr-2">•</span>
                          <span>Completed University-level Coursework: [Area of Study], [School Name]</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button 
                  type="submit" 
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2"
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
                onClick={() => navigate(`/cv/${templateId}/work`)}
                className="flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <Button 
                onClick={handleContinueToSkills}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Next
              </Button>
            </div>
          </>
        )}
        
        {/* Live CV Preview */}
        <LiveCVPreview cvData={formData} templateId={templateId} />
      </div>
    </div>
  );
};

export default EducationForm;