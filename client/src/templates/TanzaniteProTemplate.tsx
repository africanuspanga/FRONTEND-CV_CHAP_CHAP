import React from 'react';
import { CVData } from '@shared/schema';

interface TemplateProps {
  data: CVData;
}

const TanzaniteProTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, workExperiences, education, skills, languages, references } = data;
  
  // Fallback for empty data
  const name = personalInfo?.firstName && personalInfo?.lastName 
    ? `${personalInfo.firstName} ${personalInfo.lastName}`
    : 'Your Name';
    
  const title = personalInfo?.professionalTitle || personalInfo?.jobTitle || 'Professional';
  
  return (
    <div className="tanzanite-pro-template bg-white text-gray-800 p-8 font-sans">
      {/* Header */}
      <header className="border-b-2 border-blue-700 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-blue-700">{name}</h1>
        <h2 className="text-xl text-gray-600">{title}</h2>
        
        <div className="flex flex-wrap mt-2 text-sm">
          {personalInfo?.email && (
            <div className="mr-4 mb-1">
              <span className="font-semibold">Email:</span> {personalInfo.email}
            </div>
          )}
          
          {personalInfo?.phone && (
            <div className="mr-4 mb-1">
              <span className="font-semibold">Phone:</span> {personalInfo.phone}
            </div>
          )}
          
          {personalInfo?.address && (
            <div className="mr-4 mb-1">
              <span className="font-semibold">Address:</span> {personalInfo.address}
              {personalInfo.city && `, ${personalInfo.city}`}
              {personalInfo.country && `, ${personalInfo.country}`}
            </div>
          )}
        </div>
      </header>
      
      {/* Summary Section */}
      {(personalInfo?.summary || data.summary) && (
        <section className="mb-6">
          <h3 className="text-lg font-bold text-blue-700 mb-2">Professional Summary</h3>
          <p className="text-sm">{personalInfo?.summary || data.summary}</p>
        </section>
      )}
      
      {/* Work Experience */}
      {workExperiences && workExperiences.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold text-blue-700 mb-2">Work Experience</h3>
          {workExperiences.map((job, index) => (
            <div key={job.id || index} className="mb-3">
              <div className="flex justify-between">
                <h4 className="font-bold">{(job as any).jobTitle}</h4>
                <span className="text-sm text-gray-600">
                  {job.startDate} - {job.current ? 'Present' : job.endDate}
                </span>
              </div>
              <div className="text-sm">
                <p className="italic">{job.company}{job.location ? `, ${job.location}` : ''}</p>
                {job.description && <p className="mt-1">{job.description}</p>}
                {job.achievements && job.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {job.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="flex items-start">
                        <span className="mr-2 text-blue-600">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
      
      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold text-blue-700 mb-2">Education</h3>
          {education.map((edu, index) => (
            <div key={edu.id || index} className="mb-3">
              <div className="flex justify-between">
                <h4 className="font-bold">{edu.degree} in {edu.field}</h4>
                <span className="text-sm text-gray-600">
                  {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                </span>
              </div>
              <p className="text-sm italic">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
              {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
            </div>
          ))}
        </section>
      )}
      
      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold text-blue-700 mb-2">Skills</h3>
          <div className="flex flex-wrap">
            {skills.map((skill, index) => (
              <span 
                key={skill.id || index} 
                className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mr-2 mb-2"
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
          <h3 className="text-lg font-bold text-blue-700 mb-2">Languages</h3>
          <ul className="list-disc pl-5">
            {languages.map((lang, index) => (
              <li key={lang.id || index} className="text-sm mb-1">
                <span className="font-semibold">{lang.name}:</span> {lang.proficiency}
              </li>
            ))}
          </ul>
        </section>
      )}
      
      {/* References */}
      {references && references.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-blue-700 mb-2">References</h3>
          {references.map((ref, index) => (
            <div key={ref.id || index} className="mb-2 text-sm">
              <p className="font-semibold">{ref.name}</p>
              <p>{ref.position}, {ref.company}</p>
              {ref.email && <p>Email: {ref.email}</p>}
              {ref.phone && <p>Phone: {ref.phone}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default TanzaniteProTemplate;