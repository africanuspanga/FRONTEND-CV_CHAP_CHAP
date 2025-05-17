import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { useCVForm } from '@/contexts/cv-form-context';
import { workExperienceSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { generateId } from '@/lib/utils';
import { Trash2, PlusCircle, GripVertical, AlertCircle, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Extend the schema with client-side validation
const formSchema = z.object({
  workExperience: z.array(workExperienceSchema),
});

type FormValues = z.infer<typeof formSchema>;

// Single empty work experience item template
const emptyWorkExperience = {
  id: generateId(),
  jobTitle: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  achievements: [],
};

// Increased to 8 work experiences as requested
const MAX_EXPERIENCES = 8;

// Helper function to ensure work experience data is valid
const sanitizeWorkExperiences = (data: any[]): any[] => {
  if (!Array.isArray(data)) return [];
  
  return data.map(exp => ({
    id: exp.id || generateId(),
    jobTitle: exp.jobTitle || '',
    company: exp.company || '',
    location: exp.location || '',
    startDate: exp.startDate || '',
    endDate: exp.endDate || '',
    current: !!exp.current,
    description: exp.description || '',
    achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
  }));
};

const WorkExperienceStep: React.FC = () => {
  const { formData, updateFormField } = useCVForm();
  const [showMaxWarning, setShowMaxWarning] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  
  // Get and sanitize existing work experiences
  const existingExperiences = (() => {
    // First check workExperiences (primary property)
    if (Array.isArray(formData.workExperiences) && formData.workExperiences.length > 0) {
      return sanitizeWorkExperiences(formData.workExperiences);
    }
    // Then fall back to workExp (secondary property)
    else if (Array.isArray(formData.workExp) && formData.workExp.length > 0) {
      return sanitizeWorkExperiences(formData.workExp);
    }
    // If neither exists, start with one empty experience
    return [emptyWorkExperience];
  })();
  
  // Initialize form with sanitized data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workExperience: existingExperiences
    },
    mode: 'onChange',
  });
  
  // Setup field array for work experiences
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'workExperience',
  });
  
  // Effect to check if both arrays are empty and add a default empty experience
  useEffect(() => {
    if (fields.length === 0) {
      append(emptyWorkExperience);
    }
  }, [fields.length, append]);

  // Handle form submission with improved reliability
  const onSubmit = (data: FormValues) => {
    try {
      // Deep copy to avoid reference issues
      const experiences = JSON.parse(JSON.stringify(data.workExperience));
      
      // Make sure each experience has a valid ID and required fields
      experiences.forEach((exp: any, index: number) => {
        if (!exp.id) {
          exp.id = generateId();
        }
        
        // Ensure all experiences have at least the required fields
        exp.jobTitle = exp.jobTitle || `Position ${index + 1}`;
        exp.company = exp.company || '';
        exp.achievements = Array.isArray(exp.achievements) ? exp.achievements : [];
      });
      
      console.log(`Saving ${experiences.length} work experiences`);
      
      // Update both arrays in context for consistent state
      updateFormField('workExperiences', experiences);
      updateFormField('workExp', experiences);
      
      // Mark that changes have been made
      setHasChanges(false);
      
      // Save to all storage methods for maximum reliability
      try {
        // Update CV data in localStorage and sessionStorage directly
        const updatedCvData = { 
          ...formData, 
          workExperiences: experiences, 
          workExp: experiences 
        };
        
        localStorage.setItem('cv-form-data', JSON.stringify(updatedCvData));
        sessionStorage.setItem('cv-form-data', JSON.stringify(updatedCvData));
        
        console.log(`Work experiences saved successfully: ${experiences.length} entries`);
        
        // Show success toast
        toast({
          title: "Work experience saved",
          description: `Successfully saved ${experiences.length} work experience entries`,
        });
      } catch (storageError) {
        console.error('Error saving to storage:', storageError);
        // Continue even if storage fails
      }
    } catch (error) {
      console.error('Error in work experience submission:', error);
      toast({
        title: "Error saving",
        description: "There was a problem saving your work experience. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add a new work experience entry - completely rewritten for reliability
  const addWorkExperience = () => {
    if (fields.length >= MAX_EXPERIENCES) {
      setShowMaxWarning(true);
      toast({
        title: "Maximum limit reached",
        description: `You can add up to ${MAX_EXPERIENCES} work experiences.`,
        variant: "destructive",
      });
      return;
    }
    
    // Create a new work experience with unique ID
    const newExperience = {
      ...emptyWorkExperience,
      id: generateId()
    };
    
    try {
      // Add to form fields
      append(newExperience);
      
      // Wait to ensure field is added to the form
      setTimeout(() => {
        try {
          // Get current values after append
          const currentValues = form.getValues('workExperience');
          
          // Update both arrays in context (main fix)
          updateFormField('workExperiences', [...currentValues]);
          updateFormField('workExp', [...currentValues]);
          
          // Force immediate storage update
          const updatedCvData = { 
            ...formData, 
            workExperiences: [...currentValues], 
            workExp: [...currentValues]
          };
          
          localStorage.setItem('cv-form-data', JSON.stringify(updatedCvData));
          sessionStorage.setItem('cv-form-data', JSON.stringify(updatedCvData));
          
          // Mark that changes were made
          setHasChanges(true);
          
          console.log(`Added new experience - total: ${currentValues.length}`);
          
          // Force form submission to ensure data is saved
          form.handleSubmit(onSubmit)();
        } catch (innerError) {
          console.error('Error after adding work experience:', innerError);
        }
      }, 100);
    } catch (error) {
      console.error('Error adding work experience:', error);
      toast({
        title: "Error adding work experience",
        description: "Please try again or refresh the page",
        variant: "destructive",
      });
    }
  };

  // Remove a work experience entry - enhanced for reliability
  const removeWorkExperience = (index: number) => {
    try {
      console.log(`Removing work experience at index ${index}`);
      
      // Create a backup of current values before removal
      const backupValues = [...form.getValues('workExperience')];
      
      // Remove from form field array
      remove(index);
      setShowMaxWarning(false);
      
      // Give time for the form to update
      setTimeout(() => {
        try {
          // Get current values after removal
          const currentValues = form.getValues('workExperience');
          
          // Verify the removal worked correctly
          if (currentValues.length !== backupValues.length - 1) {
            console.warn('Removal may not have worked correctly, length mismatch');
          }
          
          // Create a fresh array to break any reference issues
          const safeValues = [...currentValues].map(exp => ({...exp}));
          
          console.log(`After remove: ${safeValues.length} work experiences remaining`);
          
          // Update both arrays in context for consistency
          updateFormField('workExperiences', safeValues);
          updateFormField('workExp', safeValues);
          
          // Force an immediate direct storage update with multiple methods
          try {
            // Method 1: Update through context data
            const cvData = { 
              ...formData, 
              workExperiences: safeValues, 
              workExp: safeValues 
            };
            
            // Method 2: Direct storage updates
            localStorage.setItem('cv-form-data', JSON.stringify(cvData));
            sessionStorage.setItem('cv-form-data', JSON.stringify(cvData));
            
            // Method 3: Force a form submission
            form.handleSubmit(onSubmit)();
            
            // Confirm successful removal
            toast({
              title: "Entry removed",
              description: `Work experience removed successfully. ${safeValues.length} remaining.`,
            });
          } catch (storageError) {
            console.error('Error saving after removal:', storageError);
            // Continue even if storage fails
          }
        } catch (innerError) {
          console.error('Error processing work experience removal:', innerError);
        }
      }, 100);
    } catch (error) {
      console.error('Error removing work experience:', error);
      toast({
        title: "Error removing entry",
        description: "There was a problem removing the work experience. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Update form data on change with enhanced reliability
  const handleFieldChange = (index: number, field: string, value: any) => {
    try {
      // Mark that changes have been made - triggers save confirmation
      setHasChanges(true);
      
      // Get the current form values ensuring we're working with the latest data
      const currentValues = form.getValues('workExperience');
      
      // Safety check - make sure we have an array
      if (!currentValues || !Array.isArray(currentValues)) {
        console.error('Current form values is not an array:', currentValues);
        return;
      }
      
      // Make sure the index exists
      if (!currentValues[index]) {
        console.warn(`Work experience at index ${index} doesn't exist. Creating it.`);
        currentValues[index] = { ...emptyWorkExperience, id: generateId() };
      }
      
      // Deep clone to avoid reference issues
      const updatedValues = JSON.parse(JSON.stringify(currentValues));
      
      // Update the field in the cloned values
      updatedValues[index] = {
        ...updatedValues[index],
        [field]: value,
      };
      
      // Update the form value
      form.setValue('workExperience', updatedValues);
      
      // Update both arrays in context for consistency and preview
      updateFormField('workExperiences', updatedValues);
      updateFormField('workExp', updatedValues);
      
      // Every 2 seconds, auto-save the form data
      const now = Date.now();
      if (!lastSaveTime || now - lastSaveTime > 2000) {
        // Force storage update for added reliability
        const updatedCvData = { 
          ...formData, 
          workExperiences: updatedValues, 
          workExp: updatedValues 
        };
        
        try {
          localStorage.setItem('cv-form-data', JSON.stringify(updatedCvData));
          sessionStorage.setItem('cv-form-data', JSON.stringify(updatedCvData));
          lastSaveTime = now;
          console.log('Auto-saved work experience data');
        } catch (storageError) {
          console.error('Error auto-saving:', storageError);
        }
      }
    } catch (error) {
      console.error(`Error updating field '${field}' at index ${index}:`, error);
    }
  };
  
  // Track last save time for auto-save throttling
  let lastSaveTime = 0;

  // Handle manual save function
  const handleManualSave = () => {
    try {
      // Get current values
      const currentValues = form.getValues('workExperience');
      
      // Create a valid copy of all entries
      const validExperiences = sanitizeWorkExperiences(currentValues);
      
      // Update both arrays in the CV context
      updateFormField('workExperiences', validExperiences);
      updateFormField('workExp', validExperiences);
      
      // Force save to storage
      const updatedCvData = {
        ...formData,
        workExperiences: validExperiences,
        workExp: validExperiences
      };
      
      localStorage.setItem('cv-form-data', JSON.stringify(updatedCvData));
      sessionStorage.setItem('cv-form-data', JSON.stringify(updatedCvData));
      
      // Show confirmation message
      setHasChanges(false);
      toast({
        title: "Work experience saved",
        description: `Successfully saved ${validExperiences.length} work experience entries.`,
      });
      
      console.log(`Manually saved ${validExperiences.length} work experiences`);
    } catch (error) {
      console.error('Error during manual save:', error);
      toast({
        title: "Error saving",
        description: "There was a problem saving your work experience. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Introduction and Save button */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2 flex-1">
            <p className="text-sm text-muted-foreground">
              Add your work experience, starting with your most recent position. Each entry will be saved automatically.
            </p>
          </div>
          
          <Button 
            type="button"
            onClick={handleManualSave}
            className="ml-4 flex items-center gap-2"
            variant="outline"
          >
            <Save className="h-4 w-4" />
            Save All Entries
          </Button>
        </div>
        
        {/* Work experience count indicator */}
        <div className="text-sm text-muted-foreground mb-4">
          {fields.length === 0 ? (
            <p>No work experiences added yet. Click "Add Another Position" below to get started.</p>
          ) : (
            <p>You have added {fields.length} of {MAX_EXPERIENCES} possible work experiences.</p>
          )}
        </div>

        {/* Max warning alert */}
        {showMaxWarning && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              You've reached the maximum of {MAX_EXPERIENCES} work experiences. Please remove an existing entry before adding a new one.
            </AlertDescription>
          </Alert>
        )}

        {/* Work Experience Entries */}
        <Accordion type="multiple" defaultValue={[`item-0`]} className="space-y-4">
          {fields.map((field, index) => (
            <AccordionItem 
              key={field.id} 
              value={`item-${index}`}
              className="border rounded-md px-1"
            >
              <div className="flex items-center">
                <div className="cursor-move p-2 opacity-50 hover:opacity-100">
                  <GripVertical className="h-5 w-5" />
                </div>
                <AccordionTrigger className="flex-1 hover:no-underline py-4">
                  <div className="flex-1 text-left font-medium">
                    {form.watch(`workExperience.${index}.jobTitle`) || 'New Position'}
                    {form.watch(`workExperience.${index}.company`) && (
                      <span className="text-muted-foreground ml-2">
                        at {form.watch(`workExperience.${index}.company`)}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mr-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWorkExperience(index);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
              
              <AccordionContent className="pb-4 pt-1">
                <div className="space-y-4 px-1">
                  {/* Job Title & Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`workExperience.${index}.jobTitle`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Senior Developer" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFieldChange(index, 'jobTitle', e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`workExperience.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Acme Corporation" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFieldChange(index, 'company', e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Location & Remote Work */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`workExperience.${index}.location`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Dar es Salaam, Tanzania" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFieldChange(index, 'location', e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                          <div className="space-y-1 leading-none">
                            <div className="font-medium">Remote Work</div>
                            <div className="text-sm text-muted-foreground">
                              This was a remote position
                            </div>
                          </div>
                          <Switch
                            checked={form.getValues().workExperience[index]?.location === 'Remote'}
                            onCheckedChange={(checked) => {
                              // If checked, set location to 'Remote', otherwise clear location
                              const newLocation = checked ? 'Remote' : '';
                              form.setValue(`workExperience.${index}.location`, newLocation);
                              handleFieldChange(index, 'location', newLocation);
                            }}
                          />
                    </div>
                  </div>

                  {/* Employment Dates */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`workExperience.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input 
                                type="month"
                                placeholder="MM/YYYY" 
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleFieldChange(index, 'startDate', e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {!form.watch(`workExperience.${index}.current`) && (
                        <FormField
                          control={form.control}
                          name={`workExperience.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input 
                                  type="month"
                                  placeholder="MM/YYYY" 
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleFieldChange(index, 'endDate', e.target.value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name={`workExperience.${index}.current`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                const isChecked = checked as boolean;
                                field.onChange(isChecked);
                                handleFieldChange(index, 'current', isChecked);
                                
                                // Clear end date if current job
                                if (isChecked) {
                                  form.setValue(`workExperience.${index}.endDate`, '');
                                  handleFieldChange(index, 'endDate', '');
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I currently work here
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name={`workExperience.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your responsibilities, achievements, and technologies used..."
                            className="min-h-[120px]"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFieldChange(index, 'description', e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Highlight your key responsibilities and achievements using bullet points or paragraphs.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Add Experience Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={addWorkExperience}
          disabled={fields.length >= MAX_EXPERIENCES}
        >
          <PlusCircle className="h-4 w-4" />
          Add Another Work Experience
        </Button>
        
        {fields.length === 0 && (
          <Card className="p-8 flex flex-col items-center justify-center text-center space-y-3 border-dashed">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">
                No work experience added yet.
              </p>
              <Button
                type="button"
                variant="link"
                className="mt-2 px-0"
                onClick={addWorkExperience}
              >
                Add your first experience
              </Button>
            </div>
          </Card>
        )}
      </form>
    </Form>
  );
};

export default WorkExperienceStep;