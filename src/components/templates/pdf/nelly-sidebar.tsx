import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  sidebar: {
    width: '35%',
    backgroundColor: primaryColor,
    padding: 20,
    paddingTop: 25,
    color: '#ffffff',
  },
  main: {
    width: '65%',
    padding: 25,
    paddingTop: 25,
    backgroundColor: '#ffffff',
  },
  sidebarName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 3,
  },
  sidebarTitle: {
    fontSize: 11,
    color: '#ffffff',
    opacity: 0.85,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 22,
  },
  sidebarSection: {
    marginBottom: 18,
  },
  sidebarSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  contactText: {
    fontSize: 9,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 5,
  },
  skillBullet: {
    fontSize: 9,
    color: '#ffffff',
    marginBottom: 5,
    opacity: 0.95,
  },
  langItem: {
    marginBottom: 6,
  },
  langName: {
    fontSize: 9,
    color: '#ffffff',
  },
  langLevel: {
    fontSize: 8,
    color: '#ffffff',
    opacity: 0.7,
  },
  certItem: {
    marginBottom: 8,
  },
  certName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  certIssuer: {
    fontSize: 8,
    color: '#ffffff',
    opacity: 0.8,
  },
  refItem: {
    marginBottom: 10,
  },
  refName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  refDetails: {
    fontSize: 8,
    color: '#ffffff',
    opacity: 0.85,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: primaryColor,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: primaryColor,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
  },
  expItem: {
    marginBottom: 14,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
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
    marginBottom: 2,
  },
  expLocation: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 5,
  },
  bullet: {
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 3,
    lineHeight: 1.5,
  },
  eduItem: {
    marginBottom: 12,
  },
  eduDegree: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  eduField: {
    fontSize: 9,
    color: '#4B5563',
  },
  eduSchool: {
    fontSize: 9,
    color: '#6B7280',
  },
  eduDate: {
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 2,
  },
});

interface Props {
  data: any;
  colorOverride?: string | null;
}

export function NellySidebarPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#374151';
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
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarName}>
            {personalInfo?.firstName?.toUpperCase()}
          </Text>
          <Text style={styles.sidebarName}>
            {personalInfo?.lastName?.toUpperCase()}
          </Text>
          {personalInfo?.professionalTitle && (
            <Text style={styles.sidebarTitle}>{personalInfo.professionalTitle}</Text>
          )}

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>CONTACT</Text>
            {personalInfo?.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
            {personalInfo?.phone && <Text style={styles.contactText}>{personalInfo.phone}</Text>}
            {personalInfo?.location && <Text style={styles.contactText}>{personalInfo.location}</Text>}
            {personalInfo?.linkedin && <Text style={styles.contactText}>{personalInfo.linkedin}</Text>}
            {personalInfo?.website && <Text style={styles.contactText}>{personalInfo.website}</Text>}
          </View>

          {skills?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>SKILLS</Text>
              {skills.slice(0, maxSkills).map((skill: any, i: number) => (
                <Text key={i} style={styles.skillBullet}>• {skill.name}</Text>
              ))}
            </View>
          )}

          {languages?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>LANGUAGES</Text>
              {languages.map((lang: any, i: number) => (
                <View key={i} style={styles.langItem}>
                  <Text style={styles.langName}>{lang.name}</Text>
                  <Text style={styles.langLevel}>{lang.proficiency}</Text>
                </View>
              ))}
            </View>
          )}

          {certifications?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>CERTIFICATIONS</Text>
              {certifications.slice(0, 4).map((cert: any, i: number) => (
                <View key={i} style={styles.certItem}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  {cert.issuer && <Text style={styles.certIssuer}>{cert.issuer}</Text>}
                </View>
              ))}
            </View>
          )}

          {references?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>REFERENCES</Text>
              {references.slice(0, 2).map((ref: any, i: number) => (
                <View key={i} style={styles.refItem}>
                  <Text style={styles.refName}>{ref.name}</Text>
                  <Text style={styles.refDetails}>{ref.position || ref.title} at {ref.company}</Text>
                  {ref.email && <Text style={styles.refDetails}>{ref.email}</Text>}
                  {ref.phone && <Text style={styles.refDetails}>{ref.phone}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main Area */}
        <View style={styles.main}>
          {summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PROFILE</Text>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          )}

          {workExperiences?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>EXPERIENCE</Text>
              {workExperiences.map((exp: any, i: number) => (
                <View key={i} style={styles.expItem}>
                  <View style={styles.expHeader}>
                    <Text style={styles.expTitle}>{exp.jobTitle}</Text>
                    <Text style={styles.expDate}>
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                  {exp.location && <Text style={styles.expLocation}>{exp.location}</Text>}
                  {exp.achievements?.slice(0, maxBullets).map((a: string, j: number) => (
                    <Text key={j} style={styles.bullet}>• {a}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {education?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>EDUCATION</Text>
              {education.map((edu: any, i: number) => (
                <View key={i} style={styles.eduItem}>
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  {edu.fieldOfStudy && <Text style={styles.eduField}>{edu.fieldOfStudy}</Text>}
                  <Text style={styles.eduSchool}>{edu.institution}</Text>
                  <Text style={styles.eduDate}>{edu.graduationDate}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

export default NellySidebarPDF;
