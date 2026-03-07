import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    padding: 35,
  },
  header: {
    textAlign: 'center',
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: primaryColor,
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
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
  sectionTitleWrap: {
    marginBottom: 8,
  },
  sectionLabel: {
    backgroundColor: primaryColor,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  sectionLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
  },
  expItem: {
    marginBottom: 12,
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

export function KellyPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#1F2937';
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
            {personalInfo?.phone && <Text style={styles.contactText}>|</Text>}
            {personalInfo?.phone && <Text style={styles.contactText}>{personalInfo.phone}</Text>}
            {personalInfo?.location && <Text style={styles.contactText}>|</Text>}
            {personalInfo?.location && <Text style={styles.contactText}>{personalInfo.location}</Text>}
          </View>
        </View>

        {summary && (
          <View style={styles.section}>
            <View style={styles.sectionTitleWrap}>
              <View style={styles.sectionLabel}>
                <Text style={styles.sectionLabelText}>Profile</Text>
              </View>
            </View>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {workExperiences?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleWrap}>
              <View style={styles.sectionLabel}>
                <Text style={styles.sectionLabelText}>Experience</Text>
              </View>
            </View>
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
                  <Text key={j} style={styles.bullet}>• {a}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        <View style={styles.twoColumn}>
          {education?.length > 0 && (
            <View style={styles.column}>
              <View style={styles.sectionTitleWrap}>
                <View style={styles.sectionLabel}>
                  <Text style={styles.sectionLabelText}>Education</Text>
                </View>
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
              <View style={styles.sectionTitleWrap}>
                <View style={styles.sectionLabel}>
                  <Text style={styles.sectionLabelText}>Skills</Text>
                </View>
              </View>
              {skills.slice(0, maxSkills).map((skill: any, i: number) => (
                <Text key={i} style={styles.skillText}>• {skill.name}</Text>
              ))}
            </View>
          )}
        </View>

        {languages?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleWrap}>
              <View style={styles.sectionLabel}>
                <Text style={styles.sectionLabelText}>Languages</Text>
              </View>
            </View>
            {languages.map((lang: any, i: number) => (
              <Text key={i} style={styles.langItem}>■ {lang.name} — {lang.proficiency}</Text>
            ))}
          </View>
        )}

        {references?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleWrap}>
              <View style={styles.sectionLabel}>
                <Text style={styles.sectionLabelText}>References</Text>
              </View>
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

export default KellyPDF;
