import React from 'react';
import { CVData } from '../types/cv-types';

interface TemplateProps {
  data: CVData;
}

const MjenziWaTaifaTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, workExperiences, education, skills, languages, references } = data;
  
  // Fallback for empty data
  const name = personalInfo?.firstName && personalInfo?.lastName 
    ? `${personalInfo.firstName} ${personalInfo.lastName}`
    : 'Your Name';
    
  const title = personalInfo?.professionalTitle || personalInfo?.jobTitle || 'Professional';
  
  return (
    <div className="mjenzi-wa-taifa-template bg-white text-gray-800 font-sans">
      {/* Header with national colors inspiration */}
      <header className="bg-gradient-to-r from-green-600 to-yellow-500 text-white p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{name}</h1>
            <h2 className="text-xl mt-1">{title}</h2>
          </div>
          
          {personalInfo?.profileImage && (
            <div className="mt-4 md:mt-0">
              <img 
                src={personalInfo.profileImage} 
                alt={name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg" 
              />
            </div>
          )}
        </div>
        
        {/* Contact Info */}
        <div className="mt-4 flex flex-wrap text-sm">
          {personalInfo?.email && (
            <div className="mr-6 mb-2">
              <span className="font-bold">Email: </span>
              <span>{personalInfo.email}</span>
            </div>
          )}
          
          {personalInfo?.phone && (
            <div className="mr-6 mb-2">
              <span className="font-bold">Phone: </span>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          
          {personalInfo?.address && (
            <div className="mr-6 mb-2">
              <span className="font-bold">Location: </span>
              <span>
                {personalInfo.city || personalInfo.address}
                {personalInfo.country && `, ${personalInfo.country}`}
              </span>
            </div>
          )}
        </div>
      </header>
      
      <div className="p-6">
        {/* Summary Section */}
        {(personalInfo?.summary || data.summary) && (
          <section className="mb-6">
            <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center">
              <div className="w-8 h-1 bg-yellow-500 mr-2"></div>
              PROFESSIONAL SUMMARY
            </h3>
            <p className="text-gray-700">{personalInfo?.summary || data.summary}</p>
          </section>
        )}
        
        {/* Work Experience */}
        {workExperiences && workExperiences.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
              <div className="w-8 h-1 bg-yellow-500 mr-2"></div>
              WORK EXPERIENCE
            </h3>
            {workExperiences.map((job, index) => (
              <div key={job.id || index} className="mb-5 relative pl-6 border-l-2 border-green-200 pb-4">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                <div className="flex flex-col md:flex-row md:justify-between">
                  <h4 className="font-bold text-green-700">{job.position}</h4>
                  <span className="text-sm text-gray-600">
                    {job.startDate} - {job.current ? 'Present' : job.endDate}
                  </span>
                </div>
                <p className="text-gray-700 font-medium">{job.company}{job.location ? `, ${job.location}` : ''}</p>
                <p className="text-gray-600 mt-2">{job.description}</p>
              </div>
            ))}
          </section>
        )}
        
        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
              <div className="w-8 h-1 bg-yellow-500 mr-2"></div>
              EDUCATION
            </h3>
            {education.map((edu, index) => (
              <div key={edu.id || index} className="mb-5 relative pl-6 border-l-2 border-green-200 pb-4">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                <div className="flex flex-col md:flex-row md:justify-between">
                  <h4 className="font-bold text-green-700">{edu.degree} in {edu.field}</h4>
                  <span className="text-sm text-gray-600">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </span>
                </div>
                <p className="text-gray-700 font-medium">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                {edu.description && <p className="text-gray-600 mt-2">{edu.description}</p>}
              </div>
            ))}
          </section>
        )}
        
        {/* Two column layout for Skills and Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                <div className="w-8 h-1 bg-yellow-500 mr-2"></div>
                SKILLS
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span 
                    key={skill.id || index} 
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
          
          {/* Languages */}
          {languages && languages.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                <div className="w-8 h-1 bg-yellow-500 mr-2"></div>
                LANGUAGES
              </h3>
              <ul className="space-y-2">
                {languages.map((lang, index) => (
                  <li key={lang.id || index} className="flex justify-between border-b border-green-100 pb-1">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-green-700">{lang.proficiency}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        
        {/* References */}
        {references && references.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
              <div className="w-8 h-1 bg-yellow-500 mr-2"></div>
              REFERENCES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {references.map((ref, index) => (
                <div 
                  key={ref.id || index} 
                  className="border border-green-200 rounded-lg p-4 bg-green-50"
                >
                  <p className="font-bold text-green-800">{ref.name}</p>
                  <p className="text-gray-700">{ref.position}, {ref.company}</p>
                  {ref.email && <p className="text-gray-600">Email: {ref.email}</p>}
                  {ref.phone && <p className="text-gray-600">Phone: {ref.phone}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MjenziWaTaifaTemplate;