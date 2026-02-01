"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCVStore } from "@/stores/cv-store";
import { ArrowRight, ChevronLeft, User, Mail, Phone, MapPin, Briefcase, Globe, Linkedin } from "lucide-react";
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

  const steps = [
    { num: 1, label: 'Personal', active: true },
    { num: 2, label: 'Experience', active: false },
    { num: 3, label: 'Education', active: false },
    { num: 4, label: 'Skills', active: false },
    { num: 5, label: 'Summary', active: false },
    { num: 6, label: 'Preview', active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={handleBack} 
              className="p-2 -ml-2 text-gray-600 hover:text-cv-blue-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Personal Info</h1>
            <div className="w-10"></div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step.active 
                    ? 'bg-cv-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.num}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-4 sm:w-8 h-0.5 mx-1 ${
                    step.active ? 'bg-cv-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="px-4 py-6 pb-28">
        <div className="max-w-lg mx-auto">
          {/* Section Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Tell us about yourself
            </h2>
            <p className="text-gray-500 text-sm">
              This information will appear at the top of your CV
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Photo Upload */}
            {hasPhoto && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <PhotoUpload
                  currentPhotoUrl={cvData.personalInfo.photoUrl}
                  onPhotoUploaded={handlePhotoUploaded}
                  onPhotoRemoved={handlePhotoRemoved}
                />
              </div>
            )}

            {/* Name Fields */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-2 text-cv-blue-600 mb-2">
                <User className="h-5 w-5" />
                <span className="font-semibold text-sm">Basic Information</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="John"
                    className="h-12 text-base rounded-xl border-gray-200 focus:border-cv-blue-500 focus:ring-cv-blue-500"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Mwangi"
                    className="h-12 text-base rounded-xl border-gray-200 focus:border-cv-blue-500 focus:ring-cv-blue-500"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="professionalTitle" className="text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    Professional Title
                  </div>
                </Label>
                <Input
                  id="professionalTitle"
                  {...register("professionalTitle")}
                  placeholder="e.g., Customer Service Manager"
                  className="h-12 text-base rounded-xl border-gray-200 focus:border-cv-blue-500 focus:ring-cv-blue-500"
                />
                {errors.professionalTitle && (
                  <p className="text-xs text-red-500">{errors.professionalTitle.message}</p>
                )}
              </div>
            </div>

            {/* Contact Fields */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-2 text-cv-blue-600 mb-2">
                <Mail className="h-5 w-5" />
                <span className="font-semibold text-sm">Contact Details</span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    Email Address
                  </div>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john@example.com"
                  className="h-12 text-base rounded-xl border-gray-200 focus:border-cv-blue-500 focus:ring-cv-blue-500"
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    Phone Number
                  </div>
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+255 xxx xxx xxx"
                  className="h-12 text-base rounded-xl border-gray-200 focus:border-cv-blue-500 focus:ring-cv-blue-500"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    Location
                  </div>
                </Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="e.g., Dar es Salaam, Tanzania"
                  className="h-12 text-base rounded-xl border-gray-200 focus:border-cv-blue-500 focus:ring-cv-blue-500"
                />
                {errors.location && (
                  <p className="text-xs text-red-500">{errors.location.message}</p>
                )}
              </div>
            </div>

            {/* Social Links (Optional) */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Globe className="h-5 w-5" />
                <span className="font-semibold text-sm">Online Presence (Optional)</span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="linkedin" className="text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-gray-400" />
                    LinkedIn
                  </div>
                </Label>
                <Input
                  id="linkedin"
                  {...register("linkedin")}
                  placeholder="linkedin.com/in/yourprofile"
                  className="h-12 text-base rounded-xl border-gray-200 focus:border-cv-blue-500 focus:ring-cv-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    Website
                  </div>
                </Label>
                <Input
                  id="website"
                  {...register("website")}
                  placeholder="yourwebsite.com"
                  className="h-12 text-base rounded-xl border-gray-200 focus:border-cv-blue-500 focus:ring-cv-blue-500"
                />
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="max-w-lg mx-auto">
          <Button 
            onClick={handleSubmit(onSubmit)}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 active:bg-cv-blue-800 py-6 text-lg rounded-2xl font-semibold"
          >
            Continue to Experience
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
