import React from 'react';
import type { CVData } from '@shared/schema';

interface JijengeClassicTemplateProps {
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    professionalTitle?: string;
    address?: string;
    city?: string;
    region?: string;
    country?: string;
    postalCode?: string;
    summary?: string;
    location?: string;
    linkedin?: string;
  } | null;
  workExperience?: any[] | null;
  workExperiences?: any[] | null;
  education?: any[] | null;
  skills?: any[] | null;
  summary?: string | null;
  languages?: any[] | null;
  references?: any[] | null;
  hobbies?: any | null;
}

export function JijengeClassicTemplate({ 
  personalInfo = null, 
  workExperience = null, 
  workExperiences = null,
  education = [], 
  skills = [], 
  summary = "", 
  languages = [], 
  references = [],
  hobbies
}: JijengeClassicTemplateProps): JSX.Element {
  // Set default values if personalInfo is null
  const personInfo = personalInfo || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    professionalTitle: '',
    location: '',
    linkedin: ''
  };
  
  // Handle both workExperience and workExperiences naming
  const workItems = workExperiences || workExperience || [];
  
  // Use summary from personInfo if available, otherwise use the summary prop
  const summaryText = personInfo?.summary || summary;
  
  return (
    <div style={{ 
      fontFamily: "'Lato', sans-serif",
      margin: 0,
      padding: '20px',
      backgroundColor: '#f8f8f8',
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
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={{
          padding: '40px 40px 20px 40px',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <h1 style={{
            fontSize: '2.5em',
            color: '#333',
            margin: 0,
            textAlign: 'left',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: 700,
          }}>
            {personInfo.firstName} {personInfo.lastName}
          </h1>
          <h2 style={{
            fontSize: '1.2em',
            color: '#666',
            fontWeight: 400,
            margin: '5px 0 0 0',
            textAlign: 'left'
          }}>
            {personInfo.professionalTitle || 'Professional Title'}
          </h2>
        </header>

        {/* Main Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'row'
        }}>
          {/* Left Column */}
          <main style={{
            width: '65%',
            padding: '35px',
            boxSizing: 'border-box'
          }}>
            {/* Profile/Summary Section */}
            <section style={{
              marginBottom: '35px'
            }}>
              <h3 style={{
                fontSize: '1.1em',
                color: '#333',
                marginBottom: '15px',
                textTransform: 'uppercase',
                fontWeight: 700,
                borderBottom: '1px solid #ddd',
                paddingBottom: '5px',
                letterSpacing: '1px'
              }}>
                Professional Summary
              </h3>
              <p style={{
                fontSize: '0.95em',
                color: '#555',
                lineHeight: '1.6'
              }}>
                {summaryText}
              </p>
            </section>

            {/* Experience Section */}
            <section style={{
              marginBottom: '35px'
            }}>
              <h3 style={{
                fontSize: '1.1em',
                color: '#333',
                marginBottom: '15px',
                textTransform: 'uppercase',
                fontWeight: 700,
                borderBottom: '1px solid #ddd',
                paddingBottom: '5px',
                letterSpacing: '1px'
              }}>
                Experience
              </h3>
              {workItems.map((job, index) => (
                <div key={index} style={{
                  marginBottom: '20px'
                }}>
                  <h4 style={{
                    fontSize: '1.05em',
                    color: '#333',
                    fontWeight: 700,
                    margin: '0 0 5px 0'
                  }}>
                    {job.jobTitle}
                  </h4>
                  <p style={{
                    fontSize: '0.9em',
                    color: '#555',
                    margin: '0 0 10px 0'
                  }}>
                    {job.startDate} - {job.endDate || 'Present'} | {job.company}, {job.location || ''}
                  </p>
                  <ul style={{
                    listStyleType: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {job.achievements && job.achievements.map((achievement, i) => (
                      <li key={i} style={{
                        fontSize: '0.9em',
                        color: '#555',
                        margin: '0 0 8px 0',
                        paddingLeft: '15px',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          content: '"•"',
                          color: '#666'
                        }}>•</span>
                        {typeof achievement === 'string' ? achievement.trim() : achievement}
                      </li>
                    ))}
                    {job.description && job.description.split('\\n').map((bullet, i) => (
                      <li key={`desc-${i}`} style={{
                        fontSize: '0.9em',
                        color: '#555',
                        margin: '0 0 8px 0',
                        paddingLeft: '15px',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          content: '"•"',
                          color: '#666'
                        }}>•</span>
                        {bullet.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* Education Section */}
            <section style={{
              marginBottom: '35px'
            }}>
              <h3 style={{
                fontSize: '1.1em',
                color: '#333',
                marginBottom: '15px',
                textTransform: 'uppercase',
                fontWeight: 700,
                borderBottom: '1px solid #ddd',
                paddingBottom: '5px',
                letterSpacing: '1px'
              }}>
                Education
              </h3>
              {education.map((edu, index) => (
                <div key={index} style={{
                  marginBottom: '15px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline'
                  }}>
                    <h4 style={{
                      fontSize: '1em',
                      color: '#333',
                      fontWeight: 700,
                      margin: '0 0 5px 0'
                    }}>
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </h4>
                    <span style={{
                      fontSize: '0.9em',
                      color: '#555'
                    }}>
                      {edu.endDate}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.9em',
                    color: '#555',
                    margin: '0'
                  }}>
                    {edu.institution}
                  </p>
                </div>
              ))}
            </section>
          </main>

          {/* Right Column */}
          <aside style={{
            width: '35%',
            backgroundColor: '#f7f7f7',
            padding: '35px',
            boxSizing: 'border-box'
          }}>
            {/* Contact Section */}
            <section style={{
              marginBottom: '30px'
            }}>
              <h3 style={{
                fontSize: '1.1em',
                color: '#333',
                marginBottom: '15px',
                textTransform: 'uppercase',
                fontWeight: 700,
                borderBottom: '1px solid #ddd',
                paddingBottom: '5px',
                letterSpacing: '1px'
              }}>
                Contact
              </h3>
              <p style={{
                margin: '0 0 8px 0'
              }}>
                <span style={{ 
                  color: '#666',
                  marginRight: '10px',
                  fontWeight: 'normal'
                }}>[P]</span>
                <span style={{ color: '#555' }}>{personInfo.phone}</span>
              </p>
              <p style={{
                margin: '0 0 8px 0'
              }}>
                <span style={{ 
                  color: '#666',
                  marginRight: '10px',
                  fontWeight: 'normal'
                }}>[E]</span>
                <span style={{ color: '#555' }}>{personInfo.email}</span>
              </p>
              <p style={{
                margin: '0 0 8px 0'
              }}>
                <span style={{ 
                  color: '#666',
                  marginRight: '10px',
                  fontWeight: 'normal'
                }}>[A]</span>
                <span style={{ color: '#555' }}>
                  {personInfo.address || 
                   (personInfo.city || personInfo.region || personInfo.country ? 
                     [personInfo.city, personInfo.region, personInfo.country]
                       .filter(Boolean)
                       .join(', ') 
                     : personInfo.location || 'Location')}
                </span>
              </p>
            </section>

            {/* Skills Section */}
            <section style={{
              marginBottom: '30px'
            }}>
              <h3 style={{
                fontSize: '1.1em',
                color: '#333',
                marginBottom: '15px',
                textTransform: 'uppercase',
                fontWeight: 700,
                borderBottom: '1px solid #ddd',
                paddingBottom: '5px',
                letterSpacing: '1px'
              }}>
                Skills
              </h3>
              <ul style={{
                listStyleType: 'none',
                padding: 0,
                margin: 0
              }}>
                {skills.map((skill, index) => (
                  <li key={index} style={{
                    margin: '0 0 10px 0',
                    paddingLeft: '15px',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      content: '"•"',
                      color: '#666'
                    }}>•</span>
                    <span style={{ color: '#555' }}>{skill.name}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Languages Section */}
            {languages.length > 0 && (
              <section style={{
                marginBottom: '30px'
              }}>
                <h3 style={{
                  fontSize: '1.1em',
                  color: '#333',
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '5px',
                  letterSpacing: '1px'
                }}>
                  Languages
                </h3>
                <ul style={{
                  listStyleType: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {languages.map((language, index) => (
                    <li key={index} style={{
                      margin: '0 0 10px 0',
                      paddingLeft: '15px',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        content: '"•"',
                        color: '#666'
                      }}>•</span>
                      <span style={{ color: '#555' }}>
                        {language.name} | {language.proficiency}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* References Section */}
            {references.length > 0 && (
              <section style={{
                marginBottom: '30px'
              }}>
                <h3 style={{
                  fontSize: '1.1em',
                  color: '#333',
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '5px',
                  letterSpacing: '1px'
                }}>
                  References
                </h3>
                <ul style={{
                  listStyleType: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {references.map((reference, index) => (
                    <li key={index} style={{
                      marginBottom: '15px'
                    }}>
                      <p style={{
                        margin: '0 0 5px 0',
                        fontWeight: 'bold',
                        color: '#333'
                      }}>
                        {reference.name}
                      </p>
                      <p style={{ margin: '0 0 3px 0', color: '#555' }}>
                        {reference.position}
                      </p>
                      <p style={{ margin: '0 0 3px 0', color: '#555' }}>
                        {reference.company}
                      </p>
                      <p style={{ margin: '0 0 3px 0', color: '#555' }}>
                        {reference.email}
                      </p>
                      <p style={{ margin: '0 0 3px 0', color: '#555' }}>
                        {reference.phone}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Hobbies Section if available */}
            {hobbies && (
              <section style={{
                marginBottom: '30px'
              }}>
                <h3 style={{
                  fontSize: '1.1em',
                  color: '#333',
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '5px',
                  letterSpacing: '1px'
                }}>
                  Hobbies & Interests
                </h3>
                <p style={{ 
                  margin: '0',
                  color: '#555',
                  fontSize: '0.9em',
                  lineHeight: '1.6'
                }}>
                  {hobbies}
                </p>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}