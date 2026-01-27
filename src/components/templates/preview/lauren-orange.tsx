'use client';

import type { CVData } from '@/types/cv';

interface Props {
  data: CVData;
  colorOverride?: string | null;
}

const DEFAULT_COLOR = '#E07A38';

export function LaurenOrangePreview({ data, colorOverride }: Props) {
  const { personalInfo, summary, workExperiences, education, skills, languages } = data;
  const color = colorOverride || DEFAULT_COLOR;

  return (
    <div className="w-full min-h-full bg-white flex font-sans">
      <div className="w-[35%] text-white p-8" style={{ backgroundColor: color }}>
        <h1 className="text-3xl font-bold leading-tight mb-1">
          {personalInfo.firstName?.toUpperCase() || 'FIRST'}
        </h1>
        <h1 className="text-3xl font-bold leading-tight mb-4">
          {personalInfo.lastName?.toUpperCase() || 'LAST'}
        </h1>
        
        <p className="text-sm font-semibold tracking-wide border-b border-white/30 pb-4 mb-6">
          {personalInfo.professionalTitle?.toUpperCase() || 'PROFESSIONAL TITLE'}
        </p>

        <div className="mb-8">
          <h2 className="text-xs font-bold tracking-widest mb-4 border-b border-white/30 pb-2">
            CONTACT
          </h2>
          <div className="space-y-2 text-sm">
            {personalInfo.phone && (
              <div className="flex gap-2">
                <span className="opacity-70">[P]</span>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex gap-2">
                <span className="opacity-70">[E]</span>
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex gap-2">
                <span className="opacity-70">[A]</span>
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {summary && (
          <div className="mb-8">
            <h2 className="text-xs font-bold tracking-widest mb-4 border-b border-white/30 pb-2">
              SUMMARY
            </h2>
            <p className="text-sm leading-relaxed opacity-90">{summary}</p>
          </div>
        )}

        {education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold tracking-widest mb-4 border-b border-white/30 pb-2">
              EDUCATION
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <p className="text-xs opacity-70">{edu.graduationDate}</p>
                <p className="font-semibold text-sm">{edu.degree}</p>
                <p className="text-sm">{edu.institution}</p>
              </div>
            ))}
          </div>
        )}

        {languages && languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold tracking-widest mb-4 border-b border-white/30 pb-2">
              LANGUAGES
            </h2>
            {languages.map((lang) => (
              <div key={lang.id} className="text-sm mb-1">
                {lang.name} - {lang.proficiency}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-[65%] p-8">
        <div className="mb-8">
          <h2 
            className="text-sm font-bold tracking-widest mb-4 pb-2 border-b-2"
            style={{ color, borderColor: color }}
          >
            PROFESSIONAL EXPERIENCE
          </h2>
          
          {workExperiences.map((exp) => (
            <div key={exp.id} className="mb-6">
              <p className="text-xs text-gray-500 mb-1">
                {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
              </p>
              <h3 className="font-bold text-base" style={{ color }}>
                {exp.jobTitle}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {exp.company}, {exp.location}
              </p>
              <ul className="space-y-1">
                {exp.achievements.slice(0, 3).map((achievement, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {skills.length > 0 && (
          <div>
            <h2 
              className="text-sm font-bold tracking-widest mb-4 pb-2 border-b-2"
              style={{ color, borderColor: color }}
            >
              SKILLS
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {skills.map((skill) => (
                <div key={skill.id} className="text-sm flex items-center gap-2">
                  <span style={{ color }}>•</span>
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
