import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCVForm } from '@/contexts/cv-form-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertCircle, Lightbulb, Wand2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { enhanceProfessionalSummary } from '@/lib/openai-service';
import { useAIStatus } from '@/hooks/use-ai-status';
import { debounce } from '@/lib/utils';

// Form schema definition
const formSchema = z.object({
  summary: z.string().min(1, "Professional summary is required")
    .max(2000, "Summary should be less than 2000 characters"),
});

type FormValues = z.infer<typeof formSchema>;

// Example summaries for different tones
const exampleSummaries = {
  professional: "Dedicated software engineer with 5+ years of experience developing scalable web applications using React, Node.js, and AWS. Proven track record of delivering high-quality code on time and mentoring junior developers. Passionate about creating intuitive user experiences and optimizing application performance.",
  
  confident: "Results-driven software engineer who consistently delivers innovative solutions to complex problems. Known for taking ownership of projects and driving them to successful completion while exceeding client expectations. Expert in React and Node.js with a talent for quickly mastering new technologies.",
  
  concise: "Software engineer specializing in full-stack web development with React and Node.js. 5+ years of experience building scalable applications and optimizing performance. Strong team collaborator focused on delivering quality solutions on time.",
};

const toneLabels = {
  professional: "Professional",
  confident: "Confident",
  concise: "Concise"
};

