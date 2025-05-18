import React from 'react';
import { CVData } from '@/types/cv-types';

// Import our templates
import KilimanjaroTemplate from '@/templates/KilimanjaroTemplate';
import TanzaniteProTemplate from '@/templates/TanzaniteProTemplate';
import BigBossTemplate from '@/templates/BigBossTemplate';
import MjenziWaTaifaTemplate from '@/templates/MjenziWaTaifaTemplate';
import StreetHustlerTemplate from '@/templates/StreetHustlerTemplate';

interface DirectTemplateRendererProps {
  templateId: string;
  cvData: CVData;
  height?: string | number;
  width?: string | number;
  className?: string;
}

/**
 * Renders CV templates directly as React components
 * Unlike ClientSideTemplateRenderer, this component renders templates directly
 * rather than in an iframe, which is more efficient for mobile devices
 */
const DirectTemplateRenderer: React.FC<DirectTemplateRendererProps> = ({
  templateId,
  cvData,
  height = 'auto',
  width = '100%',
  className = ''
}) => {
  const renderTemplate = () => {
    // Map templateId to component
    switch(templateId) {
      case 'kilimanjaro':
        return <KilimanjaroTemplate data={cvData} />;
      case 'tanzanitePro':
        return <TanzaniteProTemplate data={cvData} />;
      case 'bigBoss':
        return <BigBossTemplate data={cvData} />;
      case 'mjenziWaTaifa':
        return <MjenziWaTaifaTemplate data={cvData} />;
      case 'streetHustler':
        return <StreetHustlerTemplate data={cvData} />;
      default:
        // Fallback to default template
        return <TanzaniteProTemplate data={cvData} />;
    }
  };

  return (
    <div 
      className={`cv-template-container ${className}`}
      style={{ 
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
        overflow: 'hidden'
      }}
    >
      {renderTemplate()}
    </div>
  );
};

export default DirectTemplateRenderer;