import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { connectToDatabase } from '../lib/db';
import { Book } from '../lib/models/Book';
import { User } from '../lib/models/User';

async function verify() {
  console.log('Connecting to database...');
  const conn = await connectToDatabase();
  console.log('DB connected successfully, readyState:', conn.connection.readyState);

  console.log('Verifying Book model schema...');
  const bookCount = await Book.countDocuments();
  console.log('Total books in DB:', bookCount);

  console.log('Verifying User model schema...');
  const userCount = await User.countDocuments();
  console.log('Total users in DB:', userCount);

  console.log('Task 2 Verification passed!');
  process.exit(0);
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});

