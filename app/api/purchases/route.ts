import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken, getTokenFromHeader } from '@/lib/auth-utils';

export async function GET(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    // Verify the token and get user ID
    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // For now, return an empty array of purchases
    // This will be replaced with actual database queries later
    return NextResponse.json({ 
      success: true,
      purchases: [] 
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch purchases',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 