import { CVData } from '@/types/cv';

export interface PDFGeneratorOptions {
  templateId: string;
  data: CVData;
}

export async function generatePDF(options: PDFGeneratorOptions): Promise<Buffer> {
  const { templateId, data } = options;

  const html = generateHTMLForTemplate(templateId, data);
  
  const pdfBuffer = await renderHTMLToPDF(html);
  
  return pdfBuffer;
}

function generateHTMLForTemplate(templateId: string, data: CVData): string {
  const { personalInfo, summary, workExperiences, education, skills, languages, references } = data;

  const getTemplateColor = (id: string): string => {
    const colors: Record<string, string> = {
      'kathleen': '#E5B94E',
      'lauren-orange': '#E07A38',
      'grace-mint': '#6BBFAB',
      'grace-navy': '#1E4A6D',
      'grace-coral': '#E85A5A',
      'grace-teal': '#2AAA9E',
      'grace-minimal': '#6B7280',
      'nelly-mint': '#3EB489',
      'nelly-gray': '#4B5563',
      'nelly-sidebar': '#374151',
      'nelly-purple': '#8B7BB5',
      'lesley': '#2B4764',
      'kelly': '#1F2937',
      'richard': '#111827',
      'charles': '#0891B2',
      'denice': '#9B7B7B',
      'oliver': '#E07A38',
      'thomas': '#8ECFC8',
      'lauren-icons': '#374151',
      'aparna-dark': '#1E3A5F',
      'aparna-gold': '#D4A056',
    };
    return colors[id] || '#2563EB';
  };

  const color = getTemplateColor(templateId);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: A4; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Helvetica Neue', Arial, sans-serif; 
      font-size: 11pt;
      line-height: 1.4;
      color: #1F2937;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 40px;
      background: white;
    }
    .header {
      border-bottom: 3px solid ${color};
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .name {
      font-size: 28pt;
      font-weight: bold;
      color: ${color};
      margin-bottom: 5px;
    }
    .title {
      font-size: 14pt;
      color: #4B5563;
    }
    .contact {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-top: 10px;
      font-size: 10pt;
      color: #6B7280;
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      color: ${color};
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid #E5E7EB;
    }
    .summary {
      color: #4B5563;
      line-height: 1.6;
    }
    .experience-item {
      margin-bottom: 15px;
    }
    .experience-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .job-title {
      font-weight: bold;
      color: #1F2937;
    }
    .date {
      color: #6B7280;
      font-size: 10pt;
    }
    .company {
      color: ${color};
      font-size: 11pt;
    }
    .achievements {
      margin-top: 8px;
      padding-left: 15px;
    }
    .achievements li {
      margin-bottom: 4px;
      color: #4B5563;
    }
    .education-item {
      margin-bottom: 10px;
    }
    .degree {
      font-weight: bold;
    }
    .institution {
      color: #6B7280;
    }
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .skill-badge {
      background: ${color}20;
      color: ${color};
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 10pt;
    }
    .two-column {
      display: flex;
      gap: 30px;
    }
    .column {
      flex: 1;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="name">${personalInfo.firstName} ${personalInfo.lastName}</div>
      <div class="title">${personalInfo.professionalTitle}</div>
      <div class="contact">
        ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
        ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ''}
        ${personalInfo.location ? `<span>${personalInfo.location}</span>` : ''}
      </div>
    </div>

    ${summary ? `
    <div class="section">
      <div class="section-title">Professional Summary</div>
      <p class="summary">${summary}</p>
    </div>
    ` : ''}

    ${workExperiences.length > 0 ? `
    <div class="section">
      <div class="section-title">Work Experience</div>
      ${workExperiences.map(exp => `
        <div class="experience-item">
          <div class="experience-header">
            <span class="job-title">${exp.jobTitle}</span>
            <span class="date">${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}</span>
          </div>
          <div class="company">${exp.company}${exp.location ? ` | ${exp.location}` : ''}</div>
          ${exp.achievements.length > 0 ? `
            <ul class="achievements">
              ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="two-column">
      ${education.length > 0 ? `
      <div class="column">
        <div class="section">
          <div class="section-title">Education</div>
          ${education.map(edu => `
            <div class="education-item">
              <div class="degree">${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</div>
              <div class="institution">${edu.institution}</div>
              <div class="date">${edu.graduationDate}</div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      ${skills.length > 0 ? `
      <div class="column">
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-grid">
            ${skills.map(s => `<span class="skill-badge">${s.name}</span>`).join('')}
          </div>
        </div>
      </div>
      ` : ''}
    </div>

    ${languages && languages.length > 0 ? `
    <div class="section">
      <div class="section-title">Languages</div>
      <div class="skills-grid">
        ${languages.map(l => `<span class="skill-badge">${l.name} (${l.proficiency})</span>`).join('')}
      </div>
    </div>
    ` : ''}

    ${references && references.length > 0 ? `
    <div class="section">
      <div class="section-title">References</div>
      <div class="two-column">
        ${references.map(ref => `
          <div class="column">
            <div class="degree">${ref.name}</div>
            <div class="institution">${ref.title} at ${ref.company}</div>
            <div class="date">${ref.email} | ${ref.phone}</div>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}
  </div>
</body>
</html>
  `.trim();
}

async function renderHTMLToPDF(html: string): Promise<Buffer> {
  return Buffer.from(html, 'utf-8');
}

export function getTemplateStyles(templateId: string) {
  const styles: Record<string, { color: string; font: string }> = {
    'kathleen': { color: '#E5B94E', font: 'serif' },
    'grace-navy': { color: '#1E4A6D', font: 'sans-serif' },
    'charles': { color: '#0891B2', font: 'sans-serif' },
  };
  return styles[templateId] || { color: '#2563EB', font: 'sans-serif' };
}
