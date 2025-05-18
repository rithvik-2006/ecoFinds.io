// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { verifyToken, getTokenFromHeader } from '@/lib/auth-utils';
import mongoose from 'mongoose';

// GET /api/products/[id] - Get a specific product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
    
  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { message: 'Error fetching product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns this product
    if (product.seller.toString() !== userId) {
      return NextResponse.json(
        { message: 'Not authorized to delete this product' },
        { status: 403 }
      );
    }
    
    await Product.findByIdAndDelete(params.id);
    
    return NextResponse.json(
      { message: 'Product deleted successfully' }
    );
    
  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json(
      { message: 'Error deleting product' },
      { status: 500 }
    );
  }
}
