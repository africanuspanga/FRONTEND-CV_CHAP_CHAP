import React from 'react';

interface TemplatePreviewImageProps {
  templateId: string;
  templateName: string;
}

/**
 * Component that renders a colorful template preview based on template ID.
 * This creates dynamic previews when actual PNG files aren't available.
 */
const TemplatePreviewImage: React.FC<TemplatePreviewImageProps> = ({ templateId, templateName }) => {
  // Get a color based on template ID
  const getTemplateColor = (id: string): string => {
    const colorMap: Record<string, string> = {
      moonlightSonata: '#e74c3c',  // Red
      kaziFasta: '#2ecc71',        // Green
      jijengeClassic: '#3498db',   // Blue
      kilimanjaro: '#9b59b6',      // Purple
      brightDiamond: '#1abc9c',    // Teal
      mjenziWaTaifa: '#f39c12',    // Orange
      streetHustler: '#e67e22',    // Dark Orange
      safariOriginal: '#27ae60',   // Dark Green
      bigBoss: '#2980b9',          // Dark Blue
      tanzanitePro: '#8e44ad',     // Dark Purple
      mwalimuOne: '#16a085',       // Dark Teal
      serengetiFlow: '#f1c40f',    // Yellow
      smartBongo: '#d35400',       // Burnt Orange
      madiniMob: '#c0392b',        // Dark Red
      mkaliModern: '#7f8c8d',      // Gray
    };
    
    return colorMap[id] || '#3498db';
  };
  
  // Split the template name for display
  const words = templateName.split(' ');
  const firstLine = words[0];
  const secondLine = words.length > 1 ? words[1] : '';
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="300" height="400" fill="#f8f9fa" />
      
      {/* Template card */}
      <rect x="50" y="50" width="200" height="270" rx="8" fill={getTemplateColor(templateId)} />
      
      {/* Header area */}
      <rect x="70" y="70" width="160" height="20" rx="4" fill="white" fillOpacity="0.3" />
      <rect x="70" y="100" width="120" height="15" rx="4" fill="white" fillOpacity="0.3" />
      <rect x="70" y="125" width="140" height="15" rx="4" fill="white" fillOpacity="0.3" />
      
      {/* Content area - experience section */}
      <rect x="70" y="165" width="160" height="30" rx="4" fill="white" fillOpacity="0.2" />
      <rect x="70" y="205" width="160" height="30" rx="4" fill="white" fillOpacity="0.2" />
      
      {/* Skills section */}
      <rect x="70" y="250" width="40" height="20" rx="10" fill="white" fillOpacity="0.3" />
      <rect x="120" y="250" width="40" height="20" rx="10" fill="white" fillOpacity="0.3" />
      <rect x="170" y="250" width="40" height="20" rx="10" fill="white" fillOpacity="0.3" />
      
      {/* Template name */}
      <rect x="50" y="340" width="200" height="40" rx="4" fill="#495057" />
      <text x="150" y="365" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
        {firstLine}
        {secondLine && (
          <tspan x="150" dy="18">{secondLine}</tspan>
        )}
      </text>
    </svg>
  );
};

export default TemplatePreviewImage;
