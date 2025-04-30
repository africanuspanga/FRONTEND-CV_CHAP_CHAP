import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { workExperienceSchema, WorkExperience } from '@shared/schema';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { generateId } from '@/lib/utils';
import { X, PlusCircle } from 'lucide-react';

interface WorkExperienceFormProps {
  defaultValues: WorkExperience[];
  onSubmit: (data: WorkExperience[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const formSchema = z.object({
  experiences: z.array(workExperienceSchema)
});

type FormValues = z.infer<typeof formSchema>;

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({
  defaultValues,
  onSubmit,
  onBack,
  onNext
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experiences: defaultValues.length > 0 ? defaultValues : []
    },
    mode: 'onChange'
  });

  const { control, handleSubmit, reset, formState: { errors, isValid } } = form;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences"
  });

  const addNewExperience = () => {
    setShowAddForm(true);
  };

  const handleSaveExperience = (data: FormValues) => {
    onSubmit(data.experiences);
    setShowAddForm(false);
  };

  const handleAddExperience = (experience: WorkExperience) => {
    append({
      ...experience,
      id: generateId()
    });
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-darkText mb-4">Work Experience</h2>
      <p className="text-lightText mb-6">Add your work experience information. Include relevant jobs and internships.</p>
      
      <Form {...form}>
        <form onSubmit={handleSubmit(handleSaveExperience)}>
          {fields.map((field, index) => (
            <Card key={field.id} className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{field.jobTitle || 'Job Position'}</CardTitle>
                    <CardDescription>{field.company || 'Company'}</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-gray-500 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`experiences.${index}.jobTitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Software Developer" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`experiences.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Tech Company Ltd." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`experiences.${index}.location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Dar es Salaam, Tanzania" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name={`experiences.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="month" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name={`experiences.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="month" 
                              disabled={form.watch(`experiences.${index}.current`)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={control}
                    name={`experiences.${index}.current`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I currently work here</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="col-span-2">
                    <FormField
                      control={control}
                      name={`experiences.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={4}
                              placeholder="Describe your responsibilities and achievements at this job. Use bullet points for better readability." 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {!showAddForm && (
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={addNewExperience}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Work Experience
            </Button>
          )}
          
          {showAddForm && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Add New Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="newExperience.jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Software Developer" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="newExperience.company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Tech Company Ltd." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="newExperience.location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Dar es Salaam, Tanzania" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name="newExperience.startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="month" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name="newExperience.endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="month" 
                              disabled={form.watch("newExperience.current")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={control}
                    name="newExperience.current"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I currently work here</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="col-span-2">
                    <FormField
                      control={control}
                      name="newExperience.description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={4}
                              placeholder="Describe your responsibilities and achievements at this job. Use bullet points for better readability." 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    const newExperience = form.getValues("newExperience") as WorkExperience;
                    if (newExperience) {
                      handleAddExperience(newExperience);
                    }
                  }}
                >
                  Add Experience
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => {
                handleSubmit(handleSaveExperience)();
                onNext();
              }}
            >
              Next: Education
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default WorkExperienceForm;
