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
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarSection: {
    marginBottom: 18,
  },
  sidebarTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
  },
  contactText: {
    fontSize: 9,
    marginBottom: 5,
    opacity: 0.95,
  },
  skillRow: {
    marginBottom: 8,
  },
  skillName: {
    fontSize: 9,
    marginBottom: 3,
  },
  skillBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  skillBarFill: {
    height: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  eduItem: {
    marginBottom: 12,
  },
  eduDegree: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  eduField: {
    fontSize: 9,
    opacity: 0.9,
  },
  eduSchool: {
    fontSize: 9,
    opacity: 0.85,
  },
  eduDate: {
    fontSize: 8,
    opacity: 0.7,
    marginTop: 2,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 3,
  },
  title: {
    fontSize: 12,
    color: primaryColor,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
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
    marginBottom: 15,
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
    marginBottom: 6,
  },
  bullet: {
    fontSize: 9,
    color: '#4B5563',
    marginBottom: 4,
    lineHeight: 1.5,
  },
  langItem: {
    marginBottom: 6,
  },
  langName: {
    fontSize: 9,
    marginBottom: 2,
  },
  langLevel: {
    fontSize: 8,
    opacity: 0.7,
  },
  certItem: {
    marginBottom: 8,
  },
  certName: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  certIssuer: {
    fontSize: 8,
    opacity: 0.85,
  },
  refItem: {
    marginBottom: 10,
  },
  refName: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  refDetails: {
    fontSize: 8,
    opacity: 0.9,
  },
});

interface Props {
  data: any;
  colorOverride?: string | null;
}

export function CharlesPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#0891B2';
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

  const getSkillWidth = (level: string) => {
    switch (level) {
      case 'expert': return '100%';
      case 'advanced': return '80%';
      case 'intermediate': return '60%';
      default: return '40%';
    }
  };

  const hasMinimalContent = 
    (!workExperiences || workExperiences.length <= 1) &&
    (!education || education.length <= 1);

  const maxBullets = hasMinimalContent ? 6 : 4;
  const maxSkills = hasMinimalContent ? 10 : 6;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <View style={styles.photoContainer}>
            {personalInfo?.photoUrl ? (
              <Image src={personalInfo.photoUrl} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={{ fontSize: 10, textAlign: 'center', opacity: 0.7 }}>Photo</Text>
              </View>
            )}
          </View>

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>CONTACT</Text>
            {personalInfo?.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
            {personalInfo?.phone && <Text style={styles.contactText}>{personalInfo.phone}</Text>}
            {personalInfo?.location && <Text style={styles.contactText}>{personalInfo.location}</Text>}
            {personalInfo?.linkedin && <Text style={styles.contactText}>{personalInfo.linkedin}</Text>}
            {personalInfo?.website && <Text style={styles.contactText}>{personalInfo.website}</Text>}
          </View>

          {skills?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>SKILLS</Text>
              {skills.slice(0, maxSkills).map((skill: any, i: number) => (
                <View key={i} style={styles.skillRow}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <View style={styles.skillBar}>
                    <View style={{ ...styles.skillBarFill, width: getSkillWidth(skill.level) as any }} />
                  </View>
                </View>
              ))}
            </View>
          )}

          {education?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>EDUCATION</Text>
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

          {languages?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>LANGUAGES</Text>
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
              <Text style={styles.sidebarTitle}>CERTIFICATIONS</Text>
              {certifications.slice(0, 4).map((cert: any, i: number) => (
                <View key={i} style={styles.certItem}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  {cert.issuer && <Text style={styles.certIssuer}>{cert.issuer}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.main}>
          <Text style={styles.name}>
            {personalInfo?.firstName?.toUpperCase()} {personalInfo?.lastName?.toUpperCase()}
          </Text>
          {personalInfo?.professionalTitle && <Text style={styles.title}>{personalInfo.professionalTitle}</Text>}

          {summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ABOUT ME</Text>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          )}

          {workExperiences?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
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

          {references?.length > 0 && hasMinimalContent && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>REFERENCES</Text>
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
      </Page>
    </Document>
  );
}

export default CharlesPDF;
