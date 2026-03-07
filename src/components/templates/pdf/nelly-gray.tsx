import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    padding: 35,
  },
  header: {
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  firstName: {
    fontSize: 26,
    fontWeight: 'normal',
    color: '#9CA3AF',
  },
  lastName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 6,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactText: {
    fontSize: 9,
    color: '#6B7280',
    marginRight: 4,
  },
  contactDot: {
    fontSize: 9,
    color: '#D1D5DB',
    marginRight: 4,
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
  expItem: {
    marginBottom: 12,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#D1D5DB',
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  expTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  expDate: {
    fontSize: 9,
    color: '#6B7280',
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
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
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
  skillText: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 4,
  },
  langItem: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 4,
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

export function NellyGrayPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#4B5563';
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

  const contactParts: string[] = [];
  if (personalInfo?.email) contactParts.push(personalInfo.email);
  if (personalInfo?.phone) contactParts.push(personalInfo.phone);
  if (personalInfo?.location) contactParts.push(personalInfo.location);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={styles.firstName}>{personalInfo?.firstName}</Text>
            <Text style={styles.lastName}>{personalInfo?.lastName}</Text>
          </View>
          <View style={styles.contactRow}>
            {contactParts.map((part, i) => (
              <View key={i} style={{ flexDirection: 'row' as any }}>
                {i > 0 && <Text style={styles.contactDot}>·</Text>}
                <Text style={styles.contactText}>{part}</Text>
              </View>
            ))}
          </View>
        </View>

        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {workExperiences?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {workExperiences.map((exp: any, i: number) => (
              <View key={i} style={styles.expItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.expTitle}>{exp.jobTitle}</Text>
                  <Text style={styles.expDate}>
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.expCompany}>
                  {exp.company}{exp.location ? ` • ${exp.location}` : ''}
                </Text>
                {exp.achievements?.slice(0, maxBullets).map((a: string, j: number) => (
                  <Text key={j} style={styles.bullet}>— {a}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        <View style={styles.twoColumn}>
          {education?.length > 0 && (
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Education</Text>
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
              <Text style={styles.sectionTitle}>Skills</Text>
              {skills.slice(0, maxSkills).map((skill: any, i: number) => (
                <Text key={i} style={styles.skillText}>• {skill.name}</Text>
              ))}
            </View>
          )}
        </View>

        {languages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {languages.map((lang: any, i: number) => (
              <Text key={i} style={styles.langItem}>— {lang.name} ({lang.proficiency})</Text>
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
      </Page>
    </Document>
  );
}

export default NellyGrayPDF;
