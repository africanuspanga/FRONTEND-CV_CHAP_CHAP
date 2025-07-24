import React from 'react';
import { CVData } from '@shared/schema';

// Import all available template components
import KilimanjaroTemplate from '../templates/KilimanjaroTemplate';
import TanzaniteProTemplate from '../templates/TanzaniteProTemplate';
import BigBossTemplate from '../templates/BigBossTemplate';
import { MjenziWaTaifaTemplate } from '../templates/mjenziWaTaifa';
import StreetHustlerTemplate from '../templates/StreetHustlerTemplate';
import { BrightDiamondTemplate } from '../templates/brightDiamond';
import { MadiniMobTemplate } from '../templates/madiniMob';
import { MwalimuOneTemplate } from '../templates/mwalimuOne';
import { SerengetiFlowTemplate } from '../templates/serengetiFlow';

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
      case 'brightDiamond':
        console.log('Rendering BrightDiamondTemplate');
        return <BrightDiamondTemplate {...data} />;
      case 'madiniMob':
        console.log('Rendering MadiniMobTemplate');
        return <MadiniMobTemplate {...data} />;
      case 'kilimanjaro':
        return <KilimanjaroTemplate data={data} />;
      case 'tanzanitePro':
        return <TanzaniteProTemplate data={data} />;
      case 'bigBoss':
        return <BigBossTemplate data={data} />;
      case 'mjenziWaTaifa':
        return <MjenziWaTaifaTemplate {...data} />;
      case 'streetHustler':
        return <StreetHustlerTemplate data={data} />;
      case 'mwalimuOne':
        console.log('Rendering MwalimuOneTemplate');
        return <MwalimuOneTemplate {...data} />;
      case 'serengetiFlow':
        console.log('Rendering SerengetiFlowTemplate');
        return <SerengetiFlowTemplate {...data} />;
      case 'safariOriginal':
      case 'jijengeClassic':
      case 'moonlightSonata':
      case 'kaziFasta':
      case 'mkaliModern':
      case 'smartBongo':
        // Fallback to TanzaniteProTemplate for templates not yet implemented
        console.log(`Template ${templateId} using TanzaniteProTemplate fallback`);
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