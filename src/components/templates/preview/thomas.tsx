'use client';

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#8ECFC8';

export function ThomasPreview({ data, colorOverride }: Props) {
  const { personalInfo, summary, workExperiences, education, skills } = data;
  const color = colorOverride || DEFAULT_COLOR;

  return (
    <div className="w-full min-h-full bg-white font-sans">
      <div className="flex p-8 gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-light text-gray-800">
            {personalInfo.firstName || 'First'}
          </h1>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {personalInfo.lastName || 'Last'}
          </h1>
          <p className="text-lg" style={{ color }}>{personalInfo.professionalTitle}</p>
        </div>
        
        {personalInfo.photoUrl && (
          <div 
            className="w-24 h-24 rounded-full bg-cover bg-center border-4"
            style={{ 
              backgroundImage: `url(${personalInfo.photoUrl})`,
              borderColor: color
            }}
          />
        )}
      </div>

      <div className="px-8 pb-8">
        <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6 pb-4 border-b" style={{ borderColor: color }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>

        {summary && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>
              About Me
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
          </div>
        )}

        <div className="flex gap-8">
          <div className="w-[60%]">
            {workExperiences.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>
                  Work Experience
                </h2>
                {workExperiences.map((exp) => (
                  <div key={exp.id} className="mb-5">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                      <span className="text-xs text-gray-500">
                        {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color }}>{exp.company}</p>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span style={{ color }}>•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-[40%]">
            {education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>
                  Education
                </h2>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-3">
                    <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                  </div>
                ))}
              </div>
            )}

            {skills.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>
                  Skills
                </h2>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm">{skill.name}</span>
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
