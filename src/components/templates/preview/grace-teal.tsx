'use client';

import type { CVData } from '@/types/cv';

export function GraceTealPreview({ data }: { data: CVData }) {
  const { personalInfo, summary, workExperiences, education, skills } = data;
  const color = '#2AAA9E';

  return (
    <div className="w-full min-h-full bg-white font-sans p-10">
      <div className="mb-8 border-l-4 pl-6" style={{ borderColor: color }}>
        <h1 className="text-4xl font-light text-gray-900 mb-1">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-lg uppercase tracking-widest" style={{ color }}>
          {personalInfo.professionalTitle}
        </p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-8 relative pl-6 border-l-4" style={{ borderColor: color }}>
          <div 
            className="absolute w-3 h-3 rounded-full -left-[8px] top-0"
            style={{ backgroundColor: color }}
          />
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>
            Profile
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {workExperiences.length > 0 && (
        <div className="mb-8 relative pl-6 border-l-4" style={{ borderColor: color }}>
          <div 
            className="absolute w-3 h-3 rounded-full -left-[8px] top-0"
            style={{ backgroundColor: color }}
          />
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color }}>
            Experience
          </h2>
          {workExperiences.map((exp, index) => (
            <div key={exp.id} className="mb-5 relative">
              {index > 0 && (
                <div 
                  className="absolute w-2 h-2 rounded-full -left-[22px] top-1"
                  style={{ backgroundColor: color, opacity: 0.5 }}
                />
              )}
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                <span className="text-xs text-gray-500">
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{exp.company} | {exp.location}</p>
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

      <div className="grid grid-cols-2 gap-8">
        {education.length > 0 && (
          <div className="relative pl-6 border-l-4" style={{ borderColor: color }}>
            <div 
              className="absolute w-3 h-3 rounded-full -left-[8px] top-0"
              style={{ backgroundColor: color }}
            />
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h3 className="font-medium text-sm">{edu.degree}</h3>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-xs text-gray-500">{edu.graduationDate}</p>
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div className="relative pl-6 border-l-4" style={{ borderColor: color }}>
            <div 
              className="absolute w-3 h-3 rounded-full -left-[8px] top-0"
              style={{ backgroundColor: color }}
            />
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color }}>
              Skills
            </h2>
            <div className="space-y-1">
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
