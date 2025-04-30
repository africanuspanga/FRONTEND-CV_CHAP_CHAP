import React from 'react';
import type { CVData } from '@shared/schema';

export function BrightDiamondTemplate({ 
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
      color: '#4a4a4a',
      lineHeight: 1.6,
      fontSize: '10pt',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale'
    }}>
      <div style={{
        maxWidth: '850px',
        margin: '20px auto',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        padding: '40px'
      }}>
        {/* Header */}
        <header style={{
          textAlign: 'center',
          marginBottom: '15px',
          paddingBottom: '15px',
          borderBottom: '3px solid #20c997'
        }}>
          <h1 style={{
            fontSize: '2.8em',
            color: '#1a1a1a',
            marginBottom: '0px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 900
          }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <h2 style={{
            fontSize: '1.2em',
            color: '#555',
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '0'
          }}>
            {personalInfo.jobTitle}
          </h2>
        </header>

        {/* Contact Bar */}
        <section style={{
          textAlign: 'center',
          marginBottom: '25px',
          paddingBottom: '5px',
          fontSize: '0.9em',
          color: '#555',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '5px 8px'
        }}>
          <span>Phone: {personalInfo.phone}</span>
          <span style={{ color: '#ccc' }}>|</span>
          <span>Address: {personalInfo.location}</span>
          <span style={{ color: '#ccc' }}>|</span>
          <span>Email: {personalInfo.email}</span>
          {personalInfo.linkedin && (
            <>
              <span style={{ color: '#ccc' }}>|</span>
              <span>LinkedIn: <a href={personalInfo.linkedin} style={{ color: 'inherit', textDecoration: 'none' }}>{personalInfo.linkedin.replace('https://', '')}</a></span>
            </>
          )}
          {personalInfo.website && (
            <>
              <span style={{ color: '#ccc' }}>|</span>
              <span>Website: <a href={personalInfo.website} style={{ color: 'inherit', textDecoration: 'none' }}>{personalInfo.website.replace('https://', '')}</a></span>
            </>
          )}
        </section>

        {/* Summary Section */}
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{
            fontSize: '1.15em',
            color: '#20c997',
            marginBottom: '15px',
            paddingBottom: '5px',
            borderBottom: '1px solid #e0e0e0',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            fontWeight: 700
          }}>
            PROFESSIONAL SUMMARY
          </h3>
          <p style={{ fontSize: '0.95em', color: '#4a4a4a', lineHeight: 1.7 }}>
            {summary}
          </p>
        </section>

        {/* Experience Section */}
        <section style={{ marginBottom: '25px' }}>
          <h3 style={{
            fontSize: '1.15em',
            color: '#20c997',
            marginBottom: '15px',
            paddingBottom: '5px',
            borderBottom: '1px solid #e0e0e0',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            fontWeight: 700
          }}>
            EXPERIENCE
          </h3>
          <ul style={{ margin: 0 }}>
            {workExperience.map((job, index) => (
              <li key={index} style={{ marginBottom: index < workExperience.length - 1 ? '25px' : '0' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ flexGrow: 1 }}>
                    <strong style={{ display: 'block', fontSize: '1.1em', color: '#2a2a2a', marginBottom: '2px' }}>
                      {job.jobTitle}
                    </strong>
                    <span style={{ display: 'block', fontSize: '0.95em', color: '#555' }}>
                      {job.company} - {job.location}
                    </span>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right', fontSize: '0.9em', color: '#555', paddingLeft: '15px', fontWeight: 700 }}>
                    <span style={{ display: 'block', lineHeight: 1.4 }}>
                      {job.startDate} to {job.endDate || 'Present'}
                    </span>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '5px' }}>
                  {job.description && job.description.split('\\n').map((point, pointIndex) => (
                    <li key={pointIndex} style={{
                      fontSize: '0.95em',
                      color: '#4a4a4a',
                      marginBottom: '5px',
                      paddingLeft: '18px',
                      position: 'relative'
                    }}>
                      <span style={{ color: '#20c997', position: 'absolute', left: 0, top: '0.1em', fontSize: '1em' }}>•</span>
                      {point.trim()}
                    </li>
                  ))}
                  {job.achievements && job.achievements.map((achievement, achieveIndex) => (
                    <li key={`achieve-${achieveIndex}`} style={{
                      fontSize: '0.95em',
                      color: '#4a4a4a',
                      marginBottom: '5px',
                      paddingLeft: '18px',
                      position: 'relative'
                    }}>
                      <span style={{ color: '#20c997', position: 'absolute', left: 0, top: '0.1em', fontSize: '1em' }}>•</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* Education Section */}
        <section style={{ marginBottom: '25px' }}>
          <h3 style={{
            fontSize: '1.15em',
            color: '#20c997',
            marginBottom: '15px',
            paddingBottom: '5px',
            borderBottom: '1px solid #e0e0e0',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            fontWeight: 700
          }}>
            EDUCATION
          </h3>
          <ul style={{ margin: 0 }}>
            {education.map((edu, index) => (
              <li key={index} style={{ marginBottom: index < education.length - 1 ? '25px' : '0' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ flexGrow: 1 }}>
                    <strong style={{ display: 'block', fontSize: '1.1em', color: '#2a2a2a', marginBottom: '2px' }}>
                      {edu.degree} {edu.fieldOfStudy && `In ${edu.fieldOfStudy}`}
                    </strong>
                    <span style={{ display: 'block', fontSize: '0.95em', color: '#555' }}>
                      {edu.institution}
                    </span>
                    {edu.gpa && (
                      <span style={{ display: 'block', fontSize: '0.95em', color: '#555' }}>
                        GPA: {edu.gpa} / 4.0
                      </span>
                    )}
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right', fontSize: '0.9em', color: '#555', paddingLeft: '15px', fontWeight: 700 }}>
                    <span style={{ display: 'block', lineHeight: 1.4 }}>
                      {edu.endDate}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Skills Section */}
        <section style={{ marginBottom: '25px' }}>
          <h3 style={{
            fontSize: '1.15em',
            color: '#20c997',
            marginBottom: '15px',
            paddingBottom: '5px',
            borderBottom: '1px solid #e0e0e0',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            fontWeight: 700
          }}>
            SKILLS
          </h3>
          <div style={{
            columnCount: 3,
            columnGap: '25px',
            WebkitColumnCount: 3,
            MozColumnCount: 3
          }}>
            {skills.map((skill, index) => (
              <div key={index} style={{
                fontSize: '0.95em',
                color: '#4a4a4a',
                marginBottom: '8px',
                paddingLeft: '18px',
                position: 'relative',
                breakInside: 'avoid-column'
              }}>
                <span style={{ color: '#20c997', position: 'absolute', left: 0, top: '0.1em', fontSize: '1em' }}>•</span>
                {skill.name}
              </div>
            ))}
          </div>
        </section>

        {/* Certifications Section (if available) */}
        {certifications && certifications.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '1.15em',
              color: '#20c997',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #e0e0e0',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700
            }}>
              CERTIFICATIONS
            </h3>
            <div style={{
              columnCount: 3,
              columnGap: '25px',
              WebkitColumnCount: 3,
              MozColumnCount: 3
            }}>
              {certifications.map((cert, index) => (
                <div key={index} style={{
                  fontSize: '0.95em',
                  color: '#4a4a4a',
                  marginBottom: '8px',
                  paddingLeft: '18px',
                  position: 'relative',
                  breakInside: 'avoid-column'
                }}>
                  <span style={{ color: '#20c997', position: 'absolute', left: 0, top: '0.1em', fontSize: '1em' }}>•</span>
                  {cert.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages Section (if available) */}
        {languages.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <h3 style={{
              fontSize: '1.15em',
              color: '#20c997',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #e0e0e0',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700
            }}>
              LANGUAGES
            </h3>
            <div style={{
              columnCount: 3,
              columnGap: '25px',
              WebkitColumnCount: 3,
              MozColumnCount: 3
            }}>
              {languages.map((language, index) => (
                <div key={index} style={{
                  fontSize: '0.95em',
                  color: '#4a4a4a',
                  marginBottom: '8px',
                  paddingLeft: '18px',
                  position: 'relative',
                  breakInside: 'avoid-column'
                }}>
                  <span style={{ color: '#20c997', position: 'absolute', left: 0, top: '0.1em', fontSize: '1em' }}>•</span>
                  {language.name} - {language.proficiency}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hobbies Section (if available) */}
        {hobbies && (
          <section style={{ marginBottom: '25px', display: hobbies ? 'block' : 'none' }}>
            <h3 style={{
              fontSize: '1.15em',
              color: '#20c997',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #e0e0e0',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700
            }}>
              HOBBIES & INTERESTS
            </h3>
            <p style={{ fontSize: '0.95em', color: '#4a4a4a', lineHeight: 1.7 }}>
              {hobbies}
            </p>
          </section>
        )}

        {/* References Section (if available) */}
        {references.length > 0 && (
          <section style={{ marginBottom: '25px', display: references.length > 0 ? 'block' : 'none' }}>
            <h3 style={{
              fontSize: '1.15em',
              color: '#20c997',
              marginBottom: '15px',
              paddingBottom: '5px',
              borderBottom: '1px solid #e0e0e0',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 700
            }}>
              REFERENCES
            </h3>
            <ul style={{ margin: 0 }}>
              {references.map((reference, index) => (
                <li key={index} style={{ marginBottom: '15px' }}>
                  <strong style={{ display: 'block', fontSize: '1.1em', color: '#2a2a2a', marginBottom: '2px' }}>
                    {reference.name}
                  </strong>
                  <span style={{ display: 'block', fontSize: '0.95em', color: '#555' }}>
                    {reference.position} at {reference.company}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.95em', color: '#555' }}>
                    Email: {reference.email}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.95em', color: '#555' }}>
                    Phone: {reference.phone}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}