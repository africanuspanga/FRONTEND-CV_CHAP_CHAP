import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
    padding: 40,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'normal',
    color: primaryColor,
    letterSpacing: 2,
    marginBottom: 6,
  },
  headerLine: {
    height: 1,
    backgroundColor: primaryColor,
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  contactText: {
    fontSize: 9,
    color: '#6B7280',
    marginHorizontal: 6,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  sectionTitleText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: primaryColor,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginHorizontal: 12,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
    textAlign: 'center',
  },
  expItem: {
    marginBottom: 14,
    textAlign: 'center',
  },
  expTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  expCompany: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 2,
  },
  expDate: {
    fontSize: 9,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 3,
    lineHeight: 1.5,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 24,
  },
  column: {
    flex: 1,
  },
  eduItem: {
    marginBottom: 8,
  },
  eduDegree: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  eduSchool: {
    fontSize: 9,
    color: '#6B7280',
  },
  eduDate: {
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 1,
  },
  skillsText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.6,
  },
  langText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.6,
  },
  refItem: {
    marginBottom: 8,
  },
  refName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  refDetails: {
    fontSize: 9,
    color: '#6B7280',
  },
});

interface Props {
  data: any;
  colorOverride?: string | null;
}

export function RichardPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#111827';
  const styles = createStyles(primaryColor);

  const {
    personalInfo,
    summary,
    workExperiences,
    education,
    skills,
    languages,
    certifications,
    references,
  } = data || {};

  const totalExperiences = workExperiences?.length || 0;
  const totalEducation = education?.length || 0;
  const totalAchievements = workExperiences?.reduce((acc: number, exp: any) => acc + (exp.achievements?.length || 0), 0) || 0;
  const hasMinimalContent = (totalExperiences + totalEducation) <= 3 || totalAchievements < 8;
  const maxBullets = hasMinimalContent ? 5 : 4;
  const maxSkills = 10;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo?.firstName} {personalInfo?.lastName}
          </Text>
          <View style={styles.headerLine} />
          {personalInfo?.professionalTitle && (
            <Text style={styles.title}>{personalInfo.professionalTitle}</Text>
          )}
          <View style={styles.contactRow}>
            {personalInfo?.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
            {personalInfo?.phone && <Text style={styles.contactText}>|</Text>}
            {personalInfo?.phone && <Text style={styles.contactText}>{personalInfo.phone}</Text>}
            {personalInfo?.location && <Text style={styles.contactText}>|</Text>}
            {personalInfo?.location && <Text style={styles.contactText}>{personalInfo.location}</Text>}
          </View>
        </View>

        {summary && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitleText}>Profile</Text>
              <View style={styles.sectionLine} />
            </View>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {workExperiences?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitleText}>Experience</Text>
              <View style={styles.sectionLine} />
            </View>
            {workExperiences.map((exp: any, i: number) => (
              <View key={i} style={styles.expItem}>
                <Text style={styles.expTitle}>{exp.jobTitle}</Text>
                <Text style={styles.expCompany}>
                  {exp.company}{exp.location ? ` — ${exp.location}` : ''}
                </Text>
                <Text style={styles.expDate}>
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                </Text>
                {exp.achievements?.map((a: string, j: number) => (
                  <Text key={j} style={styles.bullet}>• {a}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        <View style={styles.twoColumn}>
          {education?.length > 0 && (
            <View style={styles.column}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionLine} />
                <Text style={styles.sectionTitleText}>Education</Text>
                <View style={styles.sectionLine} />
              </View>
              {education.map((edu: any, i: number) => (
                <View key={i} style={styles.eduItem}>
                  <Text style={styles.eduDegree}>
                    {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                  </Text>
                  <Text style={styles.eduSchool}>{edu.institution}</Text>
                  <Text style={styles.eduDate}>{edu.graduationDate}</Text>
                </View>
              ))}
            </View>
          )}

          {skills?.length > 0 && (
            <View style={styles.column}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionLine} />
                <Text style={styles.sectionTitleText}>Skills</Text>
                <View style={styles.sectionLine} />
              </View>
              <Text style={styles.skillsText}>
                {skills.slice(0, maxSkills).map((s: any) => s.name).join(' · ')}
              </Text>
            </View>
          )}
        </View>

        {languages?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitleText}>Languages</Text>
              <View style={styles.sectionLine} />
            </View>
            <Text style={styles.langText}>
              {languages.map((l: any) => `${l.name} (${l.proficiency})`).join(' · ')}
            </Text>
          </View>
        )}

        {references?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitleText}>References</Text>
              <View style={styles.sectionLine} />
            </View>
            {references.slice(0, 2).map((ref: any, i: number) => (
              <View key={i} style={styles.refItem}>
                <Text style={styles.refName}>{ref.name}</Text>
                <Text style={styles.refDetails}>{ref.title || ref.position} at {ref.company}</Text>
                {ref.email && <Text style={styles.refDetails}>{ref.email}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

export default RichardPDF;
