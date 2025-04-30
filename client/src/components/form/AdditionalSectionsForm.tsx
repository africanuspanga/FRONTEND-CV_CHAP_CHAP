import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { CVData } from '@shared/schema';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AdditionalSectionsFormProps {
  defaultValues: {
    hobbies: string;
    projects?: { id: string; name: string; description?: string; url?: string }[];
    certifications?: { id: string; name: string; issuer?: string; date?: string }[];
  };
  onSubmit: (data: Partial<CVData>) => void;
  onBack: () => void;
  onNext: () => void;
}

const formSchema = z.object({
  hobbies: z.string().max(500, "Hobbies section should be 500 characters or less").optional(),
  portfolioUrl: z.string().url("Please enter a valid URL").optional().or(z.string().length(0))
});

type FormValues = z.infer<typeof formSchema>;

const AdditionalSectionsForm: React.FC<AdditionalSectionsFormProps> = ({
  defaultValues,
  onSubmit,
  onBack,
  onNext
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hobbies: defaultValues.hobbies || '',
      portfolioUrl: ''
    },
    mode: 'onChange'
  });

  const { handleSubmit } = form;

  const handleFormSubmit = (data: FormValues) => {
    onSubmit({
      hobbies: data.hobbies,
      // Could add additional sections here in the future
    });
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-darkText mb-4">Additional Information</h2>
      <p className="text-lightText mb-6">Add any additional information that could strengthen your CV (optional).</p>
      
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Hobbies & Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="hobbies"
                render={({ field }) => (
                  <FormItem>
                    <FormDescription>
                      Share activities or interests that showcase your personality or relevant soft skills.
                    </FormDescription>
                    <FormControl>
                      <Textarea 
                        {...field}
                        placeholder="e.g., Photography, hiking, volunteering at local community center, playing chess"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Portfolio/Website</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="portfolioUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormDescription>
                      Add a link to your portfolio, personal website, or professional profile.
                    </FormDescription>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., https://yourportfolio.com"
                        type="url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
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
                handleSubmit(handleFormSubmit)();
                onNext();
              }}
            >
              Next: Final Preview
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdditionalSectionsForm;
