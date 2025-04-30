import React from 'react';
import { CVData } from '@shared/schema';

export function MadiniMobTemplate(data: CVData) {
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
  // Filter out empty hobbies
  const validHobbies = hobbies?.filter(hobby => hobby) || [];

  return (
    <div style={{
      fontFamily: "'Lato', sans-serif",
      margin: 0,
      padding: '20px',
      backgroundColor: '#ffffff',
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
        padding: '40px',
        border: '1px solid #e0e0e0',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '10px',
        }}>
          <h1 style={{
            fontSize: '2.6em',
            color: '#000000',
            marginBottom: '2px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 900,
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
        </div>

        {/* Contact Bar */}
        <div style={{
          textAlign: 'center',
          marginBottom: '25px',
          paddingBottom: '10px',
          borderBottom: '1px solid #e0e0e0',
          fontSize: '0.9em',
          color: '#444',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '5px 10px',
        }}>
          {personalInfo?.phone && (
            <span style={{ whiteSpace: 'nowrap' }}>{personalInfo.phone}</span>
          )}
          {personalInfo?.phone && personalInfo?.email && (
            <span style={{ color: '#999', fontWeight: 'bold' }} className="separator">•</span>
          )}
          {personalInfo?.email && (
            <span style={{ whiteSpace: 'nowrap' }}>{personalInfo.email}</span>
          )}
          {personalInfo?.email && personalInfo?.location && (
            <span style={{ color: '#999', fontWeight: 'bold' }} className="separator">•</span>
          )}
          {personalInfo?.location && (
            <span style={{ whiteSpace: 'nowrap' }}>{personalInfo.location}</span>
          )}
          {personalInfo?.website && (
            <>
              <span style={{ color: '#999', fontWeight: 'bold' }} className="separator">•</span>
              <a style={{ color: '#333', textDecoration: 'none', whiteSpace: 'nowrap' }} href={personalInfo.website}>
                {personalInfo.website.replace(/(https?:\/\/)?(www\.)?/i, '')}
              </a>
            </>
          )}
          {personalInfo?.linkedin && (
            <>
              <span style={{ color: '#999', fontWeight: 'bold' }} className="separator">•</span>
              <a style={{ color: '#333', textDecoration: 'none', whiteSpace: 'nowrap' }} href={personalInfo.linkedin}>
                LinkedIn
              </a>
            </>
          )}
        </div>

        {/* Summary Section */}
        {summary && (
          <div style={{
            marginBottom: '25px',
            textAlign: 'left',
          }}>
            <p style={{
              fontSize: '0.95em',
              color: '#444',
              lineHeight: 1.7,
            }}>
              {summary}
            </p>
          </div>
        )}

        {/* Skills Section */}
        {validSkills.length > 0 && (
          <div style={{
            marginBottom: '25px',
          }}>
            <h3 style={{
              fontSize: '1.05em',
              color: '#333',
              backgroundColor: '#f0f0f0',
              marginBottom: '15px',
              padding: '5px 10px',
              border: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              display: 'inline-block',
            }}>
              Skills
            </h3>
            <div style={{
              columnCount: 2,
              columnGap: '40px',
            }}>
              {validSkills.map((skill, index) => (
                <div 
                  key={index} 
                  style={{
                    fontSize: '0.95em',
                    color: '#444',
                    marginBottom: '8px',
                    paddingLeft: '18px',
                    position: 'relative',
                    breakInside: 'avoid-column',
                  }}
                >
                  <span style={{
                    content: '•',
                    color: '#888',
                    position: 'absolute',
                    left: 0,
                    top: '0.1em',
                    fontSize: '1em',
                  }}>•</span>
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {validWorkExperience.length > 0 && (
          <div style={{
            marginBottom: '25px',
          }}>
            <h3 style={{
              fontSize: '1.05em',
              color: '#333',
              backgroundColor: '#f0f0f0',
              marginBottom: '15px',
              padding: '5px 10px',
              border: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              display: 'inline-block',
            }}>
              Experience
            </h3>
            <ul style={{ margin: 0 }}>
              {validWorkExperience.map((job, index) => (
                <li key={index} style={{ marginBottom: index === validWorkExperience.length - 1 ? 0 : '20px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '5px',
                    flexWrap: 'wrap',
                  }}>
                    <div style={{
                      flexGrow: 1,
                    }}>
                      <strong style={{
                        display: 'block',
                        fontSize: '1.05em',
                        color: '#222',
                        marginBottom: '2px',
                        fontStyle: 'italic',
                      }}>
                        {job.jobTitle}
                      </strong>
                      <span style={{
                        display: 'block',
                        fontSize: '0.95em',
                        color: '#444',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}>
                        {job.company}, {job.location}
                      </span>
                    </div>
                    <div style={{
                      flexShrink: 0,
                      textAlign: 'right',
                      fontSize: '0.9em',
                      color: '#555',
                      paddingLeft: '15px',
                      fontWeight: 700,
                    }}>
                      <span style={{ display: 'block', lineHeight: 1.4 }}>
                        {job.startDate}{job.endDate ? ` - ${job.endDate}` : ' - Present'}
                      </span>
                    </div>
                  </div>
                  {job.achievements && job.achievements.length > 0 && (
                    <ul style={{
                      listStyle: 'none',
                      paddingLeft: '10px',
                      marginTop: '5px',
                    }}>
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
                            color: '#888',
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
          </div>
        )}

        {/* Education Section */}
        {validEducation.length > 0 && (
          <div style={{
            marginBottom: '25px',
          }}>
            <h3 style={{
              fontSize: '1.05em',
              color: '#333',
              backgroundColor: '#f0f0f0',
              marginBottom: '15px',
              padding: '5px 10px',
              border: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              display: 'inline-block',
            }}>
              Education
            </h3>
            <ul style={{ margin: 0 }}>
              {validEducation.map((edu, index) => (
                <li key={index} style={{ marginBottom: index === validEducation.length - 1 ? 0 : '20px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '5px',
                    flexWrap: 'wrap',
                  }}>
                    <div style={{
                      flexGrow: 1,
                    }}>
                      <strong style={{
                        display: 'block',
                        fontSize: '1.05em',
                        color: '#222',
                        marginBottom: '2px',
                        fontStyle: 'italic',
                      }}>
                        {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                      </strong>
                      <span style={{
                        display: 'block',
                        fontSize: '0.95em',
                        color: '#444',
                        fontWeight: 400,
                        textTransform: 'none',
                      }}>
                        {edu.institution}, {edu.location}
                      </span>
                    </div>
                    <div style={{
                      flexShrink: 0,
                      textAlign: 'right',
                      fontSize: '0.9em',
                      color: '#555',
                      paddingLeft: '15px',
                      fontWeight: 700,
                    }}>
                      <span style={{ display: 'block', lineHeight: 1.4 }}>
                        {edu.endDate || edu.startDate}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages Section */}
        {validLanguages.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '1.05em',
              color: '#333',
              backgroundColor: '#f0f0f0',
              marginBottom: '15px',
              padding: '5px 10px',
              border: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              display: 'inline-block',
            }}>
              Languages
            </h3>
            <ul style={{ margin: 0 }}>
              {validLanguages.map((language, index) => (
                <li key={index} style={{ 
                  fontSize: '0.95em',
                  color: '#444',
                  marginBottom: '5px',
                  paddingLeft: '18px',
                  position: 'relative',
                }}>
                  <span style={{
                    content: '•',
                    color: '#888',
                    position: 'absolute',
                    left: 0,
                    top: '0.1em',
                    fontSize: '1em',
                  }}>•</span>
                  {language.name}{language.level ? ` (${language.level})` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* References Section */}
        {validReferences.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '1.05em',
              color: '#333',
              backgroundColor: '#f0f0f0',
              marginBottom: '15px',
              padding: '5px 10px',
              border: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              display: 'inline-block',
            }}>
              References
            </h3>
            <ul style={{ margin: 0 }}>
              {validReferences.map((reference, index) => (
                <li key={index} style={{ 
                  marginBottom: '10px',
                  paddingLeft: '18px',
                  position: 'relative',
                }}>
                  <span style={{
                    content: '•',
                    color: '#888',
                    position: 'absolute',
                    left: 0,
                    top: '0.1em',
                    fontSize: '1em',
                  }}>•</span>
                  <strong style={{ fontWeight: 700 }}>{reference.name}</strong>
                  <div style={{ fontSize: '0.95em', color: '#444' }}>
                    {reference.position} at {reference.company}
                  </div>
                  {reference.email && <div style={{ fontSize: '0.95em', color: '#444' }}>{reference.email}</div>}
                  {reference.phone && <div style={{ fontSize: '0.95em', color: '#444' }}>{reference.phone}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hobbies Section */}
        {validHobbies.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '1.05em',
              color: '#333',
              backgroundColor: '#f0f0f0',
              marginBottom: '15px',
              padding: '5px 10px',
              border: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              display: 'inline-block',
            }}>
              Hobbies & Interests
            </h3>
            <p style={{ fontSize: '0.95em', color: '#444' }}>
              {validHobbies.join(', ')}
            </p>
          </div>
        )}

        {/* Portfolio Section */}
        {personalInfo?.website && (
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '1.05em',
              color: '#333',
              backgroundColor: '#f0f0f0',
              marginBottom: '15px',
              padding: '5px 10px',
              border: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              display: 'inline-block',
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
          </div>
        )}
      </div>
    </div>
  );
}
