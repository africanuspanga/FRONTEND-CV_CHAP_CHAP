import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    padding: 40,
  },
  header: {
    textAlign: 'center',
    marginBottom: 25,
  },
  name: {
    fontSize: 28,
    fontWeight: 'normal',
    color: '#1F2937',
    letterSpacing: 2,
  },
  divider: {
    width: 50,
    height: 2,
    backgroundColor: primaryColor,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  contactText: {
    fontSize: 9,
    color: '#6B7280',
    marginHorizontal: 8,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: primaryColor,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 6,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: `${primaryColor}40`,
    marginBottom: 10,
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
    color: '#6B7280',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 9,
    color: '#4B5563',
    marginBottom: 3,
    lineHeight: 1.5,
  },
  eduItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eduLeft: {
    flex: 1,
  },
  eduDegree: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  eduSchool: {
    fontSize: 9,
    color: '#6B7280',
  },
  eduDate: {
    fontSize: 9,
    color: '#6B7280',
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  skillText: {
    fontSize: 9,
    color: '#374151',
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
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  refDetails: {
    fontSize: 8,
    color: '#6B7280',
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
  },
  column: {
    flex: 1,
  },
});

interface Props {
  data: any;
  colorOverride?: string | null;
}

export function GracePDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#6B7280';
  const styles = createStyles(primaryColor);
  
  const { personalInfo, summary, workExperiences, education, skills, languages, references, certifications } = data || {};

  const totalExperiences = workExperiences?.length || 0;
  const totalEducation = education?.length || 0;
  const hasMinimalContent = (totalExperiences + totalEducation) <= 3;
  const maxBullets = hasMinimalContent ? 5 : 3;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo?.firstName} {personalInfo?.lastName}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.title}>{personalInfo?.professionalTitle}</Text>
          <View style={styles.contactRow}>
            {personalInfo?.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
            {personalInfo?.phone && <Text style={styles.contactText}>|</Text>}
            {personalInfo?.phone && <Text style={styles.contactText}>{personalInfo.phone}</Text>}
            {personalInfo?.location && <Text style={styles.contactText}>|</Text>}
            {personalInfo?.location && <Text style={styles.contactText}>{personalInfo.location}</Text>}
          </View>
        </View>

        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <View style={styles.sectionDivider} />
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {workExperiences?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <View style={styles.sectionDivider} />
            {workExperiences.map((exp: any, i: number) => (
              <View key={i} style={styles.expItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.expTitle}>{exp.jobTitle}</Text>
                  <Text style={styles.expDate}>
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.expCompany}>{exp.company} {exp.location && `• ${exp.location}`}</Text>
                {exp.achievements?.slice(0, maxBullets).map((a: string, j: number) => (
                  <Text key={j} style={styles.bullet}>— {a}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.sectionDivider} />
            {education.map((edu: any, i: number) => (
              <View key={i} style={styles.eduItem}>
                <View style={styles.eduLeft}>
                  <Text style={styles.eduDegree}>{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</Text>
                  <Text style={styles.eduSchool}>{edu.institution}</Text>
                </View>
                <Text style={styles.eduDate}>{edu.graduationDate}</Text>
              </View>
            ))}
          </View>
        )}

        {skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.sectionDivider} />
            <View style={styles.skillsWrap}>
              {skills.slice(0, 12).map((skill: any, i: number) => (
                <Text key={i} style={styles.skillText}>{skill.name}</Text>
              ))}
            </View>
          </View>
        )}

        {languages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.sectionDivider} />
            <View style={styles.skillsWrap}>
              {languages.map((lang: any, i: number) => (
                <Text key={i} style={styles.skillText}>{lang.name} ({lang.proficiency})</Text>
              ))}
            </View>
          </View>
        )}

        {references?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>References</Text>
            <View style={styles.sectionDivider} />
            <View style={styles.twoColumn}>
              {references.slice(0, 2).map((ref: any, i: number) => (
                <View key={i} style={styles.refItem}>
                  <Text style={styles.refName}>{ref.name}</Text>
                  <Text style={styles.refDetails}>{ref.title || ref.position} at {ref.company}</Text>
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

export default GracePDF;
