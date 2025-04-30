import React from 'react';
import type { CVData } from '@shared/schema';

export function KilimajaroTemplate({ 
  personalInfo, 
  workExperience = [], 
  education = [], 
  skills = [], 
  summary = "", 
  languages = [], 
  references = [],
  hobbies = "",
  certifications = []
}: CVData): JSX.Element {
  return (
    <div style={{ 
      fontFamily: "'Lato', sans-serif",
      margin: 0,
      padding: '20px',
      backgroundColor: '#f8f8f8',
      color: '#444',
      lineHeight: 1.6,
      fontSize: '10pt',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '20px auto',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex'
      }}>
        {/* Sidebar (Left Column) */}
        <aside style={{
          width: '35%',
          backgroundColor: '#f0f0f0',
          padding: '30px',
          boxSizing: 'border-box',
          borderRight: '1px solid #e0e0e0'
        }}>
          {/* Contact Info */}
          <section style={{ marginBottom: '25px' }}>
            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '0.95em', color: '#444' }}>
              <span style={{ width: '18px', marginRight: '8px', textAlign: 'center', color: '#777', flexShrink: 0 }}>[P]</span>
              <span>{personalInfo.phone}</span>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '0.95em', color: '#444' }}>
              <span style={{ width: '18px', marginRight: '8px', textAlign: 'center', color: '#777', flexShrink: 0 }}>[E]</span>
              <span>{personalInfo.email}</span>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '0.95em', color: '#444' }}>
              <span style={{ width: '18px', marginRight: '8px', textAlign: 'center', color: '#777', flexShrink: 0 }}>[A]</span>
              <span>{personalInfo.location || ''}</span>
            </p>
            {personalInfo.linkedin && (
              <p style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '0.95em', color: '#444' }}>
                <span style={{ width: '18px', marginRight: '8px', textAlign: 'center', color: '#777', flexShrink: 0 }}>[L]</span>
                <a href={personalInfo.linkedin} style={{ color: '#444', textDecoration: 'none' }}>{personalInfo.linkedin}</a>
              </p>
            )}
          </section>

          {/* Profile */}
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              fontSize: '1.1em', 
              color: '#333', 
              marginBottom: '15px', 
              paddingBottom: '5px', 
              borderBottom: '1px solid #d0d0d0',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              marginTop: 0
            }}>
              PROFILE
            </h3>
            <p style={{ fontSize: '0.95em', color: '#444' }}>
              {summary}
            </p>
          </section>

          {/* Skills */}
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              fontSize: '1.1em', 
              color: '#333', 
              marginBottom: '15px', 
              paddingBottom: '5px', 
              borderBottom: '1px solid #d0d0d0',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              marginTop: 0
            }}>
              SKILLS
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map((skill, index) => (
                <span key={index} style={{
                  display: 'inline-block',
                  backgroundColor: '#e0e0e0',
                  color: '#444',
                  padding: '4px 10px',
                  borderRadius: '15px',
                  fontSize: '0.9em',
                  lineHeight: 1.4
                }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </section>

          {/* Languages */}
          {languages.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                fontSize: '1.1em', 
                color: '#333', 
                marginBottom: '15px', 
                paddingBottom: '5px', 
                borderBottom: '1px solid #d0d0d0',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
                marginTop: 0
              }}>
                LANGUAGES
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {languages.map((language, index) => (
                  <li key={index} style={{ fontSize: '0.95em', color: '#444', marginBottom: '6px' }}>
                    {language.name} | {language.proficiency}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                fontSize: '1.1em', 
                color: '#333', 
                marginBottom: '15px', 
                paddingBottom: '5px', 
                borderBottom: '1px solid #d0d0d0',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
                marginTop: 0
              }}>
                LICENSES AND CERTIFICATIONS
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {certifications.map((cert, index) => (
                  <li key={index} style={{ fontSize: '0.95em', color: '#444', marginBottom: '6px' }}>
                    {cert.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Hobbies (if available) */}
          {hobbies && (
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                fontSize: '1.1em', 
                color: '#333', 
                marginBottom: '15px', 
                paddingBottom: '5px', 
                borderBottom: '1px solid #d0d0d0',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
                marginTop: 0
              }}>
                HOBBIES & INTERESTS
              </h3>
              <p style={{ fontSize: '0.95em', color: '#444' }}>
                {hobbies}
              </p>
            </section>
          )}
        </aside>

        {/* Main Content (Right Column) */}
        <main style={{
          width: '65%',
          padding: '30px',
          boxSizing: 'border-box'
        }}>
          {/* Header */}
          <header style={{ textAlign: 'left', marginBottom: '25px' }}>
            <h1 style={{
              fontSize: '2.6em',
              color: '#111',
              marginBottom: '0px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              lineHeight: 1.2,
              fontWeight: 700,
              marginTop: 0
            }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 style={{
              fontSize: '1.2em',
              color: '#555',
              fontWeight: 400,
              marginBottom: 0,
              marginTop: 0
            }}>
              {personalInfo.jobTitle || ''}
            </h2>
          </header>

          {/* Experience */}
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              fontSize: '1.1em', 
              color: '#333', 
              marginBottom: '15px', 
              paddingBottom: '5px', 
              borderBottom: '1px solid #ccc',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              marginTop: 0
            }}>
              PROFESSIONAL EXPERIENCE
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {workExperience.map((job, index) => (
                <li key={index} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <div style={{ flexGrow: 1 }}>
                      <strong style={{ display: 'block', fontSize: '1.1em', color: '#222', marginBottom: '2px', fontWeight: 700 }}>
                        {job.jobTitle}
                      </strong>
                      <span style={{ display: 'block', fontSize: '0.95em', color: '#555' }}>
                        {job.company}
                      </span>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right', fontSize: '0.9em', color: '#666', paddingLeft: '15px' }}>
                      <span style={{ display: 'block', lineHeight: 1.4 }}>
                        {job.startDate} - {job.endDate || 'Present'}
                      </span>
                      <span style={{ display: 'block', lineHeight: 1.4 }}>
                        {job.location || ''}
                      </span>
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '5px', marginBottom: 0 }}>
                    {job.description && job.description.split('\\n').map((bullet, bulletIndex) => (
                      <li key={bulletIndex} style={{
                        fontSize: '0.95em',
                        color: '#444',
                        marginBottom: '5px',
                        paddingLeft: '18px',
                        position: 'relative'
                      }}>
                        <span style={{ position: 'absolute', left: 0, top: '0.1em', fontSize: '1em', color: '#555' }}>•</span>
                        {bullet.trim()}
                      </li>
                    ))}
                    {job.achievements && job.achievements.map((achievement, achieveIndex) => (
                      <li key={`achieve-${achieveIndex}`} style={{
                        fontSize: '0.95em',
                        color: '#444',
                        marginBottom: '5px',
                        paddingLeft: '18px',
                        position: 'relative'
                      }}>
                        <span style={{ position: 'absolute', left: 0, top: '0.1em', fontSize: '1em', color: '#555' }}>•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>

          {/* Education */}
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              fontSize: '1.1em', 
              color: '#333', 
              marginBottom: '15px', 
              paddingBottom: '5px', 
              borderBottom: '1px solid #ccc',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700,
              marginTop: 0
            }}>
              EDUCATION
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {education.map((edu, index) => (
                <li key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <div style={{ flexGrow: 1 }}>
                      <strong style={{ display: 'block', fontSize: '1.1em', color: '#222', marginBottom: '2px', fontWeight: 700 }}>
                        {edu.degree} {edu.fieldOfStudy ? `In ${edu.fieldOfStudy}` : ''}
                      </strong>
                      <span style={{ display: 'block', fontSize: '0.95em', color: '#555' }}>
                        {edu.institution}
                      </span>
                      {edu.gpa && (
                        <span style={{ display: 'block', fontSize: '0.95em', color: '#555' }}>
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right', fontSize: '0.9em', color: '#666', paddingLeft: '15px' }}>
                      <span style={{ display: 'block', lineHeight: 1.4 }}>
                        {edu.endDate}
                      </span>
                    </div>
                  </div>
                  
                  {/* Education Details (if available) */}
                  {(edu.description || edu.achievements) && (
                    <div style={{ marginTop: '10px', paddingLeft: '10px', borderLeft: '2px solid #eee' }}>
                      {edu.description && (
                        <>
                          <p style={{ fontWeight: 700, fontSize: '0.95em', color: '#444', marginTop: '10px', marginBottom: '5px' }}>
                            Relevant Coursework:
                          </p>
                          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                            {edu.description.split('\\n').map((course, courseIndex) => (
                              <li key={courseIndex} style={{
                                fontSize: '0.9em',
                                color: '#555',
                                marginBottom: '4px',
                                paddingLeft: '15px',
                                position: 'relative'
                              }}>
                                <span style={{ position: 'absolute', left: 0, top: '0.1em', fontSize: '0.9em', color: '#777' }}>◦</span>
                                {course.trim()}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      
                      {edu.achievements && edu.achievements.length > 0 && (
                        <>
                          <p style={{ fontWeight: 700, fontSize: '0.95em', color: '#444', marginTop: '10px', marginBottom: '5px' }}>
                            Awards And Honors:
                          </p>
                          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                            {edu.achievements.map((award, awardIndex) => (
                              <li key={awardIndex} style={{
                                fontSize: '0.9em',
                                color: '#555',
                                marginBottom: '4px',
                                paddingLeft: '15px',
                                position: 'relative'
                              }}>
                                <span style={{ position: 'absolute', left: 0, top: '0.1em', fontSize: '0.9em', color: '#777' }}>◦</span>
                                {award}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* References Section (if available) */}
          {references.length > 0 && (
            <section style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                fontSize: '1.1em', 
                color: '#333', 
                marginBottom: '15px', 
                paddingBottom: '5px', 
                borderBottom: '1px solid #ccc',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 700,
                marginTop: 0
              }}>
                REFERENCES
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {references.map((reference, index) => (
                  <li key={index} style={{ marginBottom: '15px' }}>
                    <strong style={{ display: 'block', fontWeight: 700, fontSize: '1em', color: '#333' }}>
                      {reference.name}
                    </strong>
                    <span style={{ display: 'block', fontSize: '0.95em', color: '#555' }}>
                      {reference.position}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.95em', color: '#555' }}>
                      {reference.company}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.95em', color: '#555' }}>
                      {reference.email}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.95em', color: '#555' }}>
                      {reference.phone}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}