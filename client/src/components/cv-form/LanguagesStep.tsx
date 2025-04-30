import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { useCVForm } from '@/contexts/cv-form-context';
import { languageSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateId } from '@/lib/utils';
import { Trash2, PlusCircle, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Extend the schema with client-side validation
const formSchema = z.object({
  languages: z.array(languageSchema),
});

type FormValues = z.infer<typeof formSchema>;

// Single empty language item template
const emptyLanguage = {
  id: generateId(),
  language: '',
  proficiency: 'intermediate',
};

// Proficiency levels
const proficiencyLevels = [
  { value: 'beginner', label: 'Beginner (A1)' },
  { value: 'elementary', label: 'Elementary (A2)' },
  { value: 'intermediate', label: 'Intermediate (B1)' },
  { value: 'upperIntermediate', label: 'Upper Intermediate (B2)' },
  { value: 'advanced', label: 'Advanced (C1)' },
  { value: 'proficient', label: 'Proficient (C2)' },
  { value: 'native', label: 'Native Speaker' },
];

// Get proficiency level number for slider
const getProficiencyValue = (level: string): number => {
  const index = proficiencyLevels.findIndex(l => l.value === level);
  return index >= 0 ? index : 2; // Default to intermediate
};

// Get level from proficiency value
const getLevelFromValue = (value: number): string => {
  return proficiencyLevels[value]?.value || 'intermediate';
};

const LanguagesStep: React.FC = () => {
  const { formData, updateFormField } = useCVForm();
  const [newLanguage, setNewLanguage] = useState('');
  const [newProficiency, setNewProficiency] = useState(2); // Default to intermediate
  
  // Get default values from context or use an empty array
  const defaultValues: FormValues = {
    languages: formData.languages && formData.languages.length > 0
      ? formData.languages
      : [],
  };

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Setup field array for languages
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'languages',
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    updateFormField('languages', data.languages);
  };

  // Add a new language
  const addLanguage = () => {
    if (!newLanguage.trim()) return;
    
    const newLang = {
      ...emptyLanguage,
      id: generateId(),
      language: newLanguage.trim(),
      proficiency: getLevelFromValue(newProficiency),
    };
    
    append(newLang);
    
    // Update the preview with the new language
    const updatedLanguages = [...formData.languages || [], newLang];
    updateFormField('languages', updatedLanguages);
    
    // Reset the inputs
    setNewLanguage('');
    setNewProficiency(2); // Reset to intermediate
  };

  // Remove a language
  const removeLanguage = (index: number) => {
    remove(index);
    
    // Update the preview immediately
    const updatedLanguages = [...(formData.languages || [])];
    updatedLanguages.splice(index, 1);
    updateFormField('languages', updatedLanguages);
  };

  // Update language proficiency
  const updateLanguageProficiency = (index: number, proficiencyValue: number) => {
    const proficiency = getLevelFromValue(proficiencyValue);
    const updatedLanguages = [...(formData.languages || [])];
    
    if (updatedLanguages[index]) {
      updatedLanguages[index] = {
        ...updatedLanguages[index],
        proficiency,
      };
      form.setValue(`languages.${index}.proficiency`, proficiency);
      updateFormField('languages', updatedLanguages);
    }
  };

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Introduction */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Add languages you speak and your proficiency level. This can be an important differentiator for many positions.
          </p>
        </div>

        {/* Add New Language */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-medium">Add a Language</h3>
            <div className="space-y-4">
              {/* Language Input */}
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. English, Swahili, French"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLanguage();
                      }
                    }}
                  />
                </FormControl>
              </FormItem>

              {/* Proficiency Slider */}
              <FormItem>
                <FormLabel>Proficiency Level: {proficiencyLevels[newProficiency].label}</FormLabel>
                <FormControl>
                  <Slider
                    defaultValue={[2]}
                    value={[newProficiency]}
                    onValueChange={(value) => setNewProficiency(value[0])}
                    max={6}
                    step={1}
                    className="py-4"
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Native</span>
                </div>
              </FormItem>

              {/* Add Button */}
              <Button
                type="button"
                onClick={addLanguage}
                disabled={!newLanguage.trim()}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Language
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Languages Table */}
        {fields.length > 0 ? (
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Language</TableHead>
                    <TableHead>Proficiency</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium">{field.language}</TableCell>
                      <TableCell>
                        <Select
                          value={field.proficiency}
                          onValueChange={(value) => {
                            form.setValue(`languages.${index}.proficiency`, value);
                            const updatedLanguages = [...(formData.languages || [])];
                            if (updatedLanguages[index]) {
                              updatedLanguages[index] = {
                                ...updatedLanguages[index],
                                proficiency: value,
                              };
                              updateFormField('languages', updatedLanguages);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {proficiencyLevels.map(level => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeLanguage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card className="p-8 flex flex-col items-center justify-center text-center space-y-3 border-dashed">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">
                No languages added yet.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Add languages to showcase your communication abilities.
              </p>
            </div>
          </Card>
        )}

        {/* Tips */}
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4">
            <h3 className="font-medium text-blue-800 mb-2">Language Proficiency Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <p className="font-medium">Basic Levels:</p>
                <ul className="space-y-1 mt-1">
                  <li>• <span className="font-medium">Beginner (A1):</span> Basic phrases, simple interactions</li>
                  <li>• <span className="font-medium">Elementary (A2):</span> Simple conversations, everyday topics</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Intermediate Levels:</p>
                <ul className="space-y-1 mt-1">
                  <li>• <span className="font-medium">Intermediate (B1):</span> Express opinions, discuss familiar topics</li>
                  <li>• <span className="font-medium">Upper Intermediate (B2):</span> Clear expression on a wide range of topics</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Advanced Levels:</p>
                <ul className="space-y-1 mt-1">
                  <li>• <span className="font-medium">Advanced (C1):</span> Effective use for social, academic and professional purposes</li>
                  <li>• <span className="font-medium">Proficient (C2):</span> Near-native level of fluency</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Native Speaker:</p>
                <ul className="space-y-1 mt-1">
                  <li>• Mother tongue or language spoken from early childhood with complete fluency</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default LanguagesStep;