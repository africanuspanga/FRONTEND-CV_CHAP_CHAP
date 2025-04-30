import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Sparkles } from 'lucide-react';

interface SummaryFormProps {
  defaultValue: string;
  onSubmit: (data: { summary: string }) => void;
  onBack: () => void;
  onNext: () => void;
}

const formSchema = z.object({
  summary: z.string().max(500, "Summary should be 500 characters or less").optional()
});

type FormValues = z.infer<typeof formSchema>;

const SummaryForm: React.FC<SummaryFormProps> = ({
  defaultValue,
  onSubmit,
  onBack,
  onNext
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      summary: defaultValue || ''
    },
    mode: 'onChange'
  });

  const { handleSubmit, watch } = form;
  const summary = watch('summary') || '';
  const characterCount = summary.length;

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data as { summary: string });
  };

  const handleAIEnhancement = () => {
    // This would be implemented with actual AI integration
    // For now, just add a placeholder enhanced summary
    const currentSummary = form.getValues('summary') || '';
    
    if (currentSummary.trim()) {
      form.setValue('summary', `${currentSummary.trim()} (Enhanced with professional language and impactful statements to highlight your career achievements and skills.)`, { shouldValidate: true });
    } else {
      form.setValue('summary', 'Dedicated professional with a track record of success in project implementation, team collaboration, and delivering measurable results. Combines technical expertise with strong communication skills to bridge gaps between business needs and technical solutions.', { shouldValidate: true });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-darkText mb-4">Professional Summary</h2>
      <p className="text-lightText mb-6">Write a concise summary highlighting your key qualifications, experience, and career goals. This will appear at the top of your CV.</p>
      
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Career Summary</FormLabel>
                <FormDescription>
                  Summarize your professional background, key skills, and what you bring to potential employers in 2-4 sentences.
                </FormDescription>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="e.g., Experienced project manager with 5+ years in software development. Strong track record in leading cross-functional teams and delivering projects on time and within budget. Skilled in Agile methodologies and stakeholder communication." 
                    className="min-h-[150px]"
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 gap-1"
                      onClick={handleAIEnhancement}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Enhance with AI
                    </Button>
                  </div>
                  <div>{characterCount}/500 characters</div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
              Next: Languages
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SummaryForm;
