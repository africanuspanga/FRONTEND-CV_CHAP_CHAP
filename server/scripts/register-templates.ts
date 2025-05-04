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
    id: 'kilimanjaro',
    name: 'Kilimanjaro Professional',
    description: 'A clean, professional template with a modern design suitable for corporate environments.'
  },
  {
    id: 'serengeti-elegant',
    name: 'Serengeti Elegant',
    description: 'An elegant, minimalist design with sophisticated typography perfect for creative professionals.'
  },
  {
    id: 'safari-original',
    name: 'Safari Original',
    description: 'A bold, colorful template with a vibrant header that suits creative roles and industries.'
  },
  {
    id: 'modern-zanzibar',
    name: 'Modern Zanzibar',
    description: 'A contemporary two-column layout with a calming blue color scheme ideal for technical professionals.'
  },
  {
    id: 'mkali-modern',
    name: 'Mkali Modern',
    description: 'A sleek, modern design with minimal accents and focus on readability.'
  },
  {
    id: 'street-hustler',
    name: 'Street Hustler',
    description: 'A high-energy design with vibrant colors and street-style typography for creative fields.'
  },
  {
    id: 'big-boss',
    name: 'Big Boss',
    description: 'A powerful, executive-style template that conveys authority and experience.'
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
