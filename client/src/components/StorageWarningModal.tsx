import React, { useState, useEffect } from 'react';
import { isLikelyPrivateBrowsing, isIndexedDBAvailable } from '../utils/cv-storage';
import { AlertCircle } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export function StorageWarningModal() {
  const [open, setOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  
  useEffect(() => {
    const checkStorageAvailability = async () => {
      try {
        // Check if we're in private browsing mode
        const isPrivateBrowsing = await isLikelyPrivateBrowsing();
        const indexedDBAvailable = isIndexedDBAvailable();
        
        if (!indexedDBAvailable) {
          setWarningMessage('Your browser does not support IndexedDB. Your CV data might not be saved properly if it becomes too large. Consider using a modern browser like Chrome, Firefox, or Edge.');
          setOpen(true);
        } else if (isPrivateBrowsing) {
          setWarningMessage('You appear to be in private/incognito browsing mode. This may limit the amount of data that can be stored. Your CV progress might not be saved if you close the browser.');
          setOpen(true);
        }
        
        // Test localStorage
        try {
          const testKey = '__test_storage__';
          localStorage.setItem(testKey, '1');
          localStorage.removeItem(testKey);
        } catch (localStorageError) {
          setWarningMessage('Your browser is not allowing website storage. This may be due to disabled cookies or storage permissions. Your CV progress will not be saved if you close the browser.');
          setOpen(true);
        }
      } catch (error) {
        console.error('Error checking storage availability:', error);
      }
    };
    
    checkStorageAvailability();
  }, []);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Storage Warning
          </DialogTitle>
          <DialogDescription className="text-base">
            {warningMessage}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="text-sm text-muted-foreground mb-2">
            We've implemented compression to help save your data, but you might still experience issues.
          </div>
          <Button onClick={() => setOpen(false)}>Understood</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
