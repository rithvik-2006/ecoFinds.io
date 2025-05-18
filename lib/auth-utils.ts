// lib/auth-utils.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Verify JWT token
export async function verifyToken(token: string) {
  if (!token || typeof token !== 'string') {
    console.error('Invalid token provided:', token);
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    if (!decoded.userId) {
      console.error('Token missing userId:', decoded);
      return null;
    }
    return decoded.userId;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Helper function to get token from request headers
export function getTokenFromHeader(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return token || null;
}

// Generate JWT token
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}
