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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-0">
        {templates.map((template) => (
          <div key={template.id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
            {/* Template Preview Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              {/* Loading placeholder */}
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
              
              {/* Template Preview */}
              <div className="absolute inset-0 z-10">
                {(() => {
                  switch(template.id) {
                    case 'moonlightSonata': return <MoonlightSonataTemplate />;
                    case 'kaziFasta': return <KaziFastaTemplate />;
                    case 'jijengeClassic': return <JijengeClassicTemplate />;
                    case 'kilimanjaro': return <KilimanjaroTemplate />;
                    case 'brightDiamond': return <BrightDiamondTemplate />;
                    case 'mjenziWaTaifa': return <MjenziWaTaifaTemplate />;
                    case 'streetHustler': return <StreetHustlerTemplate />;
                    case 'safariOriginal': return <SafariOriginalTemplate />;
                    case 'bigBoss': return <BigBossTemplate />;
                    case 'tanzanitePro': return <TanzaniteProTemplate />;
                    case 'mwalimuOne': return <MwalimuOneTemplate />;
                    case 'serengetiFlow': return <SerengetiFlowTemplate />;
                    case 'smartBongo': return <SmartBongoTemplate />;
                    case 'madiniMob': return <MadiniMobTemplate />;
                    case 'mkaliModern': return <MkaliModernTemplate />;
                    default: return <TemplatePreviewImage templateId={template.id} templateName={template.name} />;
                  }
                })()}
              </div>
              
              {/* Hover Overlay with Select Button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20">
                <Button 
                  variant={selectedTemplateId === template.id ? "default" : "secondary"}
                  onClick={() => onSelectTemplate(template.id)}
                  className={`text-base font-medium ${selectedTemplateId === template.id ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-900'}`}
                  size="lg"
                >
                  {selectedTemplateId === template.id ? "Selected" : "Select Template"}
                </Button>
              </div>
            </div>
            
            {/* Template Name with Clean Border */}
            <div className="p-3 text-center border-t">
              <h3 className="font-semibold text-lg text-gray-900">{template.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelectionGrid;