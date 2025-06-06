import React from 'react';
import type { CVData } from '@shared/schema';

export function MjenziWaTaifaTemplate(cvData: CVData): JSX.Element {
  const {
    personalInfo, 
    workExperiences = [], 
    education = [], 
    skills = [], 
    languages = [], 
    references = [],
    certifications = [],
    projects = []
  } = cvData;
  
  // Extract summary and hobbies from processed data - these are added by FinalPreview
  const summary = (cvData as any).summary || personalInfo.summary || "";
  const hobbies = typeof (cvData as any).hobbies === 'string' ? (cvData as any).hobbies : "";
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
        {/* CV Header - Full Width Dark Blue */}
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
            fontWeight: 900,
            fontFamily: "'Lato', sans-serif"
          }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
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
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.phone && (
            <>
              <span style={{ color: '#ccc', margin: '0 3px' }}>|</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.email && (
            <>
              <span style={{ color: '#ccc', margin: '0 3px' }}>|</span>
              <span>{personalInfo.email}</span>
            </>
          )}
        </section>

        {/* Main Content Area */}
        <main style={{ padding: '30px 40px' }}>
          
          {/* Professional Summary */}
          {summary && (
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '1.15em',
                color: '#2c3e50',
                marginBottom: '15px',
                paddingBottom: '5px',
                borderBottom: '2px solid #2c3e50',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 700,
                fontFamily: "'Lato', sans-serif"
              }}>
                PROFESSIONAL SUMMARY
              </h3>
              <p style={{
                fontSize: '0.95em',
                color: '#444',
                lineHeight: 1.7,
                marginBottom: 0
              }}>
                {summary}
              </p>
            </section>
          )}

          {/* Skills Section */}
          {validSkills.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '1.15em',
                color: '#2c3e50',
                marginBottom: '15px',
                paddingBottom: '5px',
                borderBottom: '2px solid #2c3e50',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 700,
                fontFamily: "'Lato', sans-serif"
              }}>
                SKILLS
              </h3>
              <ul style={{
                columns: 2,
                WebkitColumns: 2,
                MozColumns: 2,
                columnGap: '30px',
                margin: 0,
                padding: 0,
                listStyle: 'none'
              }}>
                {validSkills.map((skill, index) => (
                  <li key={index} style={{
                    fontSize: '0.95em',
                    color: '#444',
                    marginBottom: '8px',
                    paddingLeft: '15px',
                    position: 'relative',
                    breakInside: 'avoid-column'
                  }}>
                    <span style={{
                      content: '•',
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
          )}

          {/* Work History */}
          {validWorkExperiences.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '1.15em',
                color: '#2c3e50',
                marginBottom: '15px',
                paddingBottom: '5px',
                borderBottom: '2px solid #2c3e50',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 700,
                fontFamily: "'Lato', sans-serif"
              }}>
                WORK HISTORY
              </h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {validWorkExperiences.map((exp, index) => (
                  <li key={index} style={{ marginBottom: index < validWorkExperiences.length - 1 ? '20px' : '0' }}>
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
                          {exp.jobTitle}
                        </strong>
                        <span style={{
                          fontSize: '1em',
                          color: '#444',
                          display: 'block',
                          fontStyle: 'italic'
                        }}>
                          {exp.company}
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
                          {exp.startDate} - {exp.current ? 'Current' : exp.endDate}
                        </span>
                        {exp.location && (
                          <span style={{
                            display: 'block',
                            lineHeight: 1.4,
                            fontWeight: 600
                          }}>
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {exp.description && (
                      <p style={{
                        fontSize: '0.95em',
                        color: '#444',
                        marginTop: '5px',
                        marginBottom: '5px'
                      }}>
                        {exp.description}
                      </p>
                    )}
                    
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul style={{
                        listStyle: 'none',
                        paddingLeft: 0,
                        marginTop: '5px',
                        marginBottom: 0
                      }}>
                        {exp.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} style={{
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
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Education */}
          {validEducation.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '1.15em',
                color: '#2c3e50',
                marginBottom: '15px',
                paddingBottom: '5px',
                borderBottom: '2px solid #2c3e50',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 700,
                fontFamily: "'Lato', sans-serif"
              }}>
                EDUCATION
              </h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {validEducation.map((edu, index) => (
                  <li key={index} style={{ marginBottom: index < validEducation.length - 1 ? '20px' : '0' }}>
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
                        {edu.location && (
                          <span style={{
                            display: 'block',
                            lineHeight: 1.4,
                            fontWeight: 600
                          }}>
                            {edu.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages Section */}
          {validLanguages.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '1.15em',
                color: '#2c3e50',
                marginBottom: '15px',
                paddingBottom: '5px',
                borderBottom: '2px solid #2c3e50',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 700,
                fontFamily: "'Lato', sans-serif"
              }}>
                LANGUAGES
              </h3>
              {validLanguages.map((lang, index) => (
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
                      {lang.name}
                    </span>
                    <span style={{
                      color: '#555',
                      fontSize: '0.9em'
                    }}>
                      {lang.proficiency === 'native' ? 'Native Language' :
                       lang.proficiency === 'fluent' ? 'C2 Proficient' :
                       lang.proficiency === 'advanced' ? 'B2 Upper Intermediate' :
                       lang.proficiency === 'intermediate' ? 'B1 Intermediate' :
                       lang.proficiency === 'beginner' ? 'A1 Beginner' : 
                       lang.proficiency}
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
                      width: lang.proficiency === 'native' ? '100%' :
                            lang.proficiency === 'fluent' ? '100%' :
                            lang.proficiency === 'advanced' ? '75%' :
                            lang.proficiency === 'intermediate' ? '60%' :
                            lang.proficiency === 'beginner' ? '30%' : '50%'
                    }} />
                  </div>
                </div>
              ))}
            </section>
          )}

        </main>
      </div>
    </div>
  );
}