import React from 'react';
import { Template, useTemplates } from '@/scripts/template-loader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { sortTemplatesByPriority } from '@/lib/template-priority';

interface TemplateSelectorProps {
  onSelect: (templateId: string) => void;
  selectedTemplateId?: string;
}

export function TemplateSelector({ onSelect, selectedTemplateId }: TemplateSelectorProps) {
  const { templates, loading, error } = useTemplates();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative">
              <Skeleton className="w-full h-48" />
            </div>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <p>Error loading templates: {error.message}</p>
        <p className="mt-2">Please try again later or contact support.</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
        <p>No templates available.</p>
      </div>
    );
  }

  // Sort templates according to priority order
  const sortedTemplates = sortTemplatesByPriority(templates);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedTemplates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          selected={selectedTemplateId === template.id}
          onSelect={() => onSelect(template.id)}
        />
      ))}
    </div>
  );
}

interface TemplateCardProps {
  template: Template;
  selected: boolean;
  onSelect: () => void;
}

function TemplateCard({ template, selected, onSelect }: TemplateCardProps) {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${selected ? 'border-primary border-2' : ''}`}>
      <div className="relative">
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <div className="text-xl text-gray-400">Template Preview</div>
        </div>
        {selected && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
            Selected
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        {template.description && <CardDescription>{template.description}</CardDescription>}
      </CardHeader>
      <CardFooter>
        <Button 
          onClick={onSelect} 
          variant={selected ? "outline" : "default"}
          className="w-full"
        >
          {selected ? "Selected" : "Choose Template"}
        </Button>
      </CardFooter>
    </Card>
  );
}
