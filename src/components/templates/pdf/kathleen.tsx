import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#f5f7fa',
    fontFamily: 'Helvetica',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: primaryColor,
    opacity: 0.3,
  },
  sidebar: {
    width: '35%',
    padding: 25,
    paddingTop: 35,
  },
  main: {
    width: '65%',
    padding: 25,
    paddingTop: 35,
    backgroundColor: '#ffffff',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  title: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 20,
  },
  quoteMark: {
    fontSize: 80,
    color: primaryColor,
    position: 'absolute',
    right: 10,
    top: 20,
    opacity: 0.8,
  },
  sidebarSection: {
    marginBottom: 18,
  },
  sidebarTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#374151',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    textTransform: 'uppercase',
  },
  contactItem: {
    fontSize: 8,
    color: primaryColor,
    marginBottom: 4,
  },
  eduItem: {
    marginBottom: 10,
  },
  eduDate: {
    fontSize: 7,
    color: '#6B7280',
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
  eduField: {
    fontSize: 8,
    color: primaryColor,
    fontStyle: 'italic',
  },
  skillItem: {
    fontSize: 8,
    color: '#374151',
    marginBottom: 3,
  },
  mainSection: {
    marginBottom: 15,
  },
  mainSectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: primaryColor,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: primaryColor,
    textTransform: 'uppercase',
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
    color: '#6B7280',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 8,
    color: '#4B5563',
    marginBottom: 2,
  },
  refItem: {
    marginBottom: 10,
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

export function KathleenPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#E5B94E';
  const styles = createStyles(primaryColor);
  
  const { personalInfo, summary, workExperiences, education, skills, languages, certifications, references } = data || {};

  // Calculate total content to determine if we need to fill space
  const totalExperiences = workExperiences?.length || 0;
  const totalEducation = education?.length || 0;
  const totalAchievements = workExperiences?.reduce((acc: number, exp: any) => acc + (exp.achievements?.length || 0), 0) || 0;
  
  // More flexible check - if total content items are low, show more
  const hasMinimalContent = (totalExperiences + totalEducation) <= 3 || totalAchievements < 8;

  // Always show good amount of content
  const maxBullets = hasMinimalContent ? 5 : 4;
  const maxSkills = 10; // Always show up to 10 skills to fill sidebar

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} />
        
        <View style={styles.sidebar}>
          <Text style={styles.name}>{personalInfo?.firstName}</Text>
          <Text style={styles.name}>{personalInfo?.lastName}</Text>
          <Text style={styles.title}>{personalInfo?.professionalTitle}</Text>
          
          <Text style={styles.quoteMark}>"</Text>

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>CONTACT</Text>
            {personalInfo?.email && (
              <Text style={styles.contactItem}>{personalInfo.email}</Text>
            )}
            {personalInfo?.phone && (
              <Text style={styles.contactItem}>{personalInfo.phone}</Text>
            )}
            {personalInfo?.location && (
              <Text style={styles.contactItem}>{personalInfo.location}</Text>
            )}
          </View>

          {education?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>EDUCATION</Text>
              {education.map((edu: any, i: number) => (
                <View key={i} style={styles.eduItem}>
                  <Text style={styles.eduDate}>{edu.graduationDate}</Text>
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  <Text style={styles.eduSchool}>{edu.institution}</Text>
                  {edu.fieldOfStudy && <Text style={styles.eduField}>{edu.fieldOfStudy}</Text>}
                </View>
              ))}
            </View>
          )}

          {skills?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>SKILLS</Text>
              {skills.slice(0, maxSkills).map((skill: any, i: number) => (
                <Text key={i} style={styles.skillItem}>• {skill.name}</Text>
              ))}
            </View>
          )}

          {languages?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>LANGUAGES</Text>
              {languages.map((lang: any, i: number) => (
                <Text key={i} style={styles.skillItem}>• {lang.name} ({lang.proficiency})</Text>
              ))}
            </View>
          )}

          {certifications?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>CERTIFICATIONS</Text>
              {certifications.slice(0, 4).map((cert: any, i: number) => (
                <Text key={i} style={styles.skillItem}>• {cert.name}</Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.main}>
          {summary && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>PROFESSIONAL SUMMARY</Text>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          )}

          {workExperiences?.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>WORK EXPERIENCE</Text>
              {workExperiences.map((exp: any, i: number) => (
                <View key={i} style={styles.expItem}>
                  <View style={styles.expHeader}>
                    <Text style={styles.expTitle}>{exp.jobTitle}</Text>
                    <Text style={styles.expDate}>
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  <Text style={styles.expCompany}>{exp.company} | {exp.location}</Text>
                  {exp.achievements?.slice(0, maxBullets).map((a: string, j: number) => (
                    <Text key={j} style={styles.bullet}>• {a}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {references?.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>REFERENCES</Text>
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

export default KathleenPDF;
