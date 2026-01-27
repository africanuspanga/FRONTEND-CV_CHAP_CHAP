'use client';

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#E07A38';

export function OliverPreview({ data, colorOverride }: Props) {
  const { personalInfo, summary, workExperiences, education, skills, references, languages } = data;
  const color = colorOverride || DEFAULT_COLOR;

  return (
    <div className="w-full min-h-full bg-white font-sans p-10">
      <div className="mb-8 pb-4 border-b-4" style={{ borderColor: color }}>
        <h1 className="text-4xl font-bold text-gray-900">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-lg mt-1" style={{ color }}>{personalInfo.professionalTitle}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2" style={{ color }}>
            Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </div>
      )}

      {workExperiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3" style={{ color }}>
            Experience
          </h2>
          {workExperiences.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-sm" style={{ color }}>{exp.company}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              <ul className="mt-2 space-y-1">
                {exp.achievements.slice(0, 3).map((achievement, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span style={{ color }}>▸</span>
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
            <h2 className="text-lg font-bold mb-3" style={{ color }}>
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
            <h2 className="text-lg font-bold mb-3" style={{ color }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 8).map((skill) => (
                <span 
                  key={skill.id} 
                  className="px-3 py-1 text-sm rounded text-white"
                  style={{ backgroundColor: color }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {languages && languages.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-3" style={{ color }}>
            Languages
          </h2>
          <div className="flex flex-wrap gap-4">
            {languages.map((lang) => (
              <span key={lang.id} className="text-sm">
                {lang.name} ({lang.proficiency})
              </span>
            ))}
          </div>
        </div>
      )}

      {references && references.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-3" style={{ color }}>
            References
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {references.map((ref) => (
              <div key={ref.id} className="text-sm">
                <p className="font-bold">{ref.name}</p>
                <p className="text-gray-600">{ref.title}</p>
                <p className="text-gray-600">{ref.company}</p>
                <p className="text-gray-500">{ref.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
