import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, FileDown } from 'lucide-react';
import PDFExportButton from '@/components/PDFExportButton';

interface MobileActionPanelProps {
  onEdit: () => void;
}

/**
 * Fixed action panel for mobile devices
 * Shows at the bottom of the screen with primary actions
 */
const MobileActionPanel: React.FC<MobileActionPanelProps> = ({ onEdit }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:hidden z-10">
      <div className="flex justify-between gap-2">
        <Button 
          variant="outline" 
          className="flex-1 flex items-center justify-center gap-2"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          Edit Content
        </Button>
        
        <PDFExportButton 
          className="flex-1 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800"
        >
          Get My CV
        </PDFExportButton>
      </div>
    </div>
  );
};

export default MobileActionPanel;
