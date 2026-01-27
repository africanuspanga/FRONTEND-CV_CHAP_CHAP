"use client";

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#6B7280';

export function GraceMinimalPreview({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || DEFAULT_COLOR;

  return (
    <div className="p-10 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-light text-gray-900 tracking-wide">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <div className="w-16 h-0.5 mx-auto my-4" style={{ backgroundColor: primaryColor }}></div>
        <p className="text-lg text-gray-600 uppercase tracking-widest">
          {data.personalInfo.professionalTitle}
        </p>
        <div className="flex justify-center flex-wrap gap-4 mt-4 text-sm text-gray-500">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>|</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>|</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>
            Profile
          </h2>
          <div className="w-full h-px mb-4" style={{ backgroundColor: `${primaryColor}40` }}></div>
          <p className="text-gray-700 leading-relaxed text-sm">{data.summary}</p>
        </div>
      )}

      {data.workExperiences.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>
            Experience
          </h2>
          <div className="w-full h-px mb-4" style={{ backgroundColor: `${primaryColor}40` }}></div>
          <div className="space-y-6">
            {data.workExperiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </p>
                {exp.achievements.length > 0 && (
                  <ul className="space-y-1">
                    {exp.achievements.slice(0, 3).map((achievement, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span style={{ color: primaryColor }}>—</span>
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

      {data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>
            Education
          </h2>
          <div className="w-full h-px mb-4" style={{ backgroundColor: `${primaryColor}40` }}></div>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  </h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                </div>
                <span className="text-sm text-gray-500">{edu.graduationDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>
            Skills
          </h2>
          <div className="w-full h-px mb-4" style={{ backgroundColor: `${primaryColor}40` }}></div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {data.skills.map((skill) => (
              <span key={skill.id} className="text-sm text-gray-700">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
