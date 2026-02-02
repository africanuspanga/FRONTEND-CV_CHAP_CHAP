import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: primaryColor,
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: primaryColor,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contactText: {
    fontSize: 9,
    color: '#6B7280',
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: primaryColor,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.5,
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
    fontSize: 9,
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
    lineHeight: 1.4,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
  },
  column: {
    flex: 1,
  },
  eduItem: {
    marginBottom: 8,
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
    fontSize: 8,
    color: '#9CA3AF',
  },
  skillTag: {
    fontSize: 9,
    color: '#ffffff',
    backgroundColor: primaryColor,
    padding: '4 8',
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 4,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
});

interface Props {
  data: any;
  colorOverride?: string | null;
}

export function OliverPDF({ data, colorOverride }: Props) {
  const primaryColor = colorOverride || '#E07A38';
  const styles = createStyles(primaryColor);
  
  const { personalInfo, summary, workExperiences, education, skills, languages, references, certifications } = data || {};

  const totalExperiences = workExperiences?.length || 0;
  const totalEducation = education?.length || 0;
  const hasMinimalContent = (totalExperiences + totalEducation) <= 3;
  const maxBullets = hasMinimalContent ? 5 : 4;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>
              {personalInfo?.firstName} {personalInfo?.lastName}
            </Text>
            <Text style={styles.title}>{personalInfo?.professionalTitle}</Text>
            <View style={styles.contactRow}>
              {personalInfo?.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
              {personalInfo?.phone && <Text style={styles.contactText}>• {personalInfo.phone}</Text>}
              {personalInfo?.location && <Text style={styles.contactText}>• {personalInfo.location}</Text>}
            </View>
          </View>
          {personalInfo?.photoUrl && (
            <Image src={personalInfo.photoUrl} style={styles.photo} />
          )}
        </View>

        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
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
                <Text style={styles.expCompany}>{exp.company}</Text>
                {exp.achievements?.slice(0, maxBullets).map((a: string, j: number) => (
                  <Text key={j} style={styles.bullet}>▸ {a}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        <View style={styles.twoColumn}>
          {education?.length > 0 && (
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Education</Text>
              {education.map((edu: any, i: number) => (
                <View key={i} style={styles.eduItem}>
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  <Text style={styles.eduSchool}>{edu.institution}</Text>
                  <Text style={styles.eduDate}>{edu.graduationDate}</Text>
                </View>
              ))}
            </View>
          )}

          {skills?.length > 0 && (
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsWrap}>
                {skills.slice(0, 10).map((skill: any, i: number) => (
                  <Text key={i} style={styles.skillTag}>{skill.name}</Text>
                ))}
              </View>
            </View>
          )}
        </View>

        {languages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.skillsWrap}>
              {languages.map((lang: any, i: number) => (
                <Text key={i} style={styles.langItem}>{lang.name} ({lang.proficiency})  </Text>
              ))}
            </View>
          </View>
        )}

        {references?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>References</Text>
            <View style={styles.twoColumn}>
              {references.slice(0, 2).map((ref: any, i: number) => (
                <View key={i} style={styles.refItem}>
                  <Text style={styles.refName}>{ref.name}</Text>
                  <Text style={styles.refDetails}>{ref.title || ref.position}</Text>
                  <Text style={styles.refDetails}>{ref.company}</Text>
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

export default OliverPDF;
