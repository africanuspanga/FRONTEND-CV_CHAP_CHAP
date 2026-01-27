"use client";

import { Button } from "@/components/ui/button";
import { TEMPLATES, type TemplateConfig } from "@/types/templates";
import { useCVStore } from "@/stores/cv-store";
import { CheckCircle, ArrowLeft, ArrowRight, Camera } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import { TemplatePreview } from "@/components/templates/preview";
import { sampleCVData } from "@/lib/sample-data";

type FilterType = 'all' | 'with-photo' | 'without-photo';
type CategoryType = 'all' | 'professional' | 'modern' | 'creative' | 'minimal';

const colorOptions = [
  { name: 'Default', value: null },
  { name: 'Teal', value: '#0891B2' },
  { name: 'Navy', value: '#1E3A5F' },
  { name: 'Forest', value: '#166534' },
  { name: 'Orange', value: '#E07A38' },
  { name: 'Purple', value: '#7C3AED' },
  { name: 'Rose', value: '#BE185D' },
  { name: 'Gold', value: '#D4A056' },
];

function LiveTemplateCard({ 
  template, 
  isSelected, 
  onSelect,
  previewColor,
}: { 
  template: TemplateConfig; 
  isSelected: boolean;
  onSelect: () => void;
  previewColor: string | null;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const templateWidth = 794;
        const newScale = containerWidth / templateWidth;
        setScale(newScale);
      }
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div
      className={`group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        ref={containerRef}
        className="relative overflow-hidden bg-white"
        style={{ paddingBottom: '141.4%' }}
      >
        <div 
          className="absolute top-0 left-0 origin-top-left pointer-events-none"
          style={{ 
            transform: `scale(${scale})`,
            width: '794px',
            height: '1123px',
          }}
        >
          <TemplatePreview
            templateId={template.id}
            data={sampleCVData}
            scale={1}
            colorOverride={previewColor}
          />
        </div>
        
        {isSelected && (
          <div className="absolute top-2 left-2 bg-blue-500 rounded-full p-1 z-10">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
        )}

        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity z-10 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <span className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium text-sm">
            Use This Template
          </span>
        </div>

        {template.hasPhoto && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
            <Camera className="h-3 w-3" />
            Photo
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-gray-900">{template.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
          {template.description}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span 
            className="w-3 h-3 rounded-full border border-gray-200" 
            style={{ backgroundColor: previewColor || template.primaryColor }}
          />
          <span className="text-xs text-gray-400 capitalize">{template.category}</span>
        </div>
      </div>
    </div>
  );
}

export default function TemplatePage() {
  const router = useRouter();
  const { templateId, setTemplateId, setSelectedColor, setCurrentStep } = useCVStore();
  const [photoFilter, setPhotoFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryType>('all');
  const [previewColor, setPreviewColor] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(template => {
      const photoMatch = 
        photoFilter === 'all' ||
        (photoFilter === 'with-photo' && template.hasPhoto) ||
        (photoFilter === 'without-photo' && !template.hasPhoto);
      
      const categoryMatch = 
        categoryFilter === 'all' || 
        template.category === categoryFilter;
      
      return photoMatch && categoryMatch;
    });
  }, [photoFilter, categoryFilter]);

  const handleSelectTemplate = (id: string) => {
    setTemplateId(id);
    setSelectedColor(previewColor);
  };

  const handleContinue = () => {
    setCurrentStep('personal');
    router.push('/personal');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">Choose Your Template</h1>
              <p className="text-sm text-gray-500">Step 1 of 8</p>
            </div>
            <div className="w-24"></div>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2 items-center">
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
                      {filter === 'all' ? `All (${TEMPLATES.length})` : 
                       filter === 'with-photo' ? `Photo (${TEMPLATES.filter(t => t.hasPhoto).length})` : 
                       `No Photo (${TEMPLATES.filter(t => !t.hasPhoto).length})`}
                    </button>
                  ))}
                </div>
              </div>

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

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:inline">Color:</span>
              <div className="flex gap-1">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => {
                      setPreviewColor(opt.value);
                      setSelectedColor(opt.value);
                    }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                      previewColor === opt.value 
                        ? 'border-gray-900 scale-110' 
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: opt.value || '#666' }}
                    title={opt.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredTemplates.length} of {TEMPLATES.length} templates
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {filteredTemplates.map((template) => (
            <LiveTemplateCard
              key={template.id}
              template={template}
              isSelected={templateId === template.id}
              onSelect={() => handleSelectTemplate(template.id)}
              previewColor={previewColor}
            />
          ))}
        </div>

        <div className="flex justify-center sticky bottom-4">
          <Button 
            size="lg" 
            onClick={handleContinue}
            disabled={!templateId}
            className="px-8 shadow-lg"
          >
            Continue to Personal Info
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
