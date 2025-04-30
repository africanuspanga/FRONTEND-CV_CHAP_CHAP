import React from 'react';
import { CVData } from '@shared/schema';
import { formatDate } from '@/lib/utils';

export function MoonlightSonataTemplate({ personalInfo, workExperience, education, skills, summary, languages, references }: CVData): JSX.Element {
  const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();
  const jobTitle = personalInfo?.jobTitle || 'PROFESSIONAL';

  return (
    <div className="cv-container" style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff', boxShadow: '0 1px 5px rgba(0, 0, 0, 0.15)' }}>
      <aside className="sidebar" style={{ width: '38%', backgroundColor: '#e87b3a', color: '#ffffff', padding: '35px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <header className="sidebar-header" style={{ marginBottom: '30px', textAlign: 'left' }}>
          <h1 style={{ fontSize: '2.8em', color: '#ffffff', marginBottom: '5px', textTransform: 'uppercase', lineHeight: '1.1', letterSpacing: '1px', fontFamily: '"Montserrat", sans-serif', fontWeight: 700 }}>
            <span style={{ display: 'block' }}>{fullName.split(' ')[0]}</span>
            <span style={{ display: 'block' }}>{fullName.split(' ').slice(1).join(' ')}</span>
          </h1>
          <h2 style={{ fontSize: '1.1em', color: '#f0f0f0', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '1.5px', borderTop: '1px solid rgba(255, 255, 255, 0.5)', paddingTop: '10px', marginTop: '10px', fontFamily: '"Open Sans", sans-serif' }}>
            {jobTitle}
          </h2>
        </header>

        <section className="contact-info" style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '1.1em', color: '#ffffff', marginBottom: '15px', paddingBottom: '5px', borderBottom: '1px solid rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: '"Montserrat", sans-serif', fontWeight: 700 }}>
            CONTACT
          </h3>
          
          {personalInfo?.phone && (
            <p style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px', fontSize: '0.95em', lineHeight: '1.5', fontFamily: '"Open Sans", sans-serif' }}>
              <span style={{ width: '20px', marginRight: '10px', textAlign: 'center', color: '#f0f0f0', flexShrink: 0, paddingTop: '2px' }}>[P]</span>
              <span>{personalInfo.phone}</span>
            </p>
          )}
          
          {personalInfo?.email && (
            <p style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px', fontSize: '0.95em', lineHeight: '1.5', fontFamily: '"Open Sans", sans-serif' }}>
              <span style={{ width: '20px', marginRight: '10px', textAlign: 'center', color: '#f0f0f0', flexShrink: 0, paddingTop: '2px' }}>[E]</span>
              <span>{personalInfo.email}</span>
            </p>
          )}
          
          {personalInfo?.location && (
            <p style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px', fontSize: '0.95em', lineHeight: '1.5', fontFamily: '"Open Sans", sans-serif' }}>
              <span style={{ width: '20px', marginRight: '10px', textAlign: 'center', color: '#f0f0f0', flexShrink: 0, paddingTop: '2px' }}>[A]</span>
              <span>{personalInfo.location}</span>
            </p>
          )}
          
          {personalInfo?.website && (
            <p style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px', fontSize: '0.95em', lineHeight: '1.5', fontFamily: '"Open Sans", sans-serif' }}>
              <span style={{ width: '20px', marginRight: '10px', textAlign: 'center', color: '#f0f0f0', flexShrink: 0, paddingTop: '2px' }}>[W]</span>
              <a href={personalInfo.website} style={{ color: '#ffffff', textDecoration: 'none' }}>{personalInfo.website.replace(/(^\w+:|^)\/\//, '')}</a>
            </p>
          )}
          
          {personalInfo?.linkedin && (
            <p style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px', fontSize: '0.95em', lineHeight: '1.5', fontFamily: '"Open Sans", sans-serif' }}>
              <span style={{ width: '20px', marginRight: '10px', textAlign: 'center', color: '#f0f0f0', flexShrink: 0, paddingTop: '2px' }}>[L]</span>
              <a href={personalInfo.linkedin} style={{ color: '#ffffff', textDecoration: 'none' }}>{personalInfo.linkedin.replace(/(^\w+:|^)\/\//, '')}</a>
            </p>
          )}
        </section>

        {summary && (
          <section className="summary" style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '1.1em', color: '#ffffff', marginBottom: '15px', paddingBottom: '5px', borderBottom: '1px solid rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: '"Montserrat", sans-serif', fontWeight: 700 }}>
              SUMMARY
            </h3>
            <p style={{ fontSize: '0.95em', lineHeight: '1.7', fontFamily: '"Open Sans", sans-serif' }}>
              {summary}
            </p>
          </section>
        )}

        {languages && languages.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '1.1em', color: '#ffffff', marginBottom: '15px', paddingBottom: '5px', borderBottom: '1px solid rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: '"Montserrat", sans-serif', fontWeight: 700 }}>
              LANGUAGES
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: '"Open Sans", sans-serif' }}>
              {languages.map((language, index) => (
                <li key={index} style={{ marginBottom: '8px', fontSize: '0.95em' }}>
                  <strong>{language.name}:</strong> {language.proficiency}
                </li>
              ))}
            </ul>
          </section>
        )}

        {references && references.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '1.1em', color: '#ffffff', marginBottom: '15px', paddingBottom: '5px', borderBottom: '1px solid rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: '"Montserrat", sans-serif', fontWeight: 700 }}>
              REFERENCES
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: '"Open Sans", sans-serif' }}>
              {references.map((reference, index) => (
                <li key={index} style={{ marginBottom: '12px', fontSize: '0.95em' }}>
                  <strong>{reference.name}</strong>
                  {reference.position && <div>{reference.position}</div>}
                  {reference.company && <div>{reference.company}</div>}
                  {reference.email && <div>{reference.email}</div>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      <main style={{ width: '62%', padding: '35px', boxSizing: 'border-box' }}>
        {workExperience && workExperience.length > 0 && (
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.2em', color: '#e87b3a', marginBottom: '15px', paddingBottom: '5px', borderBottom: '2px solid #e87b3a', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: '"Montserrat", sans-serif', fontWeight: 700 }}>
              PROFESSIONAL EXPERIENCE
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {workExperience.map((job, index) => (
                <li key={index} style={{ marginBottom: '20px' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ display: 'block', fontSize: '0.9em', color: '#777', marginBottom: '3px', fontWeight: 600, fontFamily: '"Open Sans", sans-serif' }}>
                      {job.startDate && formatDate(job.startDate)} - {job.current ? 'Present' : (job.endDate ? formatDate(job.endDate) : '')}
                    </span>
                    <strong style={{ display: 'block', fontSize: '1.15em', color: '#222', marginBottom: '2px', fontFamily: '"Open Sans", sans-serif', fontWeight: 600 }}>
                      {job.jobTitle}
                    </strong>
                    <span style={{ display: 'block', fontSize: '1em', color: '#555', fontFamily: '"Open Sans", sans-serif' }}>
                      {job.company}{job.location ? `, ${job.location}` : ''}
                    </span>
                  </div>
                  
                  {job.description && (
                    <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '5px', marginBottom: 0 }}>
                      {job.description.split('\n').filter(line => line.trim()).map((line, i) => (
                        <li key={i} style={{ 
                          fontSize: '0.95em', 
                          color: '#444', 
                          marginBottom: '6px', 
                          paddingLeft: '18px', 
                          position: 'relative',
                          fontFamily: '"Open Sans", sans-serif' 
                        }}>
                          <span style={{ 
                            position: 'absolute',
                            left: 0,
                            top: '0.1em',
                            color: '#e87b3a',
                            fontSize: '1em'
                          }}>•</span>
                          {line}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {job.achievements && job.achievements.length > 0 && (
                    <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '5px', marginBottom: 0 }}>
                      {job.achievements.map((achievement, i) => (
                        <li key={i} style={{ 
                          fontSize: '0.95em', 
                          color: '#444', 
                          marginBottom: '6px', 
                          paddingLeft: '18px', 
                          position: 'relative',
                          fontFamily: '"Open Sans", sans-serif' 
                        }}>
                          <span style={{ 
                            position: 'absolute',
                            left: 0,
                            top: '0.1em',
                            color: '#e87b3a',
                            fontSize: '1em'
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

        {education && education.length > 0 && (
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.2em', color: '#e87b3a', marginBottom: '15px', paddingBottom: '5px', borderBottom: '2px solid #e87b3a', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: '"Montserrat", sans-serif', fontWeight: 700 }}>
              EDUCATION
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {education.map((edu, index) => (
                <li key={index} style={{ marginBottom: '20px' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ display: 'block', fontSize: '0.9em', color: '#777', marginBottom: '3px', fontWeight: 600, fontFamily: '"Open Sans", sans-serif' }}>
                      {edu.startDate && formatDate(edu.startDate)} - {edu.current ? 'Present' : (edu.endDate ? formatDate(edu.endDate) : '')}
                    </span>
                    <strong style={{ display: 'block', fontSize: '1.15em', color: '#222', marginBottom: '2px', fontFamily: '"Open Sans", sans-serif', fontWeight: 600 }}>
                      {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                    </strong>
                    <span style={{ display: 'block', fontSize: '1em', color: '#555', fontFamily: '"Open Sans", sans-serif' }}>
                      {edu.institution}
                    </span>
                  </div>
                  
                  {edu.description && (
                    <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '5px', marginBottom: 0 }}>
                      {edu.description.split('\n').filter(line => line.trim()).map((line, i) => (
                        <li key={i} style={{ 
                          fontSize: '0.95em', 
                          color: '#444', 
                          marginBottom: '6px', 
                          paddingLeft: '18px', 
                          position: 'relative',
                          fontFamily: '"Open Sans", sans-serif' 
                        }}>
                          <span style={{ 
                            position: 'absolute',
                            left: 0,
                            top: '0.1em',
                            color: '#e87b3a',
                            fontSize: '1em'
                          }}>•</span>
                          {line}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '5px', marginBottom: 0 }}>
                      {edu.achievements.map((achievement, i) => (
                        <li key={i} style={{ 
                          fontSize: '0.95em', 
                          color: '#444', 
                          marginBottom: '6px', 
                          paddingLeft: '18px', 
                          position: 'relative',
                          fontFamily: '"Open Sans", sans-serif' 
                        }}>
                          <span style={{ 
                            position: 'absolute',
                            left: 0,
                            top: '0.1em',
                            color: '#e87b3a',
                            fontSize: '1em'
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

        {skills && skills.length > 0 && (
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.2em', color: '#e87b3a', marginBottom: '15px', paddingBottom: '5px', borderBottom: '2px solid #e87b3a', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: '"Montserrat", sans-serif', fontWeight: 700 }}>
              SKILLS
            </h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0,
              columns: 2,
              columnGap: '30px',
              fontFamily: '"Open Sans", sans-serif' 
            }}>
              {skills.map((skill, index) => (
                <li key={index} style={{ 
                  fontSize: '0.95em', 
                  color: '#444', 
                  marginBottom: '8px', 
                  paddingLeft: '18px', 
                  position: 'relative',
                  breakInside: 'avoid-column'
                }}>
                  <span style={{ 
                    position: 'absolute',
                    left: 0,
                    top: '0.1em',
                    color: '#e87b3a',
                    fontSize: '1em'
                  }}>•</span>
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
