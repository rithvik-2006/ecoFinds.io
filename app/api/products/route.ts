// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { verifyToken, getTokenFromHeader } from '@/lib/auth-utils';
import mongoose from 'mongoose';

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    // Get token from header
    const token = getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json(
        { message: 'Invalid token provided' },
        { status: 401 }
      );
    }

    // Connect to database
    try {
      await connectDB();
    } catch (error) {
      console.error('Database connection error:', error);
      return NextResponse.json(
        { message: 'Database connection failed', error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }

    // Get product data from request
    const data = await request.json();
    console.log('Received product data:', data);

    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'category'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create new product
    try {
      const product = await Product.create({
        ...data,
        seller: new mongoose.Types.ObjectId(userId),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('Created product:', product);
      return NextResponse.json(product, { status: 201 });
    } catch (error) {
      console.error('Product creation error:', error);
      return NextResponse.json(
        { 
          message: 'Failed to create product',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/products - Get all products or filter by query params
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build query
    let query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (userId) {
      query.userId = userId;
    }
    
    // Execute query with pagination
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments(query);
    
    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { message: 'Error fetching products' },
      { status: 500 }
    );
  }
}
