"use client";

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#2563EB';

export function HexagonBluePreview({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || DEFAULT_COLOR;

  const initials = `${data.personalInfo.firstName?.[0] || ''}${data.personalInfo.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-full bg-white font-sans">
      {/* Header */}
      <div className="p-8 flex items-start gap-6">
        {/* Hexagon with initials */}
        <div className="flex-shrink-0">
          <svg width="70" height="80" viewBox="0 0 70 80">
            <polygon
              points="35,0 70,20 70,60 35,80 0,60 0,20"
              fill="none"
              stroke={primaryColor}
              strokeWidth="2"
            />
            <text
              x="35"
              y="45"
              textAnchor="middle"
              fill={primaryColor}
              fontSize="20"
              fontWeight="bold"
            >
              {initials}
            </text>
          </svg>
        </div>

        {/* Name and contact */}
        <div className="flex-1">
          <h1 className="text-3xl font-light text-gray-800">
            {data.personalInfo.firstName}
          </h1>
          <h1 className="text-3xl font-light text-gray-800 mb-3">
            {data.personalInfo.lastName}
          </h1>
        </div>

        {/* Contact info on right */}
        <div className="text-right text-sm text-gray-600">
          {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
          {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
          {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
        </div>
      </div>

      {/* Two column layout */}
      <div className="px-8 pb-8 flex gap-8">
        {/* Left column */}
        <div className="w-2/5">
          {/* Summary */}
          {data.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-light mb-2" style={{ color: primaryColor }}>
                Summary
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {data.summary}
              </p>
            </div>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-light mb-2" style={{ color: primaryColor }}>
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
              <h2 className="text-lg font-light mb-2" style={{ color: primaryColor }}>
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

          {/* Languages with visual bars */}
          {data.languages.length > 0 && (
            <div>
              <h2 className="text-lg font-light mb-2" style={{ color: primaryColor }}>
                Languages
              </h2>
              <div className="space-y-3">
                {data.languages.map((lang) => {
                  const proficiencyWidth = {
                    'native': '100%',
                    'fluent': '85%',
                    'conversational': '60%',
                    'basic': '35%',
                  }[lang.proficiency] || '50%';

                  return (
                    <div key={lang.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{lang.name}:</span>
                        <span className="text-gray-500 capitalize">{lang.proficiency}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: proficiencyWidth, backgroundColor: primaryColor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Experience */}
        <div className="w-3/5">
          {data.workExperiences.length > 0 && (
            <div>
              <h2 className="text-lg font-light mb-3" style={{ color: primaryColor }}>
                Experience
              </h2>
              <div className="space-y-5">
                {data.workExperiences.map((exp) => (
                  <div key={exp.id}>
                    <h3 className="font-semibold text-gray-900">{exp.company}</h3>
                    <p className="text-sm mb-1">
                      <span className="italic">{exp.jobTitle}</span>
                      <span className="text-gray-400"> | </span>
                      <span className="italic text-gray-500">{exp.location}</span>
                      <span className="text-gray-400 ml-4">
                        {exp.startDate} to {exp.isCurrent ? 'Current' : exp.endDate}
                      </span>
                    </p>
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
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {data.references.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-light mb-3" style={{ color: primaryColor }}>
                References
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {data.references.slice(0, 2).map((ref) => (
                  <div key={ref.id}>
                    <p className="font-semibold text-gray-900">{ref.name}</p>
                    <p className="text-sm text-gray-600">{ref.position || ref.title}</p>
                    <p className="text-sm text-gray-500">{ref.company}</p>
                    {ref.email && <p className="text-sm text-gray-500">{ref.email}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
