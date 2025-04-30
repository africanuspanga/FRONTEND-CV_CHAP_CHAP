import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { languageSchema, Language } from '@shared/schema';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateId } from '@/lib/utils';
import { X, PlusCircle } from 'lucide-react';

interface LanguagesFormProps {
  defaultValues: Language[];
  onSubmit: (data: Language[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const formSchema = z.object({
  languages: z.array(languageSchema)
});

type FormValues = z.infer<typeof formSchema>;

const LanguagesForm: React.FC<LanguagesFormProps> = ({
  defaultValues,
  onSubmit,
  onBack,
  onNext
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      languages: defaultValues.length > 0 ? defaultValues : []
    },
    mode: 'onChange'
  });

  const { control, handleSubmit } = form;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages"
  });

  const addNewLanguage = () => {
    setShowAddForm(true);
  };

  const handleSaveLanguages = (data: FormValues) => {
    onSubmit(data.languages);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-darkText mb-4">Languages</h2>
      <p className="text-lightText mb-6">Add the languages you speak and your proficiency level.</p>
      
      <Form {...form}>
        <form onSubmit={handleSubmit(handleSaveLanguages)}>
          {fields.map((field, index) => (
            <Card key={field.id} className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{field.name}</CardTitle>
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
                    name={`languages.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., English, Swahili, French" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`languages.${index}.proficiency`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proficiency Level</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select proficiency level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Fluent">Fluent</SelectItem>
                            <SelectItem value="Native">Native</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`languages.${index}.certification`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Certification (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="e.g., TOEFL, DELF, HSK" 
                          />
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
              onClick={addNewLanguage}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Language
            </Button>
          )}
          
          {showAddForm && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Add New Language</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="newLanguage.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., English, Swahili, French" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="newLanguage.proficiency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proficiency Level</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select proficiency level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Fluent">Fluent</SelectItem>
                            <SelectItem value="Native">Native</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="newLanguage.certification"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Certification (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="e.g., TOEFL, DELF, HSK" 
                          />
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
                    const newLanguage = form.getValues("newLanguage") as Language;
                    if (newLanguage?.name && newLanguage?.proficiency) {
                      append({
                        ...newLanguage,
                        id: generateId()
                      });
                      setShowAddForm(false);
                    }
                  }}
                >
                  Add Language
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
                handleSubmit(handleSaveLanguages)();
                onNext();
              }}
            >
              Next: References
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LanguagesForm;
