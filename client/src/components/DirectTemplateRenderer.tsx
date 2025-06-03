import React from 'react';
import { CVData } from '@shared/schema';

// Import all template components
import KilimanjaroTemplate from '../templates/KilimanjaroTemplate';
import TanzaniteProTemplate from '../templates/TanzaniteProTemplate';
import BigBossTemplate from '../templates/BigBossTemplate';
import MjenziWaTaifaTemplate from '../templates/MjenziWaTaifaTemplate';
import StreetHustlerTemplate from '../templates/StreetHustlerTemplate';

interface DirectTemplateRendererProps {
  templateId: string;
  data: CVData;
  containerClassName?: string;
}

/**
 * A component that directly renders CV templates based on templateId
 * Used primarily for mobile preview to optimize performance
 */
const DirectTemplateRenderer: React.FC<DirectTemplateRendererProps> = ({
  templateId,
  data,
  containerClassName = ''
}) => {
  // Render the appropriate template based on templateId
  const renderTemplate = () => {
    switch (templateId) {
      case 'kilimanjaro':
        return <KilimanjaroTemplate data={data} />;
      case 'tanzanitePro':
        return <TanzaniteProTemplate data={data} />;
      case 'bigBoss':
        return <BigBossTemplate data={data} />;
      case 'mjenziWaTaifa':
        return <MjenziWaTaifaTemplate data={data} />;
      case 'streetHustler':
        return <StreetHustlerTemplate data={data} />;
      default:
        // Default to TanzaniteProTemplate if templateId is not recognized
        return <TanzaniteProTemplate data={data} />;
    }
  };

  return (
    <div className={`template-container ${containerClassName}`}>
      {renderTemplate()}
    </div>
  );
};

export default DirectTemplateRenderer;