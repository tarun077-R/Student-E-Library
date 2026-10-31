import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { connectToDatabase } from '../lib/db';
import { User } from '../lib/models/User';
import { Book } from '../lib/models/Book';
import { hashPassword } from '../lib/auth';

async function seed() {
  console.log('Connecting to database...');
  await connectToDatabase();

  console.log('Seeding initial admin and demo student accounts if not already present...');

  // Admin user
  let admin = await User.findOne({ email: 'admin@elibrary.com' });
  if (!admin) {
    const hashedPassword = await hashPassword('Admin@123456');
    admin = await User.create({
      name: 'System Admin',
      email: 'admin@elibrary.com',
      password: hashedPassword,
      role: 'admin',
      shelf: [],
    });
    console.log('Created Admin user: admin@elibrary.com / Admin@123456');
  } else {
    console.log('Admin user exists: admin@elibrary.com');
  }

  // Demo student user
  let student = await User.findOne({ email: 'student@elibrary.com' });
  if (!student) {
    const hashedPassword = await hashPassword('Student@123456');
    student = await User.create({
      name: 'Demo Student',
      email: 'student@elibrary.com',
      password: hashedPassword,
      role: 'student',
      shelf: [],
    });
    console.log('Created Student user: student@elibrary.com / Student@123456');
  } else {
    console.log('Student user exists: student@elibrary.com');
  }

  const bookCount = await Book.countDocuments();
  console.log(`Current book count: ${bookCount}`);

  console.log('Database seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});

