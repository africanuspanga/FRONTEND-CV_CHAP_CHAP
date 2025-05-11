import React from 'react';
import { CVData } from '@shared/schema';

export function MkaliModernTemplate(data: CVData) {
  const {
    personalInfo,
    workExperiences = [],
    education = [],
    skills = [],
    languages = [],
    references = [],
    certifications = [],
    hobbies = "",
  } = data;
  
  // Filter out empty work experiences
  const validWorkExperiences = workExperiences?.filter(exp => exp.jobTitle && exp.company) || [];
  // Filter out empty education entries
  const validEducation = education?.filter(edu => edu.institution && edu.degree) || [];
  // Filter out empty skills
  const validSkills = skills?.filter(skill => skill.name) || [];
  // Filter out empty languages
  const validLanguages = languages?.filter(lang => lang.name) || [];
  // Filter out empty references
  const validReferences = references?.filter(ref => ref.name) || [];
  // Filter out empty certifications
  const validCertifications = certifications?.filter(cert => cert.name) || [];

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
        maxWidth: '900px',
        margin: '20px auto',
        backgroundColor: '#ffffff',
        padding: '30px 40px',
        boxSizing: 'border-box',
        borderTop: '6px solid #6F7D9C'
      }}>
        {/* Top Contact Info Bar */}
        <section style={{
          textAlign: 'center',
          marginBottom: '20px',
          paddingBottom: '10px',
          fontSize: '0.9em',
          color: '#555',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '5px 10px'
        }}>
          <span style={{ whiteSpace: 'nowrap' }}>{personalInfo.address}</span>
          <span style={{ color: '#aaa', margin: '0 5px' }}>|</span>
          <span style={{ whiteSpace: 'nowrap' }}>{personalInfo.phone}</span>
          <span style={{ color: '#aaa', margin: '0 5px' }}>|</span>
          <span style={{ whiteSpace: 'nowrap' }}>{personalInfo.email}</span>
          {personalInfo.linkedin && (
            <>
              <span style={{ color: '#aaa', margin: '0 5px' }}>|</span>
              <a href={personalInfo.linkedin} style={{ color: '#333', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                {personalInfo.linkedin}
              </a>
            </>
          )}
        </section>

        {/* Header */}
        <header style={{
          textAlign: 'center',
          marginBottom: '25px',
          fontFamily: "'Lato', sans-serif"
        }}>
          <h1 style={{
            fontSize: '2.6em',
            color: '#333',
            marginBottom: 0,
            textTransform: 'uppercase',
            letterSpacing: '1px',
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
        
        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '20px'
        }}>
          {/* Professional Summary Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '180px 1fr',
            gap: '30px',
            alignItems: 'start',
            paddingBottom: '15px',
            borderBottom: '1px solid #eee'
          }}>
            <div>
              <h3 style={{
                fontSize: '0.9em',
                color: '#6F7D9C',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 700,
                marginBottom: 0,
                paddingTop: '2px',
                textAlign: 'left',
                fontFamily: "'Lato', sans-serif"
              }}>
                PROFESSIONAL SUMMARY
              </h3>
            </div>
            <div>
              <p style={{
                fontSize: '0.95em',
                color: '#444',
                lineHeight: 1.7,
                marginBottom: 0
              }}>
                {personalInfo.summary}
              </p>
            </div>
          </div>

          {/* Work History Section */}
          {validWorkExperiences.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: '30px',
              alignItems: 'start',
              paddingBottom: '15px',
              borderBottom: '1px solid #eee'
            }}>
              <div>
                <h3 style={{
                  fontSize: '0.9em',
                  color: '#6F7D9C',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  marginBottom: 0,
                  paddingTop: '2px',
                  textAlign: 'left',
                  fontFamily: "'Lato', sans-serif"
                }}>
                  WORK HISTORY
                </h3>
              </div>
              <div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {validWorkExperiences.map((job, index) => (
                    <li key={index} style={{ 
                      marginBottom: index < validWorkExperiences.length - 1 ? '15px' : '0' 
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '3px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          fontSize: '1em',
                          color: '#222',
                          display: 'block',
                          marginBottom: '2px'
                        }}>
                          <strong style={{ fontWeight: 700 }}>
                            {job.jobTitle.toUpperCase()}
                          </strong>
                        </span>
                        <span style={{
                          flexShrink: 0,
                          textAlign: 'right',
                          fontSize: '0.9em',
                          color: '#555',
                          fontWeight: 700,
                          paddingLeft: '15px'
                        }}>
                          {job.startDate} to {job.endDate || 'Current'}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.95em',
                        color: '#444',
                        display: 'block',
                        marginBottom: '5px',
                        fontStyle: 'italic'
                      }}>
                        {job.company}, {job.location}
                      </div>
                      <ul style={{
                        listStyle: 'none',
                        paddingLeft: 0,
                        marginTop: 0
                      }}>
                        {job.achievements?.map((achievement, achieveIndex) => (
                          <li key={`achieve-${achieveIndex}`} style={{
                            fontSize: '0.95em',
                            color: '#444',
                            marginBottom: '4px',
                            paddingLeft: '15px',
                            position: 'relative'
                          }}>
                            <span style={{
                              content: '•',
                              color: '#6F7D9C',
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
              </div>
            </div>
          )}

          {/* Skills Section */}
          {validSkills.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: '30px',
              alignItems: 'start',
              paddingBottom: '15px',
              borderBottom: '1px solid #eee'
            }}>
              <div>
                <h3 style={{
                  fontSize: '0.9em',
                  color: '#6F7D9C',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  marginBottom: 0,
                  paddingTop: '2px',
                  textAlign: 'left',
                  fontFamily: "'Lato', sans-serif"
                }}>
                  SKILLS
                </h3>
              </div>
              <div>
                <ul style={{
                  columns: 3,
                  WebkitColumns: 3,
                  MozColumns: 3,
                  columnGap: '20px',
                  margin: 0,
                  padding: 0
                }}>
                  {validSkills.map((skill, index) => (
                    <li key={index} style={{
                      fontSize: '0.95em',
                      color: '#444',
                      marginBottom: '6px',
                      paddingLeft: '15px',
                      position: 'relative',
                      breakInside: 'avoid-column'
                    }}>
                      <span style={{
                        content: '•',
                        color: '#6F7D9C',
                        position: 'absolute',
                        left: 0,
                        top: '0.1em',
                        fontSize: '1em'
                      }}>•</span>
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Education Section */}
          {validEducation.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: '30px',
              alignItems: 'start',
              paddingBottom: '15px',
              borderBottom: '1px solid #eee'
            }}>
              <div>
                <h3 style={{
                  fontSize: '0.9em',
                  color: '#6F7D9C',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  marginBottom: 0,
                  paddingTop: '2px',
                  textAlign: 'left',
                  fontFamily: "'Lato', sans-serif"
                }}>
                  EDUCATION
                </h3>
              </div>
              <div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {validEducation.map((edu, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>
                      <div style={{
                        display: 'block',
                        fontSize: '0.95em',
                        color: '#444',
                        lineHeight: 1.4,
                        marginBottom: '2px'
                      }}>
                        <span style={{ display: 'block' }}>
                          {edu.institution}, {edu.location}
                        </span>
                        <span style={{ display: 'block' }}>
                          <strong style={{ color: '#222', fontWeight: 700 }}>
                            {edu.degree}
                          </strong>
                          {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Certifications/Licenses Section */}
          {validCertifications.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: '30px',
              alignItems: 'start',
              paddingBottom: '15px',
              borderBottom: '1px solid #eee'
            }}>
              <div>
                <h3 style={{
                  fontSize: '0.9em',
                  color: '#6F7D9C',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  marginBottom: 0,
                  paddingTop: '2px',
                  textAlign: 'left',
                  fontFamily: "'Lato', sans-serif"
                }}>
                  LICENSES
                </h3>
              </div>
              <div>
                <ul style={{ margin: 0, padding: 0 }}>
                  {validCertifications.map((cert, index) => (
                    <li key={index} style={{
                      fontSize: '0.95em',
                      color: '#444',
                      marginBottom: '6px',
                      paddingLeft: '15px',
                      position: 'relative'
                    }}>
                      <span style={{
                        content: '•',
                        color: '#6F7D9C',
                        position: 'absolute',
                        left: 0,
                        top: '0.1em',
                        fontSize: '1em'
                      }}>•</span>
                      {cert.name}{cert.year ? ` - (${cert.year})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Languages Section - Hidden by Default */}
          {validLanguages.length > 0 && (
            <div id="languagesSection" style={{
              display: 'none',
              gridTemplateColumns: '180px 1fr',
              gap: '30px',
              alignItems: 'start',
              paddingBottom: '15px',
              borderBottom: '1px solid #eee'
            }}>
              <div>
                <h3 style={{
                  fontSize: '0.9em',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  marginBottom: 0,
                  paddingTop: '2px',
                  textAlign: 'left',
                  fontFamily: "'Lato', sans-serif"
                }}>
                  LANGUAGES
                </h3>
              </div>
              <div>
                <ul style={{ 
                  columns: 3,
                  WebkitColumns: 3,
                  MozColumns: 3,
                  columnGap: '20px',
                  margin: 0,
                  padding: 0
                }}>
                  {validLanguages.map((language, index) => (
                    <li key={index} style={{
                      fontSize: '0.95em',
                      color: '#444',
                      marginBottom: '6px',
                      paddingLeft: '15px',
                      position: 'relative',
                      breakInside: 'avoid-column'
                    }}>
                      <span style={{
                        content: '•',
                        color: '#999',
                        position: 'absolute',
                        left: 0,
                        top: '0.1em',
                        fontSize: '1em'
                      }}>•</span>
                      {language.name} | {language.proficiency}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* References Section - Hidden by Default */}
          {validReferences.length > 0 && (
            <div id="referencesSection" style={{
              display: 'none',
              gridTemplateColumns: '180px 1fr',
              gap: '30px',
              alignItems: 'start',
              paddingBottom: '15px',
              borderBottom: '1px solid #eee'
            }}>
              <div>
                <h3 style={{
                  fontSize: '0.9em',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  marginBottom: 0,
                  paddingTop: '2px',
                  textAlign: 'left',
                  fontFamily: "'Lato', sans-serif"
                }}>
                  REFERENCES
                </h3>
              </div>
              <div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {validReferences.map((reference, index) => (
                    <li key={index} style={{
                      marginBottom: '10px'
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
              </div>
            </div>
          )}

          {/* Hobbies Section - Hidden by Default */}
          {hobbies && (
            <div id="hobbiesSection" style={{
              display: 'none',
              gridTemplateColumns: '180px 1fr',
              gap: '30px',
              alignItems: 'start'
            }}>
              <div>
                <h3 style={{
                  fontSize: '0.9em',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  marginBottom: 0,
                  paddingTop: '2px',
                  textAlign: 'left',
                  fontFamily: "'Lato', sans-serif"
                }}>
                  HOBBIES
                </h3>
              </div>
              <div>
                <p style={{
                  fontSize: '0.95em',
                  color: '#444',
                  lineHeight: 1.7,
                  marginBottom: 0
                }}>
                  {hobbies}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}