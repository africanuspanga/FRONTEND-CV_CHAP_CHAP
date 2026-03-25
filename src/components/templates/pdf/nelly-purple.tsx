import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const sidebarColor = '#6B5B9A';

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
    backgroundColor: sidebarColor,
    padding: 20,
    paddingTop: 25,
    color: '#ffffff',
  },
  main: {
    marginLeft: '35%',
    padding: 25,
    paddingTop: 25,
    backgroundColor: '#ffffff',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 18,
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 3,
  },
  sidebarTitle: {
    fontSize: 10,
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 20,
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
  skillRow: {
    marginBottom: 8,
  },
  skillName: {
    fontSize: 9,
    color: '#ffffff',
    marginBottom: 4,
  },
  skillBarContainer: {
    flexDirection: 'row',
    gap: 3,
  },
  skillSegmentFilled: {
    width: 20,
    height: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    marginRight: 3,
  },
  skillSegmentEmpty: {
    width: 20,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    marginRight: 3,
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
  // Timeline experience item
  expItem: {
    marginBottom: 14,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: primaryColor,
  },
  expDot: {
    position: 'absolute',
    left: -5,
    top: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: primaryColor,
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
  // Timeline education item
  eduItem: {
    marginBottom: 12,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: primaryColor,
  },
  eduDot: {
    position: 'absolute',
    left: -5,
    top: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: primaryColor,
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
  refItem: {
    marginBottom: 10,
  },
  refName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
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

export function NellyPurplePDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#8B7BB5';
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

  const getSkillSegments = (level: string): number => {
    switch (level) {
      case 'expert': return 5;
      case 'advanced': return 4;
      case 'intermediate': return 3;
      default: return 2;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View fixed style={styles.sidebar}>
          <View style={styles.photoContainer}>
            {personalInfo?.photoUrl ? (
              <Image src={personalInfo.photoUrl} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={{ fontSize: 10, textAlign: 'center', color: '#ffffff', opacity: 0.5 }}>Photo</Text>
              </View>
            )}
          </View>

          <Text style={styles.sidebarName}>
            {personalInfo?.firstName} {personalInfo?.lastName}
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
              {skills.slice(0, maxSkills).map((skill: any, i: number) => {
                const filled = getSkillSegments(skill.level);
                return (
                  <View key={i} style={styles.skillRow}>
                    <Text style={styles.skillName}>{skill.name}</Text>
                    <View style={styles.skillBarContainer}>
                      {[1, 2, 3, 4, 5].map((seg) => (
                        <View
                          key={seg}
                          style={seg <= filled ? styles.skillSegmentFilled : styles.skillSegmentEmpty}
                        />
                      ))}
                    </View>
                  </View>
                );
              })}
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
        </View>

        {/* Main Area */}
        <View style={styles.main}>
          {summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SUMMARY</Text>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          )}

          {workExperiences?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
              {workExperiences.map((exp: any, i: number) => (
                <View key={i} style={styles.expItem}>
                  <View style={styles.expDot} />
                  <View style={styles.expHeader}>
                    <Text style={styles.expTitle}>{exp.jobTitle}</Text>
                    <Text style={styles.expDate}>
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                  {exp.location && <Text style={styles.expLocation}>{exp.location}</Text>}
                  {exp.achievements?.map((a: string, j: number) => (
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
                  <View style={styles.eduDot} />
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  {edu.fieldOfStudy && <Text style={styles.eduField}>{edu.fieldOfStudy}</Text>}
                  <Text style={styles.eduSchool}>{edu.institution}</Text>
                  <Text style={styles.eduDate}>{edu.graduationDate}</Text>
                </View>
              ))}
            </View>
          )}

          {references?.length > 0 && (
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

export default NellyPurplePDF;
