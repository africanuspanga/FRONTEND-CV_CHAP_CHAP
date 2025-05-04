import html2pdf from 'html2pdf.js';
import { CVData } from '@shared/schema';
import { directDownloadCV } from '@/services/cv-api-service';

/**
 * Download a blob as a file
 * @param blob The blob to download
 * @param filename The filename to use
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

/**
 * Generates a PDF from the provided CV data and template
 * @param cvData The CV data to render
 * @param templateId The ID of the template to use
 * @returns Promise that resolves when the PDF has been generated
 */
export const generatePDF = async (cvData: CVData, templateId: string): Promise<void> => {
  try {
    // Fetch the template HTML
    const response = await fetch(`/templates/${templateId}.html`);
    if (!response.ok) {
      throw new Error(`Failed to load template: ${response.statusText}`);
    }
    
    const templateHtml = await response.text();
    
    // Create a temporary DOM parser to work with the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(templateHtml, 'text/html');
    
    // Update the template with CV data
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
          <h3 class="job-title">${exp.jobTitle || ''}</h3>
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
          <div class="location">${''}</div>
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
          <div class="reference-title">${reference.position || ''}</div>
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
    
    // Get the modified HTML
    const updatedHtml = doc.documentElement.outerHTML;
    
    // Create a temporary container with the updated HTML
    const container = document.createElement('div');
    container.innerHTML = updatedHtml;
    document.body.appendChild(container);
    
    // Configure PDF options
    const options = {
      margin: [0, 0, 0, 0],
      filename: `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as 'portrait' | 'landscape' }
    };
    
    // Generate and download the PDF
    await html2pdf().from(container).set(options).save();
    
    // Clean up
    document.body.removeChild(container);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Direct download CV as PDF using the backend API
 * @param cvData The CV data to use
 * @param templateId The template ID to use
 * @returns Promise that resolves when the download is complete
 */
export const directDownloadCVAsPDF = async (cvData: CVData, templateId: string): Promise<void> => {
  try {
    console.log(`Attempting direct download with template: ${templateId}`);
    
    // Get the PDF blob from the backend API
    const pdfBlob = await directDownloadCV(templateId, cvData);
    
    // Generate filename based on user data
    const filename = `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV.pdf`.replace(/\s+/g, '_').toUpperCase();
    
    // Download the blob
    downloadBlob(pdfBlob, filename);
    
    console.log(`PDF downloaded as ${filename}`);
  } catch (error) {
    console.error('Error in direct download:', error);
    alert('Failed to download CV. Please try again.');
    throw error;
  }
};
