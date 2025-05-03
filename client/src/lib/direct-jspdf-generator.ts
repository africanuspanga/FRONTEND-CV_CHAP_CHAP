/**
 * Direct jsPDF generator without HTML capture
 * This approach builds the PDF directly using jsPDF commands instead of
 * capturing HTML, which can be more reliable but requires manual layout.
 */

import jsPDF from 'jspdf';
import { getTemplateByID } from '@/lib';

/**
 * Check if a value is valid for printing
 */
function isValidValue(value: any): boolean {
  return value !== undefined && value !== null && value !== '';
}

/**
 * Safely get text from potentially complex values
 */
function safeGetText(value: any): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return '';
}

/**
 * Generate PDF directly using jsPDF
 */
export async function generateDirectPDF(templateId: string, cvData: any): Promise<Blob> {
  console.log('Direct jsPDF generator starting for template:', templateId);
  
  // Get the template metadata
  const template = getTemplateByID(templateId);
  if (!template) {
    throw new Error(`Template with ID '${templateId}' not found`);
  }
  
  // Normalize data
  const personalInfo = cvData.personalInfo || {};
  const workExperiences = cvData.workExperiences || cvData.workExperience || [];
  const education = cvData.education || [];
  const skills = cvData.skills || [];
  const summary = cvData.summary || personalInfo.summary || '';
  const languages = cvData.languages || [];
  const references = cvData.references || [];
  
  // Initialize PDF Document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Set default font
  pdf.setFont('helvetica');
  
  // Add a red debugging border to the PDF to ensure something is being drawn
  pdf.setDrawColor(255, 0, 0); // Red
  pdf.setLineWidth(0.5);
  pdf.rect(5, 5, 200, 287); // A4 page with margins
  
  // Add metadata
  pdf.setProperties({
    title: `CV - ${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`,
    subject: 'Curriculum Vitae',
    author: `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`,
    keywords: 'cv, resume, curriculum vitae',
    creator: 'CV Chap Chap'
  });
  
  // Set text colors
  pdf.setTextColor(0, 0, 0); // Black text
  
  // Draw a header for debugging
  pdf.setFillColor(255, 0, 0); // Red
  pdf.rect(10, 10, 190, 15, 'F');
  pdf.setTextColor(255, 255, 255); // White text
  pdf.setFontSize(16);
  pdf.text(`CV GENERATED WITH TEMPLATE: ${template.name}`, 15, 20);
  
  // Reset text color
  pdf.setTextColor(0, 0, 0); // Black text
  
  // Personal Info Section
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PERSONAL INFORMATION', 10, 40);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  
  let y = 50; // Current Y position
  
  // Add personal info fields
  if (isValidValue(personalInfo.firstName) && isValidValue(personalInfo.lastName)) {
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${personalInfo.firstName} ${personalInfo.lastName}`, 10, y);
    y += 7;
  }
  
  if (isValidValue(personalInfo.professionalTitle)) {
    pdf.setFont('helvetica', 'italic');
    pdf.text(personalInfo.professionalTitle, 10, y);
    y += 7;
  }
  
  pdf.setFont('helvetica', 'normal');
  
  if (isValidValue(personalInfo.email)) {
    pdf.text(`Email: ${personalInfo.email}`, 10, y);
    y += 7;
  }
  
  if (isValidValue(personalInfo.phone)) {
    pdf.text(`Phone: ${personalInfo.phone}`, 10, y);
    y += 7;
  }
  
  if (isValidValue(personalInfo.address)) {
    pdf.text(`Address: ${personalInfo.address}`, 10, y);
    y += 7;
  } else {
    // Try to build address from components
    const addressParts = [];
    if (personalInfo.city) addressParts.push(personalInfo.city);
    if (personalInfo.region) addressParts.push(personalInfo.region);
    if (personalInfo.country) addressParts.push(personalInfo.country);
    
    if (addressParts.length > 0) {
      pdf.text(`Address: ${addressParts.join(', ')}`, 10, y);
      y += 7;
    }
  }
  
  // Summary Section
  if (isValidValue(summary)) {
    y += 5; // Add some spacing
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PROFESSIONAL SUMMARY', 10, y);
    y += 7;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    // Split long text into lines
    const summaryLines = pdf.splitTextToSize(summary, 190); // 190mm is the width
    pdf.text(summaryLines, 10, y);
    y += (summaryLines.length * 7) + 5;
  }
  
  // Work Experience Section
  if (workExperiences.length > 0) {
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('WORK EXPERIENCE', 10, y);
    y += 10;
    
    pdf.setFontSize(12);
    
    workExperiences.forEach((job: any) => {
      if (!job) return;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(safeGetText(job.jobTitle), 10, y);
      y += 5;
      
      pdf.setFont('helvetica', 'italic');
      
      let jobInfo = `${safeGetText(job.company)}`;
      if (job.location) jobInfo += `, ${safeGetText(job.location)}`;
      pdf.text(jobInfo, 10, y);
      y += 5;
      
      pdf.setFont('helvetica', 'normal');
      let dateRange = '';
      if (job.startDate) {
        dateRange = `${safeGetText(job.startDate)}`;
        if (job.current) {
          dateRange += ' - Present';
        } else if (job.endDate) {
          dateRange += ` - ${safeGetText(job.endDate)}`;
        }
      }
      
      if (dateRange) {
        pdf.text(dateRange, 10, y);
        y += 5;
      }
      
      // Job description
      if (job.description) {
        const descLines = pdf.splitTextToSize(safeGetText(job.description), 180);
        pdf.text(descLines, 15, y);
        y += (descLines.length * 5) + 3;
      }
      
      // Job achievements or responsibilities
      if (job.bullets && job.bullets.length > 0) {
        job.bullets.forEach((bullet: any) => {
          pdf.text('•', 15, y);
          const bulletText = pdf.splitTextToSize(safeGetText(bullet), 175);
          pdf.text(bulletText, 20, y);
          y += (bulletText.length * 5) + 2;
        });
      }
      
      y += 5; // Add spacing between jobs
    });
    
    y += 5; // Additional spacing after section
  }
  
  // Skills Section
  if (skills.length > 0) {
    // Check if we need a new page
    if (y > 250) {
      pdf.addPage();
      y = 20;
    }
    
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SKILLS', 10, y);
    y += 10;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    // Split skills into chunks to create columns
    const skillsPerColumn = 6;
    const columns = 2;
    const columnWidth = 80;
    
    for (let i = 0; i < skills.length; i++) {
      const columnIndex = Math.floor(i / skillsPerColumn);
      if (columnIndex < columns) {
        const rowIndex = i % skillsPerColumn;
        const skill = skills[i];
        const xPos = 10 + (columnIndex * columnWidth);
        const yPos = y + (rowIndex * 7);
        
        pdf.text(`• ${safeGetText(skill.name)}`, xPos, yPos);
      }
    }
    
    y += Math.ceil(skills.length / columns) * 7 + 10;
  }
  
  // Education Section
  if (education.length > 0) {
    // Check if we need a new page
    if (y > 250) {
      pdf.addPage();
      y = 20;
    }
    
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EDUCATION', 10, y);
    y += 10;
    
    pdf.setFontSize(12);
    
    education.forEach((edu: any) => {
      if (!edu) return;
      
      pdf.setFont('helvetica', 'bold');
      if (edu.degree) {
        pdf.text(safeGetText(edu.degree), 10, y);
        y += 5;
      }
      
      pdf.setFont('helvetica', 'italic');
      if (edu.institution) {
        let schoolInfo = safeGetText(edu.institution);
        if (edu.location) schoolInfo += `, ${safeGetText(edu.location)}`;
        pdf.text(schoolInfo, 10, y);
        y += 5;
      }
      
      pdf.setFont('helvetica', 'normal');
      let dateRange = '';
      if (edu.startDate) {
        dateRange = `${safeGetText(edu.startDate)}`;
        if (edu.current) {
          dateRange += ' - Present';
        } else if (edu.endDate) {
          dateRange += ` - ${safeGetText(edu.endDate)}`;
        }
      }
      
      if (dateRange) {
        pdf.text(dateRange, 10, y);
        y += 5;
      }
      
      // Education description
      if (edu.description) {
        const descLines = pdf.splitTextToSize(safeGetText(edu.description), 180);
        pdf.text(descLines, 15, y);
        y += (descLines.length * 5) + 3;
      }
      
      y += 5; // Add spacing between education items
    });
    
    y += 5; // Additional spacing after section
  }
  
  // Languages Section
  if (languages.length > 0) {
    // Check if we need a new page
    if (y > 250) {
      pdf.addPage();
      y = 20;
    }
    
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LANGUAGES', 10, y);
    y += 10;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    languages.forEach((lang: any) => {
      if (!lang) return;
      
      let langText = safeGetText(lang.name);
      if (lang.proficiency) langText += ` - ${safeGetText(lang.proficiency)}`;
      
      pdf.text(`• ${langText}`, 10, y);
      y += 7;
    });
    
    y += 5; // Additional spacing after section
  }
  
  // References Section
  if (references.length > 0) {
    // Check if we need a new page
    if (y > 220) {
      pdf.addPage();
      y = 20;
    }
    
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('REFERENCES', 10, y);
    y += 10;
    
    pdf.setFontSize(12);
    
    references.forEach((ref: any) => {
      if (!ref) return;
      
      pdf.setFont('helvetica', 'bold');
      if (ref.name) {
        pdf.text(safeGetText(ref.name), 10, y);
        y += 5;
      }
      
      pdf.setFont('helvetica', 'normal');
      
      if (ref.position || ref.company) {
        let posInfo = [];
        if (ref.position) posInfo.push(safeGetText(ref.position));
        if (ref.company) posInfo.push(safeGetText(ref.company));
        
        if (posInfo.length > 0) {
          pdf.text(posInfo.join(', '), 10, y);
          y += 5;
        }
      }
      
      if (ref.email) {
        pdf.text(`Email: ${safeGetText(ref.email)}`, 10, y);
        y += 5;
      }
      
      if (ref.phone) {
        pdf.text(`Phone: ${safeGetText(ref.phone)}`, 10, y);
        y += 5;
      }
      
      y += 5; // Add spacing between references
    });
  }
  
  // Add a footer with CV Chap Chap branding
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150); // Gray
    pdf.text('Generated with CV Chap Chap', 10, 290);
    pdf.text(`Page ${i} of ${pageCount}`, 180, 290);
  }
  
  // Return the PDF as a blob
  return pdf.output('blob');
}

/**
 * Generate and download a PDF
 */
export async function generateAndDownloadPDF(templateId: string, cvData: any): Promise<void> {
  try {
    console.log('Starting direct PDF download for template:', templateId);
    
    // Generate PDF
    const pdfBlob = await generateDirectPDF(templateId, cvData);
    
    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cv-${Date.now()}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log('PDF download initiated successfully');
  } catch (error) {
    console.error('Failed to generate or download PDF:', error);
    throw error;
  }
}