// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { verifyToken, getTokenFromHeader } from '@/lib/auth-utils';
import mongoose from 'mongoose';

// POST /api/orders - Create a new order
export async function POST(request: Request) {
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
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    const { items, buyerEmail, buyerPhone, shippingAddress } = await request.json();

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Fetch product details and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return NextResponse.json(
          { message: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
    }
    const date = new Date();
const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
const orderId = `ORD${dateStr}-${random}`;
    // Create order
    // const order = await Order.create({
    //   buyer: new mongoose.Types.ObjectId(userId),
    //   buyerEmail,
    //   buyerPhone,
    //   items: orderItems,
    //   totalAmount,
    //   shippingAddress,
    //   status: 'pending'
    // });
    const order = await Order.create({
        orderId,  // Explicitly set orderId
        buyer: new mongoose.Types.ObjectId(userId),
        buyerEmail,
        buyerPhone,
        items: orderItems,
        totalAmount,
        shippingAddress,
        status: 'pending'
      });
    return NextResponse.json({
      success: true,
      order: {
        _id: order._id,
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to create order',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get user's orders
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
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    const orders = await Order.find({ buyer: userId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'title image');

    return NextResponse.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
