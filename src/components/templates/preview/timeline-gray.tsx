"use client";

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#6B7280';

export function TimelineGrayPreview({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || DEFAULT_COLOR;

  return (
    <div className="min-h-full bg-white font-sans">
      {/* Gray header */}
      <div className="px-8 py-6 bg-gray-100">
        <h1 className="text-3xl font-bold tracking-wide uppercase text-center mb-2" style={{ color: primaryColor }}>
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
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

      {/* Main content */}
      <div className="p-8">
        {/* Summary */}
        {data.summary && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2" style={{ color: primaryColor }}>
              Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {data.summary}
            </p>
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2" style={{ color: primaryColor }}>
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
              {data.skills.map((skill) => (
                <p key={skill.id} className="text-sm text-gray-700 flex items-start gap-2">
                  <span>•</span>
                  <span>{skill.name}</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Experience with timeline */}
        {data.workExperiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-3" style={{ color: primaryColor }}>
              Experience
            </h2>
            <div className="space-y-4">
              {data.workExperiences.map((exp) => (
                <div key={exp.id} className="flex gap-4">
                  {/* Date column */}
                  <div className="w-28 flex-shrink-0 text-right">
                    <p className="text-sm text-gray-500">
                      {exp.startDate} - {exp.isCurrent ? 'Current' : exp.endDate}
                    </p>
                    <p className="text-xs text-gray-400">{exp.company}</p>
                    <p className="text-xs text-gray-400">{exp.location}</p>
                  </div>

                  {/* Content */}
                  <div className="flex-1 border-l-2 border-gray-200 pl-4">
                    <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                    {exp.achievements.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.achievements.slice(0, 4).map((achievement, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <span>•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education with timeline */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-3" style={{ color: primaryColor }}>
              Education and Training
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex gap-4">
                  <div className="w-28 flex-shrink-0 text-right">
                    <p className="text-sm text-gray-500">{edu.graduationDate}</p>
                    <p className="text-xs text-gray-400">{edu.location}</p>
                  </div>
                  <div className="flex-1 border-l-2 border-gray-200 pl-4">
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    </h3>
                    <p className="text-sm text-gray-500">{edu.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2" style={{ color: primaryColor }}>
              Languages
            </h2>
            <div className="space-y-1">
              {data.languages.map((lang) => (
                <p key={lang.id} className="text-sm text-gray-700">
                  <span className="font-medium">{lang.name}:</span> {lang.proficiency}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {data.references.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold mb-3" style={{ color: primaryColor }}>
              References
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.references.slice(0, 2).map((ref) => (
                <div key={ref.id}>
                  <p className="font-semibold text-gray-900">{ref.name}</p>
                  <p className="text-sm text-gray-500">{ref.position || ref.title} at {ref.company}</p>
                  {ref.email && <p className="text-sm text-gray-500">{ref.email}</p>}
                  {ref.phone && <p className="text-sm text-gray-500">{ref.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
