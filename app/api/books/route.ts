import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Book } from '@/lib/models/Book';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const query: Record<string, any> = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim()) {
      const regex = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ title: regex }, { author: regex }, { description: regex }];
    }

    const books = await Book.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(books, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

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

    await connectToDatabase();
    const body = await request.json();
    const { title, author, description, category, fileUrl, coverImage, totalPages } = body;

    if (!title || !author || !category || !fileUrl) {
      return NextResponse.json(
        { message: 'Title, author, category, and PDF file are required' },
        { status: 400 }
      );
    }

    const newBook = await Book.create({
      title: title.trim(),
      author: author.trim(),
      description: description?.trim() || '',
      category: category.trim(),
      fileUrl,
      coverImage: coverImage || '',
      totalPages: totalPages ? parseInt(totalPages, 10) : 0,
      uploadedBy: user.id,
    });

    const populatedBook = await Book.findById(newBook._id).populate(
      'uploadedBy',
      'name email'
    );

    return NextResponse.json(populatedBook, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to create book' },
      { status: 500 }
    );
  }
}
