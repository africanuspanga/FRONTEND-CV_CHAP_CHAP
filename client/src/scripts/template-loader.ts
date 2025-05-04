/**
 * Template loader for CV Chap Chap
 * Handles template loading and management
 */

import { useState, useEffect } from 'react';

// Interface for template data
export interface Template {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Hook to fetch available templates
export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch('/api/templates');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch templates: ${response.statusText}`);
        }
        
        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        
        // Fallback to default templates if API fails
        setTemplates(defaultTemplates);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTemplates();
  }, []);

  return { templates, loading, error };
}

// Function to fetch a specific template's HTML
export async function fetchTemplateHTML(templateId: string): Promise<string> {
  try {
    const response = await fetch(`/api/templates/${templateId}/html`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch template HTML: ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error(`Error fetching template HTML for ${templateId}:`, error);
    
    // Return a basic fallback template if API fails
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{ name }} - CV</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; }
    .section { margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>{{ name }}</h1>
  <p>{{ title }}</p>
  <p>{{ email }}{% if phone %} | {{ phone }}{% endif %}{% if location %} | {{ location }}{% endif %}</p>
  
  {% if summary %}
  <div class="section">
    <h2>Summary</h2>
    <p>{{ summary }}</p>
  </div>
  {% endif %}
  
  {% if experience and experience|length > 0 %}
  <div class="section">
    <h2>Experience</h2>
    {% for exp in experience %}
    <div>
      <h3>{{ exp.position }} at {{ exp.company }}</h3>
      <p>{{ exp.duration }}</p>
      <p>{{ exp.description }}</p>
    </div>
    {% endfor %}
  </div>
  {% endif %}
  
  {% if education and education|length > 0 %}
  <div class="section">
    <h2>Education</h2>
    {% for edu in education %}
    <div>
      <h3>{{ edu.degree }} - {{ edu.school }}</h3>
      <p>{{ edu.duration }}</p>
      {% if edu.description %}<p>{{ edu.description }}</p>{% endif %}
    </div>
    {% endfor %}
  </div>
  {% endif %}
  
  {% if skills and skills|length > 0 %}
  <div class="section">
    <h2>Skills</h2>
    <p>{{ skills|join(", ") }}</p>
  </div>
  {% endif %}
  
  {% if languages and languages|length > 0 %}
  <div class="section">
    <h2>Languages</h2>
    <p>{{ languages|join(", ") }}</p>
  </div>
  {% endif %}
</body>
</html>`;
  }
}

// Function to update a template's HTML content
export async function updateTemplateHTML(templateId: string, htmlContent: string): Promise<boolean> {
  try {
    const formData = new FormData();
    const htmlFile = new File([htmlContent], `${templateId}.html`, { type: 'text/html' });
    formData.append('html_file', htmlFile);
    
    const response = await fetch(`/api/templates/${templateId}/html`, {
      method: 'PUT',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update template HTML: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating template HTML for ${templateId}:`, error);
    return false;
  }
}

// Function to test template rendering
export async function testTemplate(templateId: string): Promise<Blob | null> {
  try {
    const response = await fetch(`/api/templates/${templateId}/test`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to test template: ${response.statusText}`);
    }
    
    // Return the PDF blob
    return await response.blob();
  } catch (error) {
    console.error(`Error testing template ${templateId}:`, error);
    return null;
  }
}

// Function to upload a new template
export async function uploadTemplate(
  templateId: string,
  templateName: string,
  htmlContent: string,
  description: string = ''
): Promise<Template | null> {
  try {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append('id', templateId);
    formData.append('name', templateName);
    formData.append('description', description);
    
    // Create a File object from the HTML content
    const htmlFile = new File([htmlContent], `${templateId}.html`, { type: 'text/html' });
    formData.append('html_file', htmlFile);
    
    const response = await fetch('/api/templates/', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload template: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Template upload failed:', error);
    return null;
  }
}

// Default templates to use as fallback if API fails
const defaultTemplates: Template[] = [
  {
    id: 'kilimanjaro',
    name: 'Kilimanjaro Professional',
    description: 'A clean, professional template with a modern design suitable for corporate environments.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'serengeti-elegant',
    name: 'Serengeti Elegant',
    description: 'An elegant, minimalist design with sophisticated typography perfect for creative professionals.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'safari-original',
    name: 'Safari Original',
    description: 'A bold, colorful template with a vibrant header that suits creative roles and industries.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'modern-zanzibar',
    name: 'Modern Zanzibar',
    description: 'A contemporary two-column layout with a calming blue color scheme ideal for technical professionals.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mkali-modern',
    name: 'Mkali Modern',
    description: 'A sleek, modern design with minimal accents and focus on readability.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'street-hustler',
    name: 'Street Hustler',
    description: 'A high-energy design with vibrant colors and street-style typography for creative fields.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'big-boss',
    name: 'Big Boss',
    description: 'A powerful, executive-style template that conveys authority and experience.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
