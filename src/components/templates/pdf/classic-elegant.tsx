import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'light',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  contactText: {
    fontSize: 9,
    color: '#4B5563',
  },
  contactDot: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: primaryColor,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: primaryColor,
  },
  summaryText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#374151',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    width: '50%',
    fontSize: 9,
    color: '#374151',
    marginBottom: 3,
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
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  expDate: {
    fontSize: 8,
    color: '#6B7280',
  },
  expCompany: {
    fontSize: 9,
    color: '#4B5563',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 8,
    color: '#4B5563',
    marginBottom: 2,
    paddingLeft: 10,
  },
  eduItem: {
    marginBottom: 8,
  },
  eduTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  eduDetails: {
    fontSize: 9,
    color: '#4B5563',
  },
  langItem: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 2,
  },
  refGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  refItem: {
    flex: 1,
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

export function ClassicElegantPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#1F2937';
  const styles = createStyles(primaryColor);

  const { personalInfo, summary, workExperiences, education, skills, languages, references } = data || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo?.firstName}</Text>
          <Text style={styles.name}>{personalInfo?.lastName}</Text>
          <View style={styles.contactRow}>
            {personalInfo?.phone && <Text style={styles.contactText}>{personalInfo.phone}</Text>}
            {personalInfo?.phone && personalInfo?.email && <Text style={styles.contactDot}>•</Text>}
            {personalInfo?.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
            {personalInfo?.email && personalInfo?.location && <Text style={styles.contactDot}>•</Text>}
            {personalInfo?.location && <Text style={styles.contactText}>{personalInfo.location}</Text>}
          </View>
        </View>

        {/* Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsGrid}>
              {skills.slice(0, 10).map((skill: any, i: number) => (
                <Text key={i} style={styles.skillItem}>• {skill.name}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Experience */}
        {workExperiences?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {workExperiences.map((exp: any, i: number) => (
              <View key={i} style={styles.expItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.expTitle}>{exp.jobTitle}</Text>
                </View>
                <Text style={styles.expCompany}>
                  {exp.company} | {exp.location} | {exp.startDate} - {exp.isCurrent ? 'Current' : exp.endDate}
                </Text>
                {exp.achievements?.slice(0, 4).map((a: string, j: number) => (
                  <Text key={j} style={styles.bullet}>• {a}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education and Training</Text>
            {education.map((edu: any, i: number) => (
              <View key={i} style={styles.eduItem}>
                <Text style={styles.eduTitle}>
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </Text>
                <Text style={styles.eduDetails}>
                  {edu.institution} | {edu.location} | {edu.graduationDate}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {languages.map((lang: any, i: number) => (
              <Text key={i} style={styles.langItem}>{lang.name}: {lang.proficiency}</Text>
            ))}
          </View>
        )}

        {/* References */}
        {references?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>References</Text>
            <View style={styles.refGrid}>
              {references.slice(0, 2).map((ref: any, i: number) => (
                <View key={i} style={styles.refItem}>
                  <Text style={styles.refName}>{ref.name}</Text>
                  <Text style={styles.refDetails}>{ref.position || ref.title} at {ref.company}</Text>
                  {ref.phone && <Text style={styles.refDetails}>{ref.phone}</Text>}
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

export default ClassicElegantPDF;
