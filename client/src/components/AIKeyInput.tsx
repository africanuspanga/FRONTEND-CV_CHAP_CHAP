import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { InfoIcon, Key } from 'lucide-react';
import { getOpenAIApiKey, setOpenAIApiKey, clearOpenAIApiKey } from '@/lib/openai-service';
import { useToast } from '@/hooks/use-toast';

interface AIKeyInputProps {
  onApiKeySet?: (hasKey: boolean) => void;
}

const AIKeyInput: React.FC<AIKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasKey, setHasKey] = useState<boolean>(false);
  const { toast } = useToast();

  // Check if API key exists on component mount
  useEffect(() => {
    const storedKey = getOpenAIApiKey();
    const hasStoredKey = !!storedKey;
    setHasKey(hasStoredKey);
    if (hasStoredKey && onApiKeySet) {
      onApiKeySet(true);
    }
  }, [onApiKeySet]);

  const handleSave = () => {
    if (apiKey.trim()) {
      setOpenAIApiKey(apiKey.trim());
      setHasKey(true);
      setIsOpen(false);
      setApiKey('');
      if (onApiKeySet) onApiKeySet(true);
      toast({
        title: 'API Key Saved',
        description: 'Your OpenAI API key has been saved for this session.',
      });
    } else {
      toast({
        title: 'Invalid API Key',
        description: 'Please enter a valid OpenAI API key.',
        variant: 'destructive',
      });
    }
  };

  const handleClear = () => {
    clearOpenAIApiKey();
    setHasKey(false);
    setIsOpen(false);
    if (onApiKeySet) onApiKeySet(false);
    toast({
      title: 'API Key Removed',
      description: 'Your OpenAI API key has been removed.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={hasKey ? "outline" : "default"}
          size="sm"
          className={`gap-1.5 ${hasKey ? 'border-green-500 text-green-600' : ''}`}
        >
          <Key className="h-3.5 w-3.5" />
          {hasKey ? 'API Key Set' : 'Set OpenAI API Key'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OpenAI API Key</DialogTitle>
          <DialogDescription>
            <div className="mt-2 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-start gap-1.5">
                <InfoIcon className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <span>
                  To enable AI enhancement features, please enter your OpenAI API key.
                  Your key will be stored in your browser for this session only and will
                  never be sent to our servers.
                </span>
              </p>
              <p className="flex items-start gap-1.5">
                <InfoIcon className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <span>
                  You can get an API key from{' '}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    OpenAI's website
                  </a>
                  .
                </span>
              </p>
              {hasKey && (
                <p className="flex items-start gap-1.5 text-green-600">
                  <InfoIcon className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>You already have an API key set for this session.</span>
                </p>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="font-mono"
          />
        </div>

        <DialogFooter className="flex justify-between">
          {hasKey && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClear}
              className="mr-auto"
            >
              Remove Key
            </Button>
          )}
          <div className="flex gap-2 mt-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!apiKey.trim()}>
              Save API Key
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIKeyInput;
