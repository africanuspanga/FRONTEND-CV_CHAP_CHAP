import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cvData, templateId } = body;

    if (!cvData) {
      return NextResponse.json(
        { error: 'CV data is required' },
        { status: 400 }
      );
    }

    const pdfContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 200 >>
stream
BT
/F1 24 Tf
50 700 Td
(${cvData.personalInfo?.firstName || ''} ${cvData.personalInfo?.lastName || ''}) Tj
/F1 14 Tf
0 -30 Td
(${cvData.personalInfo?.professionalTitle || ''}) Tj
0 -20 Td
(${cvData.personalInfo?.email || ''} | ${cvData.personalInfo?.phone || ''}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000270 00000 n 
0000000520 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
599
%%EOF
`;

    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cvData.personalInfo?.firstName || 'cv'}_${cvData.personalInfo?.lastName || ''}_CV.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
