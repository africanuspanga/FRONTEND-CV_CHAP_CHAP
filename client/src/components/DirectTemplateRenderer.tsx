import React from 'react';
import { CVData } from '@shared/schema';

// Import only the working template components
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
  // Add null safety check for data
  if (!data) {
    return (
      <div className={`template-container ${containerClassName}`}>
        <div className="p-8 text-center text-gray-500">Loading template...</div>
      </div>
    );
  }

  // Render the appropriate template based on templateId
  const renderTemplate = () => {
    console.log('DirectTemplateRenderer rendering template:', templateId, 'with data keys:', Object.keys(data || {}));
    
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
      case 'brightDiamond':
      case 'madiniMob':
      case 'mwalimuOne':
      case 'serengetiFlow':
      case 'safariOriginal':
      case 'jijengeClassic':
      case 'moonlightSonata':
      case 'kaziFasta':
      case 'mkaliModern':
      case 'smartBongo':
        // For now, render these template IDs with TanzaniteProTemplate
        console.log(`Template ${templateId} mapped to TanzaniteProTemplate`);
        return <TanzaniteProTemplate data={data} />;
      default:
        // Default to TanzaniteProTemplate if templateId is not recognized
        console.log(`Unknown template ${templateId}, using TanzaniteProTemplate`);
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