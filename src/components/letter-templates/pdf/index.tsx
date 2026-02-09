/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import type { LetterData } from '@/types/letter';

function formatDate(date: string) {
  return date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* ─── Shared helpers ─── */

function RecipientBlock({ data, styles }: { data: LetterData; styles: { text: any } }) {
  if (!data.recipient.name && !data.recipient.company) return null;
  return (
    <View style={{ marginBottom: 16 }}>
      {data.recipient.name ? <Text style={styles.text}>{data.recipient.name}</Text> : null}
      {data.recipient.company ? <Text style={styles.text}>{data.recipient.company}</Text> : null}
      {data.recipient.city ? <Text style={styles.text}>{data.recipient.city}</Text> : null}
    </View>
  );
}

function SignaturePdf({ data, color }: { data: LetterData; color?: string }) {
  if (data.signature.mode === 'draw' && data.signature.dataUrl) {
    return (
      <View style={{ marginTop: 20 }}>
        <Image src={data.signature.dataUrl} style={{ height: 40, width: 120, objectFit: 'contain' }} />
        <Text style={{ fontSize: 11, color: color || '#111', marginTop: 4 }}>{data.sender.name}</Text>
      </View>
    );
  }
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 20, color: color || '#111' }}>{data.sender.name}</Text>
      <Text style={{ fontSize: 11, color: color || '#111', marginTop: 4 }}>{data.sender.name}</Text>
    </View>
  );
}

/* ═══════════════════════════════════════════════
   Template 1: Professional
   ═══════════════════════════════════════════════ */

const proStyles = StyleSheet.create({
  page: { backgroundColor: '#fff', fontFamily: 'Times-Roman', padding: 0 },
  topLine: { height: 6, backgroundColor: '#1a1a1a' },
  content: { paddingHorizontal: 50, paddingTop: 32 },
  name: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#1a1a1a', letterSpacing: 2, textTransform: 'uppercase' },
  contact: { fontSize: 9, textAlign: 'center', color: '#888', marginTop: 4 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginTop: 16, marginBottom: 20 },
  date: { fontSize: 10, color: '#555', marginBottom: 16 },
  text: { fontSize: 10, color: '#555', lineHeight: 1.5 },
  body: { fontSize: 10, color: '#555', lineHeight: 1.6, marginBottom: 10 },
  bold: { fontSize: 10, color: '#1a1a1a' },
});

function ProfessionalPdf({ data }: { data: LetterData }) {
  const contact = [data.sender.email, data.sender.phone, data.sender.city].filter(Boolean).join(' | ');
  return (
    <Document>
      <Page size="A4" style={proStyles.page}>
        <View style={proStyles.topLine} />
        <View style={proStyles.content}>
          <Text style={proStyles.name}>{data.sender.name}</Text>
          <Text style={proStyles.contact}>{contact}</Text>
          <View style={proStyles.divider} />
          <Text style={proStyles.date}>{formatDate(data.date)}</Text>
          <RecipientBlock data={data} styles={{ text: proStyles.text }} />
          <Text style={[proStyles.bold, { marginBottom: 10 }]}>Dear {data.recipient.name || 'Hiring Manager'},</Text>
          {data.paragraphs.map((p, i) => (
            <Text key={i} style={proStyles.body}>{p}</Text>
          ))}
          <Text style={[proStyles.bold, { marginTop: 10 }]}>Sincerely,</Text>
          <SignaturePdf data={data} />
        </View>
      </Page>
    </Document>
  );
}

/* ═══════════════════════════════════════════════
   Template 2: Whitespace
   ═══════════════════════════════════════════════ */

const wsStyles = StyleSheet.create({
  page: { backgroundColor: '#fff', fontFamily: 'Helvetica', paddingHorizontal: 60, paddingTop: 50 },
  name: { fontSize: 16, fontWeight: 'ultralight', letterSpacing: 4, color: '#444', textTransform: 'uppercase' },
  contact: { fontSize: 8, color: '#aaa', letterSpacing: 2, marginTop: 4, marginBottom: 40 },
  date: { fontSize: 8, color: '#aaa', marginBottom: 30 },
  text: { fontSize: 10, color: '#666', lineHeight: 1.5 },
  body: { fontSize: 10, color: '#666', lineHeight: 1.9, marginBottom: 16 },
  bold: { fontSize: 10, color: '#444' },
});

