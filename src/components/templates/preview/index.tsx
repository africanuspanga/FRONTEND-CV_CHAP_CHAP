"use client";

import type { CVData } from '@/types/cv';
import { KathleenPreview } from './kathleen';
import { GraceMinimalPreview } from './grace-minimal';
import { CharlesPreview } from './charles';
import { LaurenOrangePreview } from './lauren-orange';
import { GraceNavyPreview } from './grace-navy';
import { GraceTealPreview } from './grace-teal';
import { LesleyPreview } from './lesley';
import { KellyPreview } from './kelly';
import { RichardPreview } from './richard';

interface TemplatePreviewProps {
  templateId: string;
  data: CVData;
  scale?: number;
}

const previewComponents: Record<string, React.FC<{ data: CVData }>> = {
  'kathleen': KathleenPreview,
  'grace-minimal': GraceMinimalPreview,
  'charles': CharlesPreview,
  'lauren-orange': LaurenOrangePreview,
  'grace-navy': GraceNavyPreview,
  'grace-teal': GraceTealPreview,
  'lesley': LesleyPreview,
  'kelly': KellyPreview,
  'richard': RichardPreview,
};

export function TemplatePreview({ templateId, data, scale = 1 }: TemplatePreviewProps) {
  const PreviewComponent = previewComponents[templateId] || DefaultPreview;

  return (
    <div 
      className="bg-white shadow-lg origin-top-left"
      style={{ 
        transform: `scale(${scale})`,
        width: '210mm',
        minHeight: '297mm',
      }}
    >
      <PreviewComponent data={data} />
    </div>
  );
}

function DefaultPreview({ data }: { data: CVData }) {
  return (
    <div className="p-8 font-sans">
      <div className="border-b-4 border-blue-600 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <p className="text-xl text-blue-600 mt-1">
          {data.personalInfo.professionalTitle}
        </p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {data.workExperiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Work Experience
          </h2>
          <div className="space-y-4">
            {data.workExperiences.map((exp) => (
              <div key={exp.id}>
                <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                <p className="text-gray-600">
                  {exp.company} {exp.location && `| ${exp.location}`}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                </p>
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <h3 className="font-bold text-gray-900">
                  {edu.degree} in {edu.fieldOfStudy}
                </h3>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.graduationDate}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export {
  KathleenPreview,
  LaurenOrangePreview,
  GraceNavyPreview,
  GraceTealPreview,
  LesleyPreview,
  KellyPreview,
  RichardPreview,
  CharlesPreview,
  GraceMinimalPreview,
};

export default TemplatePreview;
