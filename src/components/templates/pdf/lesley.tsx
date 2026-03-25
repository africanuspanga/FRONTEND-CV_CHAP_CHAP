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
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 3,
  },
  title: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactText: {
    fontSize: 9,
    color: '#4B5563',
  },
  sectionRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  labelBar: {
    width: 90,
    backgroundColor: primaryColor,
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionContent: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: 'center',
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
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: primaryColor,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  tagText: {
    fontSize: 9,
    color: '#ffffff',
  },
  langTag: {
    backgroundColor: `${primaryColor}20`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  langTagText: {
    fontSize: 9,
    color: primaryColor,
  },
});

interface Props {
  data: any;
  colorOverride?: string | null;
}

export function LesleyPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#2B4764';
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
          {personalInfo?.professionalTitle && (
            <Text style={styles.title}>{personalInfo.professionalTitle}</Text>
          )}
          <View style={styles.contactRow}>
            {personalInfo?.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
            {personalInfo?.phone && <Text style={styles.contactText}>{personalInfo.phone}</Text>}
            {personalInfo?.location && <Text style={styles.contactText}>{personalInfo.location}</Text>}
          </View>
        </View>

        {summary && (
          <View style={styles.sectionRow}>
            <View style={styles.labelBar}>
              <Text style={styles.labelText}>Profile</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          </View>
        )}

        {workExperiences?.length > 0 && (
          <View style={styles.sectionRow}>
            <View style={styles.labelBar}>
              <Text style={styles.labelText}>Experience</Text>
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
            <View style={styles.labelBar}>
              <Text style={styles.labelText}>Education</Text>
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

        {skills?.length > 0 && (
          <View style={styles.sectionRow}>
            <View style={styles.labelBar}>
              <Text style={styles.labelText}>Skills</Text>
            </View>
            <View style={styles.sectionContent}>
              <View style={styles.tagsWrap}>
                {skills.slice(0, maxSkills).map((skill: any, i: number) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{skill.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {languages?.length > 0 && (
          <View style={styles.sectionRow}>
            <View style={styles.labelBar}>
              <Text style={styles.labelText}>Languages</Text>
            </View>
            <View style={styles.sectionContent}>
              <View style={styles.tagsWrap}>
                {languages.map((lang: any, i: number) => (
                  <View key={i} style={styles.langTag}>
                    <Text style={styles.langTagText}>{lang.name} ({lang.proficiency})</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

export default LesleyPDF;
