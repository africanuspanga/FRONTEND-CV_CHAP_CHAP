'use client';

import type { CVData } from '@/types/cv';

export function GraceNavyPreview({ data }: { data: CVData }) {
  const { personalInfo, summary, workExperiences, education, skills } = data;
  const color = '#1E4A6D';

  return (
    <div className="w-full min-h-full bg-white font-sans p-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-wide mb-2" style={{ color }}>
          {personalInfo.firstName?.toUpperCase() || 'FIRST'}{' '}
          {personalInfo.lastName?.toUpperCase() || 'LAST'}
        </h1>
        <p className="text-sm text-gray-600">
          {personalInfo.location} | {personalInfo.phone} | {personalInfo.email}
        </p>
      </div>

      {summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3" style={{ color }}>
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3" style={{ color }}>
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            {skills.map((skill) => (
              <div key={skill.id} className="text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {workExperiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3" style={{ color }}>
            Work History
          </h2>
          {workExperiences.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold" style={{ color }}>{exp.jobTitle}</h3>
                <span className="text-sm" style={{ color }}>
                  {exp.startDate} - {exp.isCurrent ? 'Current' : exp.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {exp.company} — {exp.location}
              </p>
              <ul className="space-y-1">
                {exp.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3" style={{ color }}>
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{edu.degree} in {edu.fieldOfStudy}</h3>
                <p className="text-sm text-gray-600">{edu.institution}</p>
              </div>
              <span className="text-sm text-gray-500">{edu.graduationDate}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
