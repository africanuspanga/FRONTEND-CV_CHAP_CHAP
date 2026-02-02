import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/lib/pdf/generator';

export async function POST(request: NextRequest) {
  try {
    const { cvData, templateId, colorOverride } = await request.json();

    if (!cvData || !templateId) {
      return NextResponse.json(
        { error: 'cvData and templateId are required' },
        { status: 400 }
      );
    }

    const pdfBuffer = await generatePDF({
      templateId,
      data: cvData,
      colorOverride,
    });

    const firstName = cvData?.personalInfo?.firstName || 'CV';
    const lastName = cvData?.personalInfo?.lastName || '';
    const fileName = `${firstName}_${lastName}_CV.pdf`.replace(/\s+/g, '_');

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
