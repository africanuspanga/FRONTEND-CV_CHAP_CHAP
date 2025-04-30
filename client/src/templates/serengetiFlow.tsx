import React from 'react';
import { CVData } from '@shared/schema';

export function SerengetiFlowTemplate(data: CVData) {
  const {
    personalInfo,
    summary,
    workExperience,
    education,
    skills,
    languages,
    references,
    certifications,
    projects,
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
  // Filter out empty hobbies
  const validHobbies = hobbies?.filter(hobby => hobby) || [];

  // Get initials for the circle
  const getInitials = () => {
    const firstName = personalInfo?.firstName || '';
    const lastName = personalInfo?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <div style={{
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '10pt',
      lineHeight: 1.4,
      backgroundColor: '#f0f0f0',
      color: '#333',
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    }}>
      <div style={{
        maxWidth: '850px',
        margin: '30px auto',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}>
        {/* Header Section */}
        <header style={{
          backgroundColor: '#1d3557',
          color: '#ffffff',
          padding: '20px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <h1 style={{
            fontSize: '24pt',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: 0,
          }}>
            {personalInfo?.firstName} {personalInfo?.lastName}
          </h1>
          <div style={{
            textAlign: 'right',
          }}>
            {personalInfo?.location && (
              <span style={{
                display: 'block',
                fontSize: '9pt',
                marginBottom: '2px',
                color: '#f0f0f0',
              }}>
                {personalInfo.location}
              </span>
            )}
            {personalInfo?.email && (
              <span style={{
                display: 'block',
                fontSize: '9pt',
                marginBottom: '2px',
                color: '#f0f0f0',
              }}>
                {personalInfo.email}
              </span>
            )}
            {personalInfo?.phone && (
              <span style={{
                display: 'block',
                fontSize: '9pt',
                marginBottom: '2px',
                color: '#f0f0f0',
              }}>
                {personalInfo.phone}
              </span>
            )}
          </div>
        </header>

        {/* Main Body Layout */}
        <div style={{
          padding: '30px',
        }}>
          {/* Summary Section */}
          {summary && (
            <section style={{
              display: 'flex',
              marginBottom: '20px',
            }}>
              <div style={{
                flexBasis: '160px',
                paddingRight: '25px',
                flexShrink: 0,
              }}>
                <h2 style={{
                  fontSize: '9pt',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#444',
                  letterSpacing: '1px',
                  paddingTop: '2px',
                }}>
                  SUMMARY
                </h2>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  marginBottom: '10px',
                  color: '#555',
                  fontSize: '10pt',
                }}>
                  {summary}
                </p>
              </div>
            </section>
          )}

          {/* Professional Experience Section */}
          {validWorkExperience.length > 0 && (
            <section style={{
              display: 'flex',
              marginBottom: '20px',
            }}>
              <div style={{
                flexBasis: '160px',
                paddingRight: '25px',
                flexShrink: 0,
              }}>
                <h2 style={{
                  fontSize: '9pt',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#444',
                  letterSpacing: '1px',
                  paddingTop: '2px',
                }}>
                  PROFESSIONAL EXPERIENCE
                </h2>
              </div>
              <div style={{ flex: 1 }}>
                {validWorkExperience.map((job, index) => (
                  <article key={index} style={{
                    marginBottom: index === validWorkExperience.length - 1 ? 0 : '15px',
                  }}>
                    <h3 style={{
                      fontSize: '11pt',
                      fontWeight: 700,
                      color: '#222',
                      marginBottom: '2px',
                    }}>
                      {job.jobTitle}
                    </h3>
                    <p className="meta" style={{
                      fontSize: '9.5pt',
                      color: '#666',
                      marginBottom: '6px',
                    }}>
                      {job.company}, {job.location} | {job.startDate}{job.endDate ? `-${job.endDate}` : '-Present'}
                    </p>
                    {job.achievements && job.achievements.length > 0 && (
                      <ul style={{
                        listStyle: 'none',
                        paddingLeft: '15px',
                        color: '#555',
                      }}>
                        {job.achievements.map((achievement, idx) => (
                          <li key={idx} style={{
                            marginBottom: '5px',
                            position: 'relative',
                            paddingLeft: '15px',
                            fontSize: '10pt',
                          }}>
                            <span style={{
                              content: '•',
                              position: 'absolute',
                              left: 0,
                              top: '1px',
                              color: '#555',
                            }}>•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {validEducation.length > 0 && (
            <section style={{
              display: 'flex',
              marginBottom: '20px',
            }}>
              <div style={{
                flexBasis: '160px',
                paddingRight: '25px',
                flexShrink: 0,
              }}>
                <h2 style={{
                  fontSize: '9pt',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#444',
                  letterSpacing: '1px',
                  paddingTop: '2px',
                }}>
                  EDUCATION
                </h2>
              </div>
              <div style={{ flex: 1 }}>
                {validEducation.map((edu, index) => (
                  <article key={index} style={{
                    marginBottom: index === validEducation.length - 1 ? 0 : '15px',
                  }}>
                    <h3 style={{
                      fontSize: '11pt',
                      fontWeight: 700,
                      color: '#222',
                      marginBottom: '2px',
                    }}>
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}, {edu.endDate || edu.startDate}
                    </h3>
                    {edu.gpa && (
                      <p style={{
                        fontSize: '10pt',
                        color: '#555',
                        marginBottom: '4px',
                      }}>
                        Honors: {edu.gpa && `GPA: ${edu.gpa}/4.0`}
                      </p>
                    )}
                    <p className="meta" style={{
                      fontSize: '9.5pt',
                      color: '#666',
                      marginBottom: '6px',
                    }}>
                      {edu.institution}, {edu.location}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Skills Section */}
          {validSkills.length > 0 && (
            <section style={{
              display: 'flex',
              marginBottom: '20px',
            }}>
              <div style={{
                flexBasis: '160px',
                paddingRight: '25px',
                flexShrink: 0,
              }}>
                <h2 style={{
                  fontSize: '9pt',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#444',
                  letterSpacing: '1px',
                  paddingTop: '2px',
                }}>
                  ADDITIONAL SKILLS
                </h2>
              </div>
              <div style={{ flex: 1 }}>
                <ul style={{
                  listStyle: 'none',
                  paddingLeft: '15px',
                  color: '#555',
                }}>
                  {validSkills.map((skill, index) => (
                    <li key={index} style={{
                      marginBottom: '5px',
                      position: 'relative',
                      paddingLeft: '15px',
                      fontSize: '10pt',
                    }}>
                      <span style={{
                        content: '•',
                        position: 'absolute',
                        left: 0,
                        top: '1px',
                        color: '#555',
                      }}>•</span>
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Languages Section */}
          {validLanguages.length > 0 && (
            <section style={{
              display: 'flex',
              marginBottom: '20px',
            }}>
              <div style={{
                flexBasis: '160px',
                paddingRight: '25px',
                flexShrink: 0,
              }}>
                <h2 style={{
                  fontSize: '9pt',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#444',
                  letterSpacing: '1px',
                  paddingTop: '2px',
                }}>
                  LANGUAGES
                </h2>
              </div>
              <div style={{ flex: 1 }}>
                <ul style={{
                  listStyle: 'none',
                  paddingLeft: '15px',
                  color: '#555',
                }}>
                  {validLanguages.map((lang, index) => (
                    <li key={index} style={{
                      marginBottom: '5px',
                      position: 'relative',
                      paddingLeft: '15px',
                      fontSize: '10pt',
                    }}>
                      <span style={{
                        content: '•',
                        position: 'absolute',
                        left: 0,
                        top: '1px',
                        color: '#555',
                      }}>•</span>
                      {lang.name} {lang.level && `(${lang.level})`}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* References Section */}
          {validReferences.length > 0 && (
            <section style={{
              display: 'flex',
              marginBottom: '20px',
            }}>
              <div style={{
                flexBasis: '160px',
                paddingRight: '25px',
                flexShrink: 0,
              }}>
                <h2 style={{
                  fontSize: '9pt',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#444',
                  letterSpacing: '1px',
                  paddingTop: '2px',
                }}>
                  REFERENCES
                </h2>
              </div>
              <div style={{ flex: 1 }}>
                <ul style={{
                  listStyle: 'none',
                  paddingLeft: '15px',
                  color: '#555',
                }}>
                  {validReferences.map((ref, index) => (
                    <li key={index} style={{
                      marginBottom: '5px',
                      position: 'relative',
                      paddingLeft: '15px',
                      fontSize: '10pt',
                    }}>
                      <span style={{
                        content: '•',
                        position: 'absolute',
                        left: 0,
                        top: '1px',
                        color: '#555',
                      }}>•</span>
                      {ref.name}, {ref.position} at {ref.company}
                      {ref.email && <>, {ref.email}</>}
                      {ref.phone && <>, {ref.phone}</>}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Hobbies Section */}
          {validHobbies.length > 0 && (
            <section style={{
              display: 'flex',
              marginBottom: '20px',
            }}>
              <div style={{
                flexBasis: '160px',
                paddingRight: '25px',
                flexShrink: 0,
              }}>
                <h2 style={{
                  fontSize: '9pt',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#444',
                  letterSpacing: '1px',
                  paddingTop: '2px',
                }}>
                  HOBBIES & INTERESTS
                </h2>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  marginBottom: '10px',
                  color: '#555',
                  fontSize: '10pt',
                }}>
                  {validHobbies.join(', ')}
                </p>
              </div>
            </section>
          )}

          {/* Portfolio Section */}
          {personalInfo?.website && (
            <section style={{
              display: 'flex',
              marginBottom: '20px',
            }}>
              <div style={{
                flexBasis: '160px',
                paddingRight: '25px',
                flexShrink: 0,
              }}>
                <h2 style={{
                  fontSize: '9pt',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#444',
                  letterSpacing: '1px',
                  paddingTop: '2px',
                }}>
                  PORTFOLIO
                </h2>
              </div>
              <div style={{ flex: 1 }}>
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" style={{
                  color: '#007bff',
                  textDecoration: 'none',
                  fontSize: '10pt',
                }}>
                  View Portfolio
                </a>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
