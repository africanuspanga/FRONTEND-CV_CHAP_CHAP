"use client";

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#3B9B9B';

export function TealAccentPreview({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || DEFAULT_COLOR;

  return (
    <div className="p-8 font-sans min-h-full bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-light tracking-wide uppercase mb-2" style={{ color: primaryColor }}>
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <p className="text-sm text-gray-600">
          {data.personalInfo.location} | {data.personalInfo.phone} | {data.personalInfo.email}
        </p>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-2"
            style={{ color: primaryColor }}
          >
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
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-2"
            style={{ color: primaryColor }}
          >
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            {data.skills.map((skill) => (
              <div key={skill.id} className="text-sm text-gray-700 flex items-start gap-2">
                <span>•</span>
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.workExperiences.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ color: primaryColor }}
          >
            Experience
          </h2>
          <div className="space-y-4">
            {data.workExperiences.map((exp) => (
              <div key={exp.id} className="flex gap-6">
                <div className="w-28 flex-shrink-0 text-sm text-gray-500">
                  {exp.startDate} - {exp.isCurrent ? 'Current' : exp.endDate}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-sm mb-2">
                    <span className="font-semibold" style={{ color: primaryColor }}>{exp.company}</span>
                    <span className="text-gray-500"> - {exp.location}</span>
                  </p>
                  {exp.achievements.length > 0 && (
                    <ul className="space-y-1">
                      {exp.achievements.slice(0, 4).map((achievement, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
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

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ color: primaryColor }}
          >
            Education and Training
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex gap-6">
                <div className="w-28 flex-shrink-0 text-sm text-gray-500">
                  {edu.graduationDate}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  </h3>
                  <p className="text-sm">
                    <span className="font-semibold" style={{ color: primaryColor }}>{edu.institution}</span>
                    {edu.location && <span className="text-gray-500"> - {edu.location}</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-2"
            style={{ color: primaryColor }}
          >
            Languages
          </h2>
          <div className="space-y-1">
            {data.languages.map((lang) => (
              <p key={lang.id} className="text-sm text-gray-700">
                <span className="font-semibold">{lang.name}:</span> {lang.proficiency}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <div>
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ color: primaryColor }}
          >
            References
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data.references.slice(0, 2).map((ref) => (
              <div key={ref.id}>
                <p className="font-bold text-gray-900">{ref.name}</p>
                <p className="text-sm text-gray-600">{ref.position || ref.title} at {ref.company}</p>
                {ref.phone && <p className="text-sm text-gray-600">{ref.phone}</p>}
                {ref.email && <p className="text-sm text-gray-600">{ref.email}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
