import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LiveCVPreview from '@/components/LiveCVPreview';
import WorkExperienceAIRecommendations from '@/components/WorkExperienceAIRecommendations';
import WorkExperienceEditor from '@/components/WorkExperienceEditor';

const WorkExperienceForm = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData, updateFormField, addItemToArray } = useCVForm();
  const [currentJob, setCurrentJob] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [employer, setEmployer] = useState('');
  const [location, setLocation] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [startMonth, setStartMonth] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endYear, setEndYear] = useState('');
  
  // AI recommendation flow states
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [aiRecommendations, setAIRecommendations] = useState<string[]>([]);
  
  // Get the template ID from the URL
  const templateId = params.templateId;
  
  // Effect to update the live preview as user types
  useEffect(() => {
    // Only create a preview entry if we have enough data
    if (jobTitle && employer) {
      const startDate = startMonth && startYear ? `${startMonth} ${startYear}` : '';
      const endDate = currentJob ? 'Present' : (endMonth && endYear ? `${endMonth} ${endYear}` : '');
      
      // Update the form data with the current work experience
      updateFormField('workExperience', [
        {
          id: 'preview-job',
          jobTitle,
          company: employer,
          location: isRemote ? 'Remote' : location,
          startDate,
          endDate,
          current: currentJob,
          description: '',
          achievements: aiRecommendations
        },
        ...(formData.workExperience || []).filter(job => job.id !== 'preview-job')
      ]);
    }
  }, [jobTitle, employer, location, isRemote, startMonth, startYear, endMonth, endYear, currentJob, aiRecommendations]);
  
  // Update work experience data in context when form fields change
  const updateWorkExperience = (achievements: string[] = []) => {
    // Only add if we have at least job title and employer
    if (jobTitle && employer) {
      const startDate = startMonth && startYear ? `${startMonth} ${startYear}` : '';
      const endDate = currentJob ? 'Present' : (endMonth && endYear ? `${endMonth} ${endYear}` : '');
      
      // Create a new work experience entry
      const newWorkExperience = {
        id: Date.now().toString(),
        jobTitle,
        company: employer,
        location: isRemote ? 'Remote' : location,
        startDate,
        endDate,
        current: currentJob,
        description: '',
        achievements: achievements.length > 0 ? achievements : aiRecommendations
      };
      
      // Add to work experience array
      addItemToArray('workExperience', newWorkExperience);
    }
  };

  const handleAddRecommendations = (recommendations: string[]) => {
    setAIRecommendations(recommendations);
    setShowAIRecommendations(false);
    setShowEditor(true);
  };

  const handleSkipRecommendations = () => {
    setShowAIRecommendations(false);
    navigate(`/cv/${templateId}/education`);
  };

  const handleSaveAchievements = (achievements: string[]) => {
    setAIRecommendations(achievements);
    updateWorkExperience(achievements);
    setShowEditor(false);
    navigate(`/cv/${templateId}/education`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show AI recommendations instead of directly navigating
    setShowAIRecommendations(true);
  };

  // Generate month options
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  // Determine what to render based on the current state
  if (showEditor) {
    return (
      <WorkExperienceEditor
        jobTitle={jobTitle}
        company={employer}
        location={isRemote ? 'Remote' : location}
        startDate={startMonth && startYear ? `${startMonth} ${startYear}` : ''}
        endDate={currentJob ? 'Present' : (endMonth && endYear ? `${endMonth} ${endYear}` : '')}
        initialAchievements={aiRecommendations}
        onSave={handleSaveAchievements}
        onBack={() => setShowEditor(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" style={{ width: '22%' }}></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">22%</div>
      </div>

      <div className="bg-white rounded-lg border p-8">
        {/* Back button */}
        <button
          onClick={() => navigate(`/cv/${templateId}/personal`)}
          className="text-blue-600 flex items-center mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        <h1 className="text-2xl font-bold mb-2 text-center">Tell us about your job</h1>
        <p className="text-gray-600 mb-8 text-center">Add your work experience details below.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Label htmlFor="title">TITLE <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              placeholder="e.g. Chief Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="employer">EMPLOYER <span className="text-red-500">*</span></Label>
            <Input
              id="employer"
              placeholder="e.g. Driftmark Technologies"
              value={employer}
              onChange={(e) => setEmployer(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="location">LOCATION</Label>
            <Input
              id="location"
              placeholder="e.g. Dar es Salaam, Tanzania"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isRemote}
            />
          </div>

          <div className="flex items-center mb-6">
            <Checkbox 
              id="remote" 
              checked={isRemote}
              onCheckedChange={(checked) => setIsRemote(checked as boolean)}
            />
            <Label htmlFor="remote" className="ml-2 text-gray-700">Remote</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="startMonth">START DATE <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={startMonth}
                  onValueChange={setStartMonth}
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
                  value={startYear}
                  onValueChange={setStartYear}
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
            
            <div>
              <Label htmlFor="endDate">END DATE <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  disabled={currentJob}
                  value={endMonth}
                  onValueChange={setEndMonth}
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
                  disabled={currentJob}
                  value={endYear}
                  onValueChange={setEndYear}
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
          </div>

          <div className="flex items-center mb-8">
            <Checkbox 
              id="currentlyWork" 
              checked={currentJob}
              onCheckedChange={(checked) => setCurrentJob(checked as boolean)}
            />
            <Label htmlFor="currentlyWork" className="ml-2 text-gray-700">I currently work here</Label>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">
              Next
            </Button>
          </div>
        </form>
        
        {/* Live CV Preview */}
        <LiveCVPreview cvData={formData} templateId={templateId} />
      </div>
      
      {/* AI Recommendation Modal */}
      {showAIRecommendations && (
        <WorkExperienceAIRecommendations
          jobTitle={jobTitle}
          company={employer}
          onAddRecommendations={handleAddRecommendations}
          onSkip={handleSkipRecommendations}
        />
      )}
    </div>
  );
};

export default WorkExperienceForm;