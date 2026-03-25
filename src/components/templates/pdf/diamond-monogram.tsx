import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    padding: 35,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  diamondOuter: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    transform: 'rotate(45deg)',
    borderWidth: 2,
    borderColor: primaryColor,
  },
  diamondInner: {
    transform: 'rotate(-45deg)',
  },
  initialsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: primaryColor,
    textAlign: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
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
  sectionRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  sectionLabel: {
    width: 80,
    paddingTop: 2,
    paddingRight: 10,
  },
  sectionLabelText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionContent: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 6,
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
  langItem: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 3,
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

export function DiamondMonogramPDF({ data, colorOverride }: Props) {
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

  const initials = `${personalInfo?.firstName?.[0] || ''}${personalInfo?.lastName?.[0] || ''}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.diamondOuter}>
            <View style={styles.diamondInner}>
              <Text style={styles.initialsText}>{initials}</Text>
            </View>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>
              {personalInfo?.firstName} {personalInfo?.lastName}
            </Text>
            <View style={styles.contactRow}>
              {personalInfo?.professionalTitle && (
                <Text style={styles.contactText}>{personalInfo.professionalTitle}</Text>
              )}
              {personalInfo?.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
              {personalInfo?.phone && <Text style={styles.contactText}>{personalInfo.phone}</Text>}
              {personalInfo?.location && <Text style={styles.contactText}>{personalInfo.location}</Text>}
            </View>
          </View>
        </View>

        {summary && (
          <View style={styles.sectionRow}>
            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>Profile</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          </View>
        )}

        {skills?.length > 0 && (
          <View style={styles.sectionRow}>
            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>Skills</Text>
            </View>
            <View style={styles.sectionContent}>
              <View style={styles.skillsGrid}>
                {skills.slice(0, maxSkills).map((skill: any, i: number) => (
                  <View key={i} style={styles.skillCol}>
                    <Text style={styles.skillText}>• {skill.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {workExperiences?.length > 0 && (
          <View style={styles.sectionRow}>
            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>Experience</Text>
            </View>
            <View style={styles.sectionContent}>
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
                  {exp.achievements?.map((a: string, j: number) => (
                    <Text key={j} style={styles.bullet}>• {a}</Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        )}

        {education?.length > 0 && (
          <View style={styles.sectionRow}>
            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>Education</Text>
            </View>
            <View style={styles.sectionContent}>
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
          </View>
        )}

        {languages?.length > 0 && (
          <View style={styles.sectionRow}>
            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>Languages</Text>
            </View>
            <View style={styles.sectionContent}>
              {languages.map((lang: any, i: number) => (
                <Text key={i} style={styles.langItem}>{lang.name} — {lang.proficiency}</Text>
              ))}
            </View>
          </View>
        )}

        {references?.length > 0 && (
          <View style={styles.sectionRow}>
            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>References</Text>
            </View>
            <View style={styles.sectionContent}>
              {references.slice(0, 2).map((ref: any, i: number) => (
                <View key={i} style={styles.refItem}>
                  <Text style={styles.refName}>{ref.name}</Text>
                  <Text style={styles.refDetails}>{ref.title || ref.position} at {ref.company}</Text>
                  {ref.email && <Text style={styles.refDetails}>{ref.email}</Text>}
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

export default DiamondMonogramPDF;
