'use client';

import type { CVData } from '@/types/cv';

export function GraceCoralPreview({ data }: { data: CVData }) {
  const { personalInfo, summary, workExperiences, education, skills, languages } = data;
  const color = '#E85A5A';

  return (
    <div className="w-full min-h-full bg-white font-sans flex">
      <div className="w-2" style={{ backgroundColor: color }} />

      <div className="flex-1 p-8">
        <div className="mb-6 pb-4 border-b-2" style={{ borderColor: color }}>
          <h1 className="text-3xl font-black">
            <span style={{ color }}>{personalInfo.firstName?.toUpperCase() || 'FIRST'}</span>
            <span className="text-gray-400 font-light italic ml-2">
              {personalInfo.lastName?.toUpperCase() || 'LAST'}
            </span>
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {personalInfo.email} | {personalInfo.phone} | {personalInfo.location}
          </p>
        </div>

        {summary && (
          <div className="mb-6">
            <h2 className="text-sm font-bold mb-2" style={{ color }}>
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
          </div>
        )}

        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold mb-2" style={{ color }}>
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
              {skills.map((skill) => (
                <div key={skill.id} className="text-sm flex items-center gap-2">
                  <span style={{ color }}>•</span>
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold mb-3" style={{ color }}>
              Work History
            </h2>
            {workExperiences.map((exp) => (
              <div key={exp.id} className="mb-5">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm">{exp.jobTitle}</h3>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} - {exp.isCurrent ? 'Current' : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{exp.company} — {exp.location}</p>
                <ul className="mt-2 space-y-1">
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
          <div className="mb-6">
            <h2 className="text-sm font-bold mb-2" style={{ color }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-sm">{edu.degree}</p>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                </div>
                <span className="text-sm text-gray-500">{edu.graduationDate}</span>
              </div>
            ))}
          </div>
        )}

        {languages && languages.length > 0 && (
          <div>
            <h2 className="text-sm font-bold mb-2" style={{ color }}>
              Languages
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {languages.map((lang) => (
                <div key={lang.id}>
                  <div className="flex justify-between">
                    <span className="font-semibold text-sm">{lang.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{lang.proficiency}</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1"
                        style={{
                          backgroundColor: i <= (lang.proficiency === 'native' ? 5 : lang.proficiency === 'fluent' ? 4 : 3)
                            ? color
                            : '#E5E7EB',
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
