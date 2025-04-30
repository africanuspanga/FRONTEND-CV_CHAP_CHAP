import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { educationSchema, Education } from '@shared/schema';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { generateId } from '@/lib/utils';
import { X, PlusCircle } from 'lucide-react';

interface EducationFormProps {
  defaultValues: Education[];
  onSubmit: (data: Education[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const formSchema = z.object({
  education: z.array(educationSchema)
});

type FormValues = z.infer<typeof formSchema>;

const EducationForm: React.FC<EducationFormProps> = ({
  defaultValues,
  onSubmit,
  onBack,
  onNext
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      education: defaultValues.length > 0 ? defaultValues : []
    },
    mode: 'onChange'
  });

  const { control, handleSubmit, reset, formState: { errors, isValid } } = form;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education"
  });

  const addNewEducation = () => {
    setShowAddForm(true);
  };

  const handleSaveEducation = (data: FormValues) => {
    onSubmit(data.education);
    setShowAddForm(false);
  };

  const handleAddEducation = (education: Education) => {
    append({
      ...education,
      id: generateId()
    });
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-darkText mb-4">Education</h2>
      <p className="text-lightText mb-6">Add your educational background. Include degrees, certifications, and relevant training.</p>
      
      <Form {...form}>
        <form onSubmit={handleSubmit(handleSaveEducation)}>
          {fields.map((field, index) => (
            <Card key={field.id} className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{field.degree || 'Degree'}</CardTitle>
                    <CardDescription>{field.institution || 'Institution'}</CardDescription>
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
                    name={`education.${index}.institution`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., University of Dar es Salaam" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`education.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree/Certificate</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Bachelor of Science" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`education.${index}.fieldOfStudy`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Computer Science" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`education.${index}.gpa`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GPA/Grade (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 3.8/4.0 or 'First Class'" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name={`education.${index}.startDate`}
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
                      name={`education.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="month" 
                              disabled={form.watch(`education.${index}.current`)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={control}
                    name={`education.${index}.current`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I'm currently studying here</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="col-span-2">
                    <FormField
                      control={control}
                      name={`education.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={4}
                              placeholder="Describe key courses, projects, or achievements during your education." 
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
              onClick={addNewEducation}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          )}
          
          {showAddForm && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Add New Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="newEducation.institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., University of Dar es Salaam" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="newEducation.degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree/Certificate</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Bachelor of Science" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="newEducation.fieldOfStudy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Computer Science" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="newEducation.gpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GPA/Grade (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 3.8/4.0 or 'First Class'" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name="newEducation.startDate"
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
                      name="newEducation.endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="month" 
                              disabled={form.watch("newEducation.current")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={control}
                    name="newEducation.current"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I'm currently studying here</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="col-span-2">
                    <FormField
                      control={control}
                      name="newEducation.description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={4}
                              placeholder="Describe key courses, projects, or achievements during your education." 
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
                    const newEducation = form.getValues("newEducation") as Education;
                    if (newEducation) {
                      handleAddEducation(newEducation);
                    }
                  }}
                >
                  Add Education
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
                handleSubmit(handleSaveEducation)();
                onNext();
              }}
            >
              Next: Skills
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EducationForm;