function WhitespacePdf({ data }: { data: LetterData }) {
  const contact = [data.sender.email, data.sender.phone, data.sender.city].filter(Boolean).join('  ·  ');
  return (
    <Document>
      <Page size="A4" style={wsStyles.page}>
        <Text style={wsStyles.name}>{data.sender.name}</Text>
        <Text style={wsStyles.contact}>{contact}</Text>
        <Text style={wsStyles.date}>{formatDate(data.date)}</Text>
        <RecipientBlock data={data} styles={{ text: wsStyles.text }} />
        <Text style={[wsStyles.bold, { marginBottom: 16 }]}>Dear {data.recipient.name || 'Hiring Manager'},</Text>
        {data.paragraphs.map((p, i) => (
          <Text key={i} style={wsStyles.body}>{p}</Text>
        ))}
        <Text style={[wsStyles.bold, { marginTop: 20 }]}>Sincerely,</Text>
        <SignaturePdf data={data} />
      </Page>
    </Document>
  );
}

/* ═══════════════════════════════════════════════
   Template 3: Contempo
   ═══════════════════════════════════════════════ */

const ctStyles = StyleSheet.create({
  page: { backgroundColor: '#fff', fontFamily: 'Helvetica', padding: 0 },
  header: { flexDirection: 'row' },
  accent: { width: 8, backgroundColor: '#14b8a6', minHeight: 80 },
  headerContent: { flex: 1, paddingHorizontal: 44, paddingVertical: 24, alignItems: 'flex-end' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  contact: { fontSize: 8, color: '#888', marginTop: 3 },
  content: { paddingHorizontal: 50, paddingTop: 24 },
  date: { fontSize: 10, color: '#666', marginBottom: 16 },
  text: { fontSize: 10, color: '#555', lineHeight: 1.5 },
  body: { fontSize: 10, color: '#555', lineHeight: 1.6, marginBottom: 10 },
  bold: { fontSize: 10, color: '#1a1a1a' },
});

function ContempoPdf({ data }: { data: LetterData }) {
  return (
    <Document>
      <Page size="A4" style={ctStyles.page}>
        <View style={ctStyles.header}>
          <View style={ctStyles.accent} />
          <View style={ctStyles.headerContent}>
            <Text style={ctStyles.name}>{data.sender.name}</Text>
            <Text style={ctStyles.contact}>{data.sender.email}</Text>
            <Text style={ctStyles.contact}>{[data.sender.phone, data.sender.city].filter(Boolean).join(' | ')}</Text>
          </View>
        </View>
        <View style={ctStyles.content}>
          <Text style={ctStyles.date}>{formatDate(data.date)}</Text>
          <RecipientBlock data={data} styles={{ text: ctStyles.text }} />
          <Text style={[ctStyles.bold, { marginBottom: 10 }]}>Dear {data.recipient.name || 'Hiring Manager'},</Text>
          {data.paragraphs.map((p, i) => (
            <Text key={i} style={ctStyles.body}>{p}</Text>
          ))}
          <Text style={[ctStyles.bold, { marginTop: 10 }]}>Sincerely,</Text>
          <SignaturePdf data={data} />
        </View>
      </Page>
    </Document>
  );
}

/* ═══════════════════════════════════════════════
   Template 4: Managerial
   ═══════════════════════════════════════════════ */

const mgrStyles = StyleSheet.create({
  page: { backgroundColor: '#fff', fontFamily: 'Times-Roman', padding: 0 },
  header: { backgroundColor: '#1e3a5f', paddingHorizontal: 50, paddingVertical: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  initialsCircle: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', justifyContent: 'center', alignItems: 'center' },
  initials: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  headerName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  headerContact: { fontSize: 8, color: 'rgba(255,255,255,0.7)', marginTop: 3 },
  content: { paddingHorizontal: 50, paddingTop: 28 },
  date: { fontSize: 10, color: '#666', marginBottom: 16 },
  text: { fontSize: 10, color: '#555', lineHeight: 1.5 },
  body: { fontSize: 10, color: '#555', lineHeight: 1.6, marginBottom: 10 },
  bold: { fontSize: 10, color: '#1a1a1a' },
});

function ManagerialPdf({ data }: { data: LetterData }) {
  const initials = data.sender.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const contact = [data.sender.email, data.sender.phone, data.sender.city].filter(Boolean).join(' | ');
  return (
    <Document>
      <Page size="A4" style={mgrStyles.page}>
        <View style={mgrStyles.header}>
          <View style={mgrStyles.initialsCircle}>
            <Text style={mgrStyles.initials}>{initials}</Text>
          </View>
          <View>
            <Text style={mgrStyles.headerName}>{data.sender.name}</Text>
            <Text style={mgrStyles.headerContact}>{contact}</Text>
          </View>
        </View>
        <View style={mgrStyles.content}>
          <Text style={mgrStyles.date}>{formatDate(data.date)}</Text>
          <RecipientBlock data={data} styles={{ text: mgrStyles.text }} />
          <Text style={[mgrStyles.bold, { marginBottom: 10 }]}>Dear {data.recipient.name || 'Hiring Manager'},</Text>
          {data.paragraphs.map((p, i) => (
            <Text key={i} style={mgrStyles.body}>{p}</Text>
          ))}
          <Text style={[mgrStyles.bold, { marginTop: 10 }]}>Sincerely,</Text>
          <SignaturePdf data={data} />
        </View>
      </Page>
    </Document>
  );
}

/* ═══════════════════════════════════════════════
   Template 5: Refined
   ═══════════════════════════════════════════════ */

const refStyles = StyleSheet.create({
  page: { backgroundColor: '#fff', fontFamily: 'Times-Roman', padding: 24 },
  outerBorder: { borderWidth: 2, borderColor: '#222', padding: 6, flex: 1 },
  innerBorder: { borderWidth: 1, borderColor: '#aaa', padding: 32, flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#1a1a1a', letterSpacing: 2 },
  contact: { fontSize: 8, textAlign: 'center', color: '#888', marginTop: 6, letterSpacing: 1 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginTop: 16, marginBottom: 16 },
  date: { fontSize: 10, color: '#666', marginBottom: 16 },
  text: { fontSize: 10, color: '#555', lineHeight: 1.5 },
  body: { fontSize: 10, color: '#555', lineHeight: 1.6, marginBottom: 10 },
  bold: { fontSize: 10, color: '#1a1a1a' },
});

function RefinedPdf({ data }: { data: LetterData }) {
  const contact = [data.sender.email, data.sender.phone, data.sender.city].filter(Boolean).join(' | ');
  return (
    <Document>
      <Page size="A4" style={refStyles.page}>
        <View style={refStyles.outerBorder}>
          <View style={refStyles.innerBorder}>
            <Text style={refStyles.name}>{data.sender.name}</Text>
            <Text style={refStyles.contact}>{contact}</Text>
            <View style={refStyles.divider} />
            <Text style={refStyles.date}>{formatDate(data.date)}</Text>
            <RecipientBlock data={data} styles={{ text: refStyles.text }} />
            <Text style={[refStyles.bold, { marginBottom: 10 }]}>Dear {data.recipient.name || 'Hiring Manager'},</Text>
            {data.paragraphs.map((p, i) => (
              <Text key={i} style={refStyles.body}>{p}</Text>
            ))}
            <Text style={[refStyles.bold, { marginTop: 10 }]}>Sincerely,</Text>
            <SignaturePdf data={data} />
          </View>
        </View>
      </Page>
    </Document>
  );
}

/* ═══════════════════════════════════════════════
   Template 6: Pacific
   ═══════════════════════════════════════════════ */

const pacStyles = StyleSheet.create({
  page: { backgroundColor: '#fff', fontFamily: 'Helvetica', padding: 0 },
  header: { backgroundColor: '#2563eb', paddingHorizontal: 50, paddingVertical: 30 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  contact: { fontSize: 9, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  content: { paddingHorizontal: 50, paddingTop: 28 },
  date: { fontSize: 10, color: '#666', marginBottom: 16 },
  text: { fontSize: 10, color: '#555', lineHeight: 1.5 },
  body: { fontSize: 10, color: '#555', lineHeight: 1.6, marginBottom: 10 },
  bold: { fontSize: 10, fontWeight: 'bold', color: '#1a1a1a' },
});

function PacificPdf({ data }: { data: LetterData }) {
  const contact = [data.sender.email, data.sender.phone, data.sender.city].filter(Boolean).join(' | ');
  return (
    <Document>
      <Page size="A4" style={pacStyles.page}>
        <View style={pacStyles.header}>
          <Text style={pacStyles.name}>{data.sender.name}</Text>
          <Text style={pacStyles.contact}>{contact}</Text>
        </View>
        <View style={pacStyles.content}>
          <Text style={pacStyles.date}>{formatDate(data.date)}</Text>
          <RecipientBlock data={data} styles={{ text: pacStyles.text }} />
          <Text style={[pacStyles.bold, { marginBottom: 10 }]}>Dear {data.recipient.name || 'Hiring Manager'},</Text>
          {data.paragraphs.map((p, i) => (
            <Text key={i} style={pacStyles.body}>{p}</Text>
          ))}
          <Text style={[pacStyles.bold, { marginTop: 10 }]}>Sincerely,</Text>
          <SignaturePdf data={data} />
        </View>
      </Page>
    </Document>
  );
}

/* ─── Export lookup ─── */

export function getLetterTemplate(templateId: string) {
  switch (templateId) {
    case 'whitespace':
      return WhitespacePdf;
    case 'contempo':
      return ContempoPdf;
    case 'managerial':
      return ManagerialPdf;
    case 'refined':
      return RefinedPdf;
    case 'pacific':
      return PacificPdf;
    case 'professional':
    default:
      return ProfessionalPdf;
  }
}
