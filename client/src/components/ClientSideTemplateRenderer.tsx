import { useEffect, useRef, useState } from 'react';
import { CVData } from '@shared/schema';

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [templateHtml, setTemplateHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the template HTML content
  useEffect(() => {
    const fetchTemplate = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/templates/${templateId}.html`);
        
        if (!response.ok) {
          throw new Error(`Failed to load template: ${response.statusText}`);
        }
        
        const html = await response.text();
        setTemplateHtml(html);
      } catch (err) {
        console.error('Error loading template:', err);
        setError(err instanceof Error ? err.message : 'Failed to load template');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  // Update the template with CV data
  useEffect(() => {
    if (!templateHtml || !iframeRef.current || !iframeRef.current.contentDocument) return;

    const updateTemplate = () => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      // Reset the document with the template HTML
      doc.open();
      doc.write(templateHtml);
      doc.close();

      // Wait for content to load
      setTimeout(() => {
        if (!doc.body) return;

        // Update simple text fields
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
        updateElement('github', personalInfo.github || '');
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
              <h3 class="job-title">${exp.title || exp.jobTitle || ''}</h3>
              <div class="company">${exp.company || ''}</div>
              <div class="dates">${exp.startDate || ''} - ${exp.endDate || (exp.current ? 'Present' : '')}</div>
              <div class="location">${exp.location || ''}</div>
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
              <h3 class="degree">${edu.degree || ''}</h3>
              <div class="institution">${edu.institution || ''}</div>
              <div class="dates">${edu.startDate || ''} - ${edu.endDate || (edu.current ? 'Present' : '')}</div>
              <div class="location">${edu.location || ''}</div>
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
            
            skillElement.innerHTML = `
              <span class="skill-name">${skill.name || ''}</span>
              ${skill.level ? `<span class="skill-level">${skill.level}</span>` : ''}
            `;
            
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
              <span class="language-name">${language.name || ''}</span>
              ${language.proficiency ? `<span class="language-proficiency">${language.proficiency}</span>` : ''}
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
              <h3 class="reference-name">${reference.name || ''}</h3>
              <div class="reference-title">${reference.title || reference.position || ''}</div>
              <div class="reference-company">${reference.company || ''}</div>
              <div class="reference-email">${reference.email || ''}</div>
              <div class="reference-phone">${reference.phone || ''}</div>
            `;
            
            referencesContainer.appendChild(refElement);
          });
        }

        // Additional Sections (Projects, Certifications, Hobbies)
        const additionalContainer = doc.getElementById('additional-sections-container');
        if (additionalContainer) {
          additionalContainer.innerHTML = '';
          
          // Projects
          if (cvData.projects?.length) {
            const projectsSection = doc.createElement('div');
            projectsSection.className = 'projects-section';
            projectsSection.innerHTML = '<h2>Projects</h2>';
            
            const projectsList = doc.createElement('div');
            projectsList.className = 'projects-list';
            
            cvData.projects.forEach(project => {
              const projElement = doc.createElement('div');
              projElement.className = 'project-item';
              
              projElement.innerHTML = `
                <h3 class="project-name">${project.name || ''}</h3>
                <div class="project-description">${project.description || ''}</div>
                ${project.url ? `<div class="project-url">${project.url}</div>` : ''}
              `;
              
              projectsList.appendChild(projElement);
            });
            
            projectsSection.appendChild(projectsList);
            additionalContainer.appendChild(projectsSection);
          }
          
          // Certifications
          if (cvData.certifications?.length) {
            const certsSection = doc.createElement('div');
            certsSection.className = 'certifications-section';
            certsSection.innerHTML = '<h2>Certifications</h2>';
            
            const certsList = doc.createElement('div');
            certsList.className = 'certifications-list';
            
            cvData.certifications.forEach(cert => {
              const certElement = doc.createElement('div');
              certElement.className = 'certification-item';
              
              certElement.innerHTML = `
                <h3 class="certification-name">${cert.name || ''}</h3>
                <div class="certification-issuer">${cert.issuer || ''}</div>
                <div class="certification-date">${cert.date || ''}</div>
              `;
              
              certsList.appendChild(certElement);
            });
            
            certsSection.appendChild(certsList);
            additionalContainer.appendChild(certsSection);
          }
          
          // Hobbies
          if (cvData.hobbies) {
            const hobbiesSection = doc.createElement('div');
            hobbiesSection.className = 'hobbies-section';
            hobbiesSection.innerHTML = `
              <h2>Hobbies & Interests</h2>
              <div class="hobbies-content">${cvData.hobbies}</div>
            `;
            
            additionalContainer.appendChild(hobbiesSection);
          }
        }
      }, 100);
    };

    updateTemplate();
  }, [templateHtml, cvData, iframeRef]);

  if (isLoading) {
    return <div className={`template-loading ${className}`}>Loading template...</div>;
  }

  if (error) {
    return <div className={`template-error ${className}`}>Error: {error}</div>;
  }

  return (
    <div className={`template-container ${className}`}>
      <iframe
        ref={iframeRef}
        className="template-iframe"
        title={`CV Template ${templateId}`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        sandbox="allow-same-origin"
      />
    </div>
  );
};

export default ClientSideTemplateRenderer;