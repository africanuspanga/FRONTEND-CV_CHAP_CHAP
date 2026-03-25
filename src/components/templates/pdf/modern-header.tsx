import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: primaryColor,
    padding: 25,
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 3,
    letterSpacing: 2,
  },
  title: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  contactItem: {
    fontSize: 9,
    color: '#ffffff',
    opacity: 0.9,
  },
  contactSeparator: {
    fontSize: 9,
    color: '#ffffff',
    opacity: 0.5,
    marginHorizontal: 4,
  },
  body: {
    flexDirection: 'row',
    flex: 1,
    padding: 20,
    paddingTop: 18,
  },
  leftColumn: {
    width: '60%',
    paddingRight: 15,
  },
  rightColumn: {
    width: '40%',
    paddingLeft: 15,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: primaryColor,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  skillDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: primaryColor,
    marginRight: 8,
  },
  skillName: {
    fontSize: 9,
    color: '#374151',
  },
  skillLevel: {
    fontSize: 8,
    color: '#9CA3AF',
    marginLeft: 4,
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
  langItem: {
    marginBottom: 6,
  },
  langName: {
    fontSize: 9,
    color: '#374151',
  },
  langLevel: {
    fontSize: 8,
    color: '#9CA3AF',
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

export function ModernHeaderPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#4B5563';
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

  // Build contact items array for dot-separated display
  const contactItems: string[] = [];
  if (personalInfo?.email) contactItems.push(personalInfo.email);
  if (personalInfo?.phone) contactItems.push(personalInfo.phone);
  if (personalInfo?.location) contactItems.push(personalInfo.location);
  if (personalInfo?.linkedin) contactItems.push(personalInfo.linkedin);
  if (personalInfo?.website) contactItems.push(personalInfo.website);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Dark Header Bar */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo?.firstName?.toUpperCase()} {personalInfo?.lastName?.toUpperCase()}
          </Text>
          {personalInfo?.professionalTitle && (
            <Text style={styles.title}>{personalInfo.professionalTitle}</Text>
          )}
          <View style={styles.contactRow}>
            {contactItems.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Text style={styles.contactSeparator}>•</Text>}
                <Text style={styles.contactItem}>{item}</Text>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Two-column body */}
        <View style={styles.body}>
          {/* Left Column - 60% */}
          <View style={styles.leftColumn}>
            {summary && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>PROFILE</Text>
                </View>
                <Text style={styles.summaryText}>{summary}</Text>
              </View>
            )}

            {workExperiences?.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>EXPERIENCE</Text>
                </View>
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

            {languages?.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>LANGUAGES</Text>
                </View>
                {languages.map((lang: any, i: number) => (
                  <View key={i} style={styles.langItem}>
                    <Text style={styles.langName}>{lang.name}</Text>
                    <Text style={styles.langLevel}>{lang.proficiency}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column - 40% */}
          <View style={styles.rightColumn}>
            {skills?.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>SKILLS</Text>
                </View>
                {skills.slice(0, maxSkills).map((skill: any, i: number) => (
                  <View key={i} style={styles.skillRow}>
                    <View style={styles.skillDot} />
                    <Text style={styles.skillName}>{skill.name}</Text>
                  </View>
                ))}
              </View>
            )}

            {education?.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>EDUCATION</Text>
                </View>
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

            {references?.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>REFERENCES</Text>
                </View>
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

            {certifications?.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
                </View>
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

export default ModernHeaderPDF;
