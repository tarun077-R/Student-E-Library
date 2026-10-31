import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Book } from '@/lib/models/Book';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
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
    const { bookId, currentPage, totalPages, status } = body;

    if (!bookId) {
      return NextResponse.json({ message: 'Book ID is required' }, { status: 400 });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let itemIndex = user.shelf.findIndex(
      (item) => item.book.toString() === bookId.toString()
    );

    // If book is not yet on shelf, add it as 'reading'
    if (itemIndex === -1) {
      const book = await Book.findById(bookId);
      if (!book) {
        return NextResponse.json({ message: 'Book not found' }, { status: 404 });
      }

      user.shelf.push({
        book: book._id,
        status: 'reading',
        currentPage: typeof currentPage === 'number' ? currentPage : 1,
        totalPages: totalPages || book.totalPages || 1,
        lastReadAt: new Date(),
      });
      itemIndex = user.shelf.length - 1;
    } else {
      const shelfItem = user.shelf[itemIndex];

      if (typeof currentPage === 'number') {
        shelfItem.currentPage = Math.max(0, currentPage);
      }

      if (typeof totalPages === 'number' && totalPages > 0) {
        shelfItem.totalPages = totalPages;
      }

      if (status && ['reading', 'saved', 'completed'].includes(status)) {
        shelfItem.status = status;
      } else if (shelfItem.currentPage >= shelfItem.totalPages && shelfItem.totalPages > 0) {
        shelfItem.status = 'completed';
      } else if (shelfItem.currentPage > 0 && shelfItem.status === 'saved') {
        shelfItem.status = 'reading';
      }

      shelfItem.lastReadAt = new Date();
    }

    await user.save();
    await user.populate({
      path: 'shelf.book',
      model: Book,
    });

    return NextResponse.json(
      {
        message: 'Reading progress updated',
        item: user.shelf[itemIndex],
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to update progress' },
      { status: 500 }
    );
  }
}

