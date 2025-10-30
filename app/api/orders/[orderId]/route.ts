// // app/api/orders/[orderId]/route.ts
// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/db';
// import Order from '@/models/Order';
// import { verifyToken, getTokenFromHeader } from '@/lib/auth-utils';

// // GET /api/orders/[orderId] - Get specific order
// export async function GET(
//   request: Request,
//   { params }: { params: { orderId: string } }
// ) {
//   try {
//     const token = getTokenFromHeader(request);
//     if (!token) {
//       return NextResponse.json(
//         { message: 'No token provided' },
//         { status: 401 }
//       );
//     }

//     const userId = await verifyToken(token);
//     if (!userId) {
//       return NextResponse.json(
//         { message: 'Invalid token' },
//         { status: 401 }
//       );
//     }

//     await connectDB();

//     const order = await Order.findOne({ orderId: params.orderId })
//       .populate('items.productId', 'title image');

//     if (!order) {
//       return NextResponse.json(
//         { message: 'Order not found' },
//         { status: 404 }
//       );
//     }

//     // Verify user owns this order
//     if (order.buyer.toString() !== userId) {
//       return NextResponse.json(
//         { message: 'Not authorized' },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       order
//     });

//   } catch (error) {
//     console.error('Order fetch error:', error);
//     return NextResponse.json(
//       { message: 'Failed to fetch order' },
//       { status: 500 }
//     );
//   }
// }


// // app/api/orders/[orderId]/route.ts
// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/db';
// import Order from '@/models/Order';
// import { verifyToken, getTokenFromHeader } from '@/lib/auth-utils';

// // GET /api/orders/[orderId] - Get specific order
// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ orderId: string }> }
// ) {
//   try {
//     const token = getTokenFromHeader(request);
//     if (!token) {
//       return NextResponse.json(
//         { message: 'No token provided' },
//         { status: 401 }
//       );
//     }

//     const userId = await verifyToken(token);
//     if (!userId) {
//       return NextResponse.json(
//         { message: 'Invalid token' },
//         { status: 401 }
//       );
//     }

//     await connectDB();

//     // Await params in Next.js 15
//     const { orderId } = await params;

//     // Find by orderId (not _id)
//     const order = await Order.findOne({ orderId })
//       .populate('items.productId', 'title image category price')
//       .lean()
//       .exec();

//     if (!order) {
//       return NextResponse.json(
//         { message: 'Order not found' },
//         { status: 404 }
//       );
//     }

//     // Verify user owns this order
//     if (order.buyer.toString() !== userId) {
//       return NextResponse.json(
//         { message: 'Not authorized' },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       order
//     });

//   } catch (error) {
//     console.error('Order fetch error:', error);
//     return NextResponse.json(
//       { message: 'Failed to fetch order' },
//       { status: 500 }
//     );
//   }
// }

// app/api/orders/[orderId]/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { verifyToken, getTokenFromHeader } from '@/lib/auth-utils';
import { Types } from 'mongoose';

// Define the Order type for better type safety
interface OrderDocument {
  _id: Types.ObjectId;
  orderId: string;
  buyer: Types.ObjectId;
  items: Array<{
    productId: {
      _id: Types.ObjectId;
      title: string;
      image: string;
      category: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

// GET /api/orders/[orderId] - Get specific order
export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
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
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    // Await params in Next.js 15
    const { orderId } = await params;

    // Find by orderId (not _id) and type the result
    const order = await Order.findOne({ orderId })
      .populate('items.productId', 'title image category price')
      .lean<OrderDocument>()
      .exec();

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify user owns this order
    if (order.buyer.toString() !== userId) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}