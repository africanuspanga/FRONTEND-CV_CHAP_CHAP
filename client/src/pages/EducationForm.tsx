import React, { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ChevronLeft, PlusCircle, Info } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const EducationForm = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData, updateFormField, addItemToArray } = useCVForm();
  
  // Get the template ID from the URL
  const templateId = params.templateId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/cv/${templateId}/skills`); // Navigate to next step (skills)
  };

  // Generate month and year options for date select
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

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
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="degree" className="font-semibold">DEGREE</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="No Degree" />
                </SelectTrigger>
                <SelectContent>
                  {degreeOptions.map(degree => (
                    <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="fieldOfStudy" className="font-semibold">FIELD OF STUDY</Label>
              <Input
                id="fieldOfStudy"
                placeholder="e.g. Business"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="schoolLocation" className="font-semibold">SCHOOL LOCATION</Label>
            <Input
              id="schoolLocation"
              placeholder="e.g. Mwanza, Tanzania"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="graduationDate" className="font-semibold">
              GRADUATION DATE (OR EXPECTED GRADUATION DATE) <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select>
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
            <Label htmlFor="additionalCourses" className="font-semibold">
              ADD ANY ADDITIONAL COURSEWORK YOU'RE PROUD TO SHOWCASE
            </Label>
            <div className="flex justify-end text-sm text-blue-600 mb-2 cursor-pointer">
              Look here for sample CV references
            </div>
          </div>

          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <Info className="h-4 w-4 text-yellow-700" />
            <AlertDescription className="text-yellow-800">
              Not enough work experience? This section can help you stand out. If your bachelor's degree is in-progress,
              you may include international schooling, educational achievements or any other certification that corresponds
              to the job you want.
            </AlertDescription>
          </Alert>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Educational Achievements</h3>
            <p className="text-gray-600 mb-4">Would you like to include any honors or achievements?</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center py-6 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                onClick={() => {}}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                GPA
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center py-6 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                onClick={() => {}}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Honors
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center py-6 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                onClick={() => {}}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                International Grade to GPA Equivalent
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center py-6 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
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
                className="flex items-center justify-center py-6 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                onClick={() => {}}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Min Average
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center py-6 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                onClick={() => {}}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Dean's List
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationForm;