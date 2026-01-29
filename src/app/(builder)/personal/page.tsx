"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { PhotoUpload } from "@/components/builder/photo-upload";
import { TEMPLATES } from "@/types/templates";

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  professionalTitle: z.string().min(1, "Professional title is required"),
  location: z.string().min(1, "Location is required"),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

export default function PersonalInfoPage() {
  const router = useRouter();
  const { cvData, templateId, updatePersonalInfo, setCurrentStep } = useCVStore();

  const selectedTemplate = TEMPLATES.find(t => t.id === templateId);
  const hasPhoto = selectedTemplate?.hasPhoto ?? false;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: cvData.personalInfo,
  });

  useEffect(() => {
    reset(cvData.personalInfo);
  }, [cvData.personalInfo, reset]);

  const onSubmit = (data: PersonalInfoForm) => {
    updatePersonalInfo(data);
    setCurrentStep('experience');
    router.push('/experience');
  };

  const handleBack = () => {
    setCurrentStep('template');
    router.push('/template');
  };

  const handlePhotoUploaded = (url: string) => {
    updatePersonalInfo({ photoUrl: url });
  };

  const handlePhotoRemoved = () => {
    updatePersonalInfo({ photoUrl: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-white">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-4 flex items-center justify-between">
          <button onClick={handleBack} className="p-2 -ml-2 text-gray-600 hover:text-cv-blue-600 active:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-xs text-gray-500">Step 1 of 6</p>
            <h1 className="text-lg font-heading font-bold text-gray-900">Personal Info</h1>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="px-4 py-6 pb-32">
        <div className="max-w-lg mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">
              Tell us about yourself
            </h2>
            <p className="text-gray-600 text-sm">
              This information will appear at the top of your CV
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {hasPhoto && (
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <PhotoUpload
                  currentPhotoUrl={cvData.personalInfo.photoUrl}
                  onPhotoUploaded={handlePhotoUploaded}
                  onPhotoRemoved={handlePhotoRemoved}
                />
              </div>
            )}

            <div className="bg-white rounded-xl p-5 shadow-sm space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="John"
                    className="h-12 text-base"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Mwangi"
                    className="h-12 text-base"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="professionalTitle" className="text-sm font-medium">Professional Title *</Label>
                <Input
                  id="professionalTitle"
                  {...register("professionalTitle")}
                  placeholder="e.g., Customer Service Manager"
                  className="h-12 text-base"
                />
                {errors.professionalTitle && (
                  <p className="text-sm text-red-500">{errors.professionalTitle.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john@example.com"
                  className="h-12 text-base"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+255 xxx xxx xxx"
                  className="h-12 text-base"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">Location *</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="e.g., Dar es Salaam, Tanzania"
                  className="h-12 text-base"
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm font-medium">LinkedIn (optional)</Label>
                <Input
                  id="linkedin"
                  {...register("linkedin")}
                  placeholder="linkedin.com/in/yourprofile"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium">Website (optional)</Label>
                <Input
                  id="website"
                  {...register("website")}
                  placeholder="yourwebsite.com"
                  className="h-12 text-base"
                />
              </div>
            </div>
          </form>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="max-w-lg mx-auto">
          <Button 
            onClick={handleSubmit(onSubmit)}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 active:bg-cv-blue-800 py-6 text-lg rounded-xl"
          >
            Next: Experience
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
