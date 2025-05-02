import React, { useState } from 'react';
import { getAllTemplatesWithMetadata as getAllTemplates, TemplateWithMetadata } from '@/lib/templates-registry';
import { getTemplatesByCategory } from '@/lib/simple-template-registry';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TemplatePreviewImage from './TemplatePreviewImage';
import { 
  MoonlightSonataTemplate, 
  KaziFastaTemplate,
  JijengeClassicTemplate,
  KilimanjaroTemplate,
  BrightDiamondTemplate,
  MjenziWaTaifaTemplate,
  StreetHustlerTemplate,
  SafariOriginalTemplate,
  BigBossTemplate,
  TanzaniteProTemplate,
  MwalimuOneTemplate,
  SerengetiFlowTemplate,
  SmartBongoTemplate,
  MadiniMobTemplate,
  MkaliModernTemplate
} from '@/assets/templates';

interface TemplateSelectionGridProps {
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId?: string;
  filterCategory?: string;
}

const TemplateSelectionGrid: React.FC<TemplateSelectionGridProps> = ({
  onSelectTemplate,
  selectedTemplateId,
  filterCategory
}) => {
  // Get templates from either filtered category or all templates
  const templates = filterCategory 
    ? getTemplatesByCategory(filterCategory).map(template => ({
        ...template,
        description: 'Professional CV template with clean design.',
        previewImage: '',
        category: filterCategory,
        popularity: 4
      }))
    : getAllTemplates().map(template => ({
        ...template,
        category: 'Modern',
        popularity: template.isPopular ? 5 : 4
      }));

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`text-lg ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 sm:mb-6 px-2 sm:px-0">New Templates</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden flex flex-col h-full border shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] bg-white overflow-hidden">
              <div className="absolute inset-0 bg-gray-100 animate-pulse" /> {/* Loading placeholder */}
              
              {/* Directly use imported template components */}
              <div className="relative w-full h-full z-10">
                {template.id === 'moonlightSonata' ? (
                  <MoonlightSonataTemplate />
                ) : template.id === 'kaziFasta' ? (
                  <KaziFastaTemplate />
                ) : (
                  <TemplatePreviewImage templateId={template.id} templateName={template.name} />
                )}
              </div>
            </div>
            <CardContent className="p-3 sm:p-4 flex flex-col justify-between flex-grow border-t">
              <div>
                <h3 className="text-lg sm:text-xl font-bold">{template.name}</h3>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">{template.description}</p>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-wrap sm:flex-nowrap justify-between items-center">
                <div className="flex flex-wrap items-center space-x-1 sm:space-x-2 mb-2 sm:mb-0">
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 text-xs sm:text-sm">
                    {template.category}
                  </Badge>
                  <div className="ml-1 sm:ml-2">{renderStarRating(template.popularity)}</div>
                </div>
                <Button 
                  variant={selectedTemplateId === template.id ? "default" : "outline"}
                  onClick={() => onSelectTemplate(template.id)}
                  className={`ml-auto text-sm sm:text-base ${selectedTemplateId === template.id ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'border-gray-300 hover:bg-gray-50'}`}
                  size="sm"
                >
                  {selectedTemplateId === template.id ? "Selected" : "Select"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelectionGrid;