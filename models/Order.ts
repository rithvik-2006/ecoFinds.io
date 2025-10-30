// models/Order.ts
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: String
});

const paymentProofSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  upiId: String,
  phoneNumber: String,
  transactionTimestamp: { type: Date, required: true },
  hasOrderIdInRemark: { type: Boolean, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  buyerEmail: { type: String, required: true },
  buyerPhone: String,
  
  items: [orderItemSchema],
  
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  status: {
    type: String,
    enum: ['pending', 'payment_submitted', 'verified', 'processing', 'shipped', 'delivered', 'cancelled', 'manual_review'],
    default: 'pending',
    index: true
  },
  
  paymentProof: paymentProofSchema,
  
  verificationNotes: String,
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  shippingAddress: {
    fullName: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate unique order ID
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderId = `ORD${dateStr}-${random}`;
  }
  next();
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
