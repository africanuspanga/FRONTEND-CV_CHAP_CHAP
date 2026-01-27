'use client';

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#374151';

export function NellySidebarPreview({ data, colorOverride }: Props) {
  const { personalInfo, summary, workExperiences, education, skills, languages } = data;
  const color = colorOverride || DEFAULT_COLOR;

  return (
    <div className="w-full min-h-full bg-white font-sans flex">
      <div className="w-[35%] p-8 text-white" style={{ backgroundColor: color }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold leading-tight">
            {personalInfo.firstName}
          </h1>
          <h1 className="text-2xl font-bold leading-tight mb-2">
            {personalInfo.lastName}
          </h1>
          <p className="text-sm opacity-80">{personalInfo.professionalTitle}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-2 mb-3">
            Contact
          </h2>
          <div className="space-y-2 text-sm">
            {personalInfo.email && (
              <p className="break-all">{personalInfo.email}</p>
            )}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-2 mb-3">
              Skills
            </h2>
            <div className="space-y-1">
              {skills.map((skill) => (
                <p key={skill.id} className="text-sm">• {skill.name}</p>
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-2 mb-3">
              Languages
            </h2>
            {languages.map((lang) => (
              <div key={lang.id} className="mb-2">
                <p className="text-sm">{lang.name}</p>
                <p className="text-xs opacity-70 capitalize">{lang.proficiency}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-[65%] p-8">
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
              <div key={exp.id} className="mb-5">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{exp.company}</p>
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
        )}

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
      </div>
    </div>
  );
}
