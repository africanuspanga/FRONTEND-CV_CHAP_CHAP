import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { navigateWithScrollReset } from '@/lib/navigation-utils';

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
  
  // Check if user has any work experiences
  const hasWorkExperiences = workExperiences.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Enhanced Progress Bar */}
      <div className="mb-6">
        <div className="enhanced-progress-bar">
          <div className="progress-fill" style={{ width: '22%' }}></div>
        </div>
        <div className="progress-percentage">22%</div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="text-primary flex items-center mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        <h1 className="text-2xl font-bold mb-2">Work history summary</h1>
        
        {!hasWorkExperiences ? (
          <div className="text-center p-8">
            <Alert className="mb-4">
              <AlertDescription>
                You haven't added any work experience yet.
              </AlertDescription>
            </Alert>
            <Button onClick={handleAddNew} className="mt-2">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Work Experience
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 mt-6">
              {workExperiences.map((job: any, index: number) => (
                <Card key={job.id} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary font-medium">
                          {index + 1}
                        </div>
                        <CardTitle className="text-lg">
                          {job.jobTitle}{job.company ? `, ${job.company}` : ''}
                        </CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleEdit(job.id)}
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 px-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(job.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {job.location && `${job.location} | `}
                      {job.startDate} - {job.current ? 'Present' : job.endDate}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {job.achievements && job.achievements.map((achievement: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700">{achievement}</li>
                      ))}
                    </ul>
                    {job.achievements?.length === 0 && (
                      <div className="text-sm text-muted-foreground italic">
                        No achievements added for this position
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button 
                onClick={handleAddNew} 
                variant="outline"
                className="flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Another Position
              </Button>
              
              <Button 
                onClick={() => navigateWithScrollReset(navigate, `/cv/${templateId}/education`)}
                className="bg-primary text-white"
              >
                Continue to Education
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkExperienceSummary;