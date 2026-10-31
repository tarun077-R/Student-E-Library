import { jwtVerify } from 'jose';
import { AuthUser } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-fallback-for-edge';

export async function verifyEdgeToken(token: string): Promise<AuthUser | null> {
  try {
    const encodedSecret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, encodedSecret);

    if (!payload || typeof payload !== 'object') {
      return null;
    }

    return {
      id: (payload.id as string) || (payload.sub as string),
      email: payload.email as string,
      name: payload.name as string,
      role: (payload.role as 'student' | 'admin') || 'student',
    };
  } catch {
    return null;
  }
}
