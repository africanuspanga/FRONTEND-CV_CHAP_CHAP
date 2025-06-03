import React from 'react';
import { CVData } from '@shared/schema';

interface TemplateProps {
  data: CVData;
}

const StreetHustlerTemplate: React.FC<TemplateProps> = ({ data }) => {
  // Add null safety for data
  if (!data) {
    return <div className="p-8 text-center text-gray-500">Loading template...</div>;
  }
  
  const { personalInfo, workExperiences, education, skills, languages, references } = data;
  
  // Fallback for empty data
  const name = personalInfo?.firstName && personalInfo?.lastName 
    ? `${personalInfo.firstName} ${personalInfo.lastName}`
    : 'Your Name';
    
  const title = personalInfo?.professionalTitle || personalInfo?.jobTitle || 'Professional';
  
  return (
    <div className="street-hustler-template bg-black text-white font-sans">
      {/* Bold Urban Header */}
      <header className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
        <h1 className="text-4xl font-black tracking-tighter">{name}</h1>
        <h2 className="text-xl text-orange-100 mt-1">{title}</h2>
        
        {/* Contact Info - Modern Layout */}
        <div className="mt-4 flex flex-wrap">
          {personalInfo?.email && (
            <div className="bg-black bg-opacity-20 rounded-full px-4 py-1 mr-2 mb-2 text-sm">
              <span>{personalInfo.email}</span>
            </div>
          )}
          
          {personalInfo?.phone && (
            <div className="bg-black bg-opacity-20 rounded-full px-4 py-1 mr-2 mb-2 text-sm">
              <span>{personalInfo.phone}</span>
            </div>
          )}
          
          {(personalInfo?.city || personalInfo?.country) && (
            <div className="bg-black bg-opacity-20 rounded-full px-4 py-1 mr-2 mb-2 text-sm">
              <span>
                {personalInfo.city}
                {personalInfo.city && personalInfo.country && ', '}
                {personalInfo.country}
              </span>
            </div>
          )}
        </div>
      </header>
      
      <div className="p-6">
        {/* Summary Section */}
        {(personalInfo?.summary || data.summary) && (
          <section className="mb-6 border-l-4 border-orange-500 pl-4">
            <h3 className="text-xl font-bold text-orange-500 mb-2">HUSTLE STATEMENT</h3>
            <p className="text-gray-300">{personalInfo?.summary || data.summary}</p>
          </section>
        )}
        
        {/* Work Experience */}
        {workExperiences && workExperiences.length > 0 && (
          <section className="mb-6">
            <h3 className="text-xl font-bold text-orange-500 mb-4">THE GRIND</h3>
            {workExperiences.map((job, index) => (
              <div key={job.id || index} className="mb-5 bg-gray-900 p-4 rounded">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <h4 className="font-bold text-white text-lg">{(job as any).jobTitle}</h4>
                  <span className="text-sm text-orange-300 px-3 py-1 rounded bg-orange-900 bg-opacity-30 md:ml-2">
                    {job.startDate} - {job.current ? 'Present' : job.endDate}
                  </span>
                </div>
                <p className="text-gray-400 font-medium mt-1">{job.company}{job.location ? ` | ${job.location}` : ''}</p>
                {job.description && <p className="text-gray-300 mt-2">{job.description}</p>}
                {job.achievements && job.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {job.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="flex items-start text-gray-300">
                        <span className="mr-2 text-orange-500">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}
        
        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-6">
            <h3 className="text-xl font-bold text-orange-500 mb-4">KNOWLEDGE</h3>
            {education.map((edu, index) => (
              <div key={edu.id || index} className="mb-5 bg-gray-900 p-4 rounded">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <h4 className="font-bold text-white text-lg">{edu.degree} in {edu.field}</h4>
                  <span className="text-sm text-orange-300 px-3 py-1 rounded bg-orange-900 bg-opacity-30 md:ml-2">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </span>
                </div>
                <p className="text-gray-400 font-medium mt-1">{edu.institution}{edu.location ? ` | ${edu.location}` : ''}</p>
                {edu.description && <p className="text-gray-300 mt-2">{edu.description}</p>}
              </div>
            ))}
          </section>
        )}
        
        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="mb-6">
            <h3 className="text-xl font-bold text-orange-500 mb-4">STREET SKILLS</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={skill.id || index} 
                  className="bg-orange-900 bg-opacity-30 text-orange-300 px-3 py-1 rounded text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
        
        {/* Languages */}
        {languages && languages.length > 0 && (
          <section className="mb-6">
            <h3 className="text-xl font-bold text-orange-500 mb-4">LANGUAGES</h3>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang, index) => (
                <div 
                  key={lang.id || index} 
                  className="bg-gray-900 p-3 rounded flex justify-between items-center"
                >
                  <span className="font-medium text-white">{lang.name}</span>
                  <span className="text-sm text-orange-300">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* References */}
        {references && references.length > 0 && (
          <section>
            <h3 className="text-xl font-bold text-orange-500 mb-4">CONNECTIONS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {references.map((ref, index) => (
                <div 
                  key={ref.id || index} 
                  className="border border-gray-700 rounded p-4 bg-gray-900"
                >
                  <p className="font-bold text-white">{ref.name}</p>
                  <p className="text-gray-400">{ref.position}, {ref.company}</p>
                  {ref.email && <p className="text-gray-300 mt-1">Email: {ref.email}</p>}
                  {ref.phone && <p className="text-gray-300">Phone: {ref.phone}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black p-4 text-center text-gray-500 text-sm">
        {name} • {title} • {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default StreetHustlerTemplate;