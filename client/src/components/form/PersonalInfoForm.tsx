import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { personalInfoSchema, PersonalInfo } from '@shared/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface PersonalInfoFormProps {
  defaultValues: PersonalInfo;
  onSubmit: (data: PersonalInfo) => void;
  onBack: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  defaultValues,
  onSubmit,
  onBack
}) => {
  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
    mode: 'onChange'
  });

  const { handleSubmit, formState, watch } = form;
  const firstName = watch('firstName') || '';
  const lastName = watch('lastName') || '';

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-8">
          <h2 className="text-xl font-medium text-darkText mb-4">Personal Information</h2>
          <p className="text-lightText mb-6">Provide your personal and contact details for your CV.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., John"
                      {...field}
                      className="w-full rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
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
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Kimaro"
                      {...field}
                      className="w-full rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      className="w-full rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="e.g., +255782345168"
                      {...field}
                      className="w-full rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Dar es Salaam, Tanzania"
                      {...field}
                      className="w-full rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Software Developer"
                      {...field}
                      className="w-full rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="col-span-2">
              <FormLabel>Profile Picture (optional)</FormLabel>
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={defaultValues.profilePicture || ''} alt={`${firstName} ${lastName}`} />
                  <AvatarFallback>{getInitials(firstName, lastName)}</AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  className="py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-darkText hover:bg-gray-50"
                >
                  Upload Photo
                </Button>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Website/Portfolio (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="e.g., https://yourportfolio.com"
                      {...field}
                      className="w-full rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>LinkedIn (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="e.g., https://linkedin.com/in/yourname"
                      {...field}
                      className="w-full rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={!formState.isValid}
            >
              Next: Work Experience
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PersonalInfoForm;
