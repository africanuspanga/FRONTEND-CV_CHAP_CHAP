import React from 'react';
import { CVData } from '@shared/schema';

export function SmartBongoTemplate(data: CVData) {
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
        maxWidth: '850px',
        margin: '20px auto',
        backgroundColor: '#ffffff',
        padding: '40px',
        boxSizing: 'border-box',
        borderTop: '5px solid #3A4D6D' 
      }}>
        {/* Header */}
        <header style={{
          textAlign: 'left',
          marginBottom: '10px'
        }}>
          <h1 style={{
            fontSize: '2.8em',
            color: '#3A4D6D',
            marginBottom: 0,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 700
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
          textAlign: 'left',
          marginBottom: '25px',
          paddingBottom: '15px',
          borderBottom: '1px solid #e0e0e0',
          fontSize: '0.9em',
          color: '#555',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '5px 10px'
        }}>
          <span style={{ whiteSpace: 'nowrap' }}>{personalInfo.email}</span>
          <span style={{ color: '#ccc', margin: '0 5px' }}>|</span>
          <span style={{ whiteSpace: 'nowrap' }}>H: {personalInfo.phone}</span>
          <span style={{ color: '#ccc', margin: '0 5px' }}>|</span>
          <span style={{ whiteSpace: 'nowrap' }}>{personalInfo.address}</span>
        </section>
        
        {/* Main Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '20px'
        }}>
          {/* Professional Summary Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            gap: '25px',
            alignItems: 'start'
          }}>
            <div>
              <h3 style={{
                fontSize: '0.95em',
                color: '#3A4D6D',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 700,
                padding: '8px 10px',
                border: '1px solid #3A4D6D',
                textAlign: 'center',
                marginBottom: 0,
                minWidth: '150px',
                display: 'inline-block'
              }}>
                PROFESSIONAL SUMMARY
              </h3>
            </div>
            <div style={{ paddingTop: '5px' }}>
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

          {/* Skills Section */}
          {validSkills.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr',
              gap: '25px',
              alignItems: 'start'
            }}>
              <div>
                <h3 style={{
                  fontSize: '0.95em',
                  color: '#3A4D6D',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  padding: '8px 10px',
                  border: '1px solid #3A4D6D',
                  textAlign: 'center',
                  marginBottom: 0,
                  minWidth: '150px',
                  display: 'inline-block'
                }}>
                  SKILLS
                </h3>
              </div>
              <div style={{ paddingTop: '5px' }}>
                <ul style={{
                  columns: 2,
                  columnGap: '30px',
                  margin: 0,
                  padding: 0
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
                        color: '#555',
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

          {/* Work History Section */}
          {validWorkExperiences.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr',
              gap: '25px',
              alignItems: 'start'
            }}>
              <div>
                <h3 style={{
                  fontSize: '0.95em',
                  color: '#3A4D6D',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  padding: '8px 10px',
                  border: '1px solid #3A4D6D',
                  textAlign: 'center',
                  marginBottom: 0,
                  minWidth: '150px',
                  display: 'inline-block'
                }}>
                  WORK HISTORY
                </h3>
              </div>
              <div style={{ paddingTop: '5px' }}>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {validWorkExperiences.map((job, index) => (
                    <li key={index} style={{ marginBottom: '20px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '5px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          flexGrow: 1,
                          fontSize: '1.05em',
                          color: '#444'
                        }}>
                          <strong style={{
                            fontSize: '1.05em',
                            color: '#222'
                          }}>{job.jobTitle}</strong> / {job.company} - {job.location}
                        </span>
                        <span style={{
                          flexShrink: 0,
                          textAlign: 'right',
                          fontSize: '0.9em',
                          color: '#555',
                          fontStyle: 'italic',
                          paddingLeft: '15px'
                        }}>
                          {job.startDate} - {job.endDate || 'Current'}
                        </span>
                      </div>
                      <ul style={{
                        listStyle: 'none',
                        paddingLeft: '10px',
                        marginTop: '5px'
                      }}>
                        {job.achievements?.map((achievement, achieveIndex) => (
                          <li key={`achieve-${achieveIndex}`} style={{
                            fontSize: '0.95em',
                            color: '#444',
                            marginBottom: '5px',
                            paddingLeft: '15px',
                            position: 'relative'
                          }}>
                            <span style={{
                              content: '•',
                              color: '#555',
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

          {/* Education Section */}
          {validEducation.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr',
              gap: '25px',
              alignItems: 'start'
            }}>
              <div>
                <h3 style={{
                  fontSize: '0.95em',
                  color: '#3A4D6D',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  padding: '8px 10px',
                  border: '1px solid #3A4D6D',
                  textAlign: 'center',
                  marginBottom: 0,
                  minWidth: '150px',
                  display: 'inline-block'
                }}>
                  EDUCATION
                </h3>
              </div>
              <div style={{ paddingTop: '5px' }}>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {validEducation.map((edu, index) => (
                    <li key={index} style={{ marginBottom: '20px' }}>
                      <div style={{
                        fontSize: '0.95em',
                        color: '#444',
                        lineHeight: 1.4
                      }}>
                        <span style={{ display: 'block' }}>
                          {edu.institution} - {edu.location}
                        </span>
                        <span style={{ display: 'block' }}>
                          <strong style={{ color: '#222' }}>
                            {edu.degree}
                          </strong>
                          {edu.fieldOfStudy ? `: ${edu.fieldOfStudy}` : ''}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {validCertifications.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr',
              gap: '25px',
              alignItems: 'start'
            }}>
              <div>
                <h3 style={{
                  fontSize: '0.95em',
                  color: '#3A4D6D',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  padding: '8px 10px',
                  border: '1px solid #3A4D6D',
                  textAlign: 'center',
                  marginBottom: 0,
                  minWidth: '150px',
                  display: 'inline-block'
                }}>
                  CERTIFICATIONS
                </h3>
              </div>
              <div style={{ paddingTop: '5px' }}>
                <ul style={{ margin: 0, padding: 0 }}>
                  {validCertifications.map((cert, index) => (
                    <li key={index} style={{
                      fontSize: '0.95em',
                      color: '#444',
                      marginBottom: '8px',
                      paddingLeft: '15px',
                      position: 'relative'
                    }}>
                      <span style={{
                        content: '•',
                        color: '#555',
                        position: 'absolute',
                        left: 0,
                        top: '0.1em',
                        fontSize: '1em'
                      }}>•</span>
                      {cert.name} {cert.year ? `- (${cert.year})` : ''}
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
              gridTemplateColumns: '200px 1fr',
              gap: '25px',
              alignItems: 'start'
            }}>
              <div>
                <h3 style={{
                  fontSize: '0.95em',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  padding: '8px 10px',
                  border: '1px solid #999',
                  textAlign: 'center',
                  marginBottom: 0,
                  minWidth: '150px',
                  display: 'inline-block'
                }}>
                  LANGUAGES
                </h3>
              </div>
              <div style={{ paddingTop: '5px' }}>
                <ul style={{
                  columns: 2,
                  columnGap: '30px',
                  margin: 0,
                  padding: 0
                }}>
                  {validLanguages.map((language, index) => (
                    <li key={index} style={{
                      fontSize: '0.95em',
                      color: '#444',
                      marginBottom: '8px',
                      paddingLeft: '15px',
                      position: 'relative',
                      breakInside: 'avoid-column'
                    }}>
                      <span style={{
                        color: '#555',
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
              gridTemplateColumns: '200px 1fr',
              gap: '25px',
              alignItems: 'start'
            }}>
              <div>
                <h3 style={{
                  fontSize: '0.95em',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  padding: '8px 10px',
                  border: '1px solid #999',
                  textAlign: 'center',
                  marginBottom: 0,
                  minWidth: '150px',
                  display: 'inline-block'
                }}>
                  REFERENCES
                </h3>
              </div>
              <div style={{ paddingTop: '5px' }}>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {validReferences.map((reference, index) => (
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
              </div>
            </div>
          )}

          {/* Hobbies Section - Hidden by Default */}
          {hobbies && (
            <div id="hobbiesSection" style={{
              display: 'none',
              gridTemplateColumns: '200px 1fr',
              gap: '25px',
              alignItems: 'start'
            }}>
              <div>
                <h3 style={{
                  fontSize: '0.95em',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  padding: '8px 10px',
                  border: '1px solid #999',
                  textAlign: 'center',
                  marginBottom: 0,
                  minWidth: '150px',
                  display: 'inline-block'
                }}>
                  HOBBIES
                </h3>
              </div>
              <div style={{ paddingTop: '5px' }}>
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