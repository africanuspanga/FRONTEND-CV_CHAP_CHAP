import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Polygon } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    padding: 30,
    gap: 20,
  },
  hexagonContainer: {
    width: 60,
    height: 70,
  },
  nameSection: {
    flex: 1,
  },
  firstName: {
    fontSize: 24,
    fontWeight: 'light',
    color: '#374151',
  },
  lastName: {
    fontSize: 24,
    fontWeight: 'light',
    color: '#374151',
  },
  contactSection: {
    textAlign: 'right',
  },
  contactText: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 2,
  },
  mainContent: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingBottom: 30,
    gap: 25,
  },
  leftColumn: {
    width: '38%',
  },
  rightColumn: {
    width: '62%',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'light',
    color: primaryColor,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#4B5563',
  },
  skillItem: {
    fontSize: 9,
    color: '#4B5563',
    marginBottom: 3,
  },
  eduItem: {
    marginBottom: 10,
  },
  eduTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  eduSchool: {
    fontSize: 9,
    color: '#4B5563',
  },
  eduDetails: {
    fontSize: 8,
    color: '#6B7280',
  },
  langItem: {
    marginBottom: 6,
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  langName: {
    fontSize: 9,
    color: '#374151',
  },
  langLevel: {
    fontSize: 8,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  langBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  langBarFill: {
    height: 4,
    backgroundColor: primaryColor,
    borderRadius: 2,
  },
  expItem: {
    marginBottom: 14,
  },
  expCompany: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  expMeta: {
    fontSize: 9,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 8,
    color: '#4B5563',
    marginBottom: 2,
    paddingLeft: 8,
  },
  refGrid: {
    flexDirection: 'row',
    gap: 15,
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

export function HexagonBluePDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#2563EB';
  const styles = createStyles(primaryColor);

  const { personalInfo, summary, workExperiences, education, skills, languages, references } = data || {};

  const initials = `${personalInfo?.firstName?.[0] || ''}${personalInfo?.lastName?.[0] || ''}`.toUpperCase();

  const getProficiencyWidth = (proficiency: string) => {
    const widths: Record<string, number> = {
      'native': 100,
      'fluent': 85,
      'conversational': 60,
      'basic': 35,
    };
    return widths[proficiency] || 50;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* Hexagon with initials */}
          <View style={styles.hexagonContainer}>
            <Svg width="60" height="70" viewBox="0 0 60 70">
              <Polygon
                points="30,0 60,17.5 60,52.5 30,70 0,52.5 0,17.5"
                stroke={primaryColor}
                strokeWidth="2"
                fill="none"
              />
            </Svg>
            <View style={{ position: 'absolute', top: 25, left: 0, right: 0, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: primaryColor }}>{initials}</Text>
            </View>
          </View>

          {/* Name */}
          <View style={styles.nameSection}>
            <Text style={styles.firstName}>{personalInfo?.firstName}</Text>
            <Text style={styles.lastName}>{personalInfo?.lastName}</Text>
          </View>

          {/* Contact */}
          <View style={styles.contactSection}>
            {personalInfo?.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
            {personalInfo?.phone && <Text style={styles.contactText}>{personalInfo.phone}</Text>}
            {personalInfo?.location && <Text style={styles.contactText}>{personalInfo.location}</Text>}
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
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
                {skills.slice(0, 10).map((skill: any, i: number) => (
                  <Text key={i} style={styles.skillItem}>• {skill.name}</Text>
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
                    <Text style={styles.eduSchool}>{edu.institution}</Text>
                    <Text style={styles.eduDetails}>{edu.location} • {edu.graduationDate}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Languages */}
            {languages?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                {languages.map((lang: any, i: number) => (
                  <View key={i} style={styles.langItem}>
                    <View style={styles.langRow}>
                      <Text style={styles.langName}>{lang.name}:</Text>
                      <Text style={styles.langLevel}>{lang.proficiency}</Text>
                    </View>
                    <View style={styles.langBar}>
                      <View style={[styles.langBarFill, { width: `${getProficiencyWidth(lang.proficiency)}%` }]} />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Experience */}
            {workExperiences?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {workExperiences.map((exp: any, i: number) => (
                  <View key={i} style={styles.expItem}>
                    <Text style={styles.expCompany}>{exp.company}</Text>
                    <Text style={styles.expMeta}>
                      {exp.jobTitle} | {exp.location} | {exp.startDate} to {exp.isCurrent ? 'Current' : exp.endDate}
                    </Text>
                    {exp.achievements?.slice(0, 4).map((a: string, j: number) => (
                      <Text key={j} style={styles.bullet}>• {a}</Text>
                    ))}
                  </View>
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
                      <Text style={styles.refDetails}>{ref.position || ref.title}</Text>
                      <Text style={styles.refDetails}>{ref.company}</Text>
                      {ref.email && <Text style={styles.refDetails}>{ref.email}</Text>}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default HexagonBluePDF;
