import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useCVForm } from '@/contexts/cv-form-context';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Info, Pencil, Trash } from 'lucide-react';
import { navigateWithScrollReset } from '@/lib/navigation-utils';
import { Button } from '@/components/ui/button';

// Work Experience Summary component
const WorkExperienceSummary = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData, updateFormField } = useCVForm();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // Get the template ID from the URL
  const templateId = params.templateId || formData.templateId || 'kilimanjaro';
  
  // Initialize on mount
  useEffect(() => {
    setLoading(true);
    if (templateId && formData.templateId !== templateId) {
      updateFormField('templateId', templateId);
    }
    setLoading(false);
  }, [templateId, formData.templateId]);

  // Handle adding a new work experience
  const handleAddNew = () => {
    navigateWithScrollReset(navigate, `/cv/${templateId}/work-experience`);
  };

  // Handle going back to edit sections
  const handleBack = () => {
    navigateWithScrollReset(navigate, `/edit-sections`);
  };

  // Handle editing a specific work experience entry
  const handleEdit = (jobId: string) => {
    // Store the job ID to edit in sessionStorage
    sessionStorage.setItem('job_to_edit', jobId);
    navigateWithScrollReset(navigate, `/cv/${templateId}/work-experience`);
  };

  // Handle deleting a work experience
  const handleDelete = (jobId: string) => {
    // Filter out the job with the given ID
    const updatedWorkExperiences = (formData.workExperiences || []).filter(
      (job: any) => job.id !== jobId
    );
    
    // Update both workExperiences and workExp arrays for consistency
    updateFormField('workExperiences', updatedWorkExperiences);
    updateFormField('workExp', updatedWorkExperiences);
    
    toast({
      title: "Deleted",
      description: "Work experience entry has been removed",
    });
  };

  // Get all work experiences
  const workExperiences = formData.workExperiences || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
          <div className="bg-[#4863c3] h-full" style={{ width: '22%' }}></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">22%</div>
      </div>

      {/* Back button */}
      <button
        onClick={handleBack}
        className="text-[#4863c3] flex items-center mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Go Back
      </button>

      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#313c75]">Work history summary</h1>
        <Button 
          variant="outline" 
          className="flex items-center text-[#4863c3] bg-[#e9eeff] border-[#e0e7ff] hover:bg-[#edf2ff] px-3 py-2 rounded-md text-sm"
        >
          <Info className="h-4 w-4 mr-2" />
          Tips
        </Button>
      </div>

      {/* Work experience entries */}
      <div className="space-y-4">
        {workExperiences.map((job: any, index: number) => (
          <div key={job.id} className="bg-white rounded-lg border p-6">
            <div className="flex justify-between">
              <div className="flex">
                <div className="bg-[#e9eeff] text-[#4863c3] w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-3">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-[#4863c3] text-lg font-semibold">
                    {job.jobTitle}{job.company ? `, ${job.company}` : ''}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {job.location} | {job.startDate} - {job.current ? 'Present' : job.endDate}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleEdit(job.id)}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
                <Button 
                  onClick={() => handleDelete(job.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-500 hover:bg-red-50"
                >
                  <Trash className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
            
            {/* Achievements */}
            <ul className="list-disc pl-6 mt-4 space-y-1.5">
              {job.achievements && job.achievements.map((achievement: string, i: number) => (
                <li key={i} className="text-gray-700">{achievement}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Add experience button */}
      {workExperiences.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">You haven't added any work experience yet.</p>
          <Button 
            onClick={handleAddNew}
            className="bg-[#4863c3] hover:bg-[#3a51a9] text-white"
          >
            Add Work Experience
          </Button>
        </div>
      ) : (
        <div className="mt-6 flex justify-between">
          <Button 
            onClick={handleAddNew}
            variant="outline"
            className="border-gray-300 text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Another Position
          </Button>
          
          <Button 
            onClick={() => navigateWithScrollReset(navigate, `/cv/${templateId}/education`)}
            className="bg-[#4863c3] hover:bg-[#3a51a9] text-white"
          >
            Continue to Education
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkExperienceSummary;