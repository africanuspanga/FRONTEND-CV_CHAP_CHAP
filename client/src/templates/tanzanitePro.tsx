import React from 'react';
import { CVData } from '@shared/schema';

export function TanzaniteProTemplate(data: CVData) {
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

  // Get initials for the circle
  const getInitials = () => {
    const firstName = personalInfo?.firstName || '';
    const lastName = personalInfo?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <div style={{
      fontFamily: "'Lato', sans-serif",
      fontSize: '10pt',
      lineHeight: 1.5,
      backgroundColor: '#ffffff',
      color: '#333',
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
      maxWidth: '100%',
    }}>
      <div style={{
        maxWidth: '850px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        padding: '40px',
      }}>
        {/* Header Section */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          paddingBottom: '20px',
          marginBottom: '30px',
          borderBottom: '1px solid #eee',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '2px solid #ddd',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '20pt',
            fontWeight: 700,
            color: '#444',
            flexShrink: 0,
          }}>
            {getInitials()}
          </div>
          <div>
            <h1 style={{
              fontSize: '26pt',
              fontWeight: 700,
              color: '#000',
              marginBottom: '2px',
              letterSpacing: '1px',
              lineHeight: 1.2,
            }}>
              {personalInfo?.firstName} {personalInfo?.lastName}
            </h1>
            <p style={{
              fontSize: '10.5pt',
              color: '#555',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 400,
            }}>
              {personalInfo?.jobTitle}
            </p>
          </div>
        </header>

        {/* Main Body Layout */}
        <div style={{
          display: 'flex',
          gap: '40px',
        }}>
          {/* Left Column */}
          <div style={{ flex: 1.8 }}>
            {/* Career Objective Section */}
            {summary && (
              <section style={{ marginBottom: '25px' }}>
                <h2 style={{
                  fontSize: '11pt',
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 700,
                  borderBottom: '1px solid #eee',
                  paddingBottom: '5px',
                }}>CAREER OBJECTIVE</h2>
                <p style={{
                  marginBottom: '10px',
                  color: '#555',
                  fontSize: '10pt',
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
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 700,
                  borderBottom: '1px solid #eee',
                  paddingBottom: '5px',
                }}>PROFESSIONAL EXPERIENCE</h2>
                <div>
                  {validWorkExperience.map((job, index) => (
                    <article key={index} style={{ marginBottom: '20px' }}>
                      <h3 style={{
                        fontSize: '11pt',
                        fontWeight: 700,
                        color: '#222',
                        marginBottom: '3px',
                      }}>{job.jobTitle}</h3>
                      <p style={{
                        fontSize: '9.5pt',
                        color: '#666',
                        marginBottom: '8px',
                      }}>
                        {job.company}, {job.location} | {job.startDate}{job.endDate ? `-${job.endDate}` : '-Present'}
                      </p>
                      {job.achievements && job.achievements.length > 0 && (
                        <ul style={{ paddingLeft: '20px' }}>
                          {job.achievements.map((achievement, idx) => (
                            <li key={idx} style={{
                              marginBottom: '8px',
                              position: 'relative',
                              paddingLeft: '15px',
                              color: '#555',
                              fontSize: '10pt',
                            }}>
                              <span style={{
                                content: '•',
                                position: 'absolute',
                                left: 0,
                                top: '1px',
                                color: '#555',
                                fontWeight: 'bold',
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
          </div>

          {/* Right Column */}
          <div style={{ flex: 1 }}>
            {/* Contact Section */}
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{
                fontSize: '11pt',
                color: '#333',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 700,
                borderBottom: '1px solid #eee',
                paddingBottom: '5px',
              }}>CONTACT</h2>
              {personalInfo?.phone && (
                <p style={{ marginBottom: '10px' }}>
                  <strong style={{
                    display: 'block',
                    marginBottom: '2px',
                    fontWeight: 700,
                    color: '#333',
                    fontSize: '9.5pt',
                  }}>Phone</strong>
                  <span style={{ fontSize: '10pt', color: '#555' }}>{personalInfo.phone}</span>
                </p>
              )}
              {personalInfo?.email && (
                <p style={{ marginBottom: '10px' }}>
                  <strong style={{
                    display: 'block',
                    marginBottom: '2px',
                    fontWeight: 700,
                    color: '#333',
                    fontSize: '9.5pt',
                  }}>Email</strong>
                  <span style={{ fontSize: '10pt', color: '#555' }}>{personalInfo.email}</span>
                </p>
              )}
              {personalInfo?.linkedin && (
                <p style={{ marginBottom: '10px' }}>
                  <strong style={{
                    display: 'block',
                    marginBottom: '2px',
                    fontWeight: 700,
                    color: '#333',
                    fontSize: '9.5pt',
                  }}>LinkedIn</strong>
                  <span style={{ fontSize: '10pt', color: '#555' }}>{personalInfo.linkedin}</span>
                </p>
              )}
            </section>

            {/* Education Section */}
            {validEducation.length > 0 && (
              <section style={{ marginBottom: '25px' }}>
                <h2 style={{
                  fontSize: '11pt',
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 700,
                  borderBottom: '1px solid #eee',
                  paddingBottom: '5px',
                }}>EDUCATION</h2>
                {validEducation.map((edu, index) => (
                  <article key={index} style={{ marginBottom: '20px' }}>
                    <h3 style={{
                      fontSize: '11pt',
                      fontWeight: 700,
                      color: '#222',
                      marginBottom: '3px',
                    }}>{edu.institution},</h3>
                    <p style={{
                      fontSize: '9.5pt',
                      color: '#666',
                      marginBottom: '8px',
                    }}>
                      {edu.location} | {edu.endDate || edu.startDate}
                    </p>
                    <p style={{
                      marginBottom: '10px',
                      color: '#555',
                      fontSize: '10pt',
                    }}>
                      {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                      {edu.gpa && <><br />Honors: GPA: {edu.gpa}/4.0</>}
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
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 700,
                  borderBottom: '1px solid #eee',
                  paddingBottom: '5px',
                }}>RELEVANT SKILLS</h2>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {validSkills.map((skill, index) => (
                    <li key={index} style={{
                      marginBottom: '5px',
                      fontSize: '10pt',
                      color: '#555',
                    }}>
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Languages Section (Hidden by default) */}
            {validLanguages.length > 0 && (
              <section style={{ marginBottom: '25px', display: 'block' }}>
                <h2 style={{
                  fontSize: '11pt',
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 700,
                  borderBottom: '1px solid #eee',
                  paddingBottom: '5px',
                }}>LANGUAGES</h2>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {validLanguages.map((lang, index) => (
                    <li key={index} style={{
                      marginBottom: '5px',
                      fontSize: '10pt',
                      color: '#555',
                    }}>
                      {lang.name} {lang.level && `(${lang.level})`}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* References Section (Hidden by default) */}
            {validReferences.length > 0 && (
              <section style={{ marginBottom: '25px', display: 'block' }}>
                <h2 style={{
                  fontSize: '11pt',
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 700,
                  borderBottom: '1px solid #eee',
                  paddingBottom: '5px',
                }}>REFERENCES</h2>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {validReferences.map((ref, index) => (
                    <li key={index} style={{
                      marginBottom: '5px',
                      fontSize: '10pt',
                      color: '#555',
                    }}>
                      {ref.name}, {ref.position} at {ref.company}
                      {ref.email && <><br />{ref.email}</>}
                      {ref.phone && <> | {ref.phone}</>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Hobbies Section (Hidden by default) */}
            {validHobbies.length > 0 && (
              <section style={{ marginBottom: '25px', display: 'block' }}>
                <h2 style={{
                  fontSize: '11pt',
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 700,
                  borderBottom: '1px solid #eee',
                  paddingBottom: '5px',
                }}>HOBBIES & INTERESTS</h2>
                <p style={{
                  marginBottom: '10px',
                  color: '#555',
                  fontSize: '10pt',
                }}>
                  {validHobbies.join(', ')}
                </p>
              </section>
            )}

            {/* Portfolio Section (Hidden by default) */}
            {personalInfo?.website && (
              <section style={{ marginBottom: '25px', display: 'block' }}>
                <h2 style={{
                  fontSize: '11pt',
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 700,
                  borderBottom: '1px solid #eee',
                  paddingBottom: '5px',
                }}>PORTFOLIO</h2>
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" style={{
                  color: '#007bff',
                  textDecoration: 'none',
                  fontSize: '10pt',
                }}>
                  View Portfolio
                </a>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
