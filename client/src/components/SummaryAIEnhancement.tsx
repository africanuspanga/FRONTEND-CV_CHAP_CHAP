import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { enhanceProfessionalSummary, hasOpenAIApiKey } from '@/lib/openai-service';
import AIKeyInput from '@/components/AIKeyInput';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface SummaryAIEnhancementProps {
  currentSummary: string;
  jobTitle?: string;
  workExperience?: string;
  onApplyEnhancement: (enhancedSummary: string) => void;
  onCancel: () => void;
}

const SummaryAIEnhancement: React.FC<SummaryAIEnhancementProps> = ({
  currentSummary,
  jobTitle,
  workExperience,
  onApplyEnhancement,
  onCancel
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [enhancedSummary, setEnhancedSummary] = useState<string>('');
  const [apiKeySet, setApiKeySet] = useState(hasOpenAIApiKey());
  
  const generateEnhancement = async () => {
    setIsGenerating(true);
    try {
      const enhanced = await enhanceProfessionalSummary(currentSummary, jobTitle, workExperience);
      setEnhancedSummary(enhanced);
    } catch (error) {
      console.error('Error enhancing summary:', error);
      // If there's an error, at least show the original summary
      setEnhancedSummary(currentSummary);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Start generating when the component mounts
  React.useEffect(() => {
    generateEnhancement();
  }, [apiKeySet]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="bg-white rounded-lg border p-6 shadow-lg max-w-3xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">AI-Enhanced Professional Summary</h2>
          <div className="flex items-center gap-2">
            <AIKeyInput onApiKeySet={(hasKey) => {
              setApiKeySet(hasKey);
              // Re-run enhancement if API key changes
              if (hasKey) {
                generateEnhancement();
              }
            }} />
            <Button 
              size="sm" 
              variant="outline" 
              className="p-2" 
              onClick={generateEnhancement}
              disabled={isGenerating}
            >
              <Wand2 className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Original Summary</h3>
              <div className="bg-gray-50 p-4 rounded-md h-[200px] overflow-auto">
                {currentSummary ? currentSummary : 
                <span className="text-gray-400 italic">No summary provided</span>}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Enhanced Summary</h3>
              {isGenerating ? (
                <div className="flex items-center justify-center h-[200px] bg-gray-50 rounded-md">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-500">Creating enhanced summary...</span>
                  </div>
                </div>
              ) : (
                <Textarea
                  className="h-[200px] bg-gray-50"
                  value={enhancedSummary}
                  onChange={(e) => setEnhancedSummary(e.target.value)}
                  placeholder="Enhanced summary will appear here"
                />
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={() => onApplyEnhancement(enhancedSummary)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isGenerating || !enhancedSummary}
          >
            Apply Enhancement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SummaryAIEnhancement;
