"use client";

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#1F2937';

export function ClassicElegantPreview({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || DEFAULT_COLOR;

  return (
    <div className="p-10 font-serif min-h-full bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-light tracking-wide text-gray-900 uppercase">
          {data.personalInfo.firstName}
        </h1>
        <h1 className="text-4xl font-light tracking-wide text-gray-900 uppercase mb-3">
          {data.personalInfo.lastName}
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.email && (
            <>
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
              <span>{data.personalInfo.email}</span>
            </>
          )}
          {data.personalInfo.location && (
            <>
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
              <span>{data.personalInfo.location}</span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b"
            style={{ borderColor: primaryColor }}
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
            className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b"
            style={{ borderColor: primaryColor }}
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
            className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b"
            style={{ borderColor: primaryColor }}
          >
            Experience
          </h2>
          <div className="space-y-4">
            {data.workExperiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {exp.company} | {exp.location} | {exp.startDate} - {exp.isCurrent ? 'Current' : exp.endDate}
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
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b"
            style={{ borderColor: primaryColor }}
          >
            Education and Training
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <h3 className="font-bold text-gray-900">
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                </h3>
                <p className="text-sm text-gray-600">
                  {edu.institution} | {edu.location} | {edu.graduationDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b"
            style={{ borderColor: primaryColor }}
          >
            Languages
          </h2>
          <div className="space-y-1">
            {data.languages.map((lang) => (
              <p key={lang.id} className="text-sm text-gray-700">
                {lang.name}: {lang.proficiency}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <div>
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b"
            style={{ borderColor: primaryColor }}
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
