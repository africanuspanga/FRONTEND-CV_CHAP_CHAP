'use client';

import type { CVData } from '@/types/cv';

export function GraceMintPreview({ data }: { data: CVData }) {
  const { personalInfo, summary, workExperiences, education, skills, languages } = data;
  const color = '#6BBFAB';

  return (
    <div className="w-full min-h-full bg-white font-sans">
      <div className="h-16" style={{ backgroundColor: color }} />
      
      <div className="relative -mt-8 mx-auto w-[70%] bg-white border border-gray-200 py-4 px-8 text-center shadow-sm">
        <h1 className="text-3xl font-light italic text-gray-800">
          {personalInfo.firstName || 'First'} {personalInfo.lastName || 'Last'}
        </h1>
      </div>

      <div className="text-center mt-4 text-sm text-gray-600">
        {personalInfo.email} | {personalInfo.phone} | {personalInfo.location}
      </div>

      <div className="flex mt-8 px-10 gap-8">
        <div className="w-[60%]">
          {summary && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold italic mb-3" style={{ color }}>
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
            </div>
          )}

          {workExperiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold italic mb-3" style={{ color }}>
                WORK HISTORY
              </h2>
              {workExperiences.map((exp) => (
                <div key={exp.id} className="mb-5">
                  <h3 className="font-bold text-sm">{exp.jobTitle}</h3>
                  <p className="text-sm italic text-gray-600">
                    {exp.company} | {exp.startDate} - {exp.isCurrent ? 'Current' : exp.endDate}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span style={{ color }}>●</span>
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
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold italic mb-3" style={{ color }}>
                SKILLS
              </h2>
              <ul className="space-y-1">
                {skills.map((skill) => (
                  <li key={skill.id} className="text-sm flex items-center gap-2">
                    <span style={{ color }}>●</span>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold italic mb-3" style={{ color }}>
                EDUCATION
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <p className="font-bold text-sm">{edu.institution}</p>
                  <p className="text-sm text-gray-600">{edu.location}</p>
                  <p className="text-sm text-gray-600">{edu.graduationDate}</p>
                  <p className="text-sm">{edu.degree}</p>
                </div>
              ))}
            </div>
          )}

          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold italic mb-3" style={{ color }}>
                LANGUAGES
              </h2>
              {languages.map((lang) => (
                <div key={lang.id} className="mb-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{lang.name}</span>
                    <span className="text-xs text-gray-500 uppercase">{lang.proficiency}</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1"
                        style={{
                          backgroundColor: i <= (lang.proficiency === 'native' ? 5 : lang.proficiency === 'fluent' ? 4 : lang.proficiency === 'conversational' ? 3 : 2)
                            ? color
                            : '#E5E7EB',
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
