import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCVForm } from '@/contexts/cv-form-context';
import { personalInfoSchema } from '@shared/schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Extend the schema with client-side validation
const formSchema = personalInfoSchema.extend({
  // Add any additional client-side validation if needed
});

type FormValues = z.infer<typeof formSchema>;

const PersonalInfoStep: React.FC = () => {
  const { formData, updateFormField } = useCVForm();
  const isMobile = useIsMobile();
  
  // Get default values from context
  const defaultValues: FormValues = {
    firstName: formData.personalInfo.firstName || '',
    lastName: formData.personalInfo.lastName || '',
    email: formData.personalInfo.email || '',
    phone: formData.personalInfo.phone || '',
    jobTitle: formData.personalInfo.jobTitle || '',
    location: formData.personalInfo.location || '',
    website: formData.personalInfo.website || '',
    linkedin: formData.personalInfo.linkedin || '',
    profilePicture: formData.personalInfo.profilePicture || '',
  };

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    updateFormField('personalInfo', data);
    // Note: Navigation is handled by the parent component
  };

  // Update form data on change to provide real-time preview
  const handleFieldChange = (field: keyof FormValues, value: string) => {
    // Update the form state
    form.setValue(field, value);
    
    // Update the global state for preview
    const updatedPersonalInfo = { 
      ...formData.personalInfo, 
      [field]: value 
    };
    updateFormField('personalInfo', updatedPersonalInfo);
  };

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 px-1 sm:px-0">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={formData.personalInfo.profilePicture || ''} alt="Profile" />
              <AvatarFallback className="bg-primary text-white">
                {getInitials(formData.personalInfo.firstName, formData.personalInfo.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">Profile Photo</h3>
              <p className="text-sm text-muted-foreground">
                Upload a professional photo (optional)
              </p>
              {/* Photo upload functionality would go here */}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your first name" 
                      {...field} 
                      onChange={(e) => handleFieldChange('firstName', e.target.value)}
                      className="h-10 text-base sm:h-10 sm:text-sm"
                      autoCapitalize="words"
                      inputMode="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your last name" 
                      {...field} 
                      onChange={(e) => handleFieldChange('lastName', e.target.value)}
                      className="h-10 text-base sm:h-10 sm:text-sm"
                      autoCapitalize="words"
                      inputMode="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Senior Software Engineer" 
                    {...field}
                    onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                    className="h-10 text-base sm:h-10 sm:text-sm"
                    autoCapitalize="words"
                    inputMode="text"
                  />
                </FormControl>
                <FormDescription>
                  Your current job title or the position you're seeking
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Information Section */}
        <Card className="p-3 sm:p-4">
          <h3 className="font-medium text-lg mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Your email address" 
                        {...field}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        className="h-10 text-base sm:h-10 sm:text-sm"
                        autoCapitalize="none"
                        autoCorrect="off"
                        inputMode="email"
                        spellCheck="false"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your phone number" 
                        {...field}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        className="h-10 text-base sm:h-10 sm:text-sm"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        pattern="[0-9+\-\s]*"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Dar es Salaam, Tanzania" 
                      {...field}
                      onChange={(e) => handleFieldChange('location', e.target.value)}
                      className="h-10 text-base sm:h-10 sm:text-sm"
                      autoCapitalize="words"
                      inputMode="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Online Profiles Section */}
        <Card className="p-4">
          <h3 className="font-medium text-lg mb-4">Online Profiles</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://linkedin.com/in/username" 
                      {...field}
                      onChange={(e) => handleFieldChange('linkedin', e.target.value)}
                      className="h-10 text-base sm:h-10 sm:text-sm"
                      autoCapitalize="none"
                      autoCorrect="off"
                      inputMode="url"
                      spellCheck="false"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Website/Portfolio</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://yourwebsite.com" 
                      {...field}
                      onChange={(e) => handleFieldChange('website', e.target.value)}
                      className="h-10 text-base sm:h-10 sm:text-sm"
                      autoCapitalize="none"
                      autoCorrect="off"
                      inputMode="url"
                      spellCheck="false"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>
      </form>
    </Form>
  );
};

export default PersonalInfoStep;