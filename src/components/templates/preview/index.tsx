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
import { GraceMintPreview } from './grace-mint';
import { GraceCoralPreview } from './grace-coral';
import { NellyMintPreview } from './nelly-mint';
import { NellyGrayPreview } from './nelly-gray';
import { NellySidebarPreview } from './nelly-sidebar';
import { LaurenIconsPreview } from './lauren-icons';
import { OliverPreview } from './oliver';
import { ThomasPreview } from './thomas';
import { DenicePreview } from './denice';
import { NellyPurplePreview } from './nelly-purple';
import { AparnaDarkPreview } from './aparna-dark';
import { AparnaGoldPreview } from './aparna-gold';
import { ClassicElegantPreview } from './classic-elegant';
import { TealAccentPreview } from './teal-accent';
import { ProfessionalSidebarPreview } from './professional-sidebar';
import { CenteredTraditionalPreview } from './centered-traditional';
import { ModernHeaderPreview } from './modern-header';
import { CreativeYellowPreview } from './creative-yellow';
import { DiamondMonogramPreview } from './diamond-monogram';
import { TimelineGrayPreview } from './timeline-gray';
import { HexagonBluePreview } from './hexagon-blue';

export interface TemplatePreviewProps {
  templateId: string;
  data: CVData;
  scale?: number;
  colorOverride?: string | null;
}

type TemplateComponent = React.FC<{ data: CVData; colorOverride?: string | null }>;

const templateComponents: Record<string, TemplateComponent> = {
  'kathleen': KathleenPreview,
  'grace-minimal': GraceMinimalPreview,
  'charles': CharlesPreview,
  'lauren-orange': LaurenOrangePreview,
  'grace-navy': GraceNavyPreview,
  'grace-teal': GraceTealPreview,
  'lesley': LesleyPreview,
  'kelly': KellyPreview,
  'richard': RichardPreview,
  'grace-mint': GraceMintPreview,
  'grace-coral': GraceCoralPreview,
  'nelly-mint': NellyMintPreview,
  'nelly-gray': NellyGrayPreview,
  'nelly-sidebar': NellySidebarPreview,
  'lauren-icons': LaurenIconsPreview,
  'oliver': OliverPreview,
  'thomas': ThomasPreview,
  'denice': DenicePreview,
  'nelly-purple': NellyPurplePreview,
  'aparna-dark': AparnaDarkPreview,
  'aparna-gold': AparnaGoldPreview,
  'classic-elegant': ClassicElegantPreview,
  'teal-accent': TealAccentPreview,
  'professional-sidebar': ProfessionalSidebarPreview,
  'centered-traditional': CenteredTraditionalPreview,
  'modern-header': ModernHeaderPreview,
  'creative-yellow': CreativeYellowPreview,
  'diamond-monogram': DiamondMonogramPreview,
  'timeline-gray': TimelineGrayPreview,
  'hexagon-blue': HexagonBluePreview,
};

export function TemplatePreview({ templateId, data, scale = 1, colorOverride }: TemplatePreviewProps) {
  const Template = templateComponents[templateId] || DefaultPreview;

  return (
    <div 
      className="bg-white shadow-lg origin-top-left"
      style={{ 
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        width: '794px',
        minHeight: '1123px',
      }}
    >
      <Template data={data} colorOverride={colorOverride} />
    </div>
  );
}

function DefaultPreview({ data, colorOverride }: { data: CVData; colorOverride?: string | null }) {
  const primaryColor = colorOverride || '#0891B2';
  
  return (
    <div className="p-8 font-sans">
      <div className="border-b-4 pb-4 mb-6" style={{ borderColor: primaryColor }}>
        <h1 className="text-3xl font-bold text-gray-900">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <p className="text-xl mt-1" style={{ color: primaryColor }}>
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
                    {exp.achievements.slice(0, 3).map((achievement, idx) => (
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
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
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
                className="px-3 py-1 rounded-full text-sm text-white"
                style={{ backgroundColor: primaryColor }}
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
  GraceMintPreview,
  GraceCoralPreview,
  NellyMintPreview,
  NellyGrayPreview,
  NellySidebarPreview,
  LaurenIconsPreview,
  OliverPreview,
  ThomasPreview,
  DenicePreview,
  NellyPurplePreview,
  AparnaDarkPreview,
  AparnaGoldPreview,
  ClassicElegantPreview,
  TealAccentPreview,
  ProfessionalSidebarPreview,
  CenteredTraditionalPreview,
  ModernHeaderPreview,
  CreativeYellowPreview,
  DiamondMonogramPreview,
  TimelineGrayPreview,
  HexagonBluePreview,
};

export default TemplatePreview;
