import React from 'react';
import { CVData } from '@shared/schema';

export function SmartBongoTemplate(data: CVData) {
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

  return (
    <div style={{
      fontFamily: "'Roboto', sans-serif",
      fontSize: '10pt',
      lineHeight: 1.5,
      backgroundColor: '#e0e0e0',
      color: '#333',
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '30px auto 0 auto',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'grid',
        gridTemplateColumns: '35% 1fr',
      }}>
        {/* Left Column */}
        <div style={{
          backgroundColor: '#4A4A4A',
          color: '#FFFFFF',
          padding: '30px',
        }}>
          {/* Header Info */}
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{
              fontSize: '26pt',
              fontWeight: 700,
              marginBottom: '5px',
              lineHeight: 1.2,
              color: '#FFFFFF',
            }}>
              {personalInfo?.firstName} {personalInfo?.lastName}
            </h1>
            <p style={{
              fontSize: '11pt',
              fontWeight: 400,
              color: '#d0d0d0',
            }}>
              {personalInfo?.jobTitle}
            </p>
          </div>

          {/* Education Section */}
          {validEducation.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{
                fontSize: '11pt',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '15px',
                color: '#f0f0f0',
                borderBottom: '1px solid #666',
                paddingBottom: '5px',
              }}>
                EDUCATION
              </h2>
              {validEducation.map((edu, index) => (
                <article key={index} style={{ marginBottom: '15px' }}>
                  <h3 style={{
                    fontSize: '10pt',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginBottom: '2px',
                  }}>
                    {edu.degree} {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                  </h3>
                  <p className="meta" style={{
                    fontSize: '9pt',
                    color: '#d0d0d0',
                    marginBottom: '1px',
                  }}>
                    {edu.institution}, {edu.location}
                  </p>
                  {edu.gpa && (
                    <p style={{
                      fontSize: '9pt',
                      color: '#d0d0d0',
                      marginBottom: '1px',
                    }}>
                      Design GPA: {edu.gpa}/4.0
                    </p>
                  )}
                  <p style={{
                    fontSize: '9pt',
                    color: '#d0d0d0',
                    marginBottom: '1px',
                  }}>
                    {edu.endDate || edu.startDate}
                  </p>
                </article>
              ))}
            </section>
          )}

          {/* Skills Section */}
          {validSkills.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{
                fontSize: '11pt',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '15px',
                color: '#f0f0f0',
                borderBottom: '1px solid #666',
                paddingBottom: '5px',
              }}>
                KEY SKILLS
              </h2>
              <ul style={{
                listStyle: 'none',
                paddingLeft: 0,
              }}>
                {validSkills.map((skill, index) => (
                  <li key={index} style={{
                    marginBottom: '6px',
                    fontSize: '9.5pt',
                    color: '#d0d0d0',
                    position: 'relative',
                    paddingLeft: '15px',
                  }}>
                    <span style={{
                      content: '▪',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      color: '#f0f0f0',
                    }}>▪</span>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages Section */}
          {validLanguages.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{
                fontSize: '11pt',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '15px',
                color: '#f0f0f0',
                borderBottom: '1px solid #666',
                paddingBottom: '5px',
              }}>
                LANGUAGES
              </h2>
              <ul style={{
                listStyle: 'none',
                paddingLeft: 0,
              }}>
                {validLanguages.map((lang, index) => (
                  <li key={index} style={{
                    marginBottom: '6px',
                    fontSize: '9.5pt',
                    color: '#d0d0d0',
                    position: 'relative',
                    paddingLeft: '15px',
                  }}>
                    <span style={{
                      content: '▪',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      color: '#f0f0f0',
                    }}>▪</span>
                    {lang.name} {lang.level && `(${lang.level})`}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* References Section */}
          {validReferences.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{
                fontSize: '11pt',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '15px',
                color: '#f0f0f0',
                borderBottom: '1px solid #666',
                paddingBottom: '5px',
              }}>
                REFERENCES
              </h2>
              <ul style={{
                listStyle: 'none',
                paddingLeft: 0,
              }}>
                {validReferences.map((reference, index) => (
                  <li key={index} style={{
                    fontSize: '9pt',
                    lineHeight: 1.4,
                    marginBottom: '10px',
                  }}>
                    <strong style={{
                      color: '#FFFFFF',
                      fontWeight: 700,
                    }}>
                      {reference.name}
                    </strong>
                    <div>{reference.position} at {reference.company}</div>
                    {reference.email && <div>{reference.email}</div>}
                    {reference.phone && <div>{reference.phone}</div>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Hobbies Section */}
          {validHobbies.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{
                fontSize: '11pt',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '15px',
                color: '#f0f0f0',
                borderBottom: '1px solid #666',
                paddingBottom: '5px',
              }}>
                HOBBIES & INTERESTS
              </h2>
              <p style={{
                fontSize: '9.5pt',
                color: '#d0d0d0',
              }}>
                {validHobbies.join(', ')}
              </p>
            </section>
          )}

          {/* Portfolio Section */}
          {personalInfo?.website && (
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{
                fontSize: '11pt',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '15px',
                color: '#f0f0f0',
                borderBottom: '1px solid #666',
                paddingBottom: '5px',
              }}>
                PORTFOLIO
              </h2>
              <a
                href={personalInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#a0d8ff', textDecoration: 'none' }}
              >
                View Portfolio
              </a>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '30px',
          color: '#333',
        }}>
          {/* Summary Section */}
          {summary && (
            <section style={{ marginBottom: '25px' }}>
              <p style={{
                fontSize: '10pt',
                color: '#555',
                lineHeight: 1.6,
              }}>
                {summary}
              </p>
            </section>
          )}

          {/* Professional Experience Section */}
          {validWorkExperience.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{
                fontSize: '11pt',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '15px',
                color: '#333',
                borderBottom: '1px solid #eee',
                paddingBottom: '5px',
              }}>
                PROFESSIONAL EXPERIENCE
              </h2>
              {validWorkExperience.map((job, index) => (
                <article key={index} style={{
                  marginBottom: index === validWorkExperience.length - 1 ? 0 : '20px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '2px',
                    flexWrap: 'wrap',
                    gap: '5px',
                  }}>
                    <h3 style={{
                      fontSize: '11pt',
                      fontWeight: 700,
                      color: '#222',
                      marginRight: '10px',
                    }}>
                      {job.jobTitle}
                    </h3>
                    <span style={{
                      fontSize: '9pt',
                      fontWeight: 700,
                      color: '#555',
                      textAlign: 'right',
                      flexShrink: 0,
                    }}>
                      {job.company}, {job.location}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '9pt',
                    fontStyle: 'italic',
                    color: '#666',
                    marginBottom: '8px',
                  }}>
                    {job.startDate}{job.endDate ? ` - ${job.endDate}` : ' - Present'}
                  </p>
                  {job.achievements && job.achievements.length > 0 && (
                    <ul style={{
                      listStyle: 'none',
                      paddingLeft: '15px',
                    }}>
                      {job.achievements.map((achievement, idx) => (
                        <li key={idx} style={{
                          marginBottom: '5px',
                          fontSize: '10pt',
                          color: '#555',
                          position: 'relative',
                          paddingLeft: '18px',
                        }}>
                          <span style={{
                            content: '•',
                            position: 'absolute',
                            left: 0,
                            top: '1px',
                            color: '#444',
                          }}>•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </section>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto 30px auto',
        backgroundColor: '#4A4A4A',
        color: '#FFFFFF',
        padding: '15px 20px',
        textAlign: 'center',
        fontSize: '9pt',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}>
        {personalInfo?.phone && (
          <span style={{
            margin: '5px 10px',
            color: '#d0d0d0',
            display: 'inline-flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}>
            <i style={{ marginRight: '6px', color: '#f0f0f0' }} className="fas fa-phone"></i>
            {personalInfo.phone}
          </span>
        )}
        {personalInfo?.location && (
          <span style={{
            margin: '5px 10px',
            color: '#d0d0d0',
            display: 'inline-flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}>
            <i style={{ marginRight: '6px', color: '#f0f0f0' }} className="fas fa-map-marker-alt"></i>
            {personalInfo.location}
          </span>
        )}
        {personalInfo?.email && (
          <span style={{
            margin: '5px 10px',
            color: '#d0d0d0',
            display: 'inline-flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}>
            <i style={{ marginRight: '6px', color: '#f0f0f0' }} className="fas fa-envelope"></i>
            {personalInfo.email}
          </span>
        )}
        {personalInfo?.website && (
          <span style={{
            margin: '5px 10px',
            color: '#d0d0d0',
            display: 'inline-flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}>
            <i style={{ marginRight: '6px', color: '#f0f0f0' }} className="fas fa-globe"></i>
            {personalInfo.website}
          </span>
        )}
        {personalInfo?.linkedin && (
          <span style={{
            margin: '5px 10px',
            color: '#d0d0d0',
            display: 'inline-flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}>
            <i style={{ marginRight: '6px', color: '#f0f0f0' }} className="fab fa-linkedin"></i>
            {personalInfo.linkedin}
          </span>
        )}
      </div>
    </div>
  );
}
