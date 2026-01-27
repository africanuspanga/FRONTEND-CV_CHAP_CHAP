'use client';

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#9B7B7B';

export function DenicePreview({ data, colorOverride }: Props) {
  const { personalInfo, summary, workExperiences, education, skills, languages } = data;
  const color = colorOverride || DEFAULT_COLOR;

  return (
    <div className="w-full min-h-full bg-white font-serif">
      <div className="flex">
        <div className="w-[35%] p-8" style={{ backgroundColor: color + '15' }}>
          {personalInfo.photoUrl && (
            <div 
              className="w-32 h-32 rounded-full mx-auto mb-6 bg-cover bg-center border-4"
              style={{ 
                backgroundImage: `url(${personalInfo.photoUrl})`,
                borderColor: color
              }}
            />
          )}
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold" style={{ color }}>
              {personalInfo.firstName}
            </h1>
            <h1 className="text-2xl font-bold mb-2" style={{ color }}>
              {personalInfo.lastName}
            </h1>
            <p className="text-sm text-gray-600">{personalInfo.professionalTitle}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-2 mb-3" style={{ color, borderColor: color }}>
              Contact
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.location && <p>{personalInfo.location}</p>}
            </div>
          </div>

          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-2 mb-3" style={{ color, borderColor: color }}>
                Skills
              </h2>
              <div className="space-y-1">
                {skills.map((skill) => (
                  <p key={skill.id} className="text-sm text-gray-700">• {skill.name}</p>
                ))}
              </div>
            </div>
          )}

          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-2 mb-3" style={{ color, borderColor: color }}>
                Languages
              </h2>
              {languages.map((lang) => (
                <div key={lang.id} className="mb-2">
                  <p className="text-sm font-medium">{lang.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{lang.proficiency}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-[65%] p-8">
          {summary && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>
                Profile
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
            </div>
          )}

          {workExperiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>
                Experience
              </h2>
              {workExperiences.map((exp) => (
                <div key={exp.id} className="mb-5">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm italic mb-2" style={{ color }}>{exp.company}</p>
                  <ul className="space-y-1">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span style={{ color }}>—</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {education.length > 0 && (
            <div>
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
        </div>
      </div>
    </div>
  );
}
