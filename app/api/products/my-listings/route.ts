// app/api/products/my-listings/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth-utils';

export async function GET(request: Request) {
  try {
    const userId = await verifyToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    // Get user's products
    const products = await Product.find({ userId })
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ products });
    
  } catch (error) {
    console.error('My listings fetch error:', error);
    return NextResponse.json(
      { message: 'Error fetching your listings' },
      { status: 500 }
    );
  }
}
