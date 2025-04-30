import React from 'react';
import { CVData } from '@shared/schema';

export function MwalimuOneTemplate(data: CVData) {
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
      fontFamily: "'Lato', sans-serif",
      margin: 0,
      padding: '20px',
      backgroundColor: '#f4f4f4',
      color: '#333',
      lineHeight: 1.6,
      fontSize: '10pt',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    }}>
      <div style={{
        maxWidth: '850px',
        margin: '20px auto',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        padding: '40px',
      }}>
        {/* CV Header (Centered) */}
        <header style={{
          textAlign: 'center',
          marginBottom: '15px',
        }}>
          <h1 style={{
            fontSize: '2.4em',
            color: '#000000',
            marginBottom: '2px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 700,
          }}>
            {personalInfo?.firstName} {personalInfo?.lastName}
          </h1>
          <h2 style={{
            fontSize: '1.1em',
            color: '#555',
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: 0,
          }}>
            {personalInfo?.jobTitle}
          </h2>
        </header>

        {/* Contact Info Bar */}
        <div style={{
          textAlign: 'center',
          marginBottom: '25px',
          paddingBottom: '15px',
          borderBottom: '1px solid #eee',
          fontSize: '0.95em',
          color: '#444',
        }}>
          {personalInfo?.phone && (
            <span style={{ display: 'inline-block', margin: '0 5px' }}>
              {personalInfo.phone}
            </span>
          )}
          {personalInfo?.phone && personalInfo?.email && (
            <span style={{ color: '#ccc', margin: '0 8px' }}>|</span>
          )}
          {personalInfo?.email && (
            <span style={{ display: 'inline-block', margin: '0 5px' }}>
              {personalInfo.email}
            </span>
          )}
          {(personalInfo?.phone || personalInfo?.email) && personalInfo?.location && (
            <span style={{ color: '#ccc', margin: '0 8px' }}>|</span>
          )}
          {personalInfo?.location && (
            <span style={{ display: 'inline-block', margin: '0 5px' }}>
              {personalInfo.location}
            </span>
          )}
        </div>

        {/* Summary Section */}
        {summary && (
          <section style={{ textAlign: 'center', marginBottom: '25px', padding: '0 20px' }}>
            <p style={{ fontSize: '0.95em', color: '#444', lineHeight: 1.7 }}>
              {summary}
            </p>
          </section>
        )}

        {/* Skills Section */}
        {validSkills.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{
              textAlign: 'center',
              fontSize: '1.1em',
              color: '#222',
              marginBottom: '20px',
              paddingBottom: '8px',
              borderBottom: '2px solid #333',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              display: 'block',
              width: 'fit-content',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              SKILLS
            </h3>
            <ul style={{
              padding: '0 10%',
              columnCount: 2,
              columnGap: '40px',
            }}>
              {validSkills.map((skill, index) => (
                <li key={index} style={{
                  fontSize: '0.95em',
                  color: '#444',
                  marginBottom: '8px',
                  paddingLeft: '18px',
                  position: 'relative',
                  breakInside: 'avoid-column',
                }}>
                  <span style={{
                    content: '•',
                    color: '#555',
                    position: 'absolute',
                    left: 0,
                    top: '0.1em',
                    fontSize: '1em',
                  }}>•</span>
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Experience Section */}
        {validWorkExperience.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{
              textAlign: 'center',
              fontSize: '1.1em',
              color: '#222',
              marginBottom: '20px',
              paddingBottom: '8px',
              borderBottom: '2px solid #333',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              display: 'block',
              width: 'fit-content',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              EXPERIENCE
            </h3>
            <ul style={{ margin: 0 }}>
              {validWorkExperience.map((job, index) => (
                <li key={index} style={{ marginBottom: index === validWorkExperience.length - 1 ? 0 : '25px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                  }}>
                    <div style={{ flexGrow: 1 }}>
                      <strong style={{
                        display: 'block',
                        fontSize: '1.1em',
                        color: '#222',
                        marginBottom: '2px',
                      }}>
                        {job.jobTitle}
                      </strong>
                      <span style={{
                        display: 'block',
                        fontSize: '0.95em',
                        color: '#555',
                      }}>
                        {job.company}
                      </span>
                    </div>
                    <div style={{
                      flexShrink: 0,
                      textAlign: 'right',
                      fontSize: '0.9em',
                      color: '#666',
                      paddingLeft: '15px',
                    }}>
                      <span style={{ display: 'block', lineHeight: 1.4 }}>
                        {job.location}
                      </span>
                      <span style={{ display: 'block', lineHeight: 1.4 }}>
                        {job.startDate}{job.endDate ? ` - ${job.endDate}` : ' - Present'}
                      </span>
                    </div>
                  </div>
                  {job.achievements && job.achievements.length > 0 && (
                    <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '5px' }}>
                      {job.achievements.map((achievement, idx) => (
                        <li key={idx} style={{
                          fontSize: '0.95em',
                          color: '#444',
                          marginBottom: '5px',
                          paddingLeft: '18px',
                          position: 'relative',
                        }}>
                          <span style={{
                            content: '•',
                            color: '#555',
                            position: 'absolute',
                            left: 0,
                            top: '0.1em',
                            fontSize: '1em',
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

        {/* Education Section */}
        {validEducation.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{
              textAlign: 'center',
              fontSize: '1.1em',
              color: '#222',
              marginBottom: '20px',
              paddingBottom: '8px',
              borderBottom: '2px solid #333',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              display: 'block',
              width: 'fit-content',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              EDUCATION
            </h3>
            <ul style={{ margin: 0 }}>
              {validEducation.map((edu, index) => (
                <li key={index} style={{ marginBottom: index === validEducation.length - 1 ? 0 : '25px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                  }}>
                    <div style={{ flexGrow: 1 }}>
                      <strong style={{
                        display: 'block',
                        fontSize: '1.1em',
                        color: '#222',
                        marginBottom: '2px',
                      }}>
                        {edu.degree} {edu.fieldOfStudy ? `IN ${edu.fieldOfStudy.toUpperCase()}` : ''}
                      </strong>
                      <span style={{
                        display: 'block',
                        fontSize: '0.95em',
                        color: '#555',
                      }}>
                        {edu.institution}, {edu.location}
                      </span>
                    </div>
                    <div style={{
                      flexShrink: 0,
                      textAlign: 'right',
                      fontSize: '0.9em',
                      color: '#666',
                      paddingLeft: '15px',
                    }}>
                      <span style={{ display: 'block', lineHeight: 1.4 }}>
                        {edu.endDate || edu.startDate}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages Section */}
        {validLanguages.length > 0 && (
          <section style={{ marginBottom: '25px', display: 'block' }}>
            <h3 style={{
              textAlign: 'center',
              fontSize: '1.1em',
              color: '#222',
              marginBottom: '20px',
              paddingBottom: '8px',
              borderBottom: '2px solid #333',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              display: 'block',
              width: 'fit-content',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Languages
            </h3>
            <ul style={{ padding: '0 10%', columns: 2, columnGap: '40px' }}>
              {validLanguages.map((lang, index) => (
                <li key={index} style={{
                  fontSize: '0.95em',
                  color: '#444',
                  marginBottom: '8px',
                  paddingLeft: '18px',
                  position: 'relative',
                  breakInside: 'avoid-column',
                }}>
                  <span style={{
                    content: '•',
                    color: '#555',
                    position: 'absolute',
                    left: 0,
                    top: '0.1em',
                    fontSize: '1em',
                  }}>•</span>
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
              textAlign: 'center',
              fontSize: '1.1em',
              color: '#222',
              marginBottom: '20px',
              paddingBottom: '8px',
              borderBottom: '2px solid #333',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              display: 'block',
              width: 'fit-content',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              References
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {validReferences.map((ref, index) => (
                <li key={index} style={{ marginBottom: '15px', textAlign: 'center' }}>
                  <strong style={{ display: 'block', marginBottom: '5px' }}>{ref.name}</strong>
                  <div>{ref.position} at {ref.company}</div>
                  {ref.email && <div>{ref.email}</div>}
                  {ref.phone && <div>{ref.phone}</div>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Hobbies Section */}
        {validHobbies.length > 0 && (
          <section style={{ marginBottom: '25px', display: 'block' }}>
            <h3 style={{
              textAlign: 'center',
              fontSize: '1.1em',
              color: '#222',
              marginBottom: '20px',
              paddingBottom: '8px',
              borderBottom: '2px solid #333',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              display: 'block',
              width: 'fit-content',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Hobbies & Interests
            </h3>
            <p style={{ fontSize: '0.95em', color: '#444', textAlign: 'center' }}>
              {validHobbies.join(', ')}
            </p>
          </section>
        )}

        {/* Portfolio Link */}
        {personalInfo?.website && (
          <section style={{ marginBottom: '25px', display: 'block', textAlign: 'center' }}>
            <h3 style={{
              textAlign: 'center',
              fontSize: '1.1em',
              color: '#222',
              marginBottom: '20px',
              paddingBottom: '8px',
              borderBottom: '2px solid #333',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              display: 'block',
              width: 'fit-content',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Portfolio
            </h3>
            <a 
              href={personalInfo.website} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#333', textDecoration: 'none' }}
            >
              View Portfolio
            </a>
          </section>
        )}
      </div>
    </div>
  );
}
