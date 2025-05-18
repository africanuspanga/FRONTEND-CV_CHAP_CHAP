import React from 'react';
import { CVData } from '../types/cv-types';

interface TemplateProps {
  data: CVData;
}

const BigBossTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, workExperiences, education, skills, languages, references } = data;
  
  // Fallback for empty data
  const name = personalInfo?.firstName && personalInfo?.lastName 
    ? `${personalInfo.firstName} ${personalInfo.lastName}`
    : 'Your Name';
    
  const title = personalInfo?.professionalTitle || personalInfo?.jobTitle || 'Professional';
  
  return (
    <div className="big-boss-template bg-white text-gray-800 font-sans">
      {/* Header - Bold, executive style */}
      <header className="bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold tracking-wide">{name}</h1>
        <h2 className="text-xl mt-1 text-gray-300">{title}</h2>
        
        {/* Contact Info in a horizontal layout */}
        <div className="flex flex-wrap mt-3 text-sm text-gray-400">
          {personalInfo?.email && (
            <div className="mr-6 mb-1">
              <span>Email: </span>
              <span className="text-gray-200">{personalInfo.email}</span>
            </div>
          )}
          
          {personalInfo?.phone && (
            <div className="mr-6 mb-1">
              <span>Phone: </span>
              <span className="text-gray-200">{personalInfo.phone}</span>
            </div>
          )}
          
          {personalInfo?.address && (
            <div className="mr-6 mb-1">
              <span>Location: </span>
              <span className="text-gray-200">
                {personalInfo.city || personalInfo.address}
                {personalInfo.country && `, ${personalInfo.country}`}
              </span>
            </div>
          )}
        </div>
      </header>
      
      <div className="p-8">
        {/* Summary Section */}
        {(personalInfo?.summary || data.summary) && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-3">EXECUTIVE PROFILE</h3>
            <p className="text-gray-700">{personalInfo?.summary || data.summary}</p>
          </section>
        )}
        
        {/* Work Experience */}
        {workExperiences && workExperiences.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-3">PROFESSIONAL EXPERIENCE</h3>
            {workExperiences.map((job, index) => (
              <div key={job.id || index} className="mb-5">
                <div className="flex flex-col lg:flex-row lg:justify-between mb-1">
                  <h4 className="text-lg font-bold text-gray-900">{job.position}</h4>
                  <span className="text-gray-600 font-medium">
                    {job.startDate} - {job.current ? 'Present' : job.endDate}
                  </span>
                </div>
                <p className="text-gray-800 font-semibold mb-2">{job.company}{job.location ? ` | ${job.location}` : ''}</p>
                <p className="text-gray-700">{job.description}</p>
                
                {job.achievements && job.achievements.length > 0 && (
                  <ul className="mt-2 ml-5 list-disc text-gray-700">
                    {job.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}
        
        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-3">EDUCATION</h3>
            {education.map((edu, index) => (
              <div key={edu.id || index} className="mb-4">
                <div className="flex flex-col lg:flex-row lg:justify-between mb-1">
                  <h4 className="text-lg font-bold text-gray-900">{edu.degree} in {edu.field}</h4>
                  <span className="text-gray-600 font-medium">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </span>
                </div>
                <p className="text-gray-800 font-semibold">{edu.institution}{edu.location ? ` | ${edu.location}` : ''}</p>
                {edu.description && <p className="text-gray-700 mt-1">{edu.description}</p>}
                {edu.gpa && <p className="text-gray-700 mt-1">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </section>
        )}
        
        {/* Skills & Languages in a two-column layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <section className="md:w-1/2">
              <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-3">CORE COMPETENCIES</h3>
              <div className="grid grid-cols-2 gap-2">
                {skills.map((skill, index) => (
                  <div 
                    key={skill.id || index} 
                    className="bg-gray-100 px-3 py-2 rounded"
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Languages */}
          {languages && languages.length > 0 && (
            <section className="md:w-1/2">
              <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-3">LANGUAGES</h3>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang, index) => (
                  <div key={lang.id || index} className="flex justify-between">
                    <span className="font-medium">{lang.name}:</span>
                    <span className="text-gray-700">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        {/* References */}
        {references && references.length > 0 && (
          <section className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-3">REFERENCES</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {references.map((ref, index) => (
                <div key={ref.id || index} className="bg-gray-50 p-4 rounded">
                  <p className="font-bold text-gray-900">{ref.name}</p>
                  <p className="text-gray-700">{ref.position}, {ref.company}</p>
                  {ref.email && <p className="text-gray-700">Email: {ref.email}</p>}
                  {ref.phone && <p className="text-gray-700">Phone: {ref.phone}</p>}
                  {ref.relationship && <p className="text-gray-600 italic mt-1">Relation: {ref.relationship}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BigBossTemplate;