import React, { useState } from 'react';
import { TemplateSelector } from "@/components/TemplateSelector";
import { fetchTemplateHTML } from "@/scripts/template-loader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TemplateGallery() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();
  const [templateHtml, setTemplateHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setTemplateHtml(null);
  };

  const handleViewTemplate = async () => {
    if (!selectedTemplateId) return;
    
    setLoading(true);
    try {
      const html = await fetchTemplateHTML(selectedTemplateId);
      setTemplateHtml(html);
    } catch (error) {
      console.error("Error fetching template HTML:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CV Template Gallery</h1>
        <p className="text-gray-600">Select a template for your CV</p>
      </div>

      <div className="mb-8">
        <TemplateSelector 
          onSelect={handleTemplateSelect} 
          selectedTemplateId={selectedTemplateId} 
        />
      </div>

      {selectedTemplateId && (
        <div className="flex justify-center mb-8">
          <Button 
            onClick={handleViewTemplate} 
            disabled={loading}
            size="lg"
          >
            {loading ? "Loading..." : "View Template"}
          </Button>
        </div>
      )}

      {templateHtml && (
        <Card className="p-4">
          <h2 className="text-2xl font-bold mb-4">HTML Preview</h2>
          <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
            <pre className="text-sm">{templateHtml}</pre>
          </div>
        </Card>
      )}
    </div>
  );
}
