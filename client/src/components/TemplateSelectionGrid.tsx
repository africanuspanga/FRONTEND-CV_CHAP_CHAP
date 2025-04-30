import React from 'react';
import { getAllTemplates, getTemplatesByCategory, TemplateDefinition } from '@/lib/templates-registry';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  const templates = filterCategory 
    ? getTemplatesByCategory(filterCategory) 
    : getAllTemplates();

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
      <h2 className="text-2xl font-bold mb-6">New Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden flex flex-col h-full border shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-[500px] bg-white overflow-hidden">
              <img
                src={template.previewImage}
                alt={`${template.name} template preview`}
                className="w-full h-full object-contain object-top px-2"
                style={{
                  maxWidth: '100%',
                  display: 'block',
                  margin: '0 auto'
                }}
                onError={(e) => {
                  console.error(`Failed to load image: ${template.previewImage}`);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <CardContent className="p-4 flex flex-col justify-between flex-grow border-t">
              <div>
                <h3 className="text-xl font-bold">{template.name}</h3>
                <p className="text-gray-600 mt-2">{template.description}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                    {template.category}
                  </Badge>
                  {renderStarRating(template.popularity)}
                </div>
                <Button 
                  variant={selectedTemplateId === template.id ? "default" : "outline"}
                  onClick={() => onSelectTemplate(template.id)}
                  className="ml-auto"
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