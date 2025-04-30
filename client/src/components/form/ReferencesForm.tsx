import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { referenceSchema, Reference } from '@shared/schema';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { generateId } from '@/lib/utils';
import { X, PlusCircle } from 'lucide-react';

interface ReferencesFormProps {
  defaultValues: Reference[];
  onSubmit: (data: Reference[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const formSchema = z.object({
  references: z.array(referenceSchema)
});

type FormValues = z.infer<typeof formSchema>;

const ReferencesForm: React.FC<ReferencesFormProps> = ({
  defaultValues,
  onSubmit,
  onBack,
  onNext
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      references: defaultValues.length > 0 ? defaultValues : []
    },
    mode: 'onChange'
  });

  const { control, handleSubmit } = form;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "references"
  });

  const addNewReference = () => {
    setShowAddForm(true);
  };

  const handleSaveReferences = (data: FormValues) => {
    onSubmit(data.references);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-darkText mb-4">References</h2>
      <p className="text-lightText mb-6">Add professional references who can vouch for your skills and experience (optional).</p>
      
      <Form {...form}>
        <form onSubmit={handleSubmit(handleSaveReferences)}>
          {fields.map((field, index) => (
            <Card key={field.id} className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{field.name}</CardTitle>
                    {field.position && field.company && (
                      <CardDescription>{field.position}, {field.company}</CardDescription>
                    )}
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
                    name={`references.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Jane Smith" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`references.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., HR Manager" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`references.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., ABC Corporation" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`references.${index}.relationship`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Former Manager" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`references.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="e.g., jane.smith@company.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`references.${index}.phone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., +255 123 456 789" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          
          {!showAddForm && (
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={addNewReference}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Reference
            </Button>
          )}
          
          {showAddForm && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Add New Reference</CardTitle>
                <FormDescription>
                  Include contact information for people who can vouch for your professional capabilities.
                </FormDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="newReference.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Jane Smith" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="newReference.position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., HR Manager" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="newReference.company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., ABC Corporation" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="newReference.relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Former Manager" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="newReference.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="e.g., jane.smith@company.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="newReference.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., +255 123 456 789" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    const newReference = form.getValues("newReference") as Reference;
                    if (newReference?.name) {
                      append({
                        ...newReference,
                        id: generateId()
                      });
                      setShowAddForm(false);
                    }
                  }}
                >
                  Add Reference
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
                handleSubmit(handleSaveReferences)();
                onNext();
              }}
            >
              Next: Additional Sections
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReferencesForm;
