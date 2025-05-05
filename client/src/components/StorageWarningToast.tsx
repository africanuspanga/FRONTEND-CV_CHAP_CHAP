import React, { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from 'lucide-react';

interface StorageWarningToastProps {
  dataSize: number; // Size in bytes
  threshold?: number; // Threshold in bytes (default 2MB)
  onDismiss?: () => void;
}

export default function StorageWarningToast({ 
  dataSize, 
  threshold = 2 * 1024 * 1024, // 2MB default
  onDismiss 
}: StorageWarningToastProps) {
  const { toast } = useToast();
  
  useEffect(() => {
    if (dataSize > threshold) {
      const sizeInKB = Math.round(dataSize / 1024);
      const sizeInMB = (dataSize / (1024 * 1024)).toFixed(2);
      
      toast({
        title: 'CV Data Storage Warning',
        description: (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span>Your CV data is getting large ({sizeInMB} MB)</span>
            </div>
            <p className="text-sm mt-1">
              We're using enhanced storage to save your progress, but you should export your CV soon to avoid data loss.
            </p>
          </div>
        ),
        duration: 7000,
      });
      
      // Call onDismiss callback if provided
      if (onDismiss) {
        onDismiss();
      }
    }
  }, [dataSize, threshold, toast, onDismiss]);
  
  return null; // This is a utility component, doesn't render anything
}
