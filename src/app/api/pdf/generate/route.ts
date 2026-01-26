import { NextRequest, NextResponse } from 'next/server';
import { getCVById, markCVDownloaded } from '@/lib/supabase/database';
import { generatePDF } from '@/lib/pdf/generator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cvId = searchParams.get('cvId');

    if (!cvId) {
      return NextResponse.json(
        { error: 'cvId is required' },
        { status: 400 }
      );
    }

    const cv = await getCVById(cvId);

    if (!cv) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      );
    }

    if (cv.status !== 'paid' && cv.status !== 'downloaded') {
      return NextResponse.json(
        { error: 'Payment required to download CV' },
        { status: 402 }
      );
    }

    const pdfBuffer = await generatePDF({
      templateId: cv.template_id,
      data: cv.data,
    });

    await markCVDownloaded(cvId);

    const fileName = `${cv.data.personalInfo.firstName}_${cv.data.personalInfo.lastName}_CV.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${fileName.replace('.pdf', '.html')}"`,
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

export async function POST(request: NextRequest) {
  try {
    const { cvData, templateId } = await request.json();

    if (!cvData || !templateId) {
      return NextResponse.json(
        { error: 'cvData and templateId are required' },
        { status: 400 }
      );
    }

    const pdfBuffer = await generatePDF({
      templateId,
      data: cvData,
    });

    const fileName = `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV_Preview.html`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('PDF preview generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF preview' },
      { status: 500 }
    );
  }
}
