// // app/api/orders/[orderId]/payment-proof/route.ts
// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/db';
// import Order from '@/models/Order';
// import { verifyToken, getTokenFromHeader } from '@/lib/auth-utils';

// // POST /api/orders/[orderId]/payment-proof - Submit payment proof
// export async function POST(
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

//     const order = await Order.findOne({ orderId: params.orderId });

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

//     // Check if order is in valid state
//     if (order.status !== 'pending' && order.status !== 'payment_submitted') {
//       return NextResponse.json(
//         { message: 'Order cannot accept payment proof in current status' },
//         { status: 400 }
//       );
//     }

//     const {
//       transactionId,
//       upiId,
//       phoneNumber,
//       transactionTimestamp,
//       hasOrderIdInRemark
//     } = await request.json();

//     // Validate required fields
//     if (!transactionId || !transactionTimestamp || hasOrderIdInRemark === undefined) {
//       return NextResponse.json(
//         { message: 'Missing required payment proof fields' },
//         { status: 400 }
//       );
//     }

//     // Check if order ID was included in remark
//     if (!hasOrderIdInRemark) {
//       return NextResponse.json(
//         { message: 'Order ID must be included in UPI transaction remark' },
//         { status: 400 }
//       );
//     }

//     // Update order with payment proof
//     order.paymentProof = {
//       transactionId,
//       upiId,
//       phoneNumber,
//       transactionTimestamp: new Date(transactionTimestamp),
//       hasOrderIdInRemark,
//       submittedAt: new Date()
//     };
//     order.status = 'payment_submitted';
//     order.updatedAt = new Date();

//     await order.save();

//     // Auto-verification logic could go here
//     // For now, all orders go to manual review
    
//     return NextResponse.json({
//       success: true,
//       message: 'Payment proof submitted successfully. Order is under verification.',
//       order: {
//         orderId: order.orderId,
//         status: order.status,
//         paymentProof: order.paymentProof
//       }
//     });

//   } catch (error) {
//     console.error('Payment proof submission error:', error);
//     return NextResponse.json(
//       { 
//         message: 'Failed to submit payment proof',
//         error: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     );
//   }
// }


// app/api/orders/[orderId]/payment-proof/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { verifyToken, getTokenFromHeader } from '@/lib/auth-utils';

// POST /api/orders/[orderId]/payment-proof - Submit payment proof
export async function POST(
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

    const order = await Order.findOne({ orderId });

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

    // Check if order is in valid state
    if (order.status !== 'pending' && order.status !== 'payment_submitted') {
      return NextResponse.json(
        { message: 'Order cannot accept payment proof in current status' },
        { status: 400 }
      );
    }

    const {
      transactionId,
      upiId,
      phoneNumber,
      transactionTimestamp,
      hasOrderIdInRemark
    } = await request.json();

    // Validate required fields
    if (!transactionId || !transactionTimestamp || hasOrderIdInRemark === undefined) {
      return NextResponse.json(
        { message: 'Missing required payment proof fields' },
        { status: 400 }
      );
    }

    // Check if order ID was included in remark
    if (!hasOrderIdInRemark) {
      return NextResponse.json(
        { message: 'Order ID must be included in UPI transaction remark' },
        { status: 400 }
      );
    }

    // Update order with payment proof
    order.paymentProof = {
      transactionId,
      upiId,
      phoneNumber,
      transactionTimestamp: new Date(transactionTimestamp),
      hasOrderIdInRemark,
      submittedAt: new Date()
    };
    order.status = 'payment_submitted';
    order.updatedAt = new Date();

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Payment proof submitted successfully. Order is under verification.',
      order: {
        orderId: order.orderId,
        status: order.status,
        paymentProof: order.paymentProof
      }
    });

  } catch (error) {
    console.error('Payment proof submission error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to submit payment proof',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
