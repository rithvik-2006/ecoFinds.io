
import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth-utils';

export async function GET(request: Request) {
  try {
    // Connect to database
    await connectDB();

    // Get token from header
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token and get user ID
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user's products - using decoded.userId directly
    const products = await Product.find({ seller: decoded.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching user\'s products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}