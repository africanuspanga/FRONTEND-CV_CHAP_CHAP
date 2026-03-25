import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 6,
    height: '100%',
    backgroundColor: primaryColor,
  },
  mainArea: {
    marginLeft: 6,
    padding: 30,
  },
  nameHeader: {
    textAlign: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 18,
  },
  name: {
    fontSize: 26,
    fontWeight: 'normal',
    color: '#1F2937',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: primaryColor,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
  },
  leftCol: {
    flex: 3,
  },
  rightCol: {
    flex: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
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
    fontSize: 8,
    color: '#6B7280',
  },
  expCompany: {
    fontSize: 10,
    color: primaryColor,
    marginBottom: 4,
  },
  bullet: {
    fontSize: 9,
    color: '#4B5563',
    marginBottom: 3,
    lineHeight: 1.5,
  },
  contactItem: {
    fontSize: 9,
    color: '#4B5563',
    marginBottom: 5,
  },
  skillText: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 4,
  },
  eduItem: {
    marginBottom: 8,
  },
  eduDegree: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  eduSchool: {
    fontSize: 8,
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

export function ProfessionalSidebarPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#6B7B8C';
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
        <View fixed style={styles.accentBar} />
        <View style={styles.mainArea}>
          <View style={styles.nameHeader}>
            <Text style={styles.name}>
              {personalInfo?.firstName} {personalInfo?.lastName}
            </Text>
            {personalInfo?.professionalTitle && (
              <Text style={styles.title}>{personalInfo.professionalTitle}</Text>
            )}
          </View>

          <View style={styles.twoColumn}>
            <View style={styles.leftCol}>
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
                      {exp.achievements?.map((a: string, j: number) => (
                        <Text key={j} style={styles.bullet}>• {a}</Text>
                      ))}
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

            <View style={styles.rightCol}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact</Text>
                {personalInfo?.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
                {personalInfo?.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
                {personalInfo?.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
                {personalInfo?.linkedin && <Text style={styles.contactItem}>{personalInfo.linkedin}</Text>}
                {personalInfo?.website && <Text style={styles.contactItem}>{personalInfo.website}</Text>}
              </View>

              {skills?.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Skills</Text>
                  {skills.slice(0, maxSkills).map((skill: any, i: number) => (
                    <Text key={i} style={styles.skillText}>• {skill.name}</Text>
                  ))}
                </View>
              )}

              {education?.length > 0 && (
                <View style={styles.section}>
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

              {certifications?.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Certifications</Text>
                  {certifications.slice(0, 4).map((cert: any, i: number) => (
                    <View key={i} style={{ marginBottom: 4 }}>
                      <Text style={styles.skillText}>{cert.name}</Text>
                      {cert.issuer && <Text style={styles.refDetails}>{cert.issuer}</Text>}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default ProfessionalSidebarPDF;
