import React, { useEffect, useState } from 'react';
import { CVData } from '@shared/schema';
import { getTemplateById } from '@/lib/templates-registry';

interface ClientSideTemplateRendererProps {
  templateId: string;
  cvData: CVData;
  className?: string;
}

export const ClientSideTemplateRenderer = ({ 
  templateId,
  cvData,
  className = ''
}: ClientSideTemplateRendererProps) => {
  const [templateHtml, setTemplateHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTemplate() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get template definition
        const templateDef = getTemplateById(templateId);
        if (!templateDef) {
          throw new Error(`Template with ID ${templateId} not found`);
        }
        
        // Load the template HTML
        const response = await fetch(templateDef.contentPath);
        if (!response.ok) {
          throw new Error(`Failed to load template: ${response.statusText}`);
        }
        
        const html = await response.text();
        setTemplateHtml(html);
      } catch (err) {
        console.error('Error loading template:', err);
        setError(err instanceof Error ? err.message : 'Unknown error loading template');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTemplate();
  }, [templateId]);
  
  // Apply the CV data to the template HTML
  useEffect(() => {
    if (!templateHtml || !cvData) return;
    
    const applyDataToTemplate = () => {
      try {
        // Create a DOM parser to manipulate the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(templateHtml, 'text/html');
        
        // Helper function to update element content
        const updateElement = (id: string, value: string) => {
          const element = doc.getElementById(id);
          if (element) element.textContent = value;
        };
        
        // Personal Info
        const { personalInfo } = cvData;
        updateElement('first-name', personalInfo.firstName || '');
        updateElement('last-name', personalInfo.lastName || '');
        updateElement('full-name', `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim());
        updateElement('email', personalInfo.email || '');
        updateElement('phone', personalInfo.phone || '');
        updateElement('location', personalInfo.location || '');
        updateElement('website', personalInfo.website || '');
        updateElement('linkedin', personalInfo.linkedin || '');
        updateElement('job-title', personalInfo.jobTitle || '');
        updateElement('summary', cvData.summary || '');
        
        // Work Experience
        const experienceContainer = doc.getElementById('experience-container');
        if (experienceContainer && cvData.workExperience?.length) {
          experienceContainer.innerHTML = '';
          
          cvData.workExperience.forEach(exp => {
            const expElement = doc.createElement('div');
            expElement.className = 'experience-item';
            
            expElement.innerHTML = `
              <span class="dates">${exp.startDate || ''} - ${exp.endDate || (exp.current ? 'Present' : '')}</span>
              <strong class="job-title">${exp.jobTitle || ''}</strong>
              <span class="company">${exp.company || ''}</span>
              <div class="description">${exp.description || ''}</div>
            `;
            
            experienceContainer.appendChild(expElement);
          });
        }
        
        // Education
        const educationContainer = doc.getElementById('education-container');
        if (educationContainer && cvData.education?.length) {
          educationContainer.innerHTML = '';
          
          cvData.education.forEach(edu => {
            const eduElement = doc.createElement('div');
            eduElement.className = 'education-item';
            
            eduElement.innerHTML = `
              <span class="dates">${edu.startDate || ''} - ${edu.endDate || (edu.current ? 'Present' : '')}</span>
              <strong class="degree">${edu.degree || ''}</strong>
              <span class="institution">${edu.institution || ''}</span>
              <div class="description">${edu.description || ''}</div>
            `;
            
            educationContainer.appendChild(eduElement);
          });
        }
        
        // Skills
        const skillsContainer = doc.getElementById('skills-container');
        if (skillsContainer && cvData.skills?.length) {
          skillsContainer.innerHTML = '';
          
          cvData.skills.forEach(skill => {
            const skillElement = doc.createElement('div');
            skillElement.className = 'skill-item';
            skillElement.textContent = skill.name;
            
            skillsContainer.appendChild(skillElement);
          });
        }
        
        // Languages
        const languagesContainer = doc.getElementById('languages-container');
        if (languagesContainer && cvData.languages?.length) {
          languagesContainer.innerHTML = '';
          
          cvData.languages.forEach(language => {
            const langElement = doc.createElement('div');
            langElement.className = 'language-item';
            
            langElement.innerHTML = `
              <span class="language-name">${language.name || ''}:</span> ${language.proficiency || ''}
            `;
            
            languagesContainer.appendChild(langElement);
          });
        }
        
        // References
        const referencesContainer = doc.getElementById('references-container');
        if (referencesContainer && cvData.references?.length) {
          referencesContainer.innerHTML = '';
          
          cvData.references.forEach(reference => {
            const refElement = doc.createElement('div');
            refElement.className = 'reference-item';
            
            refElement.innerHTML = `
              <strong class="reference-name">${reference.name || ''}</strong>
              <div>${reference.position || ''}</div>
              <div>${reference.company || ''}</div>
              <div>${reference.email || ''}</div>
            `;
            
            referencesContainer.appendChild(refElement);
          });
        }
        
        // Get the iframe element and update its content
        const iframe = document.getElementById('template-preview-frame') as HTMLIFrameElement;
        if (iframe && iframe.contentDocument) {
          iframe.contentDocument.open();
          iframe.contentDocument.write(doc.documentElement.outerHTML);
          iframe.contentDocument.close();
        }
      } catch (err) {
        console.error('Error applying data to template:', err);
      }
    };
    
    // Apply the data once the iframe is loaded
    const iframe = document.getElementById('template-preview-frame') as HTMLIFrameElement;
    if (iframe) {
      iframe.onload = applyDataToTemplate;
    }
  }, [templateHtml, cvData]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <div className="text-red-500 mb-4">Failed to load template</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  return (
    <div className={`template-container ${className}`}>
      <iframe
        id="template-preview-frame"
        title={`CV Template - ${templateId}`}
        className="w-full border-0"
        style={{ 
          height: 'auto',
          maxHeight: '842px',
          display: 'block',
          margin: '0 auto',
          overflow: 'hidden'
        }}
        srcDoc={templateHtml || ''}
        scrolling="no"
      />
    </div>
  );
};

export default ClientSideTemplateRenderer;