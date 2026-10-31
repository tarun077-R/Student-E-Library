import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Book } from '@/lib/models/Book';
import { User } from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    await connectToDatabase();

    const [totalBooks, totalStudents, activeUsers, categoryAgg] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.aggregate([
        { $match: { 'shelf.status': 'reading' } },
        { $count: 'count' },
      ]),
      Book.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const activeReaders = activeUsers[0]?.count || 0;

    // Total shelved books across all users
    const shelvedAgg = await User.aggregate([
      { $project: { shelfCount: { $size: { $ifNull: ['$shelf', []] } } } },
      { $group: { _id: null, total: { $sum: '$shelfCount' } } },
    ]);
    const totalShelved = shelvedAgg[0]?.total || 0;

    const categoryStats = categoryAgg.map((item) => ({
      name: item._id || 'Uncategorized',
      count: item.count,
    }));

    return NextResponse.json(
      {
        totalBooks,
        totalStudents,
        activeReaders,
        totalShelved,
        categoryStats,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}
