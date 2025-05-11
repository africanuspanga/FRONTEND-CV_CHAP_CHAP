import React from 'react';
import type { CVData } from '@shared/schema';

export function MjenziWaTaifaTemplate({ 
  personalInfo, 
  workExperiences = [], 
  education = [], 
  skills = [], 
  languages = [], 
  references = [],
  hobbies = "",
  certifications = [],
  projects = []
}: CVData): JSX.Element {
  return (
    <div style={{ 
      fontFamily: "'Open Sans', sans-serif",
      margin: 0,
      padding: '20px',
      backgroundColor: '#f4f4f4',
      color: '#333',
      lineHeight: 1.6,
      fontSize: '10pt',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale'
    }}>
      <div style={{
        maxWidth: '850px',
        margin: '20px auto',
        backgroundColor: '#ffffff',
        padding: 0,
        boxSizing: 'border-box',
        border: '1px solid #e0e0e0'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: '#2c3e50',
          color: '#ffffff',
          textAlign: 'center',
          padding: '25px 20px',
          marginBottom: 0
        }}>
          <h1 style={{
            fontSize: '2.6em',
            color: '#ffffff',
            marginBottom: 0,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: 900
          }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <h2 style={{
            display: 'none'
          }}>
            {personalInfo.professionalTitle}
          </h2>
        </header>

        {/* Contact Info Bar */}
        <section style={{
          textAlign: 'center',
          padding: '10px 20px',
          borderBottom: '1px solid #e0e0e0',
          fontSize: '0.9em',
          color: '#555',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '5px 8px',
          backgroundColor: '#f8f9fa'
        }}>
          <span style={{ whiteSpace: 'nowrap' }}>{personalInfo.address}</span>
          <span style={{ color: '#ccc', margin: '0 3px' }}>|</span>
          <span style={{ whiteSpace: 'nowrap' }}>{personalInfo.phone}</span>
          <span style={{ color: '#ccc', margin: '0 3px' }}>|</span>
          <span style={{ whiteSpace: 'nowrap' }}>{personalInfo.email}</span>
        </section>
        
        {/* Main Content Area */}
        <main style={{ padding: '30px 40px' }}>
          {/* Summary Section */}
          <section>
            <h3 style={{
              fontSize: '1.15em',
              color: '#2c3e50',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '2px solid #2c3e50',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 700
            }}>
              Professional Summary
            </h3>
            <p style={{
              fontSize: '0.95em',
              color: '#444',
              lineHeight: 1.7,
              marginBottom: 0
            }}>
              {personalInfo.summary}
            </p>
          </section>

          {/* Skills Section */}
          <section style={{ marginTop: '20px' }}>
            <h3 style={{
              fontSize: '1.15em',
              color: '#2c3e50',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '2px solid #2c3e50',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 700
            }}>
              Skills
            </h3>
            <ul style={{
              columns: 2,
              columnGap: '30px',
              margin: 0,
              padding: 0
            }}>
              {skills.map((skill, index) => (
                <li key={index} style={{
                  fontSize: '0.95em',
                  color: '#444',
                  marginBottom: '8px',
                  paddingLeft: '15px',
                  position: 'relative',
                  breakInside: 'avoid-column'
                }}>
                  <span style={{
                    color: '#2c3e50',
                    position: 'absolute',
                    left: 0,
                    top: '0.1em',
                    fontSize: '1em'
                  }}>•</span>
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>

          {/* Work History Section */}
          <section style={{ marginTop: '20px' }}>
            <h3 style={{
              fontSize: '1.15em',
              color: '#2c3e50',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '2px solid #2c3e50',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 700
            }}>
              Work History
            </h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {workExperiences.map((job, index) => (
                <li key={index} style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '5px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flexGrow: 1 }}>
                      <strong style={{
                        fontSize: '1.05em',
                        color: '#222',
                        display: 'block',
                        marginBottom: '2px'
                      }}>
                        {job.jobTitle}
                      </strong>
                      <span style={{
                        fontSize: '1em',
                        color: '#444',
                        display: 'block',
                        fontStyle: 'italic'
                      }}>
                        {job.company}
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
                        {job.startDate} - {job.endDate || 'Current'}
                      </span>
                      <span style={{
                        display: 'block',
                        lineHeight: 1.4,
                        fontWeight: 600
                      }}>
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <ul style={{
                    listStyle: 'none',
                    paddingLeft: 0,
                    marginTop: '5px'
                  }}>
                    {job.achievements && job.achievements.map((achievement, achieveIndex) => (
                      <li key={`achieve-${achieveIndex}`} style={{
                        fontSize: '0.95em',
                        color: '#444',
                        marginBottom: '4px',
                        paddingLeft: '15px',
                        position: 'relative'
                      }}>
                        <span style={{
                          content: '•',
                          color: '#2c3e50',
                          position: 'absolute',
                          left: 0,
                          top: '0.1em',
                          fontSize: '1em'
                        }}>•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>

          {/* Education Section */}
          <section style={{ marginTop: '20px' }}>
            <h3 style={{
              fontSize: '1.15em',
              color: '#2c3e50',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '2px solid #2c3e50',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 700
            }}>
              Education
            </h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {education.map((edu, index) => (
                <li key={index} style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '5px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flexGrow: 1 }}>
                      <strong style={{
                        fontSize: '1.05em',
                        color: '#222',
                        display: 'block',
                        marginBottom: '2px'
                      }}>
                        {edu.degree}
                      </strong>
                      <span style={{
                        fontSize: '1em',
                        color: '#444',
                        display: 'block',
                        fontStyle: 'italic'
                      }}>
                        {edu.institution}
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
                        {edu.endDate}
                      </span>
                      <span style={{
                        display: 'block',
                        lineHeight: 1.4,
                        fontWeight: 600
                      }}>
                        {edu.location}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Languages Section */}
          {languages && languages.length > 0 && (
            <section style={{ marginTop: '20px' }}>
              <h3 style={{
                fontSize: '1.15em',
                color: '#2c3e50',
                marginBottom: '15px',
                paddingBottom: '5px',
                borderBottom: '2px solid #2c3e50',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 700
              }}>
                Languages
              </h3>
              {languages.map((language, index) => (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                    fontSize: '0.95em'
                  }}>
                    <span style={{
                      color: '#333',
                      fontWeight: 600
                    }}>
                      {language.name}
                    </span>
                    <span style={{
                      color: '#555',
                      fontSize: '0.9em'
                    }}>
                      {language.proficiency}
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      backgroundColor: '#2c3e50',
                      borderRadius: '4px',
                      width: language.name === 'English' ? '100%' : 
                             language.name === 'Arabic' ? '75%' : '100%'
                    }}></div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* References Section */}
          {references && references.length > 0 && (
            <section style={{ marginTop: '20px', display: 'none' }} id="referencesSection">
              <h3 style={{
                fontSize: '1.15em',
                color: '#2c3e50',
                marginBottom: '15px',
                paddingBottom: '5px',
                borderBottom: '2px solid #2c3e50',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 700
              }}>
                References
              </h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {references.map((reference, index) => (
                  <li key={index} style={{
                    marginBottom: '10px',
                    lineHeight: 1.4,
                    fontSize: '0.95em',
                    color: '#555'
                  }}>
                    <strong style={{
                      display: 'block',
                      color: '#444',
                      fontWeight: 'bold'
                    }}>
                      {reference.name}
                    </strong>
                    {reference.position} at {reference.company}<br />
                    {reference.phone}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Hobbies Section */}
          {hobbies && (
            <section style={{ marginTop: '20px', display: 'none' }} id="hobbiesSection">
              <h3 style={{
                fontSize: '1.15em',
                color: '#2c3e50',
                marginBottom: '15px',
                paddingBottom: '5px',
                borderBottom: '2px solid #2c3e50',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 700
              }}>
                Hobbies
              </h3>
              <p style={{
                fontSize: '0.95em',
                color: '#444',
                lineHeight: 1.7,
                marginBottom: 0
              }}>
                {hobbies}
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}