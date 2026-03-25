import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: primaryColor,
    padding: 20,
    paddingTop: 25,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTextArea: {
    flex: 1,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 3,
  },
  title: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: primaryColor,
    backgroundColor: '#ffffff',
    gap: 4,
  },
  contactItem: {
    fontSize: 9,
    color: '#4B5563',
    marginRight: 15,
  },
  body: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 15,
  },
  leftColumn: {
    width: '60%',
    paddingRight: 15,
  },
  rightColumn: {
    width: '40%',
    paddingLeft: 15,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
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
    paddingBottom: 4,
    borderBottomWidth: 1,
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
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  skillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: primaryColor,
    marginRight: 8,
  },
  skillName: {
    fontSize: 9,
    color: '#374151',
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  langDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: primaryColor,
    marginRight: 8,
  },
  langName: {
    fontSize: 9,
    color: '#374151',
  },
  langLevel: {
    fontSize: 8,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  certItem: {
    marginBottom: 8,
  },
  certName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
  },
  certIssuer: {
    fontSize: 8,
    color: '#6B7280',
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

export function ThomasPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#8ECFC8';
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
        {/* Header */}
        <View style={styles.header}>
          {personalInfo?.photoUrl ? (
            <Image src={personalInfo.photoUrl} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={{ fontSize: 10, textAlign: 'center', opacity: 0.7, color: '#ffffff' }}>Photo</Text>
            </View>
          )}
          <View style={styles.headerTextArea}>
            <Text style={styles.name}>
              {personalInfo?.firstName?.toUpperCase()} {personalInfo?.lastName?.toUpperCase()}
            </Text>
            {personalInfo?.professionalTitle && (
              <Text style={styles.title}>{personalInfo.professionalTitle}</Text>
            )}
          </View>
        </View>

        {/* Contact Row */}
        <View style={styles.contactRow}>
          {personalInfo?.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
          {personalInfo?.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
          {personalInfo?.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
          {personalInfo?.linkedin && <Text style={styles.contactItem}>{personalInfo.linkedin}</Text>}
          {personalInfo?.website && <Text style={styles.contactItem}>{personalInfo.website}</Text>}
        </View>

        {/* Two-column body */}
        <View style={styles.body}>
          {/* Left Column - 60% */}
          <View style={styles.leftColumn}>
            {summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>PROFILE</Text>
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
                    {exp.achievements?.map((a: string, j: number) => (
                      <Text key={j} style={styles.bullet}>• {a}</Text>
                    ))}
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

          {/* Right Column - 40% */}
          <View style={styles.rightColumn}>
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

            {skills?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>SKILLS</Text>
                {skills.slice(0, maxSkills).map((skill: any, i: number) => (
                  <View key={i} style={styles.skillRow}>
                    <View style={styles.skillDot} />
                    <Text style={styles.skillName}>{skill.name}</Text>
                  </View>
                ))}
              </View>
            )}

            {languages?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>LANGUAGES</Text>
                {languages.map((lang: any, i: number) => (
                  <View key={i} style={styles.langRow}>
                    <View style={styles.langDot} />
                    <Text style={styles.langName}>{lang.name}</Text>
                    <Text style={styles.langLevel}>({lang.proficiency})</Text>
                  </View>
                ))}
              </View>
            )}

            {certifications?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
                {certifications.slice(0, 4).map((cert: any, i: number) => (
                  <View key={i} style={styles.certItem}>
                    <Text style={styles.certName}>{cert.name}</Text>
                    {cert.issuer && <Text style={styles.certIssuer}>{cert.issuer}</Text>}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default ThomasPDF;
