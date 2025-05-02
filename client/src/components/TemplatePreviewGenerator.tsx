import React from 'react';

interface TemplatePreviewGeneratorProps {
  templateId: string;
  templateName: string;
  color: string;
  width?: number;
  height?: number;
}

/**
 * Component that generates SVG template previews with different colors
 * These will be used as fallbacks and can be exported as PNGs
 */
const TemplatePreviewGenerator: React.FC<TemplatePreviewGeneratorProps> = ({
  templateId,
  templateName,
  color,
  width = 400,
  height = 600
}) => {
  // Split template name if needed
  const words = templateName.split(' ');
  const firstLine = words[0];
  const secondLine = words.length > 1 ? words[1] : '';
  
  return (
    <svg width={width} height={height} viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="300" height="400" fill="#f8f9fa" />
      
      {/* Template card */}
      <rect x="50" y="50" width="200" height="270" rx="8" fill={color} />
      
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

export default TemplatePreviewGenerator;
