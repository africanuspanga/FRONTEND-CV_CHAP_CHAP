import React from 'react';
import type { CVData } from '@shared/schema';

export function JijengeClassicTemplate({ 
  personalInfo, 
  workExperience = [], 
  education = [], 
  skills = [], 
  summary = "", 
  languages = [], 
  references = [],
  hobbies
}: CVData): JSX.Element {
  return (
    <div style={{ 
      fontFamily: "'Lato', sans-serif",
      margin: 0,
      padding: '20px',
      backgroundColor: '#f0f0f0',
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
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
        display: 'flex'
      }}>
        <main style={{
          width: '68%',
          padding: '35px',
          boxSizing: 'border-box'
        }}>
          <header style={{
            textAlign: 'center',
            marginBottom: '30px',
            paddingBottom: '15px',
            borderBottom: '2px solid #ccc'
          }}>
            <h1 style={{
              fontSize: '2.5em',
              color: '#111',
              marginBottom: '3px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: 700,
              marginTop: 0
            }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 style={{
              fontSize: '1.2em',
              color: '#555',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: 0,
              marginTop: 0
            }}>
              {personalInfo.jobTitle || 'Professional'}
            </h2>
          </header>

          <section style={{
            marginBottom: '25px'
          }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#333',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #ddd',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              marginTop: 0
            }}>Professional Summary</h3>
            <p style={{
              fontSize: '0.95em',
              color: '#444'
            }}>
              {summary}
            </p>
          </section>

          <section style={{
            marginBottom: '25px'
          }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#333',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #ddd',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              marginTop: 0
            }}>Experience</h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {workExperience.map((job, index) => (
                <li key={index} style={{
                  marginBottom: index === workExperience.length - 1 ? 0 : '20px'
                }}>
                  <div>
                    <div style={{
                      marginBottom: '8px'
                    }}>
                      <strong style={{
                        display: 'block',
                        fontSize: '1.1em',
                        color: '#222',
                        fontWeight: 700
                      }}>
                        {job.jobTitle}
                      </strong>
                      <span style={{
                        display: 'block',
                        fontSize: '0.9em',
                        color: '#666'
                      }}>
                        {job.startDate} - {job.endDate || 'Present'} | {job.company}, {job.location || ''}
                      </span>
                    </div>
                    <ul style={{
                      listStyle: 'none',
                      paddingLeft: 0,
                      marginTop: '5px'
                    }}>
                      {job.description ? job.description.split('\\n').map((bullet, bulletIndex) => (
                        <li key={bulletIndex} style={{
                          fontSize: '0.95em',
                          color: '#444',
                          marginBottom: '5px',
                          paddingLeft: '18px',
                          position: 'relative'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: 0,
                            top: '0.1em',
                            fontSize: '1em',
                            color: '#555'
                          }}>•</span>
                          {bullet.trim()}
                        </li>
                      )) : null}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section style={{
            marginBottom: '25px'
          }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#333',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #ddd',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              marginTop: 0
            }}>Education</h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {education.map((edu, index) => (
                <li key={index}>
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '3px'
                    }}>
                      <strong style={{
                        fontSize: '1.1em',
                        color: '#222',
                        fontWeight: 700
                      }}>
                        {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                      </strong>
                      <span style={{
                        fontSize: '0.9em',
                        color: '#666'
                      }}>
                        {edu.endDate}
                      </span>
                    </div>
                    <div>
                      <span style={{
                        display: 'block',
                        fontSize: '0.95em',
                        color: '#555'
                      }}>
                        {edu.institution}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {hobbies && (
            <section style={{
              marginBottom: '25px'
            }}>
              <h3 style={{
                fontSize: '1.1em',
                color: '#333',
                marginBottom: '15px',
                paddingBottom: '5px',
                borderBottom: '1px solid #ddd',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
                marginTop: 0
              }}>Hobbies & Interests</h3>
              <p style={{
                fontSize: '0.95em',
                color: '#444'
              }}>
                {hobbies}
              </p>
            </section>
          )}
        </main>

        <aside style={{
          width: '32%',
          backgroundColor: '#e8e8e8',
          padding: '35px',
          boxSizing: 'border-box'
        }}>
          <section style={{
            marginBottom: '25px'
          }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#444',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #ccc',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              marginTop: 0
            }}>Contact</h3>
            <p style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              fontSize: '0.95em',
              color: '#444'
            }}>
              <span style={{
                width: '20px',
                marginRight: '10px',
                textAlign: 'center',
                color: '#666',
                flexShrink: 0
              }}>[P]</span>
              <span>{personalInfo.phone}</span>
            </p>
            <p style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              fontSize: '0.95em',
              color: '#444'
            }}>
              <span style={{
                width: '20px',
                marginRight: '10px',
                textAlign: 'center',
                color: '#666',
                flexShrink: 0
              }}>[E]</span>
              <span>{personalInfo.email}</span>
            </p>
            <p style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              fontSize: '0.95em',
              color: '#444'
            }}>
              <span style={{
                width: '20px',
                marginRight: '10px',
                textAlign: 'center',
                color: '#666',
                flexShrink: 0
              }}>[A]</span>
              <span>{personalInfo.city}, {personalInfo.state} {personalInfo.zipCode}</span>
            </p>
            {personalInfo.linkedin && (
              <p style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                fontSize: '0.95em',
                color: '#444'
              }}>
                <span style={{
                  width: '20px',
                  marginRight: '10px',
                  textAlign: 'center',
                  color: '#666',
                  flexShrink: 0
                }}>[L]</span>
                <a href={personalInfo.linkedin} style={{
                  color: '#333',
                  textDecoration: 'none'
                }}>LinkedIn Profile</a>
              </p>
            )}
          </section>

          <section style={{
            marginBottom: '25px'
          }}>
            <h3 style={{
              fontSize: '1.1em',
              color: '#444',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #ccc',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              marginTop: 0
            }}>Skills</h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {skills.map((skill, index) => (
                <li key={index} style={{
                  fontSize: '0.95em',
                  color: '#444',
                  marginBottom: '6px',
                  paddingLeft: '18px',
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    top: '0.1em',
                    fontSize: '1em',
                    color: '#555'
                  }}>•</span>
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>

          {languages.length > 0 && (
            <section style={{
              marginBottom: '25px'
            }}>
              <h3 style={{
                fontSize: '1.1em',
                color: '#444',
                marginBottom: '15px',
                paddingBottom: '5px',
                borderBottom: '1px solid #ccc',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
                marginTop: 0
              }}>Languages</h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {languages.map((language, index) => (
                  <li key={index} style={{
                    fontSize: '0.95em',
                    color: '#444',
                    marginBottom: '6px',
                    paddingLeft: '18px',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      top: '0.1em',
                      fontSize: '1em',
                      color: '#555'
                    }}>•</span>
                    {language.name} | {language.proficiency}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {references.length > 0 && (
            <section style={{
              marginBottom: '25px'
            }}>
              <h3 style={{
                fontSize: '1.1em',
                color: '#444',
                marginBottom: '15px',
                paddingBottom: '5px',
                borderBottom: '1px solid #ccc',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
                marginTop: 0
              }}>References</h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {references.map((reference, index) => (
                  <li key={index} style={{
                    fontSize: '0.95em',
                    color: '#444',
                    marginBottom: '10px'
                  }}>
                    <strong style={{
                      display: 'block',
                      fontWeight: 700
                    }}>{reference.name}</strong>
                    <span style={{
                      display: 'block'
                    }}>{reference.position}</span>
                    <span style={{
                      display: 'block'
                    }}>{reference.company}</span>
                    <span style={{
                      display: 'block'
                    }}>{reference.email}</span>
                    <span style={{
                      display: 'block'
                    }}>{reference.phone}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}