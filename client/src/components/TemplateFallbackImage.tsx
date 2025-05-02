import React from 'react';

interface TemplateFallbackImageProps {
  templateName: string;
}

/**
 * This component renders a fallback image when a template preview image fails to load
 * It creates a simple SVG with the template name as text
 */
const TemplateFallbackImage: React.FC<TemplateFallbackImageProps> = ({ templateName }) => {
  // Generate a consistent color based on the template name
  const getColorFromName = (name: string) => {
    const colors = [
      '#3b82f6', // blue-500
      '#10b981', // emerald-500
      '#ef4444', // red-500
      '#8b5cf6', // violet-500
      '#f59e0b', // amber-500
      '#ec4899', // pink-500
      '#6366f1', // indigo-500
    ];
    
    // Create a simple hash from the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    // Use the absolute value of the hash to select a color
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  };

  const bgColor = getColorFromName(templateName);
  const textColor = '#ffffff'; // White text

  // Split the template name into words
  const words = templateName.split(' ');
  const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const secondLine = words.slice(Math.ceil(words.length / 2)).join(' ');

  return (
    <svg width="100%" height="100%" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="400" height="600" fill="#f8f9fa" />
      
      {/* Template card */}
      <rect x="50" y="50" width="300" height="400" rx="8" fill={bgColor} />
      
      {/* Header area */}
      <rect x="70" y="80" width="260" height="30" rx="4" fill="white" fillOpacity="0.2" />
      <rect x="70" y="120" width="180" height="20" rx="4" fill="white" fillOpacity="0.2" />
      <rect x="70" y="150" width="220" height="20" rx="4" fill="white" fillOpacity="0.2" />
      
      {/* Content area - experience section */}
      <rect x="70" y="200" width="260" height="50" rx="4" fill="white" fillOpacity="0.15" />
      <rect x="70" y="260" width="260" height="50" rx="4" fill="white" fillOpacity="0.15" />
      
      {/* Skills section */}
      <rect x="70" y="330" width="60" height="25" rx="12.5" fill="white" fillOpacity="0.2" />
      <rect x="140" y="330" width="60" height="25" rx="12.5" fill="white" fillOpacity="0.2" />
      <rect x="210" y="330" width="60" height="25" rx="12.5" fill="white" fillOpacity="0.2" />
      
      {/* Template name */}
      <rect x="50" y="470" width="300" height="80" rx="8" fill="#495057" />
      <text x="200" y="510" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill={textColor} textAnchor="middle">
        {firstLine}
      </text>
      {secondLine && (
        <text x="200" y="535" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill={textColor} textAnchor="middle">
          {secondLine}
        </text>
      )}
      
      {/* No preview available text */}
      <text x="200" y="570" fontFamily="Arial, sans-serif" fontSize="14" fill="#6c757d" textAnchor="middle">
        Preview image loading...
      </text>
    </svg>
  );
};

export default TemplateFallbackImage;
