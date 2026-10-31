import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { hashPassword, comparePassword, signToken, verifyToken } from '../lib/auth';
import { verifyEdgeToken } from '../lib/edge-auth';

async function testAuth() {
  console.log('Testing password hashing and comparison...');
  const password = 'SecretPassword123!';
  const hash = await hashPassword(password);
  const match = await comparePassword(password, hash);
  const mismatch = await comparePassword('wrong-password', hash);

  if (!match || mismatch) {
    throw new Error('Password verification failed');
  }
  console.log('Password hash & compare passed!');

  console.log('Testing Node JWT signing & verification...');
  const mockUser = {
    _id: '65f0a12b3c4d5e6f7a8b9c0d',
    email: 'student@example.com',
    name: 'Test Student',
    role: 'student' as const,
  };

  const token = signToken(mockUser);
  const decodedNode = verifyToken(token);
  if (!decodedNode || decodedNode.email !== mockUser.email) {
    throw new Error('Node JWT verification failed');
  }
  console.log('Node JWT passed!');

  console.log('Testing Edge (jose) JWT verification...');
  const decodedEdge = await verifyEdgeToken(token);
  if (!decodedEdge || decodedEdge.id !== mockUser._id || decodedEdge.role !== 'student') {
    throw new Error('Edge jose JWT verification failed');
  }
  console.log('Edge jose JWT passed!');

  console.log('Task 3 Verification passed!');
  process.exit(0);
}

testAuth().catch((err) => {
  console.error('Auth verification failed:', err);
  process.exit(1);
});

