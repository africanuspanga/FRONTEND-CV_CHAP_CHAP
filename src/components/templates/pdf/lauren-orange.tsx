import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '35%',
    height: '100%',
    backgroundColor: primaryColor,
    padding: 24,
    paddingTop: 36,
  },
  main: {
    marginLeft: '35%',
    padding: 30,
    paddingTop: 36,
  },
  // Sidebar styles
  sidebarName: {
    fontSize: 26,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#ffffff',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  sidebarTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#ffffff',
    opacity: 0.85,
    letterSpacing: 1,
    marginBottom: 20,
  },
  sidebarSection: {
    marginBottom: 16,
  },
  sidebarSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.4)',
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  contactLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
    width: 24,
  },
  contactValue: {
    fontSize: 9,
    color: '#ffffff',
    opacity: 0.9,
    flex: 1,
  },
  sidebarText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#ffffff',
    opacity: 0.9,
  },
  sidebarEduItem: {
    marginBottom: 8,
  },
  sidebarEduTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sidebarEduSchool: {
    fontSize: 9,
    color: '#ffffff',
    opacity: 0.85,
  },
  sidebarEduDetails: {
    fontSize: 8,
    color: '#ffffff',
    opacity: 0.7,
  },
  sidebarLangItem: {
    fontSize: 9,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 3,
  },
  // Main area styles
  mainSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: primaryColor,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: primaryColor,
  },
  section: {
    marginBottom: 16,
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
    color: '#4B5563',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 9,
    color: '#4B5563',
    marginBottom: 2,
    paddingLeft: 8,
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
  certItem: {
    marginBottom: 6,
  },
  certName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  certDetails: {
    fontSize: 8,
    color: '#6B7280',
  },
  refGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  refItem: {
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

export function LaurenOrangePDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#E07A38';
  const styles = createStyles(primaryColor);

  const { personalInfo, summary, workExperiences, education, skills, languages, certifications, references } = data || {};

  // Dynamic content balancing
  const totalExperiences = workExperiences?.length || 0;
  const totalEducation = education?.length || 0;
  const totalAchievements = workExperiences?.reduce((acc: number, exp: any) => acc + (exp.achievements?.length || 0), 0) || 0;
  const hasMinimalContent = (totalExperiences + totalEducation) <= 3 || totalAchievements < 8;
  const maxBullets = hasMinimalContent ? 5 : 4;
  const maxSkills = 10;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View fixed style={styles.sidebar}>
          {/* Name */}
          <Text style={styles.sidebarName}>{personalInfo?.firstName}</Text>
          <Text style={styles.sidebarName}>{personalInfo?.lastName}</Text>
          {personalInfo?.title && (
            <Text style={styles.sidebarTitle}>{personalInfo.title}</Text>
          )}

          {/* Contact */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Contact</Text>
            {personalInfo?.phone && (
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>[P]</Text>
                <Text style={styles.contactValue}>{personalInfo.phone}</Text>
              </View>
            )}
            {personalInfo?.email && (
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>[E]</Text>
                <Text style={styles.contactValue}>{personalInfo.email}</Text>
              </View>
            )}
            {personalInfo?.location && (
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>[A]</Text>
                <Text style={styles.contactValue}>{personalInfo.location}</Text>
              </View>
            )}
          </View>

          {/* Summary */}
          {summary && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Profile</Text>
              <Text style={styles.sidebarText}>{summary}</Text>
            </View>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Education</Text>
              {education.map((edu: any, i: number) => (
                <View key={i} style={styles.sidebarEduItem}>
                  <Text style={styles.sidebarEduTitle}>
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </Text>
                  <Text style={styles.sidebarEduSchool}>{edu.institution}</Text>
                  <Text style={styles.sidebarEduDetails}>
                    {edu.location} {edu.graduationDate ? `• ${edu.graduationDate}` : ''}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Languages */}
          {languages?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Languages</Text>
              {languages.map((lang: any, i: number) => (
                <Text key={i} style={styles.sidebarLangItem}>
                  {lang.name} — {lang.proficiency}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          {/* Professional Experience */}
          {workExperiences?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.mainSectionTitle}>Professional Experience</Text>
              {workExperiences.map((exp: any, i: number) => (
                <View key={i} style={styles.expItem}>
                  <View style={styles.expHeader}>
                    <Text style={styles.expTitle}>{exp.jobTitle}</Text>
                    <Text style={styles.expDate}>
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  <Text style={styles.expCompany}>
                    {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                  </Text>
                  {exp.achievements?.map((a: string, j: number) => (
                    <Text key={j} style={styles.bullet}>• {a}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Skills */}
          {skills?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.mainSectionTitle}>Skills</Text>
              <View style={styles.skillsGrid}>
                {skills.slice(0, maxSkills).map((skill: any, i: number) => (
                  <Text key={i} style={styles.skillItem}>• {skill.name}</Text>
                ))}
              </View>
            </View>
          )}

          {/* Certifications */}
          {certifications?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.mainSectionTitle}>Certifications</Text>
              {certifications.map((cert: any, i: number) => (
                <View key={i} style={styles.certItem}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certDetails}>
                    {cert.issuer}{cert.date ? ` • ${cert.date}` : ''}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* References */}
          {references?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.mainSectionTitle}>References</Text>
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
        </View>
      </Page>
    </Document>
  );
}

export default LaurenOrangePDF;