const SummaryStep: React.FC = () => {
  const { formData, updateFormField } = useCVForm();
  const [summaryLength, setSummaryLength] = useState(0);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [isEnhanceDialogOpen, setIsEnhanceDialogOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedSummary, setEnhancedSummary] = useState<string>('');
  const { hasOpenAI, isLoading: isCheckingAI } = useAIStatus();
  const { toast } = useToast();
  
  // Initialize form with values from context
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      summary: formData.summary || '',
    },
    mode: 'onChange',
  });

  // Update character count when summary changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'summary') {
        setSummaryLength(value.summary?.length || 0);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    updateFormField('summary', data.summary);
  };

  // Debounced update function for real-time preview
  const debouncedUpdate = debounce((value: string) => {
    updateFormField('summary', value);
  }, 300);

  // Apply example summary based on selected tone
  const applyTone = (tone: string) => {
    // Only use example summaries as tone references, not as actual content
    setSelectedTone(tone);
    
    // We don't actually set the summary text to the example
    // but rather show it as a reference for the user
  };

  // Handle AI enhancement of summary
  const handleEnhanceSummary = async () => {
    // Get current summary text from form
    const currentSummary = form.getValues('summary');
    
    // Validate that there's text to enhance
    if (!currentSummary || currentSummary.trim().length < 10) {
      toast({
        title: 'Summary Too Short',
        description: 'Please add more content to your summary before enhancing it.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsEnhancing(true);
    try {
      // Call the OpenAI service to enhance the summary
      const jobTitle = formData.personalInfo?.professionalTitle || '';
      const yearsOfExperience = formData.workExperiences && formData.workExperiences.length > 0 
        ? calculateTotalYearsExperience(formData.workExperiences) 
        : undefined;
      
      const enhanced = await enhanceProfessionalSummary(
        currentSummary,
        jobTitle,
        yearsOfExperience
      );
      
      setEnhancedSummary(enhanced);
      setIsEnhanceDialogOpen(true);
    } catch (error) {
      toast({
        title: 'Enhancement Failed',
        description: error instanceof Error ? error.message : 'Failed to enhance your summary. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsEnhancing(false);
    }
  };
  
  // Calculate total years of experience from work history
  const calculateTotalYearsExperience = (workExperiences: any[]) => {
    if (!workExperiences || workExperiences.length === 0) return undefined;
    
    let totalMonths = 0;
    
    workExperiences.forEach((job: any) => {
      if (job.startDate) {
        const startDate = new Date(job.startDate);
        const endDate = job.current ? new Date() : job.endDate ? new Date(job.endDate) : new Date();
        
        // Calculate months between dates
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                       (endDate.getMonth() - startDate.getMonth());
        
        if (months > 0) totalMonths += months;
      }
    });
    
    // Convert months to years (rounded to nearest half year)
    return Math.round(totalMonths / 6) / 2;
  };
  
  // Apply the enhanced summary
  const handleApplyEnhancedSummary = () => {
    form.setValue('summary', enhancedSummary);
    updateFormField('summary', enhancedSummary);
    setIsEnhanceDialogOpen(false);
    toast({
      title: 'Summary Enhanced',
      description: 'Your professional summary has been enhanced with AI.',
    });
  };
  
  // Handle summary text change with debounce
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    form.setValue('summary', value);
    debouncedUpdate(value);
  };

  // Length-based color indicator
  const getLengthColor = () => {
    if (summaryLength === 0) return 'text-gray-400';
    if (summaryLength < 100) return 'text-red-500';
    if (summaryLength > 1000) return 'text-amber-500';
    return 'text-green-500';
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* AI Enhancement Dialog */}
        <Dialog open={isEnhanceDialogOpen} onOpenChange={setIsEnhanceDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                AI Enhanced Summary
              </DialogTitle>
              <DialogDescription>
                Review your AI-enhanced professional summary below.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="border rounded-md p-3 bg-muted/50">
                <h3 className="text-sm font-medium mb-2">Original Summary</h3>
                <p className="text-sm text-muted-foreground">
                  {form.getValues('summary')}
                </p>
              </div>
              
              <div className="border rounded-md p-3 bg-green-50">
                <h3 className="text-sm font-medium mb-2 text-green-800">Enhanced Summary</h3>
                <Textarea 
                  value={enhancedSummary} 
                  onChange={(e) => setEnhancedSummary(e.target.value)}
                  className="min-h-[120px] bg-white"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEnhanceDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleApplyEnhancedSummary}>
                  Apply Enhanced Summary
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Introduction */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Write a professional summary that highlights your key qualifications, experience, and career objectives.
            This appears at the top of your CV and makes a strong first impression.
          </p>
        </div>

        {/* Summary Input */}
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Summary <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write a concise summary of your professional background, key skills, and what you bring to the table..."
                  className="min-h-[200px] resize-y"
                  {...field}
                  onChange={handleSummaryChange}
                />
              </FormControl>
              <div className="flex justify-between">
                <FormDescription>
                  Aim for 100-200 words that capture your professional profile
                </FormDescription>
                <span className={`text-xs ${getLengthColor()}`}>
                  {summaryLength} characters
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tone Examples */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h3 className="font-medium">Example Tones</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Here are examples of different tones to help guide your writing. Select one to see an example.
            </p>
            
            <Tabs defaultValue="professional" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                {Object.entries(toneLabels).map(([key, label]) => (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    onClick={() => applyTone(key)}
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(exampleSummaries).map(([key, summary]) => (
                <TabsContent key={key} value={key} className="mt-0">
                  <Card className="border-dashed">
                    <CardContent className="p-3">
                      <p className="text-sm italic text-muted-foreground">
                        "{summary}"
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="mt-4 flex justify-end">
              <Button 
                type="button" 
                variant="secondary" 
                size="sm"
                onClick={handleEnhanceSummary}
                disabled={isEnhancing || isCheckingAI}
                className="text-xs"
              >
                {isEnhancing ? (
                  <>
                    <Wand2 className="mr-1 h-3 w-3 animate-pulse" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-1 h-3 w-3" />
                    AI Enhancement
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Alert className="bg-blue-50 border-blue-100">
          <AlertCircle className="h-4 w-4 text-blue-700" />
          <AlertTitle className="text-blue-800">Writing Tips</AlertTitle>
          <AlertDescription className="text-blue-700 text-sm">
            <ul className="space-y-1 mt-2">
              <li>• Focus on your most impressive achievements and skills</li>
              <li>• Tailor your summary to the job you're applying for</li>
              <li>• Use strong action verbs and concrete numbers when possible</li>
              <li>• Avoid clichés and generic statements</li>
              <li>• Keep it concise - ideally 3-5 sentences</li>
            </ul>
          </AlertDescription>
        </Alert>
      </form>
    </Form>
  );
};

export default SummaryStep;