"use client";

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#F5C542';

export function CreativeYellowPreview({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || DEFAULT_COLOR;

  return (
    <div className="min-h-full bg-white font-sans">
      {/* Yellow header */}
      <div className="px-8 py-6 relative" style={{ backgroundColor: primaryColor }}>
        {/* Speech bubble tail */}
        <div
          className="absolute bottom-0 left-8 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent"
          style={{ borderTopColor: primaryColor, transform: 'translateY(100%)' }}
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Hi, I&apos;m {data.personalInfo.firstName} {data.personalInfo.lastName}.
        </h1>
        <p className="text-gray-800">
          {data.personalInfo.professionalTitle || 'Professional'}
        </p>
      </div>

      {/* Contact bar */}
      <div className="px-8 py-4 border-b border-gray-200 mt-4">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          {data.personalInfo.phone && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.email && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{data.personalInfo.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="p-8">
        {/* Summary */}
        {data.summary && (
          <div className="flex gap-8 mb-6">
            <div className="w-24 flex-shrink-0">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Summary
              </h2>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">
                {data.summary}
              </p>
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="flex gap-8 mb-6">
            <div className="w-24 flex-shrink-0">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Skills
              </h2>
            </div>
            <div className="flex-1">
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
          <div className="flex gap-8 mb-6">
            <div className="w-24 flex-shrink-0">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Experience
              </h2>
            </div>
            <div className="flex-1 space-y-4">
              {data.workExperiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                    <span className="text-sm text-gray-500">
                      {exp.startDate} - {exp.isCurrent ? 'Current' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 italic mb-2">
                    {exp.company} <span className="text-gray-400">{exp.location}</span>
                  </p>
                  {exp.achievements.length > 0 && (
                    <ul className="space-y-1">
                      {exp.achievements.slice(0, 4).map((achievement, idx) => (
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
          <div className="flex gap-8 mb-6">
            <div className="w-24 flex-shrink-0">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Education
              </h2>
            </div>
            <div className="flex-1 space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    </h3>
                    <p className="text-sm text-gray-500">{edu.institution}</p>
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
            <div className="w-24 flex-shrink-0">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Languages
              </h2>
            </div>
            <div className="flex-1">
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
      </div>
    </div>
  );
}
