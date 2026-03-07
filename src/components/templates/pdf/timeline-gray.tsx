import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  headerArea: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 20,
    paddingHorizontal: 35,
    textAlign: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    color: primaryColor,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  contactText: {
    fontSize: 9,
    color: '#6B7280',
  },
  body: {
    paddingHorizontal: 35,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: primaryColor,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillCol: {
    width: '50%',
    marginBottom: 4,
  },
  skillText: {
    fontSize: 9,
    color: '#374151',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timelineDateCol: {
    width: 80,
    paddingRight: 8,
    alignItems: 'flex-end',
  },
  timelineDateText: {
    fontSize: 8,
    color: '#6B7280',
    textAlign: 'right',
  },
  timelineBorder: {
    width: 1,
    backgroundColor: '#D1D5DB',
    marginRight: 10,
  },
  timelineContent: {
    flex: 1,
  },
  expTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  expCompany: {
    fontSize: 10,
    color: primaryColor,
    marginBottom: 4,
  },
  bullet: {
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 3,
    lineHeight: 1.5,
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
  langItem: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 3,
  },
  refItem: {
    marginBottom: 8,
  },
  refName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  refDetails: {
    fontSize: 8,
    color: '#6B7280',
  },
});

interface Props {
  data: any;
  colorOverride?: string | null;
}

export function TimelineGrayPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#6B7280';
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
        <View style={styles.headerArea}>
          <Text style={styles.name}>
            {personalInfo?.firstName} {personalInfo?.lastName}
          </Text>
          {personalInfo?.professionalTitle && (
            <Text style={styles.title}>{personalInfo.professionalTitle}</Text>
          )}
          <View style={styles.contactRow}>
            {personalInfo?.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
            {personalInfo?.phone && <Text style={styles.contactText}>{personalInfo.phone}</Text>}
            {personalInfo?.location && <Text style={styles.contactText}>{personalInfo.location}</Text>}
          </View>
        </View>

        <View style={styles.body}>
          {summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile</Text>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          )}

          {skills?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsGrid}>
                {skills.slice(0, maxSkills).map((skill: any, i: number) => (
                  <View key={i} style={styles.skillCol}>
                    <Text style={styles.skillText}>• {skill.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {workExperiences?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {workExperiences.map((exp: any, i: number) => (
                <View key={i} style={styles.timelineItem}>
                  <View style={styles.timelineDateCol}>
                    <Text style={styles.timelineDateText}>{exp.startDate}</Text>
                    <Text style={styles.timelineDateText}>-</Text>
                    <Text style={styles.timelineDateText}>
                      {exp.isCurrent ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  <View style={styles.timelineBorder} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.expTitle}>{exp.jobTitle}</Text>
                    <Text style={styles.expCompany}>
                      {exp.company}{exp.location ? ` • ${exp.location}` : ''}
                    </Text>
                    {exp.achievements?.slice(0, maxBullets).map((a: string, j: number) => (
                      <Text key={j} style={styles.bullet}>• {a}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {education?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {education.map((edu: any, i: number) => (
                <View key={i} style={styles.timelineItem}>
                  <View style={styles.timelineDateCol}>
                    <Text style={styles.timelineDateText}>{edu.graduationDate}</Text>
                  </View>
                  <View style={styles.timelineBorder} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.eduDegree}>
                      {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                    </Text>
                    <Text style={styles.eduSchool}>{edu.institution}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {languages?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              {languages.map((lang: any, i: number) => (
                <Text key={i} style={styles.langItem}>{lang.name} — {lang.proficiency}</Text>
              ))}
            </View>
          )}

          {references?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>References</Text>
              {references.slice(0, 2).map((ref: any, i: number) => (
                <View key={i} style={styles.refItem}>
                  <Text style={styles.refName}>{ref.name}</Text>
                  <Text style={styles.refDetails}>{ref.title || ref.position} at {ref.company}</Text>
                  {ref.email && <Text style={styles.refDetails}>{ref.email}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

export default TimelineGrayPDF;
