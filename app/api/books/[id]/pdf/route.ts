import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Book } from '@/lib/models/Book';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    await connectToDatabase();
    const { id } = params;

    const book = await Book.findById(id).select('fileUrl title');
    if (!book || !book.fileUrl) {
      return NextResponse.json({ message: 'Book or PDF file not found' }, { status: 404 });
    }

    const pdfResponse = await fetch(book.fileUrl, {
      headers: {
        Accept: 'application/pdf',
      },
    });

    if (!pdfResponse.ok || !pdfResponse.body) {
      return NextResponse.json(
        { message: 'Failed to fetch upstream PDF resource' },
        { status: 502 }
      );
    }

    const cleanTitle = (book.title || 'document').replace(/[^a-zA-Z0-9_-]/g, '_');

    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `inline; filename="${cleanTitle}.pdf"`);
    headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=43200');

    const contentLength = pdfResponse.headers.get('content-length');
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    return new Response(pdfResponse.body as any, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('PDF proxy stream error:', error);
    return NextResponse.json(
      { message: error.message || 'Error streaming PDF' },
      { status: 500 }
    );
  }
}

