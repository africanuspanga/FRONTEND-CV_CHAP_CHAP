"use client";

import { Button } from "@/components/ui/button";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, ArrowRight, Plus, Languages, Award, Link2, Medal, Rocket, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const sections = [
  {
    id: 'languages',
    title: 'Languages',
    icon: Languages,
    path: '/additional/languages',
    color: 'bg-amber-50',
  },
  {
    id: 'certifications',
    title: 'Certifications and Licenses',
    icon: Award,
    path: '/additional/certifications',
    color: 'bg-green-50',
  },
  {
    id: 'links',
    title: 'Websites and Social Links',
    icon: Link2,
    path: '/additional/links',
    color: 'bg-blue-50',
  },
  {
    id: 'accomplishments',
    title: 'Awards, Accomplishments, and Honors',
    icon: Medal,
    path: '/additional/accomplishments',
    color: 'bg-purple-50',
  },
];

export default function AdditionalSectionsPage() {
  const router = useRouter();
  const { cvData, setCurrentStep } = useCVStore();

  const handleBack = () => {
    setCurrentStep('references');
    router.push('/references');
  };

  const handleContinue = () => {
    setCurrentStep('preview');
    router.push('/preview');
  };

  const handleSectionClick = (path: string) => {
    router.push(path);
  };

  const getSectionCount = (sectionId: string) => {
    switch (sectionId) {
      case 'languages':
        return cvData.languages?.length || 0;
      case 'certifications':
        return cvData.certifications?.length || 0;
      case 'links':
        return cvData.socialLinks?.length || 0;
      case 'accomplishments':
        return cvData.accomplishments?.length || 0;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-white">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-cv-blue-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-xs text-gray-500">Step 7 of 8</p>
            <h1 className="text-lg font-heading font-bold text-gray-900">Additional Sections</h1>
          </div>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              Add more details
            </h2>
            <p className="text-gray-600">
              Show your expertise and passion! Here are some popular ones included by other candidates.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {sections.map((section, index) => {
              const count = getSectionCount(section.id);
              return (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSectionClick(section.path)}
                  className={`${section.color} rounded-2xl p-6 text-left hover:shadow-md transition-shadow relative group`}
                >
                  <div className="flex flex-col items-center text-center">
                    <section.icon className="h-10 w-10 text-gray-700 mb-3" />
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                      {section.title}
                    </h3>
                    {count > 0 && (
                      <span className="absolute top-3 right-3 bg-cv-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {count}
                      </span>
                    )}
                    <Plus className="h-5 w-5 text-cv-blue-600 mt-3 opacity-60 group-hover:opacity-100" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-lg">
          <Button 
            onClick={handleContinue}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl"
          >
            Next: Finalize CV
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
