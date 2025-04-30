import React from 'react';
import { CVData } from '@shared/schema';

export function KaziFastaTemplate({ personalInfo, workExperience, education, skills, summary, languages, references }: CVData): JSX.Element {
  // Ensure data existence - prevents rendering errors with incomplete data
  const name = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();
  
  return (
    <div className="kazi-fasta-template" style={{ fontFamily: 'Arial, sans-serif', margin: '0', padding: '0' }}>
      <div className="template-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '30px' }}>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 5px 0', textTransform: 'uppercase' }}>{name}</h1>
          <p className="job-title" style={{ fontSize: '18px', color: '#555', margin: '0 0 15px 0' }}>{personalInfo?.jobTitle || ''}</p>
          <div className="contact-info" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '14px', color: '#555' }}>
            {personalInfo?.email && <span className="contact-item" style={{ display: 'inline-flex', alignItems: 'center' }}>[E] {personalInfo.email}</span>}
            {personalInfo?.phone && <span className="contact-item" style={{ display: 'inline-flex', alignItems: 'center' }}>[P] {personalInfo.phone}</span>}
            {personalInfo?.location && <span className="contact-item" style={{ display: 'inline-flex', alignItems: 'center' }}>[A] {personalInfo.location}</span>}
          </div>
        </header>

        <main style={{ display: 'flex', gap: '30px' }}>
          <div className="two-column-layout" style={{ width: '100%', display: 'flex', gap: '30px' }}>
            <div className="left-column" style={{ flex: '2', backgroundColor: '#f9f9f9', padding: '20px' }}>
              {summary && (
                <section className="summary" style={{ marginBottom: '25px' }}>
                  <h2 style={{ fontSize: '20px', color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '5px', marginBottom: '15px' }}>PROFILE</h2>
                  <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{summary}</p>
                </section>
              )}

              {workExperience && workExperience.length > 0 && (
                <section className="work-experience" style={{ marginBottom: '25px' }}>
                  <h2 style={{ fontSize: '20px', color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '5px', marginBottom: '15px' }}>PROFESSIONAL EXPERIENCE</h2>
                  {workExperience.map((job, index) => (
                    <div key={`job-${index}-${job.id || ''}`} className="work-item" style={{ marginBottom: '20px' }}>
                      <div className="job-header" style={{ marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>{job.jobTitle}</h3>
                        <div className="company-date" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555' }}>
                          <span className="company" style={{ fontWeight: 'bold' }}>{job.company}</span>
                          <span className="dates">{job.startDate} - {job.endDate || 'Present'}</span>
                        </div>
                      </div>
                      {job.description && <p style={{ fontSize: '14px', margin: '0' }}>{job.description}</p>}
                    </div>
                  ))}
                </section>
              )}

              {education && education.length > 0 && (
                <section className="education" style={{ marginBottom: '25px' }}>
                  <h2 style={{ fontSize: '20px', color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '5px', marginBottom: '15px' }}>EDUCATION</h2>
                  {education.map((edu, index) => (
                    <div key={`edu-${index}-${edu.id || ''}`} className="education-item" style={{ marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>{edu.degree}</h3>
                      <div className="school-date" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555' }}>
                        <span className="school" style={{ fontWeight: 'bold' }}>{edu.institution}</span>
                        <span className="dates">{edu.startDate} - {edu.endDate || 'Present'}</span>
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </div>

            <div className="right-column" style={{ flex: '1', padding: '20px', backgroundColor: '#f0f0f0' }}>
              {skills && skills.length > 0 && (
                <section className="skills" style={{ marginBottom: '25px' }}>
                  <h2 style={{ fontSize: '20px', color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '5px', marginBottom: '15px' }}>SKILLS</h2>
                  <div className="skills-container">
                    {skills.map((skill, index) => (
                      <div key={`skill-${index}-${skill.id || ''}`} className="skill-item" style={{ marginBottom: '12px' }}>
                        <div className="skill-name" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>{skill.name}</div>
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
                  <h2 style={{ fontSize: '20px', color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '5px', marginBottom: '15px' }}>LANGUAGES</h2>
                  <div className="languages-container">
                    {languages.map((language, index) => (
                      <div key={`lang-${index}-${language.id || ''}`} className="language-item" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                        <span className="language-name" style={{ fontSize: '14px', fontWeight: 'bold' }}>{language.name}</span>
                        <span className="language-level" style={{ fontSize: '14px', color: '#555' }}>{language.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {references && references.length > 0 && (
                <section className="references" style={{ marginBottom: '25px' }}>
                  <h2 style={{ fontSize: '20px', color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '5px', marginBottom: '15px' }}>REFERENCES</h2>
                  {references.map((reference, index) => (
                    <div key={`ref-${index}-${reference.id || ''}`} className="reference-item" style={{ marginBottom: '15px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>{reference.name}</h3>
                      {reference.position && <p style={{ fontSize: '14px', margin: '0 0 2px 0', fontStyle: 'italic' }}>{reference.position}</p>}
                      {reference.company && <p style={{ fontSize: '14px', margin: '0 0 2px 0' }}>{reference.company}</p>}
                      {reference.email && <p style={{ fontSize: '14px', margin: '0 0 2px 0' }}>{reference.email}</p>}
                      {reference.phone && <p style={{ fontSize: '14px', margin: '0 0 2px 0' }}>{reference.phone}</p>}
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