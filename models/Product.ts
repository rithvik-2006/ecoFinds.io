// models/Product.ts
import mongoose from 'mongoose';

export interface IProduct {
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  condition?: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    title: { 
      type: String, 
      required: [true, 'Please provide a title'],
      trim: true
    },
    description: { 
      type: String, 
      required: [true, 'Please provide a description'],
      trim: true 
    },
    price: { 
      type: Number, 
      required: [true, 'Please provide a price'],
      min: [0, 'Price must be a positive number']
    },
    image: { 
      type: String
    },
    category: { 
      type: String,
      trim: true
    },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
      default: 'Good'
    },
    userId: { 
      type: String, 
      required: true,
      index: true
    },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
