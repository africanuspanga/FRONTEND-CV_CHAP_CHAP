"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCVStore } from "@/stores/cv-store";
import { TEMPLATES } from "@/types/templates";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function PreviewPage() {
  const router = useRouter();
  const { cvData, templateId, setCurrentStep } = useCVStore();
  const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];

  const handleBack = () => {
    setCurrentStep('summary');
    router.push('/summary');
  };

  const handleContinue = () => {
    setCurrentStep('payment');
    router.push('/payment');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr + '-01'), 'MMM yyyy');
    } catch {
      return dateStr;
    }
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
            <h1 className="text-xl font-bold">Preview Your CV</h1>
            <p className="text-sm text-gray-500">Step 7 of 8</p>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your CV Preview
            </h2>
            <p className="text-gray-600">
              Review your CV before downloading. Using template: <strong>{template.name}</strong>
            </p>
          </div>

          <Card className="p-8 mb-8 bg-white shadow-lg">
            <div style={{ fontFamily: 'Georgia, serif' }}>
              <div 
                className="border-b-4 pb-6 mb-6"
                style={{ borderColor: template.primaryColor }}
              >
                <h1 
                  className="text-3xl font-bold mb-1"
                  style={{ color: template.primaryColor }}
                >
                  {cvData.personalInfo.firstName} {cvData.personalInfo.lastName}
                </h1>
                <h2 
                  className="text-xl mb-3 text-gray-600"
                >
                  {cvData.personalInfo.professionalTitle}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
                  {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
                  {cvData.personalInfo.location && <span>{cvData.personalInfo.location}</span>}
                </div>
              </div>

              {cvData.summary && (
                <div className="mb-6">
                  <h3 
                    className="text-lg font-bold mb-2 uppercase tracking-wide"
                    style={{ color: template.primaryColor }}
                  >
                    Professional Summary
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
                </div>
              )}

              {cvData.workExperiences.length > 0 && (
                <div className="mb-6">
                  <h3 
                    className="text-lg font-bold mb-3 uppercase tracking-wide"
                    style={{ color: template.primaryColor }}
                  >
                    Work Experience
                  </h3>
                  <div className="space-y-4">
                    {cvData.workExperiences.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold">{exp.jobTitle}</h4>
                            <p className="text-gray-600">{exp.company} {exp.location && `- ${exp.location}`}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                          </span>
                        </div>
                        {exp.achievements.length > 0 && (
                          <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i}>{achievement}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cvData.education.length > 0 && (
                <div className="mb-6">
                  <h3 
                    className="text-lg font-bold mb-3 uppercase tracking-wide"
                    style={{ color: template.primaryColor }}
                  >
                    Education
                  </h3>
                  <div className="space-y-3">
                    {cvData.education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">{edu.degree} in {edu.fieldOfStudy}</h4>
                          <p className="text-gray-600">{edu.institution}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(edu.graduationDate)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cvData.skills.length > 0 && (
                <div className="mb-6">
                  <h3 
                    className="text-lg font-bold mb-3 uppercase tracking-wide"
                    style={{ color: template.primaryColor }}
                  >
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cvData.skills.map((skill) => (
                      <span 
                        key={skill.id}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ 
                          backgroundColor: template.primaryColor + '20',
                          color: template.primaryColor
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Edit CV
            </Button>
            <Button onClick={handleContinue} size="lg">
              <Download className="mr-2 h-5 w-5" />
              Download PDF
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
