"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

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
  const { cvData, updatePersonalInfo, setCurrentStep } = useCVStore();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold">Personal Information</h1>
            <p className="text-sm text-gray-500">Step 2 of 8</p>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Tell Us About Yourself</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professionalTitle">Professional Title *</Label>
                  <Input
                    id="professionalTitle"
                    {...register("professionalTitle")}
                    placeholder="e.g., Software Engineer, Marketing Manager"
                  />
                  {errors.professionalTitle && (
                    <p className="text-sm text-red-500">{errors.professionalTitle.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="+255 xxx xxx xxx"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="e.g., Dar es Salaam, Tanzania"
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500">{errors.location.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn (optional)</Label>
                    <Input
                      id="linkedin"
                      {...register("linkedin")}
                      placeholder="linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website (optional)</Label>
                    <Input
                      id="website"
                      {...register("website")}
                      placeholder="yourwebsite.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" size="lg">
                    Continue to Work Experience
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
