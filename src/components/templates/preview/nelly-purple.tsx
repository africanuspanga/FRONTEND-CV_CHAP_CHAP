'use client';

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#8B7BB5';

export function NellyPurplePreview({ data, colorOverride }: Props) {
  const { personalInfo, summary, workExperiences, education, skills, languages } = data;
  const color = colorOverride || DEFAULT_COLOR;
  const sidebarColor = '#6B5B9A';

  return (
    <div className="w-full min-h-full bg-white font-sans flex">
      <div className="w-[35%] p-8 text-white" style={{ backgroundColor: sidebarColor }}>
        <div className="text-center mb-8">
          {personalInfo.photoUrl && (
            <div 
              className="w-28 h-28 rounded-full mx-auto mb-4 bg-cover bg-center border-4 border-white/30"
              style={{ backgroundImage: `url(${personalInfo.photoUrl})` }}
            />
          )}
          <h1 className="text-xl font-bold">{personalInfo.firstName}</h1>
          <h1 className="text-xl font-bold mb-1">{personalInfo.lastName}</h1>
          <p className="text-sm opacity-80">{personalInfo.professionalTitle}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-2 mb-3">
            Contact
          </h2>
          <div className="space-y-2 text-sm">
            {personalInfo.email && <p className="break-all">{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-2 mb-3">
              Skills
            </h2>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <p className="text-sm mb-1">{skill.name}</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded"
                        style={{
                          backgroundColor: i <= (skill.level === 'expert' ? 5 : skill.level === 'advanced' ? 4 : 3)
                            ? 'white'
                            : 'rgba(255,255,255,0.3)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-2 mb-3">
              Languages
            </h2>
            {languages.map((lang) => (
              <div key={lang.id} className="mb-2">
                <p className="text-sm">{lang.name}</p>
                <p className="text-xs opacity-70 capitalize">{lang.proficiency}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-[65%] p-8">
        {summary && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>
              About Me
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>
              Work Experience
            </h2>
            {workExperiences.map((exp) => (
              <div key={exp.id} className="mb-5 relative pl-4 border-l-2" style={{ borderColor: color }}>
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
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

        {education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 relative pl-4 border-l-2" style={{ borderColor: color }}>
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-xs text-gray-500">{edu.graduationDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
