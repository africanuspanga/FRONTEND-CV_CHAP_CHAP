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
    color: '#ffffff',
  },
  main: {
    width: '65%',
    padding: 25,
    backgroundColor: '#ffffff',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  photo: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  photoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  sidebarSection: {
    marginBottom: 15,
  },
  sidebarTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
  },
  contactText: {
    fontSize: 8,
    marginBottom: 4,
    opacity: 0.9,
  },
  skillRow: {
    marginBottom: 6,
  },
  skillName: {
    fontSize: 8,
    marginBottom: 2,
  },
  skillBar: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  skillBarFill: {
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  eduItem: {
    marginBottom: 8,
  },
  eduDegree: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  eduSchool: {
    fontSize: 8,
    opacity: 0.9,
  },
  eduDate: {
    fontSize: 7,
    opacity: 0.7,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 2,
  },
  title: {
    fontSize: 11,
    color: primaryColor,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: primaryColor,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: primaryColor,
  },
  summaryText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#4B5563',
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
    color: primaryColor,
    marginBottom: 1,
  },
  expLocation: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 8,
    color: '#4B5563',
    marginBottom: 2,
    paddingLeft: 8,
  },
});

interface Props {
  data: any;
  colorOverride?: string | null;
}

export function CharlesPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#0891B2';
  const styles = createStyles(primaryColor);
  
  const { personalInfo, summary, workExperiences, education, skills, languages } = data || {};

  const getSkillWidth = (level: string) => {
    switch (level) {
      case 'expert': return '100%';
      case 'advanced': return '80%';
      case 'intermediate': return '60%';
      default: return '40%';
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* LEFT SIDEBAR */}
        <View style={styles.sidebar}>
          {/* Photo */}
          <View style={styles.photoContainer}>
            {personalInfo?.photoUrl ? (
              <Image src={personalInfo.photoUrl} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>Photo</Text>
              </View>
            )}
          </View>

          {/* Contact */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>CONTACT</Text>
            {personalInfo?.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
            {personalInfo?.phone && <Text style={styles.contactText}>{personalInfo.phone}</Text>}
            {personalInfo?.location && <Text style={styles.contactText}>{personalInfo.location}</Text>}
            {personalInfo?.linkedin && <Text style={styles.contactText}>{personalInfo.linkedin}</Text>}
          </View>

          {/* Skills */}
          {skills?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>SKILLS</Text>
              {skills.slice(0, 8).map((skill: any, i: number) => (
                <View key={i} style={styles.skillRow}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <View style={styles.skillBar}>
                    <View style={{ ...styles.skillBarFill, width: getSkillWidth(skill.level) as any }} />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>EDUCATION</Text>
              {education.map((edu: any, i: number) => (
                <View key={i} style={styles.eduItem}>
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  <Text style={styles.eduSchool}>{edu.institution}</Text>
                  <Text style={styles.eduDate}>{edu.graduationDate}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Languages */}
          {languages?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>LANGUAGES</Text>
              {languages.map((lang: any, i: number) => (
                <View key={i} style={{ marginBottom: 4 }}>
                  <Text style={styles.skillName}>{lang.name} - {lang.proficiency}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* RIGHT MAIN CONTENT */}
        <View style={styles.main}>
          {/* Name */}
          <Text style={styles.name}>
            {personalInfo?.firstName?.toUpperCase()} {personalInfo?.lastName?.toUpperCase()}
          </Text>
          <Text style={styles.title}>{personalInfo?.professionalTitle}</Text>

          {/* Summary */}
          {summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ABOUT ME</Text>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          )}

          {/* Experience */}
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
                  <Text style={styles.expLocation}>{exp.location}</Text>
                  {exp.achievements?.slice(0, 4).map((a: string, j: number) => (
                    <Text key={j} style={styles.bullet}>• {a}</Text>
                  ))}
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
