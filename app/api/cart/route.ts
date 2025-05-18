// app/api/cart/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken } from '@/lib/auth-utils';

// GET /api/cart - Get user's cart
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
    
    // In a real app, you would fetch the cart from the database
    // For now, we'll just return an empty cart
    
    return NextResponse.json({ cartItems: [] });
    
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { message: 'Error fetching cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Update user's cart
export async function POST(request: Request) {
  try {
    const userId = await verifyToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { cartItems } = await request.json();
    
    // In a real app, you would update the cart in the database
    // For now, we'll just return the cart items
    
    return NextResponse.json({ cartItems });
    
  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json(
      { message: 'Error updating cart' },
      { status: 500 }
    );
  }
}
