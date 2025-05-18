import React from 'react';
import { CVData } from '../types/cv-types';

interface TemplateProps {
  data: CVData;
}

const KilimanjaroTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, workExperiences, education, skills, languages, references } = data;
  
  // Fallback for empty data
  const name = personalInfo?.firstName && personalInfo?.lastName 
    ? `${personalInfo.firstName} ${personalInfo.lastName}`
    : 'Your Name';
    
  const title = personalInfo?.professionalTitle || personalInfo?.jobTitle || 'Professional';
  
  return (
    <div className="kilimanjaro-template bg-white text-gray-800 font-sans">
      {/* Header with sidebar layout */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="bg-emerald-800 text-white p-6 md:w-1/3">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{name}</h1>
            <h2 className="text-lg text-emerald-200 mt-1">{title}</h2>
          </div>
          
          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="text-emerald-200 uppercase text-sm font-bold mb-2 border-b border-emerald-700 pb-1">Contact</h3>
            <ul className="space-y-2 text-sm">
              {personalInfo?.email && (
                <li className="flex items-start">
                  <span className="mr-2">📧</span>
                  <span>{personalInfo.email}</span>
                </li>
              )}
              {personalInfo?.phone && (
                <li className="flex items-start">
                  <span className="mr-2">📱</span>
                  <span>{personalInfo.phone}</span>
                </li>
              )}
              {personalInfo?.address && (
                <li className="flex items-start">
                  <span className="mr-2">🏠</span>
                  <span>
                    {personalInfo.address}
                    {personalInfo.city && `, ${personalInfo.city}`}
                    {personalInfo.country && `, ${personalInfo.country}`}
                  </span>
                </li>
              )}
            </ul>
          </div>
          
          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-emerald-200 uppercase text-sm font-bold mb-2 border-b border-emerald-700 pb-1">Skills</h3>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div key={skill.id || index}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{skill.name}</span>
                      {skill.level && (
                        <span>{skill.level}/5</span>
                      )}
                    </div>
                    {skill.level && (
                      <div className="h-1.5 bg-emerald-700 rounded-full">
                        <div 
                          className="h-full bg-emerald-400 rounded-full" 
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h3 className="text-emerald-200 uppercase text-sm font-bold mb-2 border-b border-emerald-700 pb-1">Languages</h3>
              <ul className="space-y-1 text-sm">
                {languages.map((lang, index) => (
                  <li key={lang.id || index} className="flex justify-between">
                    <span>{lang.name}</span>
                    <span className="text-emerald-200 italic">{lang.proficiency}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="p-6 md:w-2/3">
          {/* Summary Section */}
          {(personalInfo?.summary || data.summary) && (
            <section className="mb-6">
              <h3 className="text-lg font-bold text-emerald-800 uppercase mb-2 pb-1 border-b-2 border-emerald-800">Profile</h3>
              <p className="text-sm">{personalInfo?.summary || data.summary}</p>
            </section>
          )}
          
          {/* Work Experience */}
          {workExperiences && workExperiences.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-bold text-emerald-800 uppercase mb-2 pb-1 border-b-2 border-emerald-800">Experience</h3>
              {workExperiences.map((job, index) => (
                <div key={job.id || index} className="mb-4">
                  <div className="flex flex-col md:flex-row md:justify-between mb-1">
                    <h4 className="font-bold text-emerald-800">{job.position}</h4>
                    <span className="text-sm text-gray-600 italic">
                      {job.startDate} - {job.current ? 'Present' : job.endDate}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">{job.company}{job.location ? `, ${job.location}` : ''}</p>
                  <p className="text-sm mt-1">{job.description}</p>
                </div>
              ))}
            </section>
          )}
          
          {/* Education */}
          {education && education.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-bold text-emerald-800 uppercase mb-2 pb-1 border-b-2 border-emerald-800">Education</h3>
              {education.map((edu, index) => (
                <div key={edu.id || index} className="mb-4">
                  <div className="flex flex-col md:flex-row md:justify-between mb-1">
                    <h4 className="font-bold text-emerald-800">{edu.degree} in {edu.field}</h4>
                    <span className="text-sm text-gray-600 italic">
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                  {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                </div>
              ))}
            </section>
          )}
          
          {/* References */}
          {references && references.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-emerald-800 uppercase mb-2 pb-1 border-b-2 border-emerald-800">References</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {references.map((ref, index) => (
                  <div key={ref.id || index} className="text-sm">
                    <p className="font-bold text-emerald-800">{ref.name}</p>
                    <p>{ref.position}, {ref.company}</p>
                    {ref.email && <p>Email: {ref.email}</p>}
                    {ref.phone && <p>Phone: {ref.phone}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default KilimanjaroTemplate;