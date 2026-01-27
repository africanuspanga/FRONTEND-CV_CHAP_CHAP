'use client';

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#111827';

export function RichardPreview({ data, colorOverride }: Props) {
  const { personalInfo, summary, workExperiences, education, skills } = data;
  const color = colorOverride || DEFAULT_COLOR;

  return (
    <div className="w-full min-h-full bg-white font-serif p-10">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-light tracking-wide text-gray-900 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="w-24 h-px bg-gray-900 mx-auto my-4" />
        <p className="text-lg uppercase tracking-[0.3em] text-gray-600">
          {personalInfo.professionalTitle}
        </p>
        <div className="flex justify-center flex-wrap gap-6 mt-4 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-300" />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
              Profile
            </h2>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <p className="text-sm text-gray-700 leading-relaxed text-center">{summary}</p>
        </div>
      )}

      {workExperiences.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-300" />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
              Experience
            </h2>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="space-y-6">
            {workExperiences.map((exp) => (
              <div key={exp.id} className="text-center">
                <h3 className="font-bold text-gray-900 mb-1">{exp.jobTitle}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  {exp.company} — {exp.location}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                </p>
                <ul className="text-left max-w-xl mx-auto space-y-1">
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
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {education.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-gray-300" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
                Education
              </h2>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <div className="space-y-3 text-center">
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
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-gray-300" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
                Expertise
              </h2>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-700">
                {skills.map(s => s.name).join(' • ')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
