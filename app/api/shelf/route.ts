import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Book } from '@/lib/models/Book';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(payload.id).populate({
      path: 'shelf.book',
      model: Book,
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Auto-migrate legacy savedBooks if shelf is empty
    if ((!user.shelf || user.shelf.length === 0) && user.savedBooks && user.savedBooks.length > 0) {
      const legacyBooks = await Book.find({ _id: { $in: user.savedBooks } });
      user.shelf = legacyBooks.map((b) => ({
        book: b._id,
        status: 'saved',
        currentPage: 0,
        totalPages: b.totalPages || 1,
        lastReadAt: new Date(),
      }));
      await user.save();

      // Re-populate shelf
      await user.populate({
        path: 'shelf.book',
        model: Book,
      });
    }

    return NextResponse.json(user.shelf || [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch shelf' },
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

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { bookId, status = 'saved', action } = body;

    if (!bookId) {
      return NextResponse.json({ message: 'Book ID is required' }, { status: 400 });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const existingIndex = user.shelf.findIndex(
      (item) => item.book.toString() === bookId.toString()
    );

    let message = '';
    let isSaved = false;

    if (existingIndex > -1) {
      if (action === 'toggle') {
        // Remove from shelf
        user.shelf.splice(existingIndex, 1);
        message = 'Book removed from shelf';
        isSaved = false;
      } else {
        // Update status
        user.shelf[existingIndex].status = status;
        user.shelf[existingIndex].lastReadAt = new Date();
        message = `Book marked as ${status}`;
        isSaved = true;
      }
    } else {
      // Add new shelf item
      user.shelf.push({
        book: book._id,
        status: status as 'reading' | 'saved' | 'completed',
        currentPage: 0,
        totalPages: book.totalPages || 1,
        lastReadAt: new Date(),
      });
      message = 'Book added to shelf';
      isSaved = true;
    }

    // Keep legacy savedBooks in sync
    user.savedBooks = user.shelf.map((s) => s.book);
    await user.save();

    await user.populate({
      path: 'shelf.book',
      model: Book,
    });

    return NextResponse.json(
      {
        message,
        isSaved,
        shelf: user.shelf,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to update shelf' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');

    if (!bookId) {
      return NextResponse.json({ message: 'Book ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.shelf = user.shelf.filter((item) => item.book.toString() !== bookId);
    user.savedBooks = user.shelf.map((s) => s.book);
    await user.save();

    return NextResponse.json({ message: 'Book removed from shelf' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to delete from shelf' },
      { status: 500 }
    );
  }
}

