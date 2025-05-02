import React from 'react';
import { CVData } from '@shared/schema';

export function SafariOriginalTemplate(data: CVData) {
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
  // Filter out empty certifications
  const validCertifications = certifications?.filter(cert => cert.name) || [];
  // Handle hobbies based on data type
  const validHobbies = typeof hobbies === 'string' 
    ? [hobbies] // If hobbies is a string, wrap it in an array
    : Array.isArray(hobbies) 
      ? hobbies.filter(hobby => hobby) // If it's an array, filter out empty values
      : []; // Default to empty array

  // Determine if we have additional skills (use certifications as additional skills)
  const hasAdditionalSkills = validCertifications.length > 0;

  // Determine if we have awards (can be projects or certifications)
  const hasAwards = (projects && projects.length > 0) || (validCertifications.length > 0);

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
    }}>
      <div style={{
        maxWidth: '850px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        display: 'flex',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        minHeight: '100vh',
      }}>
        {/* Sidebar */}
        <aside style={{
          width: '35%',
          backgroundColor: '#f2f2f2',
          padding: '30px',
          boxSizing: 'border-box',
        }}>
          {/* Contact Section */}
          <section style={{ marginBottom: '25px' }}>
            <h2 style={{
              fontSize: '1.1em',
              color: '#555555',
              borderBottom: 'none',
              paddingBottom: '5px',
              marginBottom: '15px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
            }}>CONTACT</h2>
            {personalInfo?.phone && <p style={{ marginBottom: '8px', fontSize: '0.95em', color: '#555' }}>{personalInfo.phone}</p>}
            {personalInfo?.email && <p style={{ marginBottom: '8px', fontSize: '0.95em', color: '#555' }}>{personalInfo.email}</p>}
            {personalInfo?.location && <p style={{ marginBottom: '8px', fontSize: '0.95em', color: '#555' }}>{personalInfo.location}</p>}
            {personalInfo?.linkedin && <p style={{ marginBottom: '8px', fontSize: '0.95em', color: '#555' }}>
              <a href={personalInfo.linkedin} style={{ color: '#555', textDecoration: 'none' }}>{personalInfo.linkedin}</a>
            </p>}
          </section>

          {/* Skills Section */}
          {validSkills.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{
                fontSize: '1.1em',
                color: '#555555',
                borderBottom: 'none',
                paddingBottom: '5px',
                marginBottom: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
              }}>SKILLS</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {validSkills.slice(0, 5).map((skill, index) => (
                  <li key={index} style={{ 
                    marginBottom: '6px', 
                    fontSize: '0.95em', 
                    color: '#555',
                    position: 'relative',
                    paddingLeft: '0.5em',
                  }}>
                    <span style={{
                      content: '•',
                      color: '#555',
                      display: 'inline-block',
                      width: '1em',
                      marginLeft: '-1em',
                      fontSize: '0.9em',
                      paddingRight: '0.5em',
                    }}>•</span>
                    {skill.name} {skill.level && `(${skill.level})`}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Additional Skills/Certifications Section */}
          {hasAdditionalSkills && (
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{
                fontSize: '1.1em',
                color: '#555555',
                borderBottom: 'none',
                paddingBottom: '5px',
                marginBottom: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
              }}>ADDITIONAL SKILLS</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {validCertifications.map((cert, index) => (
                  <li key={index} style={{ marginBottom: '6px', fontSize: '0.95em', color: '#555' }}>
                    {cert.name} {cert.issuer && `(${cert.issuer})`}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Education Section */}
          {validEducation.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{
                fontSize: '1.1em',
                color: '#555555',
                borderBottom: 'none',
                paddingBottom: '5px',
                marginBottom: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
              }}>EDUCATION</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {validEducation.map((edu, index) => (
                  <li key={index} style={{ marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '15px',
                    }}>
                      <div style={{ flexGrow: 1 }}>
                        <strong style={{ 
                          display: 'block', 
                          fontSize: '1.05em', 
                          color: '#333',
                          marginBottom: '2px', 
                        }}>
                          {edu.degree} {edu.fieldOfStudy && `In ${edu.fieldOfStudy}`}
                        </strong>
                        <span style={{ 
                          display: 'block', 
                          fontSize: '0.95em', 
                          color: '#555',
                          marginBottom: '8px', 
                        }}>
                          {edu.institution}
                        </span>
                        {edu.gpa && <span style={{ 
                          display: 'block', 
                          fontSize: '0.95em', 
                          color: '#555',
                          marginBottom: '4px', 
                        }}>
                          GPA: {edu.gpa} / 4.0
                        </span>}
                        {edu.description && <p style={{ 
                          fontSize: '0.9em', 
                          color: '#666',
                          marginTop: '5px', 
                          marginBottom: '0', 
                        }}>
                          {edu.description}
                        </p>}
                      </div>
                      <div style={{
                        flexShrink: 0,
                        textAlign: 'right',
                        fontSize: '0.9em',
                        color: '#666',
                        whiteSpace: 'nowrap',
                      }}>
                        <span style={{ display: 'block', lineHeight: 1.4 }}>
                          {edu.endDate || 'Present'}
                        </span>
                        <span style={{ display: 'block', lineHeight: 1.4 }}>
                          {edu.location}
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
              <h2 style={{
                fontSize: '1.1em',
                color: '#555555',
                borderBottom: 'none',
                paddingBottom: '5px',
                marginBottom: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
              }}>Languages</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {validLanguages.map((lang, index) => (
                  <li key={index} style={{ marginBottom: '6px', fontSize: '0.95em', color: '#555' }}>
                    {lang.name} | {lang.level || 'Basic'}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* References Section */}
          {validReferences.length > 0 && (
            <section style={{ marginBottom: '25px', display: 'block' }}>
              <h2 style={{
                fontSize: '1.1em',
                color: '#555555',
                borderBottom: 'none',
                paddingBottom: '5px',
                marginBottom: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
              }}>References</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {validReferences.length > 0 ? validReferences.map((ref, index) => (
                  <li key={index} style={{ marginBottom: '6px', fontSize: '0.95em', color: '#555' }}>
                    {ref.name}, {ref.position} at {ref.company}
                  </li>
                )) : <li style={{ marginBottom: '6px', fontSize: '0.95em', color: '#555' }}>Available upon request.</li>}
              </ul>
            </section>
          )}

          {/* Awards/Projects Section */}
          {hasAwards && (
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{
                fontSize: '1.1em',
                color: '#555555',
                borderBottom: 'none',
                paddingBottom: '5px',
                marginBottom: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
              }}>AWARDS</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {validCertifications.map((cert, index) => (
                  <li key={`cert-${index}`} style={{ marginBottom: '6px', fontSize: '0.95em', color: '#555' }}>
                    {cert.name}
                  </li>
                ))}
                {projects?.map((project, index) => (
                  <li key={`proj-${index}`} style={{ marginBottom: '6px', fontSize: '0.95em', color: '#555' }}>
                    {project.name}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* Main Content */}
        <main style={{
          width: '65%',
          padding: '30px',
          boxSizing: 'border-box',
        }}>
          {/* Header with Name & Title */}
          <header style={{
            textAlign: 'left',
            marginBottom: '25px',
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: '15px',
          }}>
            <h1 style={{
              fontSize: '2.6em',
              fontWeight: 700,
              color: '#333333',
              marginBottom: '2px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              lineHeight: 1.2,
            }}>
              {personalInfo?.firstName} {personalInfo?.lastName}
            </h1>
            <h2 style={{
              fontSize: '1.3em',
              fontWeight: 400,
              color: '#666666',
              marginBottom: 0,
            }}>
              {personalInfo?.jobTitle}
            </h2>
          </header>

          {/* Profile/Summary Section */}
          {summary && (
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{
                fontSize: '1.1em',
                color: '#555555',
                borderBottom: 'none',
                paddingBottom: '5px',
                marginBottom: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
              }}>PROFILE</h2>
              <p style={{ fontSize: '0.95em', color: '#444' }}>{summary}</p>
            </section>
          )}

          {/* Professional Experience Section */}
          {validWorkExperience.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h2 style={{
                fontSize: '1.1em',
                color: '#555555',
                borderBottom: 'none',
                paddingBottom: '5px',
                marginBottom: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
              }}>PROFESSIONAL EXPERIENCE</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {validWorkExperience.map((exp, index) => (
                  <li key={index} style={{ marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '15px',
                    }}>
                      <div style={{ flexGrow: 1 }}>
                        <strong style={{ 
                          display: 'block', 
                          fontSize: '1.05em', 
                          color: '#333',
                          marginBottom: '2px', 
                        }}>
                          {exp.jobTitle}
                        </strong>
                        <span style={{ 
                          display: 'block', 
                          fontSize: '0.95em', 
                          color: '#555',
                          marginBottom: '8px', 
                        }}>
                          {exp.company}
                        </span>
                        <ul style={{ 
                          listStyle: 'none', 
                          paddingLeft: 0, 
                          marginTop: '8px' 
                        }}>
                          {exp.achievements?.map((achievement, idx) => (
                            <li key={idx} style={{
                              fontSize: '0.95em',
                              color: '#444',
                              marginBottom: '5px',
                              paddingLeft: '15px',
                              position: 'relative',
                            }}>
                              <span style={{
                                content: '•',
                                color: '#555',
                                position: 'absolute',
                                left: 0,
                                top: '0.15em',
                                fontSize: '0.9em',
                              }}>•</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div style={{
                        flexShrink: 0,
                        textAlign: 'right',
                        fontSize: '0.9em',
                        color: '#666',
                        whiteSpace: 'nowrap',
                      }}>
                        <span style={{ display: 'block', lineHeight: 1.4 }}>
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </span>
                        <span style={{ display: 'block', lineHeight: 1.4 }}>
                          {exp.location}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Hobbies Section */}
          {validHobbies.length > 0 && (
            <section style={{ marginBottom: '25px', display: 'block' }}>
              <h2 style={{
                fontSize: '1.1em',
                color: '#555555',
                borderBottom: 'none',
                paddingBottom: '5px',
                marginBottom: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
              }}>Hobbies & Interests</h2>
              <p style={{ fontSize: '0.95em', color: '#444' }}>
                {validHobbies.join(', ')}
              </p>
            </section>
          )}

          {/* Portfolio Section (with website links) */}
          {personalInfo?.website && (
            <section style={{ marginBottom: '25px', display: 'block' }}>
              <h2 style={{
                fontSize: '1.1em',
                color: '#555555',
                borderBottom: 'none',
                paddingBottom: '5px',
                marginBottom: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
              }}>Portfolio</h2>
              <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95em', color: '#555', textDecoration: 'none' }}>
                View Portfolio
              </a>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
