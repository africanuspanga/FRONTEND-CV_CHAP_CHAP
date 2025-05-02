import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import path from 'path';
import { templates } from './index.js';
import TemplatePreviewGenerator from '../components/TemplatePreviewGenerator';

/**
 * This script generates template preview images as SVGs
 * It can be run using Node.js to create the preview files
 */

// Map of template IDs to colors
const templateColors: Record<string, string> = {
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

// Generate SVG preview for each template
const generatePreviewSVGs = () => {
  const outputDir = path.resolve(__dirname, '../../../public/images/templates');
  
  // Create the output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Generate an SVG for each template
  Object.values(templates).forEach(template => {
    const color = templateColors[template.id] || '#3498db'; // Default to blue if no color specified
    
    // Generate SVG content
    const svgContent = ReactDOMServer.renderToStaticMarkup(
      <TemplatePreviewGenerator 
        templateId={template.id}
        templateName={template.name}
        color={color}
      />
    );
    
    // Write the SVG to a file
    const outputPath = path.join(outputDir, `${template.id}.svg`);
    fs.writeFileSync(outputPath, `<?xml version="1.0" encoding="UTF-8"?>${svgContent}`);
    
    console.log(`Generated preview for ${template.name} at ${outputPath}`);
  });
  
  console.log('All template previews generated successfully!');
};

// Call the function
generatePreviewSVGs();
