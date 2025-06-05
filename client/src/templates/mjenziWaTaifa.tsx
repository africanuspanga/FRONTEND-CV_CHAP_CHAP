import React from 'react';
import type { CVData } from '@shared/schema';

export function MjenziWaTaifaTemplate({ 
  personalInfo, 
  workExperiences = [], 
  education = [], 
  skills = [], 
  summary = "",
  languages = [], 
  references = [],
  hobbies = "",
  certifications = [],
  projects = []
}: CVData): JSX.Element {
  // Filter valid work experiences
  const validWorkExperiences = workExperiences?.filter(exp => exp.jobTitle && exp.company) || [];
  // Filter valid education entries
  const validEducation = education?.filter(edu => edu.institution && edu.degree) || [];
  // Filter valid skills
  const validSkills = skills?.filter(skill => skill.name) || [];
  // Filter valid languages
  const validLanguages = languages?.filter(lang => lang.name) || [];

  return (
    <div style={{ 
      fontFamily: "'Arial', sans-serif",
      margin: 0,
      padding: 0,
      backgroundColor: '#ffffff',
      color: '#333333',
      lineHeight: 1.5,
      fontSize: '11pt'
    }}>
      <div style={{
        maxWidth: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        padding: 0,
        boxSizing: 'border-box'
      }}>
        {/* Header with dark background */}
        <header style={{
          backgroundColor: '#556B73',
          color: '#ffffff',
          textAlign: 'center',
          padding: '30px 40px',
          marginBottom: 0
        }}>
          <h1 style={{
            fontSize: '28pt',
            color: '#ffffff',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            fontWeight: 'bold'
          }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
        </header>

        {/* Contact Information */}
        <div style={{
          textAlign: 'center',
          padding: '15px 40px',
          backgroundColor: '#f8f8f8',
          borderBottom: '1px solid #e0e0e0',
          fontSize: '10pt',
          color: '#666666'
        }}>
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.phone && <span style={{ margin: '0 20px' }}>{personalInfo.phone}</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
        </div>

        {/* Main Content */}
        <div style={{ padding: '30px 40px' }}>
          
          {/* Professional Summary */}
          {summary && (
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '12pt',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: '#333333',
                marginBottom: '8px',
                borderBottom: '2px solid #333333',
                paddingBottom: '5px'
              }}>
                PROFESSIONAL SUMMARY
              </h3>
              <p style={{
                margin: '12px 0 0 0',
                textAlign: 'justify',
                lineHeight: 1.6
              }}>
                {summary}
              </p>
            </section>
          )}

          {/* Skills */}
          {validSkills.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '12pt',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: '#333333',
                marginBottom: '8px',
                borderBottom: '2px solid #333333',
                paddingBottom: '5px'
              }}>
                SKILLS
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '5px',
                marginTop: '12px'
              }}>
                {validSkills.map((skill, index) => (
                  <div key={index} style={{
                    fontSize: '10pt',
                    paddingLeft: '15px',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: '0',
                      top: '0'
                    }}>•</span>
                    {skill.name}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Work History */}
          {validWorkExperiences.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '12pt',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: '#333333',
                marginBottom: '8px',
                borderBottom: '2px solid #333333',
                paddingBottom: '5px'
              }}>
                WORK HISTORY
              </h3>
              {validWorkExperiences.map((exp, index) => (
                <div key={index} style={{ marginBottom: '20px', marginTop: '12px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '5px'
                  }}>
                    <h4 style={{
                      fontSize: '11pt',
                      fontWeight: 'bold',
                      margin: 0,
                      color: '#333333'
                    }}>
                      {exp.jobTitle}
                    </h4>
                    <span style={{
                      fontSize: '10pt',
                      color: '#666666',
                      fontStyle: 'italic'
                    }}>
                      {exp.startDate} - {exp.current ? 'Current' : exp.endDate}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '10pt',
                    fontStyle: 'italic',
                    color: '#666666',
                    marginBottom: '8px'
                  }}>
                    {exp.company}
                    {exp.location && <span style={{ marginLeft: '20px' }}>{exp.location}</span>}
                  </div>
                  {exp.description && (
                    <p style={{
                      margin: '8px 0',
                      fontSize: '10pt',
                      textAlign: 'justify',
                      lineHeight: 1.5
                    }}>
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul style={{
                      margin: '8px 0 0 0',
                      paddingLeft: '15px',
                      listStyleType: 'disc'
                    }}>
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} style={{
                          fontSize: '10pt',
                          marginBottom: '3px',
                          lineHeight: 1.4
                        }}>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {validEducation.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '12pt',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: '#333333',
                marginBottom: '8px',
                borderBottom: '2px solid #333333',
                paddingBottom: '5px'
              }}>
                EDUCATION
              </h3>
              {validEducation.map((edu, index) => (
                <div key={index} style={{ marginTop: '12px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <div>
                      <h4 style={{
                        fontSize: '11pt',
                        fontWeight: 'bold',
                        margin: 0,
                        color: '#333333'
                      }}>
                        {edu.degree}
                      </h4>
                      <div style={{
                        fontSize: '10pt',
                        fontStyle: 'italic',
                        color: '#666666',
                        marginTop: '2px'
                      }}>
                        {edu.institution}
                      </div>
                    </div>
                    <div style={{
                      textAlign: 'right',
                      fontSize: '10pt',
                      color: '#666666'
                    }}>
                      <div>{edu.endDate}</div>
                      {edu.location && <div>{edu.location}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Languages */}
          {validLanguages.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '12pt',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: '#333333',
                marginBottom: '8px',
                borderBottom: '2px solid #333333',
                paddingBottom: '5px'
              }}>
                LANGUAGES
              </h3>
              {validLanguages.map((lang, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '8px',
                  fontSize: '10pt'
                }}>
                  <span style={{ fontWeight: 'bold' }}>{lang.name}</span>
                  <div style={{ flex: 1, margin: '0 15px' }}>
                    <div style={{
                      height: '8px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        backgroundColor: '#556B73',
                        width: lang.proficiency === 'native' ? '100%' :
                              lang.proficiency === 'fluent' ? '90%' :
                              lang.proficiency === 'advanced' ? '75%' :
                              lang.proficiency === 'intermediate' ? '60%' :
                              lang.proficiency === 'beginner' ? '30%' : '50%'
                      }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '9pt', color: '#666666', textTransform: 'capitalize' }}>
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </section>
          )}

        </div>
      </div>
    </div>
  );
}