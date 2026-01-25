"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TEMPLATES, type TemplateConfig } from "@/types/templates";
import { useCVStore } from "@/stores/cv-store";
import { CheckCircle, ArrowLeft, ArrowRight, Camera, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

type FilterType = 'all' | 'with-photo' | 'without-photo';
type CategoryType = 'all' | 'professional' | 'modern' | 'creative' | 'minimal';

function TemplateCard({ template, isSelected, onSelect }: { 
  template: TemplateConfig; 
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`cursor-pointer transition-all ${
          isSelected 
            ? 'ring-2 ring-primary border-primary' 
            : 'hover:shadow-lg'
        }`}
        onClick={onSelect}
      >
        <CardHeader className="p-0">
          <div 
            className="h-48 rounded-t-lg flex items-center justify-center relative"
            style={{ 
              background: `linear-gradient(135deg, ${template.primaryColor}, ${template.primaryColor}88)` 
            }}
          >
            {isSelected && (
              <div className="absolute top-3 right-3">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            )}
            {template.hasPhoto && (
              <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                <Camera className="h-3 w-3 text-white" />
                <span className="text-xs text-white">Photo</span>
              </div>
            )}
            <div className="text-white text-center p-4">
              <div className="text-2xl font-bold mb-2">{template.name}</div>
              <div className="text-sm opacity-90 capitalize">{template.category}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
          <CardDescription className="line-clamp-2">{template.description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function TemplatePage() {
  const router = useRouter();
  const { templateId, setTemplateId, setCurrentStep } = useCVStore();
  const [photoFilter, setPhotoFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryType>('all');

  const filteredTemplates = TEMPLATES.filter(template => {
    const photoMatch = 
      photoFilter === 'all' ||
      (photoFilter === 'with-photo' && template.hasPhoto) ||
      (photoFilter === 'without-photo' && !template.hasPhoto);
    
    const categoryMatch = 
      categoryFilter === 'all' || 
      template.category === categoryFilter;
    
    return photoMatch && categoryMatch;
  });

  const handleSelectTemplate = (id: string) => {
    setTemplateId(id);
  };

  const handleContinue = () => {
    setCurrentStep('personal');
    router.push('/personal');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold">Choose Your Template</h1>
            <p className="text-sm text-gray-500">Step 1 of 8</p>
          </div>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Select from 21 Professional Templates
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose a design that best represents your professional style. 
              All templates are optimized for ATS systems and hiring managers.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600">Photo:</span>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {(['all', 'with-photo', 'without-photo'] as FilterType[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPhotoFilter(filter)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      photoFilter === filter
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter === 'with-photo' ? 'With Photo' : 'No Photo'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600">Style:</span>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {(['all', 'professional', 'modern', 'creative', 'minimal'] as CategoryType[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors capitalize ${
                      categoryFilter === cat
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mb-6">
            Showing {filteredTemplates.length} of {TEMPLATES.length} templates
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={templateId === template.id}
                onSelect={() => handleSelectTemplate(template.id)}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={handleContinue}
              disabled={!templateId}
              className="px-8"
            >
              Continue to Personal Info
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
