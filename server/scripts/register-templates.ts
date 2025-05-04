/**
 * Script to register all CV templates with the backend API
 * Run with: npx tsx server/scripts/register-templates.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import FormData from 'form-data';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Templates directory
const templatesDir = path.join(process.cwd(), 'templates');

// Base server URL
const baseUrl = 'http://localhost:5000';

// Template definitions
const templates = [
  {
    id: 'moonlightSonata',
    name: 'Moonlight Sonata',
    description: 'An elegant, professional template with a sophisticated design and clean layout.'
  },
  {
    id: 'kaziFasta',
    name: 'Kazi Fasta',
    description: 'A modern, professional template with a two-column layout, perfect for highlighting key skills.'
  },
  {
    id: 'jijengeClassic',
    name: 'Jijenge Classic',
    description: 'A classic, professional CV template with a traditional layout that emphasizes work experience.'
  },
  {
    id: 'kilimanjaro',
    name: 'Kilimanjaro',
    description: 'A clean, professional template with a modern design suitable for corporate environments.'
  },
  {
    id: 'brightDiamond',
    name: 'Bright Diamond',
    description: 'A bright and modern template with a sleek design and excellent readability.'
  },
  {
    id: 'mjenziWaTaifa',
    name: 'Mjenzi wa Taifa',
    description: 'A sophisticated template with warm tones and a well-structured layout.'
  },
  {
    id: 'safariOriginal',
    name: 'Safari Original',
    description: 'A bold, colorful template with a vibrant header that suits creative roles and industries.'
  },
  {
    id: 'streetHustler',
    name: 'Street Hustler',
    description: 'A high-energy design with vibrant colors and street-style typography for creative fields.'
  },
  {
    id: 'bigBoss',
    name: 'Big Boss',
    description: 'A powerful, executive-style template that conveys authority and experience.'
  },
  {
    id: 'mkaliModern',
    name: 'Mkali Modern',
    description: 'A sleek, modern design with minimal accents and focus on readability.'
  },
  {
    id: 'tanzanitePro',
    name: 'Tanzanite Pro',
    description: 'A contemporary template with professional styling and attractive visual elements.'
  },
  {
    id: 'mwalimuOne',
    name: 'Mwalimu One',
    description: 'A teacher-oriented template ideal for education professionals.'
  },
  {
    id: 'serengetiFlow',
    name: 'Serengeti Flow',
    description: 'An elegant, flowing design with sophisticated typography perfect for creative professionals.'
  },
  {
    id: 'smartBongo',
    name: 'Smart Bongo',
    description: 'A smart, clean template with modern styling suitable for tech professionals.'
  },
  {
    id: 'madiniMob',
    name: 'Madini Mob',
    description: 'A robust template with strong visual hierarchy, ideal for a wide range of professions.'
  }
];

// Function to upload a template to the API
async function uploadTemplate(template: {id: string; name: string; description: string}) {
  const htmlFilePath = path.join(templatesDir, `${template.id}.html`);
  
  // Check if template file exists
  if (!fs.existsSync(htmlFilePath)) {
    console.error(`Template file not found: ${htmlFilePath}`);
    return false;
  }
  
  // Create form data
  const formData = new FormData();
  formData.append('id', template.id);
  formData.append('name', template.name);
  formData.append('description', template.description);
  formData.append('html_file', fs.createReadStream(htmlFilePath));
  
  try {
    // Send request to API
    const response = await fetch(`${baseUrl}/api/templates`, {
      method: 'POST',
      body: formData
    });
    
    // Check response
    if (response.ok) {
      const result = await response.json();
      console.log(`Successfully registered template: ${template.name} (${template.id})`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`Failed to register template ${template.id}: ${response.status} - ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error(`Error registering template ${template.id}:`, error);
    return false;
  }
}

// Function to register all templates
async function registerTemplates() {
  console.log('Starting template registration process...');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const template of templates) {
    const success = await uploadTemplate(template);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log(`\nRegistration complete. ${successCount} templates registered successfully, ${failCount} failed.`);
}

// Execute the registration function
registerTemplates().catch(console.error);
