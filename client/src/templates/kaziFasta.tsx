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
  return (
    <div className="kazi-fasta-template" style={{ 
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      backgroundColor: '#fff',
      maxWidth: '900px',
      margin: '0 auto',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      position: 'relative'
    }}>
      <div className="document" style={{ position: 'relative' }}>
        <header style={{ 
          backgroundColor: '#2c3e50', 
          color: 'white',
          padding: '40px 30px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ 
                margin: '0 0 5px 0',
                fontSize: '2.4rem',
                fontWeight: 'bold',
                letterSpacing: '0.05em'
              }}>
                {personalInfo?.firstName || 'FIRST'} {personalInfo?.lastName || 'LAST'}
              </h1>
              <h2 style={{ 
                margin: '0',
                fontSize: '1.4rem',
                fontWeight: 'normal',
                letterSpacing: '0.05em'
              }}>
                {personalInfo?.jobTitle || 'Professional Title'}
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              {personalInfo?.email && (
                <div style={{ margin: '5px 0', fontSize: '0.9rem' }}>
                  {personalInfo.email}
                </div>
              )}
              {personalInfo?.phone && (
                <div style={{ margin: '5px 0', fontSize: '0.9rem' }}>
                  {personalInfo.phone}
                </div>
              )}
              {personalInfo?.location && (
                <div style={{ margin: '5px 0', fontSize: '0.9rem' }}>
                  {personalInfo.location}
                </div>
              )}
              {personalInfo?.website && (
                <div style={{ margin: '5px 0', fontSize: '0.9rem' }}>
                  {personalInfo.website}
                </div>
              )}
            </div>
          </div>
        </header>

        <main style={{ padding: '30px' }}>
          {summary && (
            <section className="summary" style={{ marginBottom: '25px' }}>
              <h2 style={{ 
                fontSize: '1.2rem', 
                color: '#2c3e50',
                borderBottom: '2px solid #2c3e50',
                paddingBottom: '5px',
                marginBottom: '15px'
              }}>PROFESSIONAL SUMMARY</h2>
              <p style={{ lineHeight: '1.5', fontSize: '0.95rem' }}>{summary}</p>
            </section>
          )}

          <div style={{ display: 'flex', gap: '30px' }}>
            <div className="left-column" style={{ flex: '2', paddingRight: '15px' }}>
              {workExperience && workExperience.length > 0 && (
                <section className="work-experience" style={{ marginBottom: '25px' }}>
                  <h2 style={{ 
                    fontSize: '1.2rem', 
                    color: '#2c3e50',
                    borderBottom: '2px solid #2c3e50',
                    paddingBottom: '5px',
                    marginBottom: '15px'
                  }}>WORK EXPERIENCE</h2>
                  {workExperience.map((job: WorkExperience, index: number) => (
                    <div key={`job-${index}-${job.id || ''}`} className="job" style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
                          {job.jobTitle}
                        </h3>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          {job.startDate}{job.endDate && ` - ${job.endDate}`}
                        </div>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 'semibold', marginBottom: '5px', color: '#444' }}>
                        {job.company} {job.location && `• ${job.location}`}
                      </div>
                      {job.description && (
                        <p style={{ margin: '10px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                          {job.description}
                        </p>
                      )}
                      {job.achievements && job.achievements.length > 0 && (
                        <ul style={{ 
                          margin: '10px 0', 
                          paddingLeft: '20px',
                          fontSize: '0.9rem',
                          lineHeight: '1.5'
                        }}>
                          {job.achievements.map((achievement: string, achievementIndex: number) => (
                            <li key={achievementIndex}>{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {education && education.length > 0 && (
                <section className="education" style={{ marginBottom: '25px' }}>
                  <h2 style={{ 
                    fontSize: '1.2rem', 
                    color: '#2c3e50',
                    borderBottom: '2px solid #2c3e50',
                    paddingBottom: '5px',
                    marginBottom: '15px'
                  }}>EDUCATION</h2>
                  {education.map((edu: Education, index: number) => (
                    <div key={`edu-${index}-${edu.id || ''}`} className="education-item" style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
                          {edu.degree}
                        </h3>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          {edu.startDate}{edu.endDate && ` - ${edu.endDate}`}
                        </div>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 'semibold', marginBottom: '5px', color: '#444' }}>
                        {edu.institution} {edu.fieldOfStudy && `• ${edu.fieldOfStudy}`}
                      </div>
                      {edu.description && (
                        <p style={{ margin: '10px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                          {edu.description}
                        </p>
                      )}
                      {edu.achievements && edu.achievements.length > 0 && (
                        <ul style={{ 
                          margin: '10px 0', 
                          paddingLeft: '20px',
                          fontSize: '0.9rem',
                          lineHeight: '1.5'
                        }}>
                          {edu.achievements.map((achievement: string, achievementIndex: number) => (
                            <li key={achievementIndex}>{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </section>
              )}
            </div>

            <div className="right-column" style={{ flex: '1', padding: '20px', backgroundColor: '#f4f4f4' }}>
              {skills && skills.length > 0 && (
                <section className="skills" style={{ marginBottom: '25px' }}>
                  <h2 style={{ fontSize: '1.2rem', color: '#2c3e50', borderBottom: '2px solid #2c3e50', paddingBottom: '5px', marginBottom: '15px' }}>SKILLS</h2>
                  <div className="skills-container">
                    {skills.map((skill: Skill, index: number) => (
                      <div key={`skill-${index}-${skill.id || ''}`} className="skill-item" style={{ marginBottom: '12px' }}>
                        <div className="skill-name" style={{ fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '5px' }}>{skill.name}</div>
                        <div className="skill-bar-container" style={{ height: '8px', backgroundColor: '#ddd', borderRadius: '4px', overflow: 'hidden' }}>
                          <div 
                            className="skill-bar" 
                            style={{ 
                              width: `${(skill.level || 3) * 20}%`, 
                              height: '100%', 
                              backgroundColor: '#3498db', 
                              borderRadius: '4px' 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {languages && languages.length > 0 && (
                <section className="languages" style={{ marginBottom: '25px' }}>
                  <h2 style={{ fontSize: '1.2rem', color: '#2c3e50', borderBottom: '2px solid #2c3e50', paddingBottom: '5px', marginBottom: '15px' }}>LANGUAGES</h2>
                  <div className="languages-container">
                    {languages.map((language: Language, index: number) => (
                      <div key={`lang-${index}-${language.id || ''}`} className="language-item" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                        <span className="language-name" style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{language.name}</span>
                        <span className="language-level" style={{ fontSize: '0.9rem', color: '#555' }}>{language.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {references && references.length > 0 && (
                <section className="references" style={{ marginBottom: '25px' }}>
                  <h2 style={{ fontSize: '1.2rem', color: '#2c3e50', borderBottom: '2px solid #2c3e50', paddingBottom: '5px', marginBottom: '15px' }}>REFERENCES</h2>
                  {references.map((reference: Reference, index: number) => (
                    <div key={`ref-${index}-${reference.id || ''}`} className="reference-item" style={{ marginBottom: '15px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0 0 5px 0' }}>{reference.name}</h3>
                      {reference.position && <p style={{ fontSize: '0.9rem', margin: '0 0 2px 0', fontStyle: 'italic' }}>{reference.position}</p>}
                      {reference.company && <p style={{ fontSize: '0.9rem', margin: '0 0 2px 0' }}>{reference.company}</p>}
                      {reference.email && <p style={{ fontSize: '0.9rem', margin: '0 0 2px 0' }}>{reference.email}</p>}
                      {reference.phone && <p style={{ fontSize: '0.9rem', margin: '0 0 2px 0' }}>{reference.phone}</p>}
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}