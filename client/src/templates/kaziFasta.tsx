import React from 'react';
import { CVData } from '@shared/schema';

export function KaziFastaTemplate({ personalInfo, workExperience, education, skills, summary, languages, references }: CVData): JSX.Element {
  return (
    <div className="kazi-fasta-template">
      <div className="template-content">
        <header>
          <h1>{personalInfo.firstName} {personalInfo.lastName}</h1>
          <p className="job-title">{personalInfo.jobTitle}</p>
          <div className="contact-info">
            {personalInfo.email && <span className="contact-item"><i className="icon icon-mail"></i>{personalInfo.email}</span>}
            {personalInfo.phone && <span className="contact-item"><i className="icon icon-phone"></i>{personalInfo.phone}</span>}
            {personalInfo.website && <span className="contact-item"><i className="icon icon-globe"></i>{personalInfo.website}</span>}
            {personalInfo.location && <span className="contact-item"><i className="icon icon-location"></i>{personalInfo.location}</span>}
          </div>
        </header>

        <main>
          <div className="two-column-layout">
            <div className="left-column">
              {summary && (
                <section className="summary">
                  <h2>Professional Summary</h2>
                  <p>{summary}</p>
                </section>
              )}

              {workExperience && workExperience.length > 0 && (
                <section className="work-experience">
                  <h2>Work Experience</h2>
                  {workExperience.map((job, index) => (
                    <div key={index} className="work-item">
                      <div className="job-header">
                        <h3>{job.jobTitle}</h3>
                        <div className="company-date">
                          <span className="company">{job.company}</span>
                          <span className="dates">{job.startDate} - {job.endDate || 'Present'}</span>
                        </div>
                      </div>
                      <p>{job.description}</p>
                    </div>
                  ))}
                </section>
              )}

              {education && education.length > 0 && (
                <section className="education">
                  <h2>Education</h2>
                  {education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <h3>{edu.degree}</h3>
                      <div className="school-date">
                        <span className="school">{edu.institution}</span>
                        <span className="dates">{edu.startDate} - {edu.endDate || 'Present'}</span>
                      </div>
                      {edu.description && <p>{edu.description}</p>}
                    </div>
                  ))}
                </section>
              )}
            </div>

            <div className="right-column">
              {skills && skills.length > 0 && (
                <section className="skills">
                  <h2>Skills</h2>
                  <div className="skills-container">
                    {skills.map((skill, index) => (
                      <div key={index} className="skill-item">
                        <div className="skill-name">{skill.name}</div>
                        <div className="skill-bar-container">
                          <div 
                            className="skill-bar" 
                            style={{ width: `80%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {languages && languages.length > 0 && (
                <section className="languages">
                  <h2>Languages</h2>
                  <div className="languages-container">
                    {languages.map((language, index) => (
                      <div key={index} className="language-item">
                        <span className="language-name">{language.name}</span>
                        <span className="language-level">{language.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {references && references.length > 0 && (
                <section className="references">
                  <h2>References</h2>
                  {references.map((reference, index) => (
                    <div key={index} className="reference-item">
                      <h3>{reference.name}</h3>
                      <p className="reference-title">{reference.position || ''}</p>
                      {reference.company && <p className="reference-company">{reference.company}</p>}
                      {reference.email && <p className="reference-contact">{reference.email}</p>}
                      {reference.phone && <p className="reference-contact">{reference.phone}</p>}
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