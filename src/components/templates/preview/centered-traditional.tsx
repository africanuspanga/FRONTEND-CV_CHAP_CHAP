"use client";

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#1F2937';

export function CenteredTraditionalPreview({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || DEFAULT_COLOR;

  return (
    <div className="p-8 font-sans min-h-full bg-white">
      {/* Header - centered */}
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold tracking-wide uppercase mb-2" style={{ color: primaryColor }}>
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <p className="text-sm text-gray-600">
          {data.personalInfo.location}
        </p>
        <p className="text-sm text-gray-600">
          {data.personalInfo.phone}
        </p>
        <p className="text-sm text-gray-600">
          {data.personalInfo.email}
        </p>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2
            className="text-center text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b border-gray-300"
            style={{ color: primaryColor }}
          >
            Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed text-center">
            {data.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-center text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b border-gray-300"
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
            className="text-center text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b border-gray-300"
            style={{ color: primaryColor }}
          >
            Experience
          </h2>
          <div className="space-y-5">
            {data.workExperiences.map((exp) => (
              <div key={exp.id}>
                <div className="text-center mb-2">
                  <h3 className="font-bold uppercase text-gray-900">{exp.company}</h3>
                  <p className="text-sm text-gray-600">{exp.location}</p>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} to {exp.isCurrent ? 'Current' : exp.endDate}
                  </span>
                </div>
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
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-center text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b border-gray-300"
            style={{ color: primaryColor }}
          >
            Education and Training
          </h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold uppercase text-gray-900">
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  </h3>
                  <p className="text-sm text-gray-600">{edu.institution}, {edu.location}</p>
                </div>
                <span className="text-sm text-gray-500">{edu.graduationDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-center text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b border-gray-300"
            style={{ color: primaryColor }}
          >
            Languages
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data.languages.map((lang) => (
              <div key={lang.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{lang.name}:</span>
                <span className="text-gray-500">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <div>
          <h2
            className="text-center text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b border-gray-300"
            style={{ color: primaryColor }}
          >
            References
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data.references.slice(0, 2).map((ref) => (
              <div key={ref.id} className="text-center">
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
