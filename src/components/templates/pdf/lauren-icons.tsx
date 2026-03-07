import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  // Header
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  contactCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactCircleText: {
    fontSize: 7,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  contactText: {
    fontSize: 9,
    color: '#4B5563',
  },
  // Sections
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#1F2937',
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: primaryColor,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#4B5563',
  },
  // Experience - side by side
  expItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  expLeft: {
    width: '30%',
    paddingRight: 10,
  },
  expRight: {
    width: '70%',
  },
  expCompany: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  expLocation: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 1,
  },
  expDate: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 2,
  },
  expTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 3,
  },
  bullet: {
    fontSize: 9,
    color: '#4B5563',
    marginBottom: 2,
    paddingLeft: 8,
  },
  // Education
  eduItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eduLeft: {
    flex: 1,
  },
  eduTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  eduSchool: {
    fontSize: 9,
    color: '#4B5563',
  },
  eduDate: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'right',
  },
  // Skills
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  skillDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: primaryColor,
  },
  skillText: {
    fontSize: 9,
    color: '#374151',
  },
  // Languages
  langsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  langDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: primaryColor,
  },
  langText: {
    fontSize: 9,
    color: '#374151',
  },
  // Certifications
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
  // References
  refGrid: {
    flexDirection: 'row',
    gap: 16,
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

export function LaurenIconsPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#374151';
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo?.firstName} {personalInfo?.lastName}
          </Text>
          {personalInfo?.title && (
            <Text style={styles.title}>{personalInfo.title}</Text>
          )}
          <View style={styles.contactRow}>
            {personalInfo?.phone && (
              <View style={styles.contactItem}>
                <View style={styles.contactCircle}>
                  <Text style={styles.contactCircleText}>P</Text>
                </View>
                <Text style={styles.contactText}>{personalInfo.phone}</Text>
              </View>
            )}
            {personalInfo?.email && (
              <View style={styles.contactItem}>
                <View style={styles.contactCircle}>
                  <Text style={styles.contactCircleText}>E</Text>
                </View>
                <Text style={styles.contactText}>{personalInfo.email}</Text>
              </View>
            )}
            {personalInfo?.location && (
              <View style={styles.contactItem}>
                <View style={styles.contactCircle}>
                  <Text style={styles.contactCircleText}>A</Text>
                </View>
                <Text style={styles.contactText}>{personalInfo.location}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {/* Experience */}
        {workExperiences?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {workExperiences.map((exp: any, i: number) => (
              <View key={i} style={styles.expItem}>
                <View style={styles.expLeft}>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                  {exp.location && (
                    <Text style={styles.expLocation}>{exp.location}</Text>
                  )}
                  <Text style={styles.expDate}>
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <View style={styles.expRight}>
                  <Text style={styles.expTitle}>{exp.jobTitle}</Text>
                  {exp.achievements?.slice(0, maxBullets).map((a: string, j: number) => (
                    <Text key={j} style={styles.bullet}>• {a}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu: any, i: number) => (
              <View key={i} style={styles.eduItem}>
                <View style={styles.eduLeft}>
                  <Text style={styles.eduTitle}>
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </Text>
                  <Text style={styles.eduSchool}>
                    {edu.institution}{edu.location ? ` | ${edu.location}` : ''}
                  </Text>
                </View>
                {edu.graduationDate && (
                  <Text style={styles.eduDate}>{edu.graduationDate}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsWrap}>
              {skills.slice(0, maxSkills).map((skill: any, i: number) => (
                <View key={i} style={styles.skillItem}>
                  <View style={styles.skillDot} />
                  <Text style={styles.skillText}>{skill.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.langsWrap}>
              {languages.map((lang: any, i: number) => (
                <View key={i} style={styles.langItem}>
                  <View style={styles.langDot} />
                  <Text style={styles.langText}>{lang.name}: {lang.proficiency}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
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

export default LaurenIconsPDF;
