import React from 'react';
import { CVData } from '@shared/schema';

export function StreetHustlerTemplate({
  personalInfo,
  workExperience = [],
  education = [],
  skills = [],
  summary = "",
  languages = [],
  references = [],
  certifications = [],
  projects = [],
  hobbies
}: CVData): JSX.Element {
  return (
    <div style={{ 
      fontFamily: "'Lato', sans-serif",
      margin: 0,
      padding: '20px',
      backgroundColor: '#f8f8f8',
      color: '#3a3a3a',
      lineHeight: 1.6,
      fontSize: '10pt',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale'
    }}>
      <div style={{
        maxWidth: '850px',
        margin: '20px auto',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        padding: '40px'
      }}>
        {/* Header Section */}
        <header style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <h1 style={{
            fontSize: '2.5em',
            color: '#111',
            marginBottom: '3px',
            fontWeight: 700,
            marginTop: 0
          }}>
            {personalInfo?.firstName} {personalInfo?.lastName}
          </h1>
          <h2 style={{
            fontSize: '1.1em',
            color: '#555',
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: 0,
            marginTop: '3px'
          }}>
            {personalInfo?.jobTitle || ''}
          </h2>
        </header>

        {/* Contact Info Grid */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '15px',
          textAlign: 'center',
          marginBottom: '25px',
          paddingBottom: '20px',
          borderBottom: '1px solid #eee',
          fontSize: '0.9em',
          color: '#444'
        }}>
          {/* Left Column */}
          <div>
            <span style={{ display: 'block', lineHeight: 1.4 }}>{personalInfo?.phone}</span>
            <a href={personalInfo?.website} style={{ display: 'block', lineHeight: 1.4, color: '#444', textDecoration: 'none' }}>{personalInfo?.website}</a>
          </div>
          
          {/* Middle Column */}
          <div>
            <span style={{ display: 'block', lineHeight: 1.4 }}>{personalInfo?.email}</span>
            <a href={personalInfo?.linkedin} style={{ display: 'block', lineHeight: 1.4, color: '#444', textDecoration: 'none' }}>{personalInfo?.linkedin}</a>
          </div>
          
          {/* Right Column */}
          <div>
            <span style={{ display: 'block', lineHeight: 1.4 }}>
              {personalInfo?.address && personalInfo.address}
              {personalInfo?.city && `, ${personalInfo.city}`}
              {personalInfo?.zipCode && `, ${personalInfo.zipCode}`}
            </span>
            <a href={personalInfo?.github} style={{ display: 'block', lineHeight: 1.4, color: '#444', textDecoration: 'none' }}>{personalInfo?.github}</a>
          </div>
        </section>

        {/* Summary Section */}
        <section style={{
          textAlign: 'center',
          marginBottom: '30px',
          padding: '0 10px'
        }}>
          <p style={{
            fontSize: '0.95em',
            color: '#444',
            lineHeight: 1.7
          }}>
            {summary}
          </p>
        </section>

        {/* Experience Section */}
        <section style={{ marginBottom: '25px' }}>
          <h3 style={{
            fontSize: '1.1em',
            color: '#222',
            marginBottom: '15px',
            paddingBottom: '5px',
            borderBottom: '2px solid #444',
            textTransform: 'uppercase',
            letterSpacing: '1.5px'
          }}>
            PROFESSIONAL EXPERIENCE
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {workExperience.map((exp, index) => (
              <li key={index} style={{ marginBottom: index < workExperience.length - 1 ? '25px' : '0' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ flexGrow: 1 }}>
                    <strong style={{
                      display: 'block',
                      fontSize: '1.05em',
                      color: '#222',
                      marginBottom: '2px',
                      textTransform: 'uppercase'
                    }}>
                      {exp.company}
                    </strong>
                    <span style={{
                      display: 'block',
                      fontSize: '1em',
                      color: '#444',
                      fontStyle: 'italic'
                    }}>
                      {exp.jobTitle}
                    </span>
                  </div>
                  <div style={{
                    flexShrink: 0,
                    textAlign: 'right',
                    fontSize: '0.9em',
                    color: '#555',
                    paddingLeft: '15px'
                  }}>
                    <span style={{
                      display: 'block',
                      lineHeight: 1.4,
                      fontWeight: 600
                    }}>
                      {exp.location}
                    </span>
                    <span style={{
                      display: 'block',
                      lineHeight: 1.4,
                      fontWeight: 600
                    }}>
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                </div>
                <ul style={{ 
                  listStyle: 'none', 
                  paddingLeft: 0, 
                  marginTop: '5px' 
                }}>
                  {exp.achievements?.map((item, idx) => (
                    <li key={idx} style={{
                      fontSize: '0.95em',
                      color: '#444',
                      marginBottom: '5px',
                      paddingLeft: '18px',
                      position: 'relative'
                    }}>
                      <span style={{
                        content: '•',
                        color: '#555',
                        position: 'absolute',
                        left: 0,
                        top: '0.1em',
                        fontSize: '1em'
                      }}>
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* Education Section */}
        <section style={{ marginBottom: '25px' }}>
          <h3 style={{
            fontSize: '1.1em',
            color: '#222',
            marginBottom: '15px',
            paddingBottom: '5px',
            borderBottom: '2px solid #444',
            textTransform: 'uppercase',
            letterSpacing: '1.5px'
          }}>
            EDUCATION
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {education.map((edu, index) => (
              <li key={index} style={{ marginBottom: index < education.length - 1 ? '25px' : '0' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ flexGrow: 1 }}>
                    <strong style={{
                      display: 'block',
                      fontSize: '1.05em',
                      color: '#222',
                      marginBottom: '2px',
                      textTransform: 'uppercase'
                    }}>
                      {edu.degree} {edu.fieldOfStudy && `IN ${edu.fieldOfStudy.toUpperCase()}`}
                    </strong>
                    <span style={{
                      display: 'block',
                      fontSize: '1em',
                      color: '#444'
                    }}>
                      {edu.schoolName}{edu.location && `, ${edu.location}`}
                    </span>
                  </div>
                  <div style={{
                    flexShrink: 0,
                    textAlign: 'right',
                    fontSize: '0.9em',
                    color: '#555',
                    paddingLeft: '15px'
                  }}>
                    {edu.gpa && <span style={{
                      display: 'block',
                      lineHeight: 1.4,
                      fontWeight: 600
                    }}>
                      GPA: {edu.gpa} / 4.0
                    </span>}
                    <span style={{
                      display: 'block',
                      lineHeight: 1.4,
                      fontWeight: 600
                    }}>
                      {edu.graduationDate}
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
            fontSize: '1.1em',
            color: '#222',
            marginBottom: '15px',
            paddingBottom: '5px',
            borderBottom: '2px solid #444',
            textTransform: 'uppercase',
            letterSpacing: '1.5px'
          }}>
            SKILLS
          </h3>
          <ul style={{
            columns: 2,
            columnGap: '30px',
            listStyle: 'none',
            paddingLeft: 0
          }}>
            {skills.map((skill, index) => (
              <li key={index} style={{
                fontSize: '0.95em',
                color: '#444',
                marginBottom: '8px',
                paddingLeft: '18px',
                position: 'relative',
                breakInside: 'avoid-column'
              }}>
                <span style={{
                  content: '•',
                  color: '#555',
                  position: 'absolute',
                  left: 0,
                  top: '0.1em',
                  fontSize: '1em'
                }}>
                  •
                </span>
                {skill.name} {skill.level && ` - ${skill.level}`}
              </li>
            ))}
            
            {/* Languages */}
            {languages.length > 0 && languages.map((lang, index) => (
              <li key={`lang-${index}`} style={{
                fontSize: '0.95em',
                color: '#444',
                marginBottom: '8px',
                paddingLeft: '18px',
                position: 'relative',
                breakInside: 'avoid-column'
              }}>
                <span style={{
                  content: '•',
                  color: '#555',
                  position: 'absolute',
                  left: 0,
                  top: '0.1em',
                  fontSize: '1em'
                }}>
                  •
                </span>
                {`${lang.language} - ${lang.proficiency}`}
              </li>
            ))}
          </ul>
        </section>

        {/* Certifications Section (Optional) */}
        {certifications && certifications.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#222',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '2px solid #444',
              textTransform: 'uppercase',
              letterSpacing: '1.5px'
            }}>
              CERTIFICATIONS
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {certifications.map((cert, index) => (
                <li key={index} style={{
                  fontSize: '0.95em',
                  color: '#444',
                  marginBottom: '8px',
                  paddingLeft: '18px',
                  position: 'relative'
                }}>
                  <span style={{
                    content: '•',
                    color: '#555',
                    position: 'absolute',
                    left: 0,
                    top: '0.1em',
                    fontSize: '1em'
                  }}>
                    •
                  </span>
                  <strong>{cert.name}</strong>
                  {cert.issuer && `, ${cert.issuer}`}
                  {cert.date && ` (${cert.date})`}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* References Section (Optional) */}
        {references && references.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#222',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '2px solid #444',
              textTransform: 'uppercase',
              letterSpacing: '1.5px'
            }}>
              REFERENCES
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              justifyContent: 'space-between'
            }}>
              {references.map((ref, index) => (
                <div key={index} style={{
                  width: 'calc(50% - 10px)',
                  marginBottom: '10px'
                }}>
                  <div style={{ fontWeight: 'bold' }}>{ref.name}</div>
                  <div>{ref.title}{ref.company && `, ${ref.company}`}</div>
                  {ref.email && <div>{ref.email}</div>}
                  {ref.phone && <div>{ref.phone}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hobbies Section (Optional) */}
        {hobbies && hobbies.length > 0 && (
          <section style={{ marginBottom: '0' }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#222',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '2px solid #444',
              textTransform: 'uppercase',
              letterSpacing: '1.5px'
            }}>
              HOBBIES & INTERESTS
            </h3>
            <p style={{ fontSize: '0.95em', color: '#444' }}>
              {hobbies.join(', ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
