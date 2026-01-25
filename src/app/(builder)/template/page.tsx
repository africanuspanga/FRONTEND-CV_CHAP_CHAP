"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TEMPLATES, type TemplateConfig } from "@/types/cv";
import { useCVStore } from "@/stores/cv-store";
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
              background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.accent})` 
            }}
          >
            {isSelected && (
              <div className="absolute top-3 right-3">
                <CheckCircle className="h-8 w-8 text-white" />
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
          <CardDescription>{template.description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function TemplatePage() {
  const router = useRouter();
  const { templateId, setTemplateId, setCurrentStep } = useCVStore();

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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Select a Professional Template
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose a design that best represents your professional style. 
              All templates are optimized for ATS systems and hiring managers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {TEMPLATES.map((template) => (
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
