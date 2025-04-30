import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { useCVForm } from '@/contexts/cv-form-context';
import { educationSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { generateId } from '@/lib/utils';
import { Trash2, PlusCircle, GripVertical, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Extend the schema with client-side validation
const formSchema = z.object({
  education: z.array(educationSchema),
});

type FormValues = z.infer<typeof formSchema>;

// Single empty education item template
const emptyEducation = {
  id: generateId(),
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
};

const MAX_EDUCATION = 5;

const EducationStep: React.FC = () => {
  const { formData, updateFormField } = useCVForm();
  const [showMaxWarning, setShowMaxWarning] = useState(false);
  
  // Get default values from context or use an empty array with one item
  const defaultValues: FormValues = {
    education: formData.education && formData.education.length > 0
      ? formData.education
      : [emptyEducation],
  };

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Setup field array for education entries
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'education',
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    updateFormField('education', data.education);
  };

  // Add a new education entry
  const addEducation = () => {
    if (fields.length >= MAX_EDUCATION) {
      setShowMaxWarning(true);
      return;
    }
    
    append(emptyEducation);
    // Auto-open the newly added accordion item
    form.setValue('education', [...form.getValues('education')]);
    
    // Update the preview with the new empty field
    const updatedEducation = [...formData.education || [], emptyEducation];
    updateFormField('education', updatedEducation);
  };

  // Remove an education entry
  const removeEducation = (index: number) => {
    remove(index);
    setShowMaxWarning(false);
    
    // Update the preview immediately
    const updatedEducation = [...(formData.education || [])];
    updatedEducation.splice(index, 1);
    updateFormField('education', updatedEducation);
  };

  // Update form data on change to provide real-time preview
  const handleFieldChange = (index: number, field: string, value: any) => {
    // Clone the current education array
    const updatedEducation = [...(formData.education || [])];
    
    // Ensure the index exists
    if (!updatedEducation[index]) {
      updatedEducation[index] = { ...emptyEducation };
    }
    
    // Update the specific field
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    
    // Update the global state for preview
    updateFormField('education', updatedEducation);
  };

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Introduction */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Add your education history, starting with your most recent qualification. Include any degrees, certifications, or relevant training.
          </p>
        </div>

        {/* Max warning alert */}
        {showMaxWarning && (
          <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              You've reached the maximum of {MAX_EDUCATION} education entries. Please remove an existing entry before adding a new one.
            </AlertDescription>
          </Alert>
        )}

        {/* Education Entries */}
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
                    {form.watch(`education.${index}.degree`) || 'New Education'}
                    {form.watch(`education.${index}.institution`) && (
                      <span className="text-muted-foreground ml-2">
                        at {form.watch(`education.${index}.institution`)}
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
                    removeEducation(index);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
              
              <AccordionContent className="pb-4 pt-1">
                <div className="space-y-4 px-1">
                  {/* Degree & Institution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`education.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree/Certification <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Bachelor of Science" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFieldChange(index, 'degree', e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`education.${index}.institution`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. University of Dar es Salaam" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFieldChange(index, 'institution', e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Field of Study */}
                  <FormField
                    control={form.control}
                    name={`education.${index}.fieldOfStudy`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Computer Science" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFieldChange(index, 'fieldOfStudy', e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Education Dates */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`education.${index}.startDate`}
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

                      {!form.watch(`education.${index}.current`) && (
                        <FormField
                          control={form.control}
                          name={`education.${index}.endDate`}
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
                      name={`education.${index}.current`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                const isChecked = checked as boolean;
                                field.onChange(isChecked);
                                handleFieldChange(index, 'current', isChecked);
                                
                                // Clear end date if currently studying
                                if (isChecked) {
                                  form.setValue(`education.${index}.endDate`, '');
                                  handleFieldChange(index, 'endDate', '');
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I am currently studying here
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name={`education.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe relevant coursework, achievements, thesis, etc."
                            className="min-h-[100px]"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFieldChange(index, 'description', e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Include any honors, relevant coursework, extracurricular activities, or other achievements.
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

        {/* Add Education Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={addEducation}
          disabled={fields.length >= MAX_EDUCATION}
        >
          <PlusCircle className="h-4 w-4" />
          Add Another Education
        </Button>
        
        {fields.length === 0 && (
          <Card className="p-8 flex flex-col items-center justify-center text-center space-y-3 border-dashed">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">
                No education added yet.
              </p>
              <Button
                type="button"
                variant="link"
                className="mt-2 px-0"
                onClick={addEducation}
              >
                Add your first education
              </Button>
            </div>
          </Card>
        )}
      </form>
    </Form>
  );
};

export default EducationStep;