import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, Briefcase, Building2, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import ReactConfetti from 'react-confetti';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LiveCVPreview from '@/components/LiveCVPreview';
import WorkExperienceBulletGenerator from '@/components/WorkExperienceBulletGenerator';
import WorkExperienceRecommendationsDialog from '@/components/WorkExperienceRecommendationsDialog';
import GeneratingRecommendations from '@/components/GeneratingRecommendations';
import WorkExperienceEditor from '@/components/WorkExperienceEditor';
import WorkHistorySummary from '@/components/WorkHistorySummary';
import { WorkExperience } from '@shared/schema';
import { getWorkExperienceRecommendations } from '@/lib/openai-service';
import MobilePreviewNote from '@/components/MobilePreviewNote';
import JobTitleInput from '@/components/JobTitleInput';
import LocationInput from '@/components/LocationInput';
import { navigateWithScrollReset } from '@/lib/navigation-utils';
import '../styles/mobile-form.css';

const WorkExperienceForm = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData, updateFormField, addItemToArray, removeItemFromArray } = useCVForm();
  const [currentJob, setCurrentJob] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [employer, setEmployer] = useState('');
  const [location, setLocation] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [startMonth, setStartMonth] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endYear, setEndYear] = useState('');
  
  // UI states
  const [showJobForm, setShowJobForm] = useState(true);
  const [showWorkHistory, setShowWorkHistory] = useState(false);
  
  // AI recommendation flow states
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const [showRecommendationsDialog, setShowRecommendationsDialog] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [aiRecommendations, setAIRecommendations] = useState<string[]>([]);
  
  // Confetti states
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  // Editing state
  const [editingJobIndex, setEditingJobIndex] = useState<number | null>(null);
  
  // Get the template ID from the URL
  const templateId = params.templateId;
  
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  const jobTitleInputRef = useRef<HTMLInputElement>(null);
  
  // Check if device is mobile and update window dimensions for confetti
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Initial check
    handleResize();
    
    // Add listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Auto-focus the first input on mobile
  useEffect(() => {
    if (isMobile && jobTitleInputRef.current && showJobForm) {
      setTimeout(() => {
        jobTitleInputRef.current?.focus();
      }, 500);
    }
  }, [isMobile, showJobForm]);
  
  // Reset form fields
  const resetFormFields = () => {
    setJobTitle('');
    setEmployer('');
    setLocation('');
    setIsRemote(false);
    setStartMonth('');
    setStartYear('');
    setEndMonth('');
    setEndYear('');
    setCurrentJob(false);
    setAIRecommendations([]);
    setEditingJobIndex(null);
  };
  
  // Effect to update the live preview as user types (only when adding a new job)
  useEffect(() => {
    // Check if the preview already exists in either workExperiences or workExp
    const hasPreview = 
      (formData.workExperiences?.some(job => job.id === 'preview-job') || 
       formData.workExp?.some(job => job.id === 'preview-job'));
    
    // Check if we should display a preview
    const shouldShowPreview = jobTitle && employer && editingJobIndex === null && showJobForm;
    
    // Create a reference to current workExperiences to avoid dependency loop
    // Prioritize workExperiences but fall back to workExp if needed
    const currentWorkExperiences = formData.workExperiences || formData.workExp || [];
    
    // To prevent infinite loops, only update when the preview status changes
    if (shouldShowPreview !== hasPreview) {
      if (shouldShowPreview) {
        // Create a preview entry
        const startDate = startMonth && startYear ? `${startMonth} ${startYear}` : '';
        const endDate = currentJob ? 'Present' : (endMonth && endYear ? `${endMonth} ${endYear}` : '');
        
        // Filter out any existing preview
        const filteredExperiences = currentWorkExperiences.filter(job => job.id !== 'preview-job');
        
        // Add the new preview
        updateFormField('workExperiences', [
          {
            id: 'preview-job' as string,
            jobTitle,
            company: employer,
            location: isRemote ? 'Remote' : location,
            startDate,
            endDate,
            current: currentJob,
            description: '',
            achievements: aiRecommendations
          },
          ...filteredExperiences
        ]);
      } else if (hasPreview) { // Only remove if a preview actually exists
        // Remove any preview items
        const filteredExperiences = currentWorkExperiences.filter(job => job.id !== 'preview-job');
        updateFormField('workExperiences', filteredExperiences);
      }
    }
  // Important: Remove formData.workExperiences from dependencies to prevent infinite loop
  }, [jobTitle, employer, location, isRemote, startMonth, startYear, endMonth, endYear, currentJob, aiRecommendations, showJobForm, editingJobIndex, updateFormField]);
  
  // Add a new work experience to the form data
  const addWorkExperience = (achievements: string[] = []) => {
    // Only add if we have at least job title and employer
    if (jobTitle && employer) {
      const startDate = startMonth && startYear ? `${startMonth} ${startYear}` : '';
      const endDate = currentJob ? 'Present' : (endMonth && endYear ? `${endMonth} ${endYear}` : '');
      
      // Create a new work experience entry
      const newWorkExperience = {
        id: Date.now().toString() as string,
        jobTitle,
        company: employer,
        location: isRemote ? 'Remote' : location,
        startDate,
        endDate,
        current: currentJob,
        description: '',
        achievements: achievements.length > 0 ? achievements : aiRecommendations
      };
      
      // Update work experience array without the preview
      const filteredExperiences = (formData.workExperiences || []).filter(job => job.id !== 'preview-job');
      updateFormField('workExperiences', [...filteredExperiences, newWorkExperience]);
      
      // Reset form for adding another job
      resetFormFields();
      
      // Show work history after adding
      setShowWorkHistory(true);
      setShowJobForm(false);
    }
  };
  
  // Update an existing work experience
  const updateExistingWorkExperience = (achievements: string[] = []) => {
    // Get the appropriate work experience array, checking both fields
    const workExpArray = formData.workExperiences || formData.workExp || [];
    
    if (editingJobIndex !== null && workExpArray[editingJobIndex]) {
      const startDate = startMonth && startYear ? `${startMonth} ${startYear}` : '';
      const endDate = currentJob ? 'Present' : (endMonth && endYear ? `${endMonth} ${endYear}` : '');
      
      // Get current work experiences
      const currentExperiences = [...workExpArray];
      
      // Update the specific job
      currentExperiences[editingJobIndex] = {
        ...currentExperiences[editingJobIndex],
        jobTitle,
        company: employer,
        location: isRemote ? 'Remote' : location,
        startDate,
        endDate,
        current: currentJob,
        achievements: achievements.length > 0 ? achievements : aiRecommendations
      };
      
      // Update in form context - this will update both workExperiences and workExp
      // thanks to our synchronized context updates
      updateFormField('workExperiences', currentExperiences);
      
      // Reset form and editing state
      resetFormFields();
      setShowWorkHistory(true);
      setShowJobForm(false);
    }
  };

  // Function to handle successful generation of recommendations
  const handleAddRecommendations = (recommendations: string[]) => {
    console.log('Received recommendations:', recommendations);
    // Ensure we have an array of strings
    const recommendationsArray = Array.isArray(recommendations) ? recommendations : [recommendations];
    
    // Only keep the top 3 recommendations for cleaner UI
    const topRecommendations = recommendationsArray.slice(0, 3);
    
    setAIRecommendations(topRecommendations);
    setIsGeneratingRecommendations(false);
    setShowRecommendationsDialog(true);
  };

  // Function to handle error or skip recommendations
  const handleSkipRecommendations = () => {
    setIsGeneratingRecommendations(false);
    setShowRecommendationsDialog(false);
    // Go directly to editor with empty achievements
    setShowEditor(true);
    console.log('Proceeding to editor after skipping recommendations');
  };
  
  // Function to handle user accepting the recommendations
  const handleAcceptRecommendations = () => {
    setShowRecommendationsDialog(false);
    setIsGeneratingRecommendations(false);
    setShowEditor(true);
    console.log('Proceeding to editor with accepted recommendations');
  };
  
  // Function to handle user declining the recommendations
  const handleRejectRecommendations = () => {
    setShowRecommendationsDialog(false);
    setIsGeneratingRecommendations(false);
    // Clear AI recommendations when user clicks "No thanks"
    setAIRecommendations([]);
    setShowEditor(true);
    console.log('Proceeding to editor after declining recommendations');
  };

  const handleSaveAchievements = (achievements: string[]) => {
    setAIRecommendations(achievements);
    
    if (editingJobIndex !== null) {
      updateExistingWorkExperience(achievements);
      setEditingJobIndex(null);
    } else {
      addWorkExperience(achievements);
    }
    
    setShowEditor(false);
    setShowWorkHistory(true);
    setShowJobForm(false);
  };
  
  const handleEditJob = (index: number) => {
    // Get the appropriate work experience array, checking both fields
    const workExpArray = formData.workExperiences || formData.workExp || [];
    
    if (workExpArray[index]) {
      const job = workExpArray[index];
      
      // Fill the form with the job data
      setJobTitle(job.jobTitle || '');
      setEmployer(job.company || '');
      setLocation(job.location || '');
      setIsRemote(job.location === 'Remote');
      
      // Handle date fields
      if (job.startDate) {
        const [month, year] = job.startDate.split(' ');
        setStartMonth(month);
        setStartYear(year);
      }
      
      if (job.endDate === 'Present') {
        setCurrentJob(true);
        setEndMonth('');
        setEndYear('');
      } else if (job.endDate) {
        setCurrentJob(false);
        const [month, year] = job.endDate.split(' ');
        setEndMonth(month);
        setEndYear(year);
      }
      
      // Set achievements
      setAIRecommendations(job.achievements || []);
      
      // Set editing state
      setEditingJobIndex(index);
      
      // Show the job form
      setShowJobForm(true);
      setShowWorkHistory(false);
    }
  };
  
  const handleDeleteJob = (index: number) => {
    // Remove the job at the specified index
    removeItemFromArray('workExperiences', index);
  };
  
  const handleAddAnotherPosition = () => {
    // Reset form for adding a new job
    resetFormFields();
    setShowJobForm(true);
    setShowWorkHistory(false);
  };
  
  const handleContinueToEducation = () => {
    // Show confetti first before navigating
    setShowConfetti(true);
    console.log('Showing confetti before navigating to education page');
    
    // Add a small delay before navigation to allow confetti to display
    // This shouldn't impact user experience noticeably since confetti is lightweight
    setTimeout(() => {
      // Navigate to education page using utility for smooth scroll reset
      navigateWithScrollReset(navigate, `/cv/${templateId}/education`);
    }, 800); // 800ms delay to show some confetti without making the app feel slow
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if we have job title and employer - use placeholders if not
    const title = jobTitle || "Job Title";
    const company = employer || "Company";
    
    // Start generating recommendations
    setIsGeneratingRecommendations(true);
    
    // Use the WorkExperienceBulletGenerator component indirectly by
    // calling the OpenAI API directly here
    getWorkExperienceRecommendations(title, company)
      .then(recommendations => {
        console.log('Received AI recommendations:', recommendations);
        setAIRecommendations(recommendations);
        setIsGeneratingRecommendations(false);
        setShowRecommendationsDialog(true);
      })
      .catch(error => {
        console.error('Error getting AI recommendations:', error);
        setIsGeneratingRecommendations(false);
        // Fallback to a minimal set of professional bullet points if AI fails
        const fallbackRecommendations = [
          `Led important initiatives as ${title} at ${company}.`,
          `Worked with teams to achieve company objectives.`,
          `Managed various projects and responsibilities.`
        ];
        setAIRecommendations(fallbackRecommendations);
        setShowRecommendationsDialog(true);
      });
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
    <div className="max-w-4xl mx-auto px-4 py-5 md:py-10">
      {/* Confetti effect - only visible when triggered */}
      {showConfetti && (
        <ReactConfetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.2}
          initialVelocityY={10}
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
      
      {/* Progress Bar */}
      <div className="mb-4 md:mb-8">
        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-primary rounded-full" style={{ width: '22%' }}></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">22%</div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile Preview Notice - only visible on mobile */}
        {isMobile && <MobilePreviewNote />}
        
        {/* Main Form Content */}
        <div className={`bg-white rounded-lg border p-4 md:p-8 w-full ${isMobile ? 'mobile-form' : ''}`}>
          {/* Back button */}
          <button
            onClick={() => {
              navigateWithScrollReset(navigate, `/cv/${templateId}/personal`);
            }}
            className="text-primary flex items-center mb-4 md:mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Go Back
          </button>

          {showJobForm && (
            <>
              <h1 className="text-2xl font-bold mb-2 text-center">Tell us about your job</h1>
              <p className="text-gray-600 mb-8 text-center">Add your work experience details below.</p>

              <form id="work-experience-form" onSubmit={handleSubmit} className={isMobile ? "pb-24" : ""}>
                <div className="mb-6">
                  <Label htmlFor="title" className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-primary" />
                    TITLE <span className="text-red-500">*</span>
                  </Label>
                  <JobTitleInput
                    value={jobTitle}
                    onChange={(value) => setJobTitle(value)}
                    placeholder="Type your job title"
                    className="mt-1"
                  />
                </div>

                <div className="mb-6">
                  <Label htmlFor="employer" className="flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-primary" />
                    EMPLOYER <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="employer"
                    placeholder="e.g. Driftmark Technologies"
                    value={employer}
                    onChange={(e) => setEmployer(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="mb-6">
                  <Label htmlFor="location" className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    LOCATION
                  </Label>
                  <LocationInput
                    value={location}
                    onChange={(value) => setLocation(value)}
                    placeholder="Dar es Salaam, Tanzania"
                    className="mt-1"
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

                <div className="mb-6">
                  <Label htmlFor="startMonth" className="flex items-center mb-1">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    START DATE <span className="text-red-500">*</span>
                  </Label>
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
                
                <div className="mb-6">
                  <Label htmlFor="endDate" className="flex items-center mb-1">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    END DATE <span className="text-red-500">*</span>
                  </Label>
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

                <div className="flex items-center mb-8">
                  <Checkbox 
                    id="currentlyWork" 
                    checked={currentJob}
                    onCheckedChange={(checked) => setCurrentJob(checked as boolean)}
                  />
                  <Label htmlFor="currentlyWork" className="ml-2 text-gray-700 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    I currently work here
                  </Label>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className={`bg-primary hover:bg-primary/90 text-white ${isMobile ? 'w-full mt-6' : 'px-8 py-2'}`}
                  >
                    Next
                  </Button>
                </div>
              </form>
            </>
          )}
          
          {showWorkHistory && (
            <>
              <WorkHistorySummary
                workExperiences={(formData.workExperiences || formData.workExp || []).map(job => ({
                  ...job,
                  id: job.id || Date.now().toString() // Ensure all jobs have an ID
                }))}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
                onAddAnother={handleAddAnotherPosition}
              />
              
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigateWithScrollReset(navigate, `/cv/${templateId}/personal`);
                  }}
                  className="flex items-center gap-1 px-4"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <Button 
                  onClick={handleContinueToEducation}
                  className="bg-primary hover:bg-primary/90 text-white px-4"
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
        
        {/* Live CV Preview - Only visible on desktop */}
        {!isMobile && (
          <div className="hidden lg:block lg:w-1/2 xl:w-3/5">
            <LiveCVPreview cvData={formData} templateId={templateId} />
          </div>
        )}
      </div>
      
      {/* Removed the fixed Next button as requested */}
      
      {/* AI Recommendation Modal */}
      {isGeneratingRecommendations && (
        <>
          {/* Show loading indicator */}
          <GeneratingRecommendations />
          
          {/* Generator component that does the actual API call - render in visible DOM for proper functionality */}
          <div style={{ position: 'absolute', left: '-9999px' }}>
            <WorkExperienceBulletGenerator
              jobTitle={jobTitle}
              company={employer}
              onBulletPointsGenerated={handleAddRecommendations}
              onError={handleSkipRecommendations}
            />
          </div>
        </>
      )}
      
      {showRecommendationsDialog && (
        <WorkExperienceRecommendationsDialog
          jobTitle={jobTitle}
          company={employer}
          recommendations={aiRecommendations}
          onAccept={handleAcceptRecommendations}
          onReject={handleRejectRecommendations}
        />
      )}
    </div>
  );
};

export default WorkExperienceForm;