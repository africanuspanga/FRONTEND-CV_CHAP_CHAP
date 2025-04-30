import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { useCVForm } from '@/contexts/cv-form-context';
import { referenceSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { generateId } from '@/lib/utils';
import { Trash2, PlusCircle, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Extend the schema with client-side validation
const formSchema = z.object({
  showReferences: z.boolean().default(true),
  references: z.array(referenceSchema),
});

type FormValues = z.infer<typeof formSchema>;

// Single empty reference item template
const emptyReference = {
  id: generateId(),
  name: '',
  company: '',
  position: '',
  email: '',
  phone: '',
  relationship: '',
};

const MAX_REFERENCES = 3;

const ReferencesStep: React.FC = () => {
  const { formData, updateFormField } = useCVForm();
  const [showMaxWarning, setShowMaxWarning] = useState(false);
  
  // Get default values from context or use empty settings
  const defaultValues: FormValues = {
    showReferences: formData.references && formData.references.length > 0,
    references: formData.references && formData.references.length > 0
      ? formData.references
      : [],
  };

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Setup field array for references
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'references',
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    // Only save references if showReferences is true
    if (data.showReferences) {
      updateFormField('references', data.references);
    } else {
      updateFormField('references', []);
    }
  };

  // Add a new reference
  const addReference = () => {
    if (fields.length >= MAX_REFERENCES) {
      setShowMaxWarning(true);
      return;
    }
    
    append(emptyReference);
    
    // Update the preview with the new empty field
    const updatedReferences = [...formData.references || [], emptyReference];
    updateFormField('references', updatedReferences);
    setShowMaxWarning(false);
  };

  // Remove a reference
  const removeReference = (index: number) => {
    remove(index);
    setShowMaxWarning(false);
    
    // Update the preview immediately
    const updatedReferences = [...(formData.references || [])];
    updatedReferences.splice(index, 1);
    updateFormField('references', updatedReferences);
  };

  // Update form data on change to provide real-time preview
  const handleFieldChange = (index: number, field: string, value: any) => {
    // Clone the current references array
    const updatedReferences = [...(formData.references || [])];
    
    // Ensure the index exists
    if (!updatedReferences[index]) {
      updatedReferences[index] = { ...emptyReference };
    }
    
    // Update the specific field
    updatedReferences[index] = {
      ...updatedReferences[index],
      [field]: value,
    };
    
    // Update the global state for preview
    updateFormField('references', updatedReferences);
  };

  // Handle toggle for showing references
  const handleShowReferencesToggle = (checked: boolean) => {
    form.setValue('showReferences', checked);
    
    if (!checked) {
      // If references are turned off, clear them from the preview
      updateFormField('references', []);
    } else if (fields.length > 0) {
      // If turning back on and we have references in the form, update the preview
      updateFormField('references', form.getValues('references'));
    }
  };

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Introduction */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            References can strengthen your CV by providing professional endorsements. You can include them directly 
            or indicate they're available upon request.
          </p>
          
          {/* References Toggle */}
          <FormField
            control={form.control}
            name="showReferences"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                <div className="space-y-1 leading-none">
                  <FormLabel>Include References</FormLabel>
                  <FormDescription>
                    Toggle to include references in your CV
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={handleShowReferencesToggle}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* References Info */}
          <Alert variant="info" className="bg-blue-50 border-blue-100">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700 text-sm">
              In many regions, it's becoming standard practice to leave references off your CV and provide them 
              only when specifically requested by potential employers.
            </AlertDescription>
          </Alert>
        </div>

        {form.watch('showReferences') && (
          <>
            {/* Max warning alert */}
            {showMaxWarning && (
              <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  You've reached the maximum of {MAX_REFERENCES} references. Please remove an existing reference before adding a new one.
                </AlertDescription>
              </Alert>
            )}

            {/* References List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Your References</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs flex items-center gap-1"
                  onClick={addReference}
                  disabled={fields.length >= MAX_REFERENCES}
                >
                  <PlusCircle className="h-3 w-3" />
                  Add Reference
                </Button>
              </div>
              
              {fields.length > 0 ? (
                <Accordion type="multiple" defaultValue={fields.map((_, i) => `item-${i}`)} className="space-y-4">
                  {fields.map((field, index) => (
                    <AccordionItem
                      key={field.id}
                      value={`item-${index}`}
                      className="border rounded-md"
                    >
                      <div className="flex items-center pr-2">
                        <AccordionTrigger className="flex-1 hover:no-underline py-3 px-4">
                          <div className="flex-1 text-left font-medium">
                            {form.watch(`references.${index}.name`) || 'New Reference'}
                            {form.watch(`references.${index}.company`) && (
                              <span className="text-muted-foreground ml-2">
                                at {form.watch(`references.${index}.company`)}
                              </span>
                            )}
                          </div>
                        </AccordionTrigger>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeReference(index);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      
                      <AccordionContent className="px-4 pb-4 pt-1">
                        <div className="space-y-4">
                          {/* Name & Position */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`references.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g. John Smith" 
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        handleFieldChange(index, 'name', e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`references.${index}.position`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Position/Title</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g. Senior Manager" 
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        handleFieldChange(index, 'position', e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Company */}
                          <FormField
                            control={form.control}
                            name={`references.${index}.company`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company/Organization</FormLabel>
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

                          {/* Contact Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`references.${index}.email`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="email"
                                      placeholder="e.g. john.smith@company.com" 
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        handleFieldChange(index, 'email', e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`references.${index}.phone`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g. +255 123 456 789" 
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        handleFieldChange(index, 'phone', e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Relationship */}
                          <FormField
                            control={form.control}
                            name={`references.${index}.relationship`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Relationship</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g. Former Manager, Colleague, Supervisor" 
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      handleFieldChange(index, 'relationship', e.target.value);
                                    }}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Describe your professional relationship with this person
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
              ) : (
                <Card className="p-8 flex flex-col items-center justify-center text-center space-y-3 border-dashed">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      No references added yet.
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      className="mt-2 px-0"
                      onClick={addReference}
                    >
                      Add your first reference
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Reference Tips */}
            <Card className="bg-gray-50">
              <div className="p-4">
                <h3 className="font-medium mb-2">Tips for References</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-medium">•</span>
                    <span>Always ask for permission before listing someone as a reference</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-medium">•</span>
                    <span>Choose references who can speak specifically about your skills and work ethic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-medium">•</span>
                    <span>Prioritize recent professional connections over personal references</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-medium">•</span>
                    <span>Provide your references with your current CV so they know your recent experience</span>
                  </li>
                </ul>
              </div>
            </Card>
          </>
        )}

        {!form.watch('showReferences') && (
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-100 p-2">
                <Info className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium">References Available Upon Request</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You've chosen to not include references directly on your CV. Employers will understand that
                  you can provide references when requested during the application process.
                </p>
              </div>
            </div>
          </Card>
        )}
      </form>
    </Form>
  );
};

export default ReferencesStep;