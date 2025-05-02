/**
 * Mobile Action Panel Component
 * This component provides a fixed action panel at the bottom of the screen on mobile devices
 */

import { Button } from '@/components/ui/button';
import { Download, Edit } from 'lucide-react';
import React from 'react';

interface MobileActionPanelProps {
  onEdit: () => void;
  onDownload?: () => void;
  downloadDisabled?: boolean;
}

/**
 * Fixed action panel for mobile devices
 */
const MobileActionPanel: React.FC<MobileActionPanelProps> = ({
  onEdit,
  onDownload,
  downloadDisabled = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-3 lg:hidden">
      <div className="flex justify-between gap-2">
        <Button 
          variant="outline" 
          className="w-1/2 flex items-center justify-center"
          onClick={onEdit}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit CV
        </Button>
        
        <Button 
          className="w-1/2 flex items-center justify-center"
          onClick={onDownload}
          disabled={!onDownload || downloadDisabled}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default MobileActionPanel;
