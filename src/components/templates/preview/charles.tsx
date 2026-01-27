"use client";

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#0891B2';

export function CharlesPreview({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || DEFAULT_COLOR;

  return (
    <div className="flex min-h-full">
      <div 
        className="w-1/3 p-6 text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold">
              {data.personalInfo.firstName?.[0]}{data.personalInfo.lastName?.[0]}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3 border-b border-white/30 pb-2">
            Contact
          </h3>
          <div className="space-y-2 text-sm">
            {data.personalInfo.email && (
              <p className="break-all">{data.personalInfo.email}</p>
            )}
            {data.personalInfo.phone && (
              <p>{data.personalInfo.phone}</p>
            )}
            {data.personalInfo.location && (
              <p>{data.personalInfo.location}</p>
            )}
            {data.personalInfo.linkedin && (
              <p className="break-all">{data.personalInfo.linkedin}</p>
            )}
          </div>
        </div>

        {data.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3 border-b border-white/30 pb-2">
              Skills
            </h3>
            <div className="space-y-3">
              {data.skills.slice(0, 8).map((skill) => (
                <div key={skill.id}>
                  <p className="text-sm mb-1">{skill.name}</p>
                  <div className="w-full h-1.5 bg-white/20 rounded-full">
                    <div 
                      className="h-full bg-white rounded-full"
                      style={{ 
                        width: skill.level === 'expert' ? '100%' : 
                               skill.level === 'advanced' ? '80%' : 
                               skill.level === 'intermediate' ? '60%' : '40%'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.languages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3 border-b border-white/30 pb-2">
              Languages
            </h3>
            <div className="space-y-2 text-sm">
              {data.languages.map((lang) => (
                <div key={lang.id} className="flex justify-between">
                  <span>{lang.name}</span>
                  <span className="text-white/70 capitalize">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3 border-b border-white/30 pb-2">
              Education
            </h3>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="text-sm">
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-white/80">{edu.fieldOfStudy}</p>
                  <p className="text-white/60 text-xs">{edu.institution}</p>
                  <p className="text-white/60 text-xs">{edu.graduationDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-2/3 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-1">
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </h1>
          <p 
            className="text-xl uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            {data.personalInfo.professionalTitle}
          </p>
        </div>

        {data.summary && (
          <div className="mb-8">
            <h2 
              className="text-sm font-bold uppercase tracking-wide mb-3"
              style={{ color: primaryColor }}
            >
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">{data.summary}</p>
          </div>
        )}

        {data.workExperiences.length > 0 && (
          <div className="mb-8">
            <h2 
              className="text-sm font-bold uppercase tracking-wide mb-4"
              style={{ color: primaryColor }}
            >
              Work Experience
            </h2>
            <div className="space-y-5">
              {data.workExperiences.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: primaryColor }}>
                  <div 
                    className="absolute w-2 h-2 rounded-full -left-[5px] top-1.5"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {exp.company} {exp.location && `| ${exp.location}`}
                  </p>
                  {exp.achievements.length > 0 && (
                    <ul className="space-y-1">
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
      </div>
    </div>
  );
}
