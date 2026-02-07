"use client";

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#4B5563';

export function ModernHeaderPreview({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || DEFAULT_COLOR;

  return (
    <div className="min-h-full bg-white font-sans">
      {/* Header with dark background */}
      <div className="px-8 py-6" style={{ backgroundColor: primaryColor }}>
        <h1 className="text-3xl font-light text-white text-center mb-2">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-200">
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.phone && (
            <>
              <span>•</span>
              <span>{data.personalInfo.phone}</span>
            </>
          )}
          {data.personalInfo.email && (
            <>
              <span>•</span>
              <span>{data.personalInfo.email}</span>
            </>
          )}
        </div>
      </div>

      {/* Main content - two columns */}
      <div className="p-8">
        <div className="flex gap-8">
          {/* Left column */}
          <div className="w-3/5">
            {/* Summary */}
            {data.summary && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                  Summary
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {data.summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {data.workExperiences.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                  Experience
                </h2>
                <div className="space-y-4">
                  {data.workExperiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                        <span className="text-xs text-gray-500">
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

            {/* Languages */}
            {data.languages.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                  Languages
                </h2>
                <div className="space-y-1">
                  {data.languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between text-sm">
                      <span className="font-medium">{lang.name}:</span>
                      <span className="text-gray-500">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="w-2/5">
            {/* Skills */}
            {data.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                  Skills
                </h2>
                <div className="space-y-1">
                  {data.skills.map((skill) => (
                    <p key={skill.id} className="text-sm text-gray-600 flex items-start gap-2">
                      <span>•</span>
                      <span>{skill.name}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                  Education and Training
                </h2>
                <div className="space-y-3">
                  {data.education.map((edu) => (
                    <div key={edu.id}>
                      <p className="text-sm font-semibold text-gray-900">{edu.degree}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        {edu.institution} - {edu.location}
                      </p>
                      <p className="text-xs text-gray-400">{edu.graduationDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* References */}
            {data.references.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                  References
                </h2>
                <div className="space-y-3">
                  {data.references.slice(0, 2).map((ref) => (
                    <div key={ref.id}>
                      <p className="font-semibold text-gray-900">{ref.name}</p>
                      <p className="text-sm text-gray-600">{ref.position || ref.title} at {ref.company}</p>
                      {ref.email && <p className="text-sm text-gray-500">{ref.email}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
