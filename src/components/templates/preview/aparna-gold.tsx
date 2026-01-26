'use client';

import type { CVData } from '@/types/cv';

export function AparnaGoldPreview({ data }: { data: CVData }) {
  const { personalInfo, summary, workExperiences, education, skills } = data;
  const color = '#D4A056';

  return (
    <div className="w-full min-h-full bg-white font-serif">
      <div className="p-10">
        <div className="flex items-start justify-between mb-8 pb-4 border-b-2" style={{ borderColor: color }}>
          <div>
            <h1 className="text-4xl font-light text-gray-800">
              {personalInfo.firstName}
            </h1>
            <h1 className="text-4xl font-bold mb-2" style={{ color }}>
              {personalInfo.lastName}
            </h1>
            <p className="text-lg text-gray-600">{personalInfo.professionalTitle}</p>
          </div>
          
          {personalInfo.photoUrl && (
            <div 
              className="w-28 h-28 rounded-full bg-cover bg-center border-4"
              style={{ 
                backgroundImage: `url(${personalInfo.photoUrl})`,
                borderColor: color
              }}
            />
          )}
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-8">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>

        {summary && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3 pb-1 border-b" style={{ color, borderColor: color }}>
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 pb-1 border-b" style={{ color, borderColor: color }}>
              Professional Experience
            </h2>
            {workExperiences.map((exp) => (
              <div key={exp.id} className="mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-sm italic" style={{ color }}>{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="mt-2 space-y-1">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span style={{ color }}>◆</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          {education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4 pb-1 border-b" style={{ color, borderColor: color }}>
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <h3 className="font-bold text-sm text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                </div>
              ))}
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4 pb-1 border-b" style={{ color, borderColor: color }}>
                Expertise
              </h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2">
                    <span style={{ color }}>◆</span>
                    <span className="text-sm text-gray-700">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
