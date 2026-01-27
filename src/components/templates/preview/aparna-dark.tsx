'use client';

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#1E3A5F';

export function AparnaDarkPreview({ data, colorOverride }: Props) {
  const { personalInfo, summary, workExperiences, education, skills } = data;
  const color = colorOverride || DEFAULT_COLOR;

  return (
    <div className="w-full min-h-full font-sans text-white" style={{ backgroundColor: color }}>
      <div className="p-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-1">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-xl text-blue-300">{personalInfo.professionalTitle}</p>
          </div>
          
          {personalInfo.photoUrl && (
            <div 
              className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-blue-400"
              style={{ backgroundImage: `url(${personalInfo.photoUrl})` }}
            />
          )}
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-blue-200 mb-8 pb-4 border-b border-blue-400/30">
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>☎ {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
        </div>

        {summary && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-blue-300 mb-3 uppercase tracking-wider">
              Profile
            </h2>
            <p className="text-sm leading-relaxed text-blue-100">{summary}</p>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-blue-300 mb-4 uppercase tracking-wider">
              Experience
            </h2>
            {workExperiences.map((exp) => (
              <div key={exp.id} className="mb-6">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white">{exp.jobTitle}</h3>
                  <span className="text-sm text-blue-300">
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-blue-300 mb-2">{exp.company}</p>
                <ul className="space-y-1">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-sm text-blue-100 flex items-start gap-2">
                      <span className="text-blue-400">▸</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          {education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-blue-300 mb-4 uppercase tracking-wider">
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <h3 className="font-medium text-white">{edu.degree}</h3>
                  <p className="text-sm text-blue-200">{edu.institution}</p>
                  <p className="text-xs text-blue-300">{edu.graduationDate}</p>
                </div>
              ))}
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-blue-300 mb-4 uppercase tracking-wider">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span 
                    key={skill.id} 
                    className="px-3 py-1 text-sm rounded-full bg-blue-500/30 text-blue-100 border border-blue-400/50"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
