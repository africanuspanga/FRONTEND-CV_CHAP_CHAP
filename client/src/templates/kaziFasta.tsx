import React from 'react';
import { CVData } from '@shared/schema';

interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  jobTitle?: string;
  website?: string;
}

interface WorkExperience {
  id?: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
  achievements?: string[];
}

interface Education {
  id?: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string;
  fieldOfStudy?: string;
  description?: string;
  achievements?: string[];
}

interface Skill {
  id?: string;
  name: string;
  level?: number;
}

interface Language {
  id?: string;
  name: string;
  proficiency: string;
}

interface Reference {
  id?: string;
  name: string;
  position?: string;
  company?: string;
  email?: string;
  phone?: string;
}

interface CVDataTemplate {
  personalInfo?: PersonalInfo;
  workExperience?: WorkExperience[];
  education?: Education[];
  skills?: Skill[];
  summary?: string;
  languages?: Language[];
  references?: Reference[];
}

export function KaziFastaTemplate(cvData: CVDataTemplate = {}): JSX.Element {
  // Safely destructure with default empty values to prevent null errors
  const {
    personalInfo = {} as PersonalInfo,
    workExperience = [] as WorkExperience[],
    education = [] as Education[],
    skills = [] as Skill[],
    summary = '',
    languages = [] as Language[],
    references = [] as Reference[]
  } = cvData || {};
  
  // Create additional skills array for the right column
  const mainSkills = skills.slice(0, 6); // First 6 skills get skill bars
  const additionalSkills = skills.slice(6); // Remaining skills go to additional skills section
  
  return (
    <div className="cv-container" style={{ 
      maxWidth: '900px',
      margin: '20px auto',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      padding: '40px',
      boxSizing: 'border-box',
      fontFamily: 'Lato, sans-serif',
      color: '#444',
      lineHeight: 1.6,
      fontSize: '10pt',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale'
    }}>

      <header className="cv-header" style={{ 
        textAlign: 'left',
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: '1px solid #eee'
      }}>
        <h1 style={{ 
          fontSize: '2.8em',
          color: '#222',
          marginBottom: 0,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          lineHeight: 1.1,
          fontWeight: 700
        }}>
          {personalInfo?.firstName || 'FIRST'} {personalInfo?.lastName || 'LAST'}
        </h1>
        <h2 style={{ 
          fontSize: '1.4em',
          color: '#666',
          fontWeight: 400,
          marginBottom: 0
        }}>
          {personalInfo?.jobTitle || 'Professional Title'}
        </h2>
      </header>

      <div className="main-content-area" style={{ display: 'flex', gap: '30px' }}>
        <div className="left-column" style={{ 
          width: '60%',
          display: 'flex',
          flexDirection: 'column',
          gap: '25px'
        }}>
          <section className="profile">
            <h3 style={{ 
              fontSize: '1.1em',
              color: '#444',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #eee',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700
            }}>PROFILE</h3>
            <p style={{ fontSize: '0.95em', color: '#555' }}>{summary || 'Professional summary will appear here...'}</p>
          </section>

          <section className="contact-info" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {personalInfo?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.95em', color: '#555' }}>
                <span style={{ 
                  display: 'inline-block',
                  width: '20px',
                  textAlign: 'center',
                  marginRight: '8px',
                  color: '#888'
                }}>[P]</span>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo?.email && (
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.95em', color: '#555' }}>
                <span style={{ 
                  display: 'inline-block',
                  width: '20px',
                  textAlign: 'center',
                  marginRight: '8px',
                  color: '#888'
                }}>[E]</span>
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo?.location && (
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.95em', color: '#555' }}>
                <span style={{ 
                  display: 'inline-block',
                  width: '20px',
                  textAlign: 'center',
                  marginRight: '8px',
                  color: '#888'
                }}>[A]</span>
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo?.website && (
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.95em', color: '#555' }}>
                <span style={{ 
                  display: 'inline-block',
                  width: '20px',
                  textAlign: 'center',
                  marginRight: '8px',
                  color: '#888'
                }}>[W]</span>
                <a href={personalInfo.website} style={{ color: '#555', textDecoration: 'none' }}>
                  {personalInfo.website.replace('https://', '')}
                </a>
              </div>
            )}
          </section>

          <section className="experience">
            <h3 style={{ 
              fontSize: '1.1em',
              color: '#444',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #eee',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700
            }}>PROFESSIONAL EXPERIENCE</h3>
            <ul style={{ margin: 0, listStyle: 'none', padding: 0 }}>
              {workExperience && workExperience.length > 0 ? (
                workExperience.map((job, index) => (
                  <li key={`job-${index}`} style={{ marginBottom: index < workExperience.length - 1 ? '20px' : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', alignItems: 'flex-start' }}>
                      <div style={{ flexGrow: 1 }}>
                        <strong style={{ display: 'block', fontSize: '1.05em', color: '#333', marginBottom: '2px' }}>
                          {job.jobTitle}
                        </strong>
                        <span style={{ display: 'block', fontSize: '0.95em', color: '#666', marginBottom: '8px' }}>
                          {job.company}
                        </span>
                        {job.achievements && job.achievements.length > 0 && (
                          <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '8px' }}>
                            {job.achievements.map((achievement, i) => (
                              <li key={`achievement-${i}`} style={{ 
                                fontSize: '0.95em',
                                color: '#555',
                                marginBottom: '5px',
                                paddingLeft: '15px',
                                position: 'relative'
                              }}>
                                <span style={{ 
                                  content: '•',
                                  color: '#888',
                                  position: 'absolute',
                                  left: 0,
                                  top: '0.15em',
                                  fontSize: '0.9em'
                                }}>•</span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div style={{ flexShrink: 0, textAlign: 'right', fontSize: '0.9em', color: '#777', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'block', lineHeight: 1.4 }}>
                          {job.startDate}{job.endDate ? ` - ${job.endDate}` : ' - Present'}
                        </span>
                        {job.location && <span style={{ display: 'block', lineHeight: 1.4 }}>{job.location}</span>}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li>No work experience to display</li>
              )}
            </ul>
          </section>

          <section className="education">
            <h3 style={{ 
              fontSize: '1.1em',
              color: '#444',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #eee',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700
            }}>EDUCATION</h3>
            <ul style={{ margin: 0, listStyle: 'none', padding: 0 }}>
              {education && education.length > 0 ? (
                education.map((edu, index) => (
                  <li key={`edu-${index}`} style={{ marginBottom: index < education.length - 1 ? '20px' : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', alignItems: 'flex-start' }}>
                      <div style={{ flexGrow: 1 }}>
                        <strong style={{ display: 'block', fontSize: '1.05em', color: '#333', marginBottom: '2px' }}>
                          {edu.degree}{edu.fieldOfStudy ? ` In ${edu.fieldOfStudy}` : ''}
                        </strong>
                        <span style={{ display: 'block', fontSize: '0.95em', color: '#666', marginBottom: '8px' }}>
                          {edu.institution}
                        </span>
                        {edu.description && (
                          <p style={{ fontSize: '0.95em', color: '#666', marginBottom: '5px' }}>
                            {edu.description}
                          </p>
                        )}
                        {/* GPA field doesn't exist in Education interface, but added for compatibility with template */}
                        {edu.gpa && (
                          <span style={{ display: 'block', fontSize: '0.95em', color: '#666', marginBottom: '4px' }}>
                            GPA: {edu.gpa} / 4.0
                          </span>
                        )}
                        {edu.achievements && edu.achievements.length > 0 && (
                          <>
                            <p style={{ fontSize: '0.95em', color: '#666', marginTop: '10px', marginBottom: '5px', fontWeight: 700 }}>
                              Relevant Coursework:
                            </p>
                            <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '8px' }}>
                              {edu.achievements.map((course, i) => (
                                <li key={`course-${i}`} style={{ 
                                  fontSize: '0.95em',
                                  color: '#555',
                                  marginBottom: '5px',
                                  paddingLeft: '15px',
                                  position: 'relative'
                                }}>
                                  <span style={{ 
                                    content: '•',
                                    color: '#888',
                                    position: 'absolute',
                                    left: 0,
                                    top: '0.15em',
                                    fontSize: '0.9em'
                                  }}>•</span>
                                  {course}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                      <div style={{ flexShrink: 0, textAlign: 'right', fontSize: '0.9em', color: '#777', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'block', lineHeight: 1.4 }}>
                          {edu.endDate || (edu.startDate ? edu.startDate : 'Present')}
                        </span>
                        {edu.location && <span style={{ display: 'block', lineHeight: 1.4 }}>{edu.location}</span>}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li>No education to display</li>
              )}
            </ul>
          </section>
        </div>

        <div className="right-column" style={{ 
          width: '40%',
          display: 'flex',
          flexDirection: 'column',
          gap: '25px',
          backgroundColor: '#f4f4f4',
          padding: '20px'
        }}>
          <section className="key-skills">
            <h3 style={{ 
              fontSize: '1.1em',
              color: '#444',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #eee',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700
            }}>KEY SKILLS</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {mainSkills.length > 0 ? mainSkills.map((skill, index) => (
                <li key={`skill-${index}`} style={{ 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  fontSize: '0.95em'
                }}>
                  <span style={{ 
                    width: '100px',
                    flexShrink: 0,
                    color: '#555',
                    paddingRight: '10px'
                  }}>{skill.name}</span>
                  <div style={{ 
                    flexGrow: 1,
                    height: '8px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    margin: '0 10px'
                  }}>
                    <div style={{ 
                      height: '100%',
                      width: `${skill.level ? skill.level : 90}%`,
                      backgroundColor: '#555',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                  <span style={{ 
                    width: '35px',
                    flexShrink: 0,
                    textAlign: 'right',
                    color: '#777',
                    fontSize: '0.9em'
                  }}>{skill.level ? skill.level : 90}%</span>
                </li>
              )) : (
                <li>No skills to display</li>
              )}
            </ul>
          </section>

          {additionalSkills.length > 0 && (
            <section className="additional-skills">
              <h3 style={{ 
                fontSize: '1.1em',
                color: '#444',
                marginBottom: '15px',
                paddingBottom: '5px',
                borderBottom: '1px solid #eee',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700
              }}>ADDITIONAL SKILLS</h3>
              <ul style={{ margin: 0, padding: 0 }}>
                {additionalSkills.map((skill, index) => (
                  <li key={`add-skill-${index}`} style={{ 
                    marginBottom: '6px',
                    fontSize: '0.95em',
                    color: '#555',
                    paddingLeft: '0.5em'
                  }}>
                    <span style={{ 
                      color: '#888',
                      display: 'inline-block',
                      width: '1em',
                      marginLeft: '-1em',
                      paddingRight: '0.5em'
                    }}>•</span>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {languages && languages.length > 0 && (
            <section className="languages">
              <h3 style={{ 
                fontSize: '1.1em',
                color: '#444',
                marginBottom: '15px',
                paddingBottom: '5px',
                borderBottom: '1px solid #eee',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700
              }}>LANGUAGES</h3>
              <ul style={{ margin: 0, padding: 0 }}>
                {languages.map((language, index) => (
                  <li key={`lang-${index}`} style={{ 
                    marginBottom: '6px',
                    fontSize: '0.95em',
                    color: '#555' 
                  }}>
                    {language.name} | {language.proficiency}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {references && references.length > 0 && (
            <section id="referencesSection">
              <h3 style={{ 
                fontSize: '1.1em',
                color: '#444',
                marginBottom: '15px',
                paddingBottom: '5px',
                borderBottom: '1px solid #eee',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700
              }}>References</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {references.map((reference, index) => (
                  <li key={`ref-${index}`}>
                    {reference.name} - {reference.position} at {reference.company}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}