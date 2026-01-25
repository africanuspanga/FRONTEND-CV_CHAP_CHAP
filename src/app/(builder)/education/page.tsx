"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, ArrowRight, Plus, Trash2, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EducationPage() {
  const router = useRouter();
  const { 
    cvData, 
    addEducation, 
    updateEducation, 
    removeEducation, 
    setCurrentStep 
  } = useCVStore();

  const handleBack = () => {
    setCurrentStep('experience');
    router.push('/experience');
  };

  const handleContinue = () => {
    setCurrentStep('skills');
    router.push('/skills');
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
            <h1 className="text-xl font-bold">Education</h1>
            <p className="text-sm text-gray-500">Step 4 of 8</p>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Add Your Education
            </h2>
            <p className="text-gray-600">
              Include your degrees, certifications, and relevant training
            </p>
          </div>

          {cvData.education.length === 0 ? (
            <Card className="mb-6">
              <CardContent className="py-12 text-center">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No education added yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Add your educational background
                </p>
                <Button onClick={() => addEducation()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 mb-6">
              {cvData.education.map((edu, index) => (
                <Card key={edu.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">
                      Education {index + 1}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEducation(edu.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Degree/Certificate *</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          placeholder="e.g., Bachelor of Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Field of Study *</Label>
                        <Input
                          value={edu.fieldOfStudy}
                          onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                          placeholder="e.g., Computer Science"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Institution *</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                          placeholder="e.g., University of Dar es Salaam"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Graduation Date</Label>
                        <Input
                          type="month"
                          value={edu.graduationDate}
                          onChange={(e) => updateEducation(edu.id, { graduationDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={() => addEducation()} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Education
              </Button>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
            <Button onClick={handleContinue}>
              Continue to Skills
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
