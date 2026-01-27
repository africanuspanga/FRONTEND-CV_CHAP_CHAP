'use client';

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#2B4764';

export function LesleyPreview({ data, colorOverride }: Props) {
  const { personalInfo, summary, workExperiences, education, skills } = data;
  const color = colorOverride || DEFAULT_COLOR;

  return (
    <div className="w-full min-h-full bg-white font-sans">
      <div className="p-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-1" style={{ color }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-lg text-gray-600 mb-3">{personalInfo.professionalTitle}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>

        {summary && (
          <div className="flex mb-8">
            <div 
              className="w-32 flex-shrink-0 text-xs font-bold uppercase tracking-widest py-2 px-3 text-white"
              style={{ backgroundColor: color }}
            >
              Profile
            </div>
            <div className="flex-1 pl-6 pt-2">
              <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
            </div>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div className="flex mb-8">
            <div 
              className="w-32 flex-shrink-0 text-xs font-bold uppercase tracking-widest py-2 px-3 text-white"
              style={{ backgroundColor: color }}
            >
              Experience
            </div>
            <div className="flex-1 pl-6 pt-2 space-y-5">
              {workExperiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold" style={{ color }}>{exp.jobTitle}</h3>
                    <span className="text-xs text-gray-500">
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

        {education.length > 0 && (
          <div className="flex mb-8">
            <div 
              className="w-32 flex-shrink-0 text-xs font-bold uppercase tracking-widest py-2 px-3 text-white"
              style={{ backgroundColor: color }}
            >
              Education
            </div>
            <div className="flex-1 pl-6 pt-2 space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-medium">{edu.degree} in {edu.fieldOfStudy}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="flex">
            <div 
              className="w-32 flex-shrink-0 text-xs font-bold uppercase tracking-widest py-2 px-3 text-white"
              style={{ backgroundColor: color }}
            >
              Skills
            </div>
            <div className="flex-1 pl-6 pt-2">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span 
                    key={skill.id}
                    className="px-3 py-1 text-sm rounded"
                    style={{ backgroundColor: color + '15', color }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
