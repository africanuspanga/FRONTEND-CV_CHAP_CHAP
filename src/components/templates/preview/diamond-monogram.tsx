"use client";

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#4B5563';

export function DiamondMonogramPreview({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || DEFAULT_COLOR;

  const initials = `${data.personalInfo.firstName?.[0] || ''}${data.personalInfo.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="p-8 min-h-full bg-white font-sans">
      {/* Header with diamond monogram */}
      <div className="flex items-center gap-6 mb-8">
        {/* Diamond monogram */}
        <div
          className="w-20 h-20 flex items-center justify-center rotate-45 border-2"
          style={{ borderColor: primaryColor }}
        >
          <span
            className="text-xl font-light -rotate-45"
            style={{ color: primaryColor }}
          >
            {initials}
          </span>
        </div>

        {/* Name and contact */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-wide uppercase text-gray-900 mb-1">
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && (
              <>
                <span>|</span>
                <span>{data.personalInfo.phone}</span>
              </>
            )}
            {data.personalInfo.location && (
              <>
                <span>|</span>
                <span>{data.personalInfo.location}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main content with label-content layout */}
      <div className="space-y-6">
        {/* Summary */}
        {data.summary && (
          <div className="flex gap-8">
            <div className="w-28 flex-shrink-0">
              <h2 className="text-sm font-medium text-gray-500">Summary</h2>
            </div>
            <div className="flex-1 border-t border-gray-200 pt-2">
              <p className="text-sm text-gray-700 leading-relaxed">
                {data.summary}
              </p>
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="flex gap-8">
            <div className="w-28 flex-shrink-0">
              <h2 className="text-sm font-medium text-gray-500">Skills</h2>
            </div>
            <div className="flex-1 border-t border-gray-200 pt-2">
              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                {data.skills.map((skill) => (
                  <p key={skill.id} className="text-sm text-gray-700 flex items-start gap-2">
                    <span>•</span>
                    <span>{skill.name}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience */}
        {data.workExperiences.length > 0 && (
          <div className="flex gap-8">
            <div className="w-28 flex-shrink-0">
              <h2 className="text-sm font-medium text-gray-500">Experience</h2>
            </div>
            <div className="flex-1 border-t border-gray-200 pt-2 space-y-4">
              {data.workExperiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                    <span className="text-sm text-gray-500">
                      {exp.startDate} - {exp.isCurrent ? 'Current' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {exp.company} | {exp.location}
                  </p>
                  {exp.achievements.length > 0 && (
                    <ul className="space-y-1">
                      {exp.achievements.slice(0, 3).map((achievement, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span>•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="flex gap-8">
            <div className="w-28 flex-shrink-0">
              <h2 className="text-sm font-medium text-gray-500">Education and Training</h2>
            </div>
            <div className="flex-1 border-t border-gray-200 pt-2 space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {edu.institution} | {edu.location}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{edu.graduationDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div className="flex gap-8">
            <div className="w-28 flex-shrink-0">
              <h2 className="text-sm font-medium text-gray-500">Languages</h2>
            </div>
            <div className="flex-1 border-t border-gray-200 pt-2">
              <div className="space-y-1">
                {data.languages.map((lang) => (
                  <p key={lang.id} className="text-sm text-gray-700">
                    <span className="font-medium">{lang.name}:</span> {lang.proficiency}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* References */}
        {data.references.length > 0 && (
          <div className="flex gap-8">
            <div className="w-28 flex-shrink-0">
              <h2 className="text-sm font-medium text-gray-500">References</h2>
            </div>
            <div className="flex-1 border-t border-gray-200 pt-2 grid grid-cols-2 gap-4">
              {data.references.slice(0, 2).map((ref) => (
                <div key={ref.id}>
                  <p className="font-semibold text-gray-900">{ref.name}</p>
                  <p className="text-sm text-gray-500">{ref.position || ref.title} at {ref.company}</p>
                  {ref.email && <p className="text-sm text-gray-500">{ref.email}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
