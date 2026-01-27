'use client';

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#4B5563';

export function NellyGrayPreview({ data, colorOverride }: Props) {
  const { personalInfo, summary, workExperiences, education, skills } = data;
  const color = colorOverride || DEFAULT_COLOR;

  return (
    <div className="w-full min-h-full bg-white font-sans p-10">
      <div className="border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-4xl font-light text-gray-900">
          {personalInfo.firstName} <span className="font-bold">{personalInfo.lastName}</span>
        </h1>
        <p className="text-lg text-gray-600 mt-1">{personalInfo.professionalTitle}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>
            Profile
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </div>
      )}

      {workExperiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>
            Experience
          </h2>
          {workExperiences.map((exp) => (
            <div key={exp.id} className="mb-5 pl-4 border-l-2 border-gray-300">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                <span className="text-sm text-gray-500">
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{exp.company} | {exp.location}</p>
              <ul className="space-y-1">
                {exp.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-gray-400">—</span>
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
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-xs text-gray-500">{edu.graduationDate}</p>
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>
              Skills
            </h2>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id} className="text-sm">
                  <span className="text-gray-700">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
