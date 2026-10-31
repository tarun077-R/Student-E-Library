import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthUser } from '@/types';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Please define the JWT_SECRET environment variable in .env.local');
  }
  return secret;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(user: { _id: string; email: string; name: string; role: 'student' | 'admin' }): string {
  const payload: AuthUser = {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}
