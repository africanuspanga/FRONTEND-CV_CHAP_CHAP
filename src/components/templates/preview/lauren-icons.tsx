'use client';

import type { CVData } from '@/types/cv';

export function LaurenIconsPreview({ data }: { data: CVData }) {
  const { personalInfo, summary, workExperiences, education, skills } = data;
  const color = '#374151';

  return (
    <div className="w-full min-h-full bg-white font-sans p-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-xl text-gray-600">{personalInfo.professionalTitle}</p>
        
        <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-600">
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">✉</span>
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">☎</span>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">📍</span>
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>
      </div>

      {summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold mb-2 pb-1" style={{ color, borderBottom: `2px solid ${color}` }}>
            RESUME SUMMARY
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </div>
      )}

      {workExperiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold mb-3 pb-1" style={{ color, borderBottom: `2px solid ${color}` }}>
            PROFESSIONAL EXPERIENCE
          </h2>
          {workExperiences.map((exp) => (
            <div key={exp.id} className="mb-5 flex gap-6">
              <div className="w-[30%]">
                <p className="font-semibold text-sm">{exp.company}</p>
                <p className="text-sm text-gray-600">{exp.location}</p>
                <p className="font-bold text-sm">{exp.jobTitle}</p>
                <p className="text-sm text-gray-500">
                  {exp.startDate} to {exp.isCurrent ? 'Present' : exp.endDate}
                </p>
              </div>
              <div className="w-[70%]">
                <ul className="space-y-1">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span style={{ color }}>•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold mb-2 pb-1" style={{ color, borderBottom: `2px solid ${color}` }}>
            EDUCATION
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between mb-2">
              <div>
                <p className="font-bold text-sm">{edu.degree}</p>
                <p className="text-sm text-gray-600">{edu.institution} - {edu.fieldOfStudy}</p>
              </div>
              <span className="text-sm text-gray-500">{edu.graduationDate}</span>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <h2 className="text-sm font-bold mb-2 pb-1" style={{ color, borderBottom: `2px solid ${color}` }}>
            SKILLS
          </h2>
          <div className="flex flex-wrap gap-x-8 gap-y-1">
            {skills.map((skill) => (
              <span key={skill.id} className="text-sm flex items-center gap-2">
                <span style={{ color }}>•</span>
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
