import { NextRequest, NextResponse } from 'next/server';
import { uploadBufferToCloudinary } from '@/lib/cloudinary';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const formData = await request.formData();
    const pdfFile = formData.get('file') as File | null;
    const coverImageFile = formData.get('coverImage') as File | null;

    if (!pdfFile && !coverImageFile) {
      return NextResponse.json(
        { message: 'At least one file (PDF or cover image) must be provided' },
        { status: 400 }
      );
    }

    const results: { fileUrl?: string; coverImage?: string } = {};

    // Upload PDF
    if (pdfFile && pdfFile.size > 0) {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfBuffer = Buffer.from(pdfBytes);
      const pdfUpload = await uploadBufferToCloudinary(
        pdfBuffer,
        'elibrary/books',
        'raw',
        'pdf'
      );
      results.fileUrl = pdfUpload.secure_url;
    }

    // Upload Cover Image
    if (coverImageFile && coverImageFile.size > 0) {
      const coverBytes = await coverImageFile.arrayBuffer();
      const coverBuffer = Buffer.from(coverBytes);
      const imageUpload = await uploadBufferToCloudinary(
        coverBuffer,
        'elibrary/covers',
        'image'
      );
      results.coverImage = imageUpload.secure_url;
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { message: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}

