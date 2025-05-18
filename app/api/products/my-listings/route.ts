import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { verifyToken, getTokenFromHeader } from '@/lib/auth-utils';

export async function GET(request: Request) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json(
        { message: 'Invalid token provided' },
        { status: 401 }
      );
    }

    await connectDB();

    const products = await Product.find({ seller: userId })
      .sort({ createdAt: -1 });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching user products:', error);
    return NextResponse.json(
      { message: 'Error fetching your products' },
      { status: 500 }
    );
  }
}