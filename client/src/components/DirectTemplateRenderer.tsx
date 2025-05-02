import React from 'react';
import { CVData } from '@shared/schema';

interface DirectTemplateRendererProps {
  cvData: CVData;
  templateId: string;
  height?: number;
}

const DirectTemplateRenderer: React.FC<DirectTemplateRendererProps> = ({
  cvData,
  templateId,
  height = 600
}) => {
  // Directly extract all the relevant data
  const { 
    personalInfo = {}, 
    workExperiences = [], 
    education = [],
    skills = [],
    languages = [],
    references = [],
    hobbies = [],
    certifications = [],
    workExperience = [],
  } = cvData || {};

  // Get workExp from either field name
  const workExp = workExperiences.length > 0 ? workExperiences : (workExperience || []);
  
  // Log the data for debugging
  console.log('Direct renderer data:', {
    personalInfo,
    workExp,
    templateId
  });

  // Render based on template ID
  if (templateId === 'brightDiamond') {
    return (
      <div style={{ 
        fontFamily: "'Lato', sans-serif",
        margin: 0,
        padding: '20px',
        backgroundColor: '#f8f8f8',
        color: '#4a4a4a',
        lineHeight: 1.6,
        fontSize: '10pt',
        height: `${height}px`,
        overflow: 'auto'
      }}>
        <div style={{
          maxWidth: '850px',
          margin: '20px auto',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
          padding: '40px'
        }}>
          {/* Header */}
          <header style={{
            textAlign: 'center',
            marginBottom: '15px',
            paddingBottom: '15px',
            borderBottom: '3px solid #20c997'
          }}>
            <h1 style={{
              fontSize: '2.8em',
              color: '#1a1a1a',
              marginBottom: '0px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 900
            }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 style={{
              fontSize: '1.2em',
              color: '#555',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginBottom: '0'
            }}>
              {personalInfo.professionalTitle || personalInfo.jobTitle}
            </h2>
          </header>

          {/* Contact Bar */}
          <section style={{
            textAlign: 'center',
            marginBottom: '25px',
            paddingBottom: '5px',
            fontSize: '0.9em',
            color: '#555',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '5px 8px'
          }}>
            <span>Phone: {personalInfo.phone}</span>
            <span style={{ color: '#ccc' }}>|</span>
            <span>Address: {personalInfo.address || personalInfo.location}</span>
            <span style={{ color: '#ccc' }}>|</span>
            <span>Email: {personalInfo.email}</span>
          </section>

          {/* Summary Section */}
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{
              fontSize: '1.15em',
              color: '#20c997',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #e0e0e0',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700
            }}>
              PROFESSIONAL SUMMARY
            </h3>
            <p style={{ fontSize: '0.95em', color: '#4a4a4a', lineHeight: 1.7 }}>
              {personalInfo.summary || ''}
            </p>
          </section>

          {/* Experience Section */}
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '1.15em',
              color: '#20c997',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #e0e0e0',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700
            }}>
              EXPERIENCE
            </h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {workExp.map((job: any, index: number) => (
                <li key={index} style={{ marginBottom: '15px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flexGrow: 1 }}>
                      <strong style={{ display: 'block', fontSize: '1.1em', color: '#2a2a2a', marginBottom: '2px' }}>
                        {job.jobTitle}
                      </strong>
                      <span style={{ display: 'block', fontSize: '0.95em', color: '#555' }}>
                        {job.company} - {job.location}
                      </span>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right', fontSize: '0.9em', color: '#555', paddingLeft: '15px', fontWeight: 700 }}>
                      <span style={{ display: 'block', lineHeight: 1.4 }}>
                        {job.startDate} to {job.endDate || 'Present'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Education Section */}
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '1.15em',
              color: '#20c997',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #e0e0e0',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700
            }}>
              EDUCATION
            </h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {education.map((edu: any, index: number) => (
                <li key={index} style={{ marginBottom: '15px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flexGrow: 1 }}>
                      <strong style={{ display: 'block', fontSize: '1.1em', color: '#2a2a2a', marginBottom: '2px' }}>
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </strong>
                      <span style={{ display: 'block', fontSize: '0.95em', color: '#555' }}>
                        {edu.institution}
                      </span>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right', fontSize: '0.9em', color: '#555', paddingLeft: '15px', fontWeight: 700 }}>
                      <span style={{ display: 'block', lineHeight: 1.4 }}>
                        {edu.endDate}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Skills Section */}
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '1.15em',
              color: '#20c997',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #e0e0e0',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700
            }}>
              SKILLS
            </h3>
            <div style={{
              columnCount: 3,
              columnGap: '25px',
              WebkitColumnCount: 3,
              MozColumnCount: 3
            }}>
              {skills.map((skill: any, index: number) => (
                <div key={index} style={{
                  fontSize: '0.95em',
                  color: '#4a4a4a',
                  marginBottom: '8px',
                  paddingLeft: '18px',
                  position: 'relative'
                }}>
                  <span style={{ color: '#20c997', position: 'absolute', left: 0, top: '0.1em', fontSize: '1em' }}>•</span>
                  {skill.name}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Default fallback for any other template
  return (
    <div className="p-4 border rounded-md bg-white" style={{ height: `${height}px`, overflow: 'auto' }}>
      <h1 className="text-2xl font-bold text-gray-800">{personalInfo.firstName} {personalInfo.lastName}</h1>
      <h2 className="text-lg text-gray-600">{personalInfo.professionalTitle || personalInfo.jobTitle}</h2>
      
      <div className="mt-4 flex space-x-4 text-sm text-gray-500">
        <div>{personalInfo.email}</div>
        <div>{personalInfo.phone}</div>
        <div>{personalInfo.address || personalInfo.location}</div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium border-b pb-1 mb-3">Summary</h3>
        <p>{personalInfo.summary}</p>
      </div>
      
      {workExp.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium border-b pb-1 mb-3">Experience</h3>
          {workExp.map((job: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="font-medium">{job.jobTitle}</div>
              <div className="text-sm">{job.company} - {job.location}</div>
              <div className="text-xs">{job.startDate} to {job.endDate || 'Present'}</div>
            </div>
          ))}
        </div>
      )}
      
      {education.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium border-b pb-1 mb-3">Education</h3>
          {education.map((edu: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="font-medium">{edu.degree} {edu.field && `in ${edu.field}`}</div>
              <div className="text-sm">{edu.institution}</div>
              <div className="text-xs">{edu.endDate}</div>
            </div>
          ))}
        </div>
      )}
      
      {skills.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium border-b pb-1 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: any, index: number) => (
              <div key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">{skill.name}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectTemplateRenderer;