import React from 'react';
import { CVData } from '@shared/schema';

export function BigBossTemplate(data: CVData) {
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
  // Handle hobbies based on data type
  const validHobbies = typeof hobbies === 'string' 
    ? [hobbies] // If hobbies is a string, wrap it in an array
    : Array.isArray(hobbies) 
      ? hobbies.filter(hobby => hobby) // If it's an array, filter out empty values
      : []; // Default to empty array

  return (
    <div style={{
      fontFamily: "'Lato', sans-serif",
      margin: 0,
      padding: 0,
      backgroundColor: '#ffffff',
      color: '#444',
      lineHeight: 1.6,
      fontSize: '10pt',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      maxWidth: '100%',
      boxSizing: 'border-box',
      borderTop: '5px solid #333'
    }}>
      {/* CV Header (Dark Background) */}
      <header style={{
        textAlign: 'center',
        padding: '25px 30px',
        backgroundColor: '#2d2d2d',
        color: '#ffffff',
      }}>
        <h1 style={{
          fontSize: '2.6em',
          color: '#ffffff',
          marginBottom: '5px',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          lineHeight: 1.2,
          fontWeight: 400,
        }}>
          {personalInfo?.firstName} {personalInfo?.lastName}
        </h1>
        <h2 style={{
          fontSize: '1.1em',
          color: '#ccc',
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: 0,
        }}>
          {personalInfo?.jobTitle}
        </h2>
      </header>

      {/* Main Content */}
      <main style={{
        padding: '30px 40px',
      }}>
        {/* Top Section (Objective + Contact) */}
        <section style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '30px',
          marginBottom: '25px',
          paddingBottom: '20px',
          borderBottom: '1px solid #eee',
        }}>
          {/* Objective Column */}
          <div style={{
            flex: 2,
            paddingRight: '20px',
          }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#333',
              marginBottom: '10px',
              paddingBottom: 0,
              borderBottom: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
            }}>CAREER OBJECTIVE</h3>
            <p style={{
              fontSize: '0.95em',
              color: '#555',
            }}>{summary}</p>
          </div>

          {/* Contact Column */}
          <div style={{
            flex: 1,
            textAlign: 'right',
          }}>
            <div>
              {personalInfo?.phone && (
                <p style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginBottom: '8px',
                  fontSize: '0.95em',
                  color: '#555',
                }}>
                  <span style={{ order: 1 }}>{personalInfo.phone}</span>
                  <span style={{
                    order: 2,
                    marginLeft: '10px',
                    width: '18px',
                    textAlign: 'center',
                    color: '#888',
                    flexShrink: 0,
                  }}>[P]</span>
                </p>
              )}

              {personalInfo?.email && (
                <p style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginBottom: '8px',
                  fontSize: '0.95em',
                  color: '#555',
                }}>
                  <span style={{ order: 1 }}>{personalInfo.email}</span>
                  <span style={{
                    order: 2,
                    marginLeft: '10px',
                    width: '18px',
                    textAlign: 'center',
                    color: '#888',
                    flexShrink: 0,
                  }}>[E]</span>
                </p>
              )}

              {personalInfo?.location && (
                <p style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginBottom: '8px',
                  fontSize: '0.95em',
                  color: '#555',
                }}>
                  <span style={{ order: 1 }}>{personalInfo.location}</span>
                  <span style={{
                    order: 2,
                    marginLeft: '10px',
                    width: '18px',
                    textAlign: 'center',
                    color: '#888',
                    flexShrink: 0,
                  }}>[A]</span>
                </p>
              )}

              {personalInfo?.website && (
                <p style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginBottom: '8px',
                  fontSize: '0.95em',
                  color: '#555',
                }}>
                  <span style={{ order: 1 }}>
                    <a href={personalInfo.website} style={{ color: '#555', textDecoration: 'none' }}>
                      {personalInfo.website}
                    </a>
                  </span>
                  <span style={{
                    order: 2,
                    marginLeft: '10px',
                    width: '18px',
                    textAlign: 'center',
                    color: '#888',
                    flexShrink: 0,
                  }}>[W]</span>
                </p>
              )}

              {personalInfo?.linkedin && (
                <p style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginBottom: '8px',
                  fontSize: '0.95em',
                  color: '#555',
                }}>
                  <span style={{ order: 1 }}>
                    <a href={personalInfo.linkedin} style={{ color: '#555', textDecoration: 'none' }}>
                      {personalInfo.linkedin}
                    </a>
                  </span>
                  <span style={{
                    order: 2,
                    marginLeft: '10px',
                    width: '18px',
                    textAlign: 'center',
                    color: '#888',
                    flexShrink: 0,
                  }}>[L]</span>
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        {validWorkExperience.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#333',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #eee',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
            }}>PROFESSIONAL EXPERIENCE</h3>
            <ul style={{ margin: 0 }}>
              {validWorkExperience.map((exp, index) => (
                <li key={index} style={{ marginBottom: index === validWorkExperience.length - 1 ? 0 : '20px' }}>
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{
                        display: 'block',
                        fontSize: '1.1em',
                        color: '#222',
                      }}>{exp.jobTitle}</strong>
                      <span style={{
                        display: 'block',
                        fontSize: '0.9em',
                        color: '#777',
                      }}>
                        {exp.startDate} - {exp.endDate || 'PRESENT'} | {exp.company}, {exp.location}
                      </span>
                    </div>
                    
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul style={{
                        listStyle: 'none',
                        paddingLeft: 0,
                        marginTop: '5px',
                      }}>
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} style={{
                            fontSize: '0.95em',
                            color: '#555',
                            marginBottom: '5px',
                            paddingLeft: '15px',
                            position: 'relative',
                          }}>
                            <span style={{
                              content: '▪',
                              color: '#888',
                              position: 'absolute',
                              left: 0,
                              top: '0.1em',
                              fontSize: '0.8em',
                            }}>▪</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Education Section */}
        {validEducation.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#333',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #eee',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
            }}>EDUCATION</h3>
            <ul style={{ margin: 0 }}>
              {validEducation.map((edu, index) => (
                <li key={index}>
                  <div>
                    <div>
                      <strong style={{
                        display: 'block',
                        fontSize: '1.1em',
                        color: '#222',
                        marginBottom: '2px',
                      }}>
                        {edu.degree} {edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                      </strong>
                      <span style={{
                        display: 'block',
                        fontSize: '0.9em',
                        color: '#777',
                      }}>
                        {edu.endDate || edu.startDate} | {edu.institution}, {edu.location}
                      </span>
                    </div>
                    {edu.description && (
                      <p style={{
                        fontSize: '0.95em',
                        color: '#555',
                        marginTop: '5px',
                      }}>
                        {edu.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Skills Section */}
        {validSkills.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#333',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #eee',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
            }}>SKILLS</h3>
            <ul style={{
              listStyle: 'none',
              paddingLeft: 0,
            }}>
              {validSkills.map((skill, index) => (
                <li key={index} style={{
                  fontSize: '0.95em',
                  color: '#555',
                  marginBottom: '5px',
                  paddingLeft: '15px',
                  position: 'relative',
                }}>
                  <span style={{
                    content: '▪',
                    color: '#888',
                    position: 'absolute',
                    left: 0,
                    top: '0.1em',
                    fontSize: '0.8em',
                  }}>▪</span>
                  {skill.name} {skill.level && `(${skill.level})`}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages Section */}
        {validLanguages.length > 0 && (
          <section style={{ marginBottom: '25px', display: 'block' }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#333',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #eee',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
            }}>Languages</h3>
            <ul style={{
              listStyle: 'none',
              paddingLeft: 0,
            }}>
              {validLanguages.map((lang, index) => (
                <li key={index} style={{
                  fontSize: '0.95em',
                  color: '#555',
                  marginBottom: '5px',
                  paddingLeft: '15px',
                  position: 'relative',
                }}>
                  <span style={{
                    content: '▪',
                    color: '#888',
                    position: 'absolute',
                    left: 0,
                    top: '0.1em',
                    fontSize: '0.8em',
                  }}>▪</span>
                  {lang.name} {lang.level && `(${lang.level})`}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* References Section */}
        {validReferences.length > 0 && (
          <section style={{ marginBottom: '25px', display: 'block' }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#333',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #eee',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
            }}>References</h3>
            <ul style={{
              listStyle: 'none',
              paddingLeft: 0,
            }}>
              {validReferences.map((ref, index) => (
                <li key={index} style={{
                  fontSize: '0.95em',
                  color: '#555',
                  marginBottom: '5px',
                }}>
                  <strong>{ref.name}</strong> - {ref.position} at {ref.company}
                  {ref.email && <span> | {ref.email}</span>}
                  {ref.phone && <span> | {ref.phone}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Hobbies Section */}
        {validHobbies.length > 0 && (
          <section style={{ marginBottom: '25px', display: 'block' }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#333',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #eee',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
            }}>Hobbies & Interests</h3>
            <p style={{ fontSize: '0.95em', color: '#555' }}>
              {validHobbies.join(', ')}
            </p>
          </section>
        )}

        {/* Portfolio Section (with website links) */}
        {personalInfo?.website && (
          <section style={{ marginBottom: 0, display: 'block' }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#333',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #eee',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
            }}>Portfolio</h3>
            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95em', color: '#555' }}>
              View Portfolio
            </a>
          </section>
        )}
      </main>
    </div>
  );
}
