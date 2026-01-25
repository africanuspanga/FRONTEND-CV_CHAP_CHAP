'use client';

import type { CVData } from '@/types/cv';

export function KellyPreview({ data }: { data: CVData }) {
  const { personalInfo, summary, workExperiences, education, skills } = data;
  const color = '#1F2937';

  return (
    <div className="w-full min-h-full bg-white font-sans p-10">
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-lg text-gray-600 mb-3">{personalInfo.professionalTitle}</p>
        <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-8">
          <div 
            className="inline-block px-4 py-1 text-sm font-bold uppercase tracking-wide text-white mb-3"
            style={{ backgroundColor: color }}
          >
            Professional Summary
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {workExperiences.length > 0 && (
        <div className="mb-8">
          <div 
            className="inline-block px-4 py-1 text-sm font-bold uppercase tracking-wide text-white mb-4"
            style={{ backgroundColor: color }}
          >
            Work Experience
          </div>
          <div className="space-y-5">
            {workExperiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{exp.company} | {exp.location}</p>
                <ul className="space-y-1">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {education.length > 0 && (
          <div>
            <div 
              className="inline-block px-4 py-1 text-sm font-bold uppercase tracking-wide text-white mb-4"
              style={{ backgroundColor: color }}
            >
              Education
            </div>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <div 
              className="inline-block px-4 py-1 text-sm font-bold uppercase tracking-wide text-white mb-4"
              style={{ backgroundColor: color }}
            >
              Skills
            </div>
            <div className="space-y-1">
              {skills.map((skill) => (
                <div key={skill.id} className="text-sm flex items-center gap-2">
                  <span className="text-gray-400">▪</span>
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
