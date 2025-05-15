import React, { useState } from 'react';
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
import { Trash2, PlusCircle, GripVertical, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

const MAX_EXPERIENCES = 5;

const WorkExperienceStep: React.FC = () => {
  const { formData, updateFormField } = useCVForm();
  const [showMaxWarning, setShowMaxWarning] = useState(false);
  
  // Get default values from context or use an empty array with one item
  // Check both workExperiences and workExp properties for backward compatibility
  const defaultValues: FormValues = {
    workExperience: 
      // First check workExperiences (primary property)
      (formData.workExperiences && formData.workExperiences.length > 0)
        ? formData.workExperiences
        // Then fall back to workExp (secondary property)
        : (formData.workExp && formData.workExp.length > 0)
          ? formData.workExp
          // If neither exists, use an empty experience
          : [emptyWorkExperience],
  };

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Setup field array for work experiences
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'workExperience',
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    updateFormField('workExperiences', data.workExperience);
  };

  // Add a new work experience entry
  const addWorkExperience = () => {
    if (fields.length >= MAX_EXPERIENCES) {
      setShowMaxWarning(true);
      return;
    }
    
    append(emptyWorkExperience);
    // Auto-open the newly added accordion item
    form.setValue('workExperience', [...form.getValues('workExperience')]);
    
    // Update the preview with the new empty field
    const updatedExperience = [...formData.workExperiences || [], emptyWorkExperience];
    updateFormField('workExperiences', updatedExperience);
  };

  // Remove a work experience entry
  const removeWorkExperience = (index: number) => {
    remove(index);
    setShowMaxWarning(false);
    
    // Update the preview immediately
    const updatedExperience = [...(formData.workExperiences || [])];
    updatedExperience.splice(index, 1);
    updateFormField('workExperiences', updatedExperience);
  };

  // Update form data on change to provide real-time preview
  const handleFieldChange = (index: number, field: string, value: any) => {
    // Clone the current work experience array
    const updatedExperiences = [...(formData.workExperiences || [])];
    
    // Ensure the index exists
    if (!updatedExperiences[index]) {
      updatedExperiences[index] = { ...emptyWorkExperience };
    }
    
    // Update the specific field
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    
    // Update the global state for preview
    updateFormField('workExperiences', updatedExperiences);
  };

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Introduction */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Add your work experience, starting with your most recent position. For best results, include measurable achievements.
          </p>
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