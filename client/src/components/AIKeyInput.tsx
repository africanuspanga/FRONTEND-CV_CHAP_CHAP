/**
 * AI Key Input Component
 * This component allows users to input their OpenAI API key for AI features
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { clearOpenAIApiKey, getOpenAIApiKey, hasOpenAIApiKey, setOpenAIApiKey } from '@/lib/openai-service';
import { Check, Key, Loader2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface AIKeyInputProps {
  onClose?: () => void;
}

/**
 * Component for inputting and managing OpenAI API key
 */
const AIKeyInput: React.FC<AIKeyInputProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key exists on mount
    setHasKey(hasOpenAIApiKey());
    const existingKey = getOpenAIApiKey();
    if (existingKey) {
      // Mask the key for display
      setApiKey('****************************************');
    }
  }, []);

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        variant: 'destructive',
      });
      return;
    }

    // Don't update if it's the masked key
    if (apiKey === '****************************************') {
      if (onClose) onClose();
      return;
    }

    setIsValidating(true);

    try {
      // Basic validation: OpenAI API keys start with 'sk-'
      if (!apiKey.startsWith('sk-')) {
        throw new Error('Invalid API key format. OpenAI API keys should start with "sk-"');
      }

      // Store the API key
      setOpenAIApiKey(apiKey);
      setHasKey(true);
      
      // Show success toast
      toast({
        title: 'Success',
        description: 'API key saved successfully',
      });

      // Close the dialog if needed
      if (onClose) onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save API key';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearKey = () => {
    clearOpenAIApiKey();
    setApiKey('');
    setHasKey(false);
    toast({
      title: 'API Key Removed',
      description: 'Your OpenAI API key has been removed',
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="mr-2 h-5 w-5" /> OpenAI API Key
        </CardTitle>
        <CardDescription>
          {hasKey
            ? 'Your API key is saved securely in your browser.'
            : 'Add your API key to use AI-powered features in your CV.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="font-mono"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              Your API key is stored locally in your browser and never sent to our servers.
              You can get an API key from{' '}
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                OpenAI's website
              </a>.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {hasKey ? (
          <Button variant="outline" onClick={handleClearKey}>
            <X className="mr-2 h-4 w-4" /> Remove Key
          </Button>
        ) : (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSaveKey} disabled={isValidating}>
          {isValidating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Validating...
            </>
          ) : hasKey ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Update Key
            </>
          ) : (
            <>Save Key</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIKeyInput;
