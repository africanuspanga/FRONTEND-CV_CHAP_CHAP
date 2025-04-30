import React from 'react';
import type { CVData } from '@shared/schema';

export function MjenziWaTaifaTemplate({ 
  personalInfo, 
  workExperience = [], 
  education = [], 
  skills = [], 
  summary = "", 
  languages = [], 
  references = [],
  hobbies = "",
  certifications = [],
  projects = []
}: CVData): JSX.Element {
  return (
    <div style={{ 
      fontFamily: "'Lato', sans-serif",
      margin: 0,
      padding: '20px',
      backgroundColor: '#f8f8f8',
      color: '#555',
      lineHeight: 1.6,
      fontSize: '10pt',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '20px auto',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <header style={{
          textAlign: 'center',
          padding: '20px 30px',
          backgroundColor: '#f4ecd8',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <h1 style={{
            fontSize: '2.6em',
            color: '#4a4a4a',
            marginBottom: '2px',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            lineHeight: 1.2,
            fontWeight: 700
          }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <h2 style={{
            fontSize: '1.3em',
            color: '#777',
            fontWeight: 400,
            marginBottom: 0
          }}>
            {personalInfo.jobTitle}
          </h2>
        </header>

        {/* Top Info Section - 3 Columns */}
        <section style={{
          display: 'flex',
          padding: '25px 30px',
          gap: '30px',
          borderBottom: '1px solid #eee'
        }}>
          {/* Contact Column */}
          <div style={{ flexBasis: '25%' }}>
            <h3 style={{
              backgroundColor: '#f4ecd8',
              padding: '5px 10px',
              marginBottom: '15px',
              fontSize: '0.9em',
              color: '#5c5c5c',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'inline-block',
              borderRadius: '3px',
              fontWeight: 700
            }}>
              CONTACT
            </h3>
            <div style={{ fontSize: '0.95em', color: '#666' }}>
              <p style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ width: '18px', marginRight: '8px', textAlign: 'center', color: '#999' }}>[P]</span>
                <span>{personalInfo.phone}</span>
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ width: '18px', marginRight: '8px', textAlign: 'center', color: '#999' }}>[E]</span>
                <span>{personalInfo.email}</span>
              </p>
              <p style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ width: '18px', marginRight: '8px', textAlign: 'center', color: '#999' }}>[A]</span>
                <span>{personalInfo.location}</span>
              </p>
              {personalInfo.linkedin && (
                <p style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ width: '18px', marginRight: '8px', textAlign: 'center', color: '#999' }}>[L]</span>
                  <a href={personalInfo.linkedin} style={{ color: '#666', textDecoration: 'none' }}>
                    {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </p>
              )}
              {personalInfo.website && (
                <p style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ width: '18px', marginRight: '8px', textAlign: 'center', color: '#999' }}>[W]</span>
                  <a href={personalInfo.website} style={{ color: '#666', textDecoration: 'none' }}>
                    {personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Summary Column */}
          <div style={{ flexBasis: '45%' }}>
            <h3 style={{
              backgroundColor: '#f4ecd8',
              padding: '5px 10px',
              marginBottom: '15px',
              fontSize: '0.9em',
              color: '#5c5c5c',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'inline-block',
              borderRadius: '3px',
              fontWeight: 700
            }}>
              SUMMARY
            </h3>
            <p style={{ fontSize: '0.95em', color: '#555' }}>
              {summary}
            </p>
          </div>

          {/* Skills Column */}
          <div style={{ flexBasis: '30%' }}>
            <h3 style={{
              backgroundColor: '#f4ecd8',
              padding: '5px 10px',
              marginBottom: '15px',
              fontSize: '0.9em',
              color: '#5c5c5c',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'inline-block',
              borderRadius: '3px',
              fontWeight: 700
            }}>
              SKILLS
            </h3>
            <ul style={{ margin: 0 }}>
              {skills.slice(0, 3).map((skill, index) => (
                <li key={index} style={{ 
                  marginBottom: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  flexWrap: 'wrap',
                  fontSize: '0.95em'
                }}>
                  <span style={{ width: '80px', flexShrink: 0, color: '#555', paddingRight: '10px' }}>
                    {skill.name}
                  </span>
                  <div style={{ 
                    flexGrow: 1, 
                    height: '4px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    margin: '0 8px'
                  }}>
                    <div style={{ 
                      height: '100%',
                      backgroundColor: '#bdaa84',
                      borderRadius: '2px',
                      width: skill.level || '100%'
                    }}></div>
                  </div>
                  <span style={{ 
                    width: '30px',
                    flexShrink: 0,
                    textAlign: 'right',
                    color: '#888',
                    fontSize: '0.9em'
                  }}>
                    {skill.level || '100%'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Main Grid Area */}
        <div style={{ 
          display: 'flex',
          padding: '25px 30px',
          gap: '30px'
        }}>
          {/* Left Column */}
          <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Additional Skills */}
            {skills.length > 3 && (
              <section>
                <h3 style={{
                  backgroundColor: '#f4ecd8',
                  padding: '5px 10px',
                  marginBottom: '15px',
                  fontSize: '0.9em',
                  color: '#5c5c5c',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'inline-block',
                  borderRadius: '3px',
                  fontWeight: 700
                }}>
                  ADDITIONAL SKILLS
                </h3>
                <ul style={{ margin: 0 }}>
                  {skills.slice(3).map((skill, index) => (
                    <li key={index} style={{ 
                      fontSize: '0.95em',
                      color: '#555',
                      marginBottom: '6px',
                      paddingLeft: '0.5em',
                      position: 'relative'
                    }}>
                      <span style={{ 
                        display: 'inline-block', 
                        width: '1em', 
                        marginLeft: '-1em',
                        paddingRight: '0.5em',
                        color: '#bdaa84'
                      }}>•</span>
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <section>
                <h3 style={{
                  backgroundColor: '#f4ecd8',
                  padding: '5px 10px',
                  marginBottom: '15px',
                  fontSize: '0.9em',
                  color: '#5c5c5c',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'inline-block',
                  borderRadius: '3px',
                  fontWeight: 700
                }}>
                  LANGUAGES
                </h3>
                <ul style={{ margin: 0 }}>
                  {languages.map((language, index) => (
                    <li key={index} style={{ 
                      fontSize: '0.95em',
                      color: '#555',
                      marginBottom: '6px',
                      paddingLeft: '0.5em',
                      position: 'relative'
                    }}>
                      <span style={{ 
                        display: 'inline-block', 
                        width: '1em', 
                        marginLeft: '-1em',
                        paddingRight: '0.5em',
                        color: '#bdaa84'
                      }}>•</span>
                      {language.name} | {language.proficiency}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <section>
                <h3 style={{
                  backgroundColor: '#f4ecd8',
                  padding: '5px 10px',
                  marginBottom: '15px',
                  fontSize: '0.9em',
                  color: '#5c5c5c',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'inline-block',
                  borderRadius: '3px',
                  fontWeight: 700
                }}>
                  LICENSES AND CERTIFICATIONS
                </h3>
                <ul style={{ margin: 0 }}>
                  {certifications.map((cert, index) => (
                    <li key={index} style={{ 
                      fontSize: '0.95em',
                      color: '#555',
                      marginBottom: '6px',
                      paddingLeft: '0.5em',
                      position: 'relative'
                    }}>
                      <span style={{ 
                        display: 'inline-block', 
                        width: '1em', 
                        marginLeft: '-1em',
                        paddingRight: '0.5em',
                        color: '#bdaa84'
                      }}>•</span>
                      {cert.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* References */}
            {references.length > 0 && (
              <section>
                <h3 style={{
                  backgroundColor: '#f4ecd8',
                  padding: '5px 10px',
                  marginBottom: '15px',
                  fontSize: '0.9em',
                  color: '#5c5c5c',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'inline-block',
                  borderRadius: '3px',
                  fontWeight: 700
                }}>
                  REFERENCES
                </h3>
                <ul style={{ margin: 0 }}>
                  {references.map((reference, index) => (
                    <li key={index} style={{ 
                      marginBottom: '10px', 
                      lineHeight: 1.4,
                      fontSize: '0.95em',
                      color: '#555'
                    }}>
                      <strong style={{ display: 'block', color: '#444' }}>
                        {reference.name}
                      </strong>
                      {reference.position} at {reference.company}<br />
                      {reference.phone}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div style={{ width: '60%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Experience */}
            <section>
              <h3 style={{
                backgroundColor: '#f4ecd8',
                padding: '5px 10px',
                marginBottom: '15px',
                fontSize: '0.9em',
                color: '#5c5c5c',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'inline-block',
                borderRadius: '3px',
                fontWeight: 700
              }}>
                PROFESSIONAL EXPERIENCE
              </h3>
              <ul style={{ margin: 0 }}>
                {workExperience.map((job, index) => (
                  <li key={index} style={{ marginBottom: index < workExperience.length - 1 ? '20px' : '0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', alignItems: 'flex-start' }}>
                      <div style={{ flexGrow: 1 }}>
                        <strong style={{
                          display: 'block',
                          fontSize: '1.05em',
                          color: '#444',
                          marginBottom: '2px'
                        }}>
                          {job.jobTitle}
                        </strong>
                        <span style={{
                          display: 'block',
                          fontSize: '0.95em',
                          color: '#777',
                          marginBottom: '8px'
                        }}>
                          {job.company}
                        </span>
                        <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '8px' }}>
                          {job.description && job.description.split('\\n').map((bullet, bulletIndex) => (
                            <li key={bulletIndex} style={{
                              fontSize: '0.95em',
                              color: '#555',
                              marginBottom: '5px',
                              paddingLeft: '15px',
                              position: 'relative'
                            }}>
                              <span style={{ color: '#bdaa84', position: 'absolute', left: 0, top: '0.15em', fontSize: '0.9em' }}>•</span>
                              {bullet.trim()}
                            </li>
                          ))}
                          {job.achievements && job.achievements.map((achievement, achieveIndex) => (
                            <li key={`achieve-${achieveIndex}`} style={{
                              fontSize: '0.95em',
                              color: '#555',
                              marginBottom: '5px',
                              paddingLeft: '15px',
                              position: 'relative'
                            }}>
                              <span style={{ color: '#bdaa84', position: 'absolute', left: 0, top: '0.15em', fontSize: '0.9em' }}>•</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: 'right', fontSize: '0.9em', color: '#888', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'block', lineHeight: 1.4 }}>
                          {job.startDate} - {job.endDate || 'Present'}
                        </span>
                        <span style={{ display: 'block', lineHeight: 1.4 }}>
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Education */}
            <section>
              <h3 style={{
                backgroundColor: '#f4ecd8',
                padding: '5px 10px',
                marginBottom: '15px',
                fontSize: '0.9em',
                color: '#5c5c5c',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'inline-block',
                borderRadius: '3px',
                fontWeight: 700
              }}>
                EDUCATION
              </h3>
              <ul style={{ margin: 0 }}>
                {education.map((edu, index) => (
                  <li key={index} style={{ marginBottom: index < education.length - 1 ? '20px' : '0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', alignItems: 'flex-start' }}>
                      <div style={{ flexGrow: 1 }}>
                        <strong style={{
                          display: 'block',
                          fontSize: '1.05em',
                          color: '#444',
                          marginBottom: '2px'
                        }}>
                          {edu.degree} {edu.fieldOfStudy && `In ${edu.fieldOfStudy}`}
                        </strong>
                        <span style={{
                          display: 'block',
                          fontSize: '0.95em',
                          color: '#777',
                          marginBottom: '8px'
                        }}>
                          {edu.institution}
                        </span>
                        {edu.gpa && (
                          <span style={{
                            display: 'block',
                            fontSize: '0.95em',
                            color: '#777',
                            marginBottom: '4px'
                          }}>
                            GPA: {edu.gpa} / 4.0
                          </span>
                        )}
                        {edu.description && (
                          <>
                            <p style={{
                              fontSize: '0.95em',
                              color: '#777',
                              marginTop: '10px',
                              marginBottom: '5px',
                              fontWeight: 700
                            }}>
                              Relevant Coursework:
                            </p>
                            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                              {edu.description.split('\\n').map((course, courseIndex) => (
                                <li key={courseIndex} style={{
                                  fontSize: '0.95em',
                                  color: '#555',
                                  marginBottom: '5px',
                                  paddingLeft: '15px',
                                  position: 'relative'
                                }}>
                                  <span style={{ color: '#bdaa84', position: 'absolute', left: 0, top: '0.15em', fontSize: '0.9em' }}>•</span>
                                  {course.trim()}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                      <div style={{ flexShrink: 0, textAlign: 'right', fontSize: '0.9em', color: '#888', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'block', lineHeight: 1.4 }}>
                          {edu.endDate}
                        </span>
                        {/* Location is not present in the Education schema */}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}