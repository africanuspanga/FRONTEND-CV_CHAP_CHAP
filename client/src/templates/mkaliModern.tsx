import React from 'react';
import { CVData } from '@shared/schema';

export function MkaliModernTemplate(data: CVData) {
  const {
    personalInfo,
    summary,
    workExperience,
    education,
    skills,
    languages,
    references,
    hobbies,
  } = data;

  // Filter out empty work experiences
  const validWorkExperience = workExperience?.filter(exp => exp.jobTitle && exp.company) || [];
  // Filter out empty education entries
  const validEducation = education?.filter(edu => edu.institution && edu.degree) || [];
  // Filter out empty skills
  const validSkills = skills?.filter(skill => skill.name) || [];
  // Filter out empty languages
  const validLanguages = languages?.filter(lang => lang.name) || [];
  // Filter out empty references
  const validReferences = references?.filter(ref => ref.name) || [];
  // Handle hobbies based on data type
  const validHobbies = typeof hobbies === 'string' 
    ? [hobbies] // If hobbies is a string, wrap it in an array
    : Array.isArray(hobbies) 
      ? hobbies.filter(hobby => hobby) // If it's an array, filter out empty values
      : []; // Default to empty array

  return (
    <div style={{
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '9.5pt',
      lineHeight: 1.5,
      backgroundColor: '#e8e8e8',
      color: '#333',
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    }}>
      <div style={{
        maxWidth: '850px',
        margin: '30px auto',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #ddd',
      }}>
        {/* Header Section */}
        <div style={{
          backgroundColor: '#4db6ac',
          color: '#ffffff',
          padding: '25px 30px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
          }}>
            <div>
              <h1 style={{
                fontSize: '36pt',
                fontWeight: 700,
                lineHeight: 1.1,
                margin: 0,
              }}>
                {personalInfo?.firstName} {personalInfo?.lastName}
              </h1>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'inline-block',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '15px',
                padding: '4px 12px',
                fontSize: '10pt',
                fontWeight: 700,
                marginBottom: '10px',
              }}>
                {personalInfo?.jobTitle}
              </div>
              <p style={{
                fontSize: '9pt',
                lineHeight: 1.4,
                color: '#e0f2f1',
              }}>
                {summary}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Band */}
        <div style={{
          backgroundColor: '#3aa99f',
          color: '#ffffff',
          padding: '10px 30px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          fontSize: '9pt',
        }}>
          {personalInfo?.phone && (
            <span style={{
              margin: '3px 10px',
              display: 'inline-flex',
              alignItems: 'center',
            }}>
              <i style={{ marginRight: '6px', fontSize: '11pt' }} className="fas fa-phone"></i>
              <span style={{ margin: 0 }}>{personalInfo.phone}</span>
            </span>
          )}
          {personalInfo?.location && (
            <span style={{
              margin: '3px 10px',
              display: 'inline-flex',
              alignItems: 'center',
            }}>
              <i style={{ marginRight: '6px', fontSize: '11pt' }} className="fas fa-map-marker-alt"></i>
              <span style={{ margin: 0 }}>{personalInfo.location}</span>
            </span>
          )}
          {personalInfo?.email && (
            <span style={{
              margin: '3px 10px',
              display: 'inline-flex',
              alignItems: 'center',
            }}>
              <i style={{ marginRight: '6px', fontSize: '11pt' }} className="fas fa-envelope"></i>
              <span style={{ margin: 0 }}>{personalInfo.email}</span>
            </span>
          )}
          {personalInfo?.linkedin && (
            <span style={{
              margin: '3px 10px',
              display: 'inline-flex',
              alignItems: 'center',
            }}>
              <i style={{ marginRight: '6px', fontSize: '11pt' }} className="fab fa-linkedin"></i>
              <span style={{ margin: 0 }}>{personalInfo.linkedin}</span>
            </span>
          )}
        </div>

        {/* Main Body Layout */}
        <div style={{
          display: 'flex',
          padding: '30px',
          gap: '30px',
        }}>
          {/* Left Column */}
          <div style={{ flex: 1.8 }}>
            {/* Professional Experience Section */}
            {validWorkExperience.length > 0 && (
              <div style={{ position: 'relative' }}>
                <h2 style={{
                  fontSize: '11pt',
                  fontWeight: 700,
                  color: '#444',
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Professional Experience
                </h2>
                <div>
                  {validWorkExperience.map((job, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      marginBottom: '25px',
                      position: 'relative',
                    }}>
                      <div style={{
                        width: '40px',
                        marginRight: '20px',
                        textAlign: 'center',
                        flexShrink: 0,
                        position: 'relative',
                        zIndex: 1,
                      }}>
                        <div style={{
                          backgroundColor: '#4db6ac',
                          color: '#ffffff',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          fontSize: '7.5pt',
                          fontWeight: 700,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          lineHeight: 1.1,
                          marginBottom: '10px',
                        }}>
                          {job.startDate?.split(' ')[0]}-
                          {job.endDate ? job.endDate.split(' ')[0] : 'now'}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '10.5pt',
                          fontWeight: 700,
                          color: '#333',
                          marginBottom: '2px',
                        }}>
                          {job.jobTitle}
                        </h3>
                        <p style={{
                          fontSize: '9pt',
                          fontWeight: 700,
                          color: '#555',
                          marginBottom: '8px',
                        }}>
                          {job.company}, {job.location}
                        </p>
                        {job.achievements && job.achievements.length > 0 && (
                          <ul style={{
                            listStyle: 'none',
                            paddingLeft: '15px',
                          }}>
                            {job.achievements.map((achievement, idx) => (
                              <li key={idx} style={{
                                marginBottom: '5px',
                                fontSize: '9.5pt',
                                color: '#555',
                                position: 'relative',
                                paddingLeft: '15px',
                              }}>
                                <span style={{
                                  content: '•',
                                  position: 'absolute',
                                  left: 0,
                                  top: '1px',
                                  color: '#4db6ac',
                                }}>•</span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={{ flex: 1 }}>
            {/* Education Section */}
            {validEducation.length > 0 && (
              <div style={{ marginBottom: '25px' }}>
                <h2 style={{
                  fontSize: '11pt',
                  fontWeight: 700,
                  color: '#444',
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Education
                </h2>
                {validEducation.map((edu, index) => (
                  <div key={index} style={{ marginBottom: index === validEducation.length - 1 ? 0 : '15px' }}>
                    <p style={{
                      fontSize: '9pt',
                      fontWeight: 700,
                      color: '#555',
                      marginBottom: '2px',
                    }}>
                      {edu.endDate || edu.startDate}
                    </p>
                    <h3 style={{
                      fontSize: '10pt',
                      fontWeight: 700,
                      color: '#333',
                      marginBottom: '2px',
                    }}>
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </h3>
                    <p style={{
                      fontSize: '9pt',
                      color: '#666',
                      marginBottom: '1px',
                    }}>
                      {edu.institution}, {edu.location}
                    </p>
                    {edu.gpa && <p style={{
                      fontSize: '9pt',
                      color: '#666',
                      fontStyle: 'italic',
                    }}>GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Skills Section */}
            {validSkills.length > 0 && (
              <div style={{ marginBottom: '25px' }}>
                <h2 style={{
                  fontSize: '11pt',
                  fontWeight: 700,
                  color: '#444',
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Key Skills
                </h2>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {validSkills.map((skill, index) => (
                    <li key={index} style={{
                      marginBottom: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '9.5pt',
                      color: '#444',
                    }}>
                      <span style={{ flexShrink: 0, marginRight: '10px' }}>{skill.name}</span>
                      <div style={{
                        width: '60%',
                        height: '4px',
                        borderBottom: '3px dashed #4db6ac',
                      }}></div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Languages Section */}
            {validLanguages.length > 0 && (
              <div style={{ marginTop: '25px' }}>
                <h2 style={{
                  fontSize: '11pt',
                  fontWeight: 700,
                  color: '#444',
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Languages
                </h2>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {validLanguages.map((language, index) => (
                    <li key={index} style={{
                      marginBottom: '5px',
                      fontSize: '9.5pt',
                    }}>
                      {language.name}{language.level ? ` (${language.level})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hobbies Section */}
            {validHobbies.length > 0 && (
              <div style={{ marginTop: '25px' }}>
                <h2 style={{
                  fontSize: '11pt',
                  fontWeight: 700,
                  color: '#444',
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Hobbies & Interests
                </h2>
                <p style={{ fontSize: '9.5pt', color: '#444' }}>
                  {validHobbies.join(', ')}
                </p>
              </div>
            )}
            
            {/* References Section */}
            {validReferences.length > 0 && (
              <div style={{ marginTop: '25px' }}>
                <h2 style={{
                  fontSize: '11pt',
                  fontWeight: 700,
                  color: '#444',
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  References
                </h2>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {validReferences.map((reference, index) => (
                    <li key={index} style={{ marginBottom: '5px', fontSize: '9.5pt' }}>
                      <strong>{reference.name}</strong>, {reference.position} at {reference.company}
                      {reference.email && <span> - {reference.email}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
