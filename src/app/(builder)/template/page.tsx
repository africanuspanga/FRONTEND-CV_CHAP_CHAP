"use client";

import { Button } from "@/components/ui/button";
import { TEMPLATES, type TemplateConfig } from "@/types/templates";
import { useCVStore } from "@/stores/cv-store";
import { CheckCircle, ArrowLeft, ArrowRight, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect, useRef, Suspense } from "react";
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
  onSelect,
  previewColor,
}: { 
  template: TemplateConfig; 
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
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
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

        {/* Hover overlay with button */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col items-center justify-end pb-6 transition-opacity z-10 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <span className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold text-sm shadow-lg flex items-center gap-2">
            Use This Template
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>

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

function TemplatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUploadMode = searchParams.get('upload') === 'true';
  
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
    if (isUploadMode) {
      router.push('/upload');
    } else {
      setCurrentStep('personal');
      router.push('/personal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-gray-100">
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/create/choose" className="flex items-center gap-2 text-gray-600 hover:text-cv-blue-600">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-heading font-bold text-gray-900">Choose Your Template</h1>
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
              onSelect={() => handleSelectTemplate(template.id)}
              previewColor={previewColor}
            />
          ))}
        </div>

        {/* Upload Mode Indicator */}
        {isUploadMode && (
          <div className="mb-6 bg-gradient-to-r from-cv-blue-600 to-cv-blue-700 rounded-2xl p-4 md:p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Upload Mode</h3>
                <p className="text-blue-100 text-sm">
                  Select a template, then upload your existing CV to extract data
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Option Banner - only show when NOT in upload mode */}
        {!isUploadMode && (
          <div className="mb-8 bg-gradient-to-r from-cv-blue-600 to-cv-blue-700 rounded-2xl p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Have an existing CV?</h3>
                  <p className="text-blue-100">
                    Upload it and we'll extract all your information automatically
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  if (templateId) {
                    router.push('/upload');
                  } else {
                    alert('Please select a template first');
                  }
                }}
                className="bg-white text-cv-blue-600 hover:bg-blue-50 px-6 font-semibold"
              >
                Upload CV →
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function TemplatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-gray-100 flex items-center justify-center">Loading...</div>}>
      <TemplatePageContent />
    </Suspense>
  );
}
