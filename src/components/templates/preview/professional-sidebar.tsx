"use client";

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#6B7B8C';

export function ProfessionalSidebarPreview({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || DEFAULT_COLOR;

  return (
    <div className="flex min-h-full bg-white font-sans">
      {/* Left sidebar accent */}
      <div
        className="w-2 flex-shrink-0"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Main content */}
      <div className="flex-1 p-8">
        {/* Header - centered name */}
        <div className="text-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-light text-gray-800 mb-1">
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </h1>
        </div>

        <div className="flex gap-8">
          {/* Left column - Summary & Experience */}
          <div className="w-3/5">
            {/* Summary */}
            {data.summary && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">
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
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
                  Experience
                </h2>
                <div className="space-y-4">
                  {data.workExperiences.map((exp) => (
                    <div key={exp.id}>
                      <h3 className="font-semibold text-gray-900">
                        {exp.company} - {exp.jobTitle}
                      </h3>
                      <p className="text-sm text-gray-500 italic mb-2">
                        {exp.location} • {exp.startDate} - {exp.isCurrent ? 'Current' : exp.endDate}
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
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Languages
                </h2>
                <div className="space-y-2">
                  {data.languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{lang.name}:</span>
                      <span className="text-gray-500">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Contact, Skills, Education */}
          <div className="w-2/5">
            {/* Contact */}
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">
                Contact
              </h2>
              <div className="space-y-1 text-sm text-gray-600">
                {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
                {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
                {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
              </div>
            </div>

            {/* Skills */}
            {data.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">
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
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Education and Training
                </h2>
                <div className="space-y-3">
                  {data.education.map((edu) => (
                    <div key={edu.id}>
                      <p className="text-sm font-semibold text-gray-900">
                        {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                      </p>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">
                        {edu.location} • {edu.graduationDate}
                      </p>
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
