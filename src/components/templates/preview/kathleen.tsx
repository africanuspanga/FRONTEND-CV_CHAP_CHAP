"use client";

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#E5B94E';

export function KathleenPreview({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || DEFAULT_COLOR;

  return (
    <div className="p-8 font-sans">
      <div className="flex gap-8">
        <div className="w-1/3">
          <div className="mb-6">
            <span 
              className="text-6xl font-serif leading-none"
              style={{ color: primaryColor }}
            >
              "
            </span>
            <p className="text-sm text-gray-700 italic pl-4">
              {data.summary || 'Dedicated professional committed to excellence and continuous growth.'}
            </p>
            <span 
              className="text-6xl font-serif leading-none block text-right"
              style={{ color: primaryColor }}
            >
              "
            </span>
          </div>

          <div className="mb-6">
            <h3 
              className="text-sm font-bold uppercase tracking-wide mb-3 pb-1 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Contact
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              {data.personalInfo.email && (
                <p>{data.personalInfo.email}</p>
              )}
              {data.personalInfo.phone && (
                <p>{data.personalInfo.phone}</p>
              )}
              {data.personalInfo.location && (
                <p>{data.personalInfo.location}</p>
              )}
              {data.personalInfo.linkedin && (
                <p>{data.personalInfo.linkedin}</p>
              )}
            </div>
          </div>

          {data.skills.length > 0 && (
            <div className="mb-6">
              <h3 
                className="text-sm font-bold uppercase tracking-wide mb-3 pb-1 border-b-2"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Skills
              </h3>
              <div className="space-y-2">
                {data.skills.map((skill) => (
                  <div key={skill.id} className="text-sm text-gray-700">
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.languages.length > 0 && (
            <div className="mb-6">
              <h3 
                className="text-sm font-bold uppercase tracking-wide mb-3 pb-1 border-b-2"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Languages
              </h3>
              <div className="space-y-2">
                {data.languages.map((lang) => (
                  <div key={lang.id} className="text-sm text-gray-700">
                    {lang.name} - {lang.proficiency}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-2/3">
          <div className="mb-8">
            <h1 
              className="text-4xl font-bold mb-1"
              style={{ color: primaryColor }}
            >
              {data.personalInfo.firstName}
            </h1>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {data.personalInfo.lastName}
            </h1>
            <p className="text-lg text-gray-600 uppercase tracking-wide">
              {data.personalInfo.professionalTitle}
            </p>
          </div>

          {data.workExperiences.length > 0 && (
            <div className="mb-6">
              <h2 
                className="text-sm font-bold uppercase tracking-wide mb-4 pb-1 border-b-2"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Experience
              </h2>
              <div className="space-y-4">
                {data.workExperiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                        <p className="text-sm text-gray-600">
                          {exp.company} | {exp.location}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                      </p>
                    </div>
                    {exp.achievements.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.achievements.slice(0, 3).map((achievement, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span style={{ color: primaryColor }}>•</span>
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
            <div className="mb-6">
              <h2 
                className="text-sm font-bold uppercase tracking-wide mb-4 pb-1 border-b-2"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                      </h3>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                    </div>
                    <p className="text-sm text-gray-500">{edu.graduationDate}</p>
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
