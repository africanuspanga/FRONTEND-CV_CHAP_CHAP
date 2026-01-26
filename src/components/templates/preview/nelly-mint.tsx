'use client';

import type { CVData } from '@/types/cv';

export function NellyMintPreview({ data }: { data: CVData }) {
  const { personalInfo, summary, workExperiences, education, skills, certifications } = data;
  const color = '#3EB489';

  return (
    <div className="w-full min-h-full bg-white font-sans p-10">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-wide">
          {personalInfo.firstName?.toUpperCase() || 'FIRST'} {personalInfo.lastName?.toUpperCase() || 'LAST'}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {personalInfo.location} | {personalInfo.phone} | {personalInfo.email}
        </p>
      </div>

      {summary && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 pb-1 border-b-2" style={{ color, borderColor: color }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </div>
      )}

      {workExperiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3 pb-1 border-b-2" style={{ color, borderColor: color }}>
            EXPERIENCE
          </h2>
          {workExperiences.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{exp.jobTitle}</h3>
                <span className="text-sm text-gray-500">
                  {exp.startDate} to {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-600 italic">{exp.company} - {exp.location}</p>
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
          <h2 className="text-base font-bold mb-2 pb-1 border-b-2" style={{ color, borderColor: color }}>
            EDUCATION
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between mb-2">
              <div>
                <p className="font-bold text-sm">{edu.degree}</p>
                <p className="text-sm text-gray-600">{edu.institution}</p>
              </div>
              <span className="text-sm text-gray-500">{edu.graduationDate}</span>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 pb-1 border-b-2" style={{ color, borderColor: color }}>
            SKILLS
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span 
                key={skill.id} 
                className="px-3 py-1 text-sm rounded-full border"
                style={{ borderColor: color, color }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {certifications && certifications.length > 0 && (
        <div>
          <h2 className="text-base font-bold mb-2 pb-1 border-b-2" style={{ color, borderColor: color }}>
            CERTIFICATIONS
          </h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <p className="font-semibold text-sm">{cert.name}</p>
              <p className="text-sm text-gray-600">{cert.issuer} - {cert.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
