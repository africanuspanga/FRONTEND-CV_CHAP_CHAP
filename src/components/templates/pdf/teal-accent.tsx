import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    padding: 35,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'normal',
    color: primaryColor,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  contactText: {
    fontSize: 9,
    color: '#6B7280',
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
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: primaryColor,
    marginRight: 6,
  },
  skillText: {
    fontSize: 9,
    color: '#374151',
  },
  expItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  expDateCol: {
    width: 80,
    paddingRight: 10,
  },
  expDateText: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'right',
  },
  expContent: {
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
  eduItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  eduDateCol: {
    width: 80,
    paddingRight: 10,
  },
  eduDateText: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'right',
  },
  eduContent: {
    flex: 1,
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
    marginBottom: 4,
  },
  langName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  langProf: {
    fontSize: 8,
    color: '#6B7280',
  },
  refGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  refCol: {
    flex: 1,
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

export function TealAccentPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#3B9B9B';
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
          <View style={styles.contactRow}>
            {personalInfo?.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
            {personalInfo?.phone && <Text style={styles.contactText}>{personalInfo.phone}</Text>}
            {personalInfo?.location && <Text style={styles.contactText}>{personalInfo.location}</Text>}
          </View>
        </View>

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
                  <View style={styles.skillRow}>
                    <View style={styles.skillDot} />
                    <Text style={styles.skillText}>{skill.name}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {workExperiences?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {workExperiences.map((exp: any, i: number) => (
              <View key={i} style={styles.expItem}>
                <View style={styles.expDateCol}>
                  <Text style={styles.expDateText}>
                    {exp.startDate} -
                  </Text>
                  <Text style={styles.expDateText}>
                    {exp.isCurrent ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <View style={styles.expContent}>
                  <Text style={styles.expTitle}>{exp.jobTitle}</Text>
                  <Text style={styles.expCompany}>
                    {exp.company}{exp.location ? ` • ${exp.location}` : ''}
                  </Text>
                  {exp.achievements?.map((a: string, j: number) => (
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
              <View key={i} style={styles.eduItem}>
                <View style={styles.eduDateCol}>
                  <Text style={styles.eduDateText}>{edu.graduationDate}</Text>
                </View>
                <View style={styles.eduContent}>
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
              <View key={i} style={styles.langItem}>
                <Text style={styles.langName}>{lang.name}</Text>
                <Text style={styles.langProf}>{lang.proficiency}</Text>
              </View>
            ))}
          </View>
        )}

        {references?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>References</Text>
            <View style={styles.refGrid}>
              {references.slice(0, 2).map((ref: any, i: number) => (
                <View key={i} style={styles.refCol}>
                  <Text style={styles.refName}>{ref.name}</Text>
                  <Text style={styles.refDetails}>{ref.title || ref.position} at {ref.company}</Text>
                  {ref.email && <Text style={styles.refDetails}>{ref.email}</Text>}
                  {ref.phone && <Text style={styles.refDetails}>{ref.phone}</Text>}
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

export default TealAccentPDF;
