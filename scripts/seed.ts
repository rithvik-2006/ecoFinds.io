// // scripts/seed.ts
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Load environment variables from the root directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.resolve(__dirname, '../.env') });

// const MONGODB_URI = process.env.MONGODB_URI;

// // Define Product Schema inline (since we can't import the model in ES modules without proper setup)
// const productSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   category: { type: String, required: true },
//   image: { type: String },
//   seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   status: { type: String, enum: ['active', 'sold', 'inactive'], default: 'active' },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// // Sample eco-friendly products data
// const sampleProducts = [
//   {
//     title: 'Vintage Camera',
//     description: 'Classic 35mm film camera in excellent condition. Perfect for photography enthusiasts looking for authentic analog experience.',
//     price: 299.99,
//     category: 'electronics',
//     image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500',
//     seller: new mongoose.Types.ObjectId(),
//     status: 'active',
//   },
//   {
//     title: 'Organic Cotton T-Shirt',
//     description: '100% organic cotton, fair-trade certified. Soft, breathable, and sustainable fashion choice.',
//     price: 24.99,
//     category: 'fashion',
//     image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
//     seller: new mongoose.Types.ObjectId(),
//     status: 'active',
//   },
//   {
//     title: 'Bamboo Cutting Board',
//     description: 'Eco-friendly bamboo cutting board. Durable, antibacterial, and sustainably sourced.',
//     price: 39.99,
//     category: 'home',
//     image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500',
//     seller: new mongoose.Types.ObjectId(),
//     status: 'active',
//   },
//   {
//     title: 'Recycled Glass Vase',
//     description: 'Beautiful handcrafted vase made from 100% recycled glass. Each piece is unique.',
//     price: 45.00,
//     category: 'home',
//     image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500',
//     seller: new mongoose.Types.ObjectId(),
//     status: 'active',
//   },
//   {
//     title: 'Solar Power Bank',
//     description: '10000mAh solar-powered portable charger. Perfect for outdoor adventures and reducing carbon footprint.',
//     price: 59.99,
//     category: 'electronics',
//     image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
//     seller: new mongoose.Types.ObjectId(),
//     status: 'active',
//   },
//   {
//     title: 'Upcycled Denim Bag',
//     description: 'Stylish tote bag made from upcycled denim jeans. Spacious and eco-conscious.',
//     price: 34.99,
//     category: 'fashion',
//     image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500',
//     seller: new mongoose.Types.ObjectId(),
//     status: 'active',
//   },
//   {
//     title: 'Reusable Water Bottle',
//     description: 'Stainless steel insulated water bottle. Keeps drinks cold for 24 hours, hot for 12 hours.',
//     price: 29.99,
//     category: 'outdoor',
//     image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
//     seller: new mongoose.Types.ObjectId(),
//     status: 'active',
//   },
//   {
//     title: 'Second-Hand Laptop',
//     description: 'Dell XPS 13 (2020) - Refurbished in excellent condition. i5 processor, 8GB RAM, 256GB SSD.',
//     price: 449.99,
//     category: 'electronics',
//     image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
//     seller: new mongoose.Types.ObjectId(),
//     status: 'active',
//   },
//   {
//     title: 'Plant-Based Cookbook',
//     description: 'Comprehensive guide to sustainable plant-based cooking. 200+ delicious recipes.',
//     price: 19.99,
//     category: 'books',
//     image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
//     seller: new mongoose.Types.ObjectId(),
//     status: 'active',
//   },
//   {
//     title: 'Hemp Yoga Mat',
//     description: 'Natural hemp fiber yoga mat. Non-toxic, biodegradable, and provides excellent grip.',
//     price: 54.99,
//     category: 'outdoor',
//     image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
//     seller: new mongoose.Types.ObjectId(),
//     status: 'active',
//   },
//   {
//     title: 'Wooden Phone Stand',
//     description: 'Handcrafted phone stand made from reclaimed wood. Adjustable angle and universal fit.',
//     price: 22.99,
//     category: 'electronics',
//     image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
//     seller: new mongoose.Types.ObjectId(),
//     status: 'active',
//   },
//   {
//     title: 'Eco-Friendly Sneakers',
//     description: 'Sustainable sneakers made from recycled ocean plastic. Comfortable and stylish.',
//     price: 89.99,
//     category: 'fashion',
//     image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
//     seller: new mongoose.Types.ObjectId(),
//     status: 'active',
//   },
// ];

// // Seed function
// async function seedDatabase() {
//   try {
//     console.log('🌱 Starting database seeding...');

//     // Connect to MongoDB
//     if (!MONGODB_URI) {
//       throw new Error('MONGODB_URI is not defined in environment variables');
//     }

//     await mongoose.connect(MONGODB_URI);
//     console.log('✅ Connected to MongoDB');

//     // Clear existing products (optional - comment out if you want to keep existing data)
//     await Product.deleteMany({});
//     console.log('🗑️  Cleared existing products');

//     // Insert sample products
//     const insertedProducts = await Product.insertMany(sampleProducts);
//     console.log(`✅ Successfully seeded ${insertedProducts.length} products`);

//     // Display inserted products
//     console.log('\n📦 Inserted Products:');
//     insertedProducts.forEach((product, index) => {
//       console.log(`${index + 1}. ${product.title} - $${product.price}`);
//     });

//   } catch (error) {
//     console.error('❌ Error seeding database:', error);
//     process.exit(1);
//   } finally {
//     // Close database connection
//     await mongoose.connection.close();
//     console.log('\n🔌 Database connection closed');
//     process.exit(0);
//   }
// }

// // Run the seed function
// seedDatabase();

// scripts/seed.ts
import mongoose from 'mongoose';
import Product from '../models/Product';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

// Sample eco-friendly products data
const sampleProducts = [
  {
    title: 'Vintage Camera',
    description: 'Classic 35mm film camera in excellent condition. Perfect for photography enthusiasts looking for authentic analog experience.',
    price: 299.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500',
    seller: new mongoose.Types.ObjectId(), // Temporary ID - replace with actual user ID if needed
    status: 'active',
  },
  {
    title: 'Organic Cotton T-Shirt',
    description: '100% organic cotton, fair-trade certified. Soft, breathable, and sustainable fashion choice.',
    price: 24.99,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    seller: new mongoose.Types.ObjectId(),
    status: 'active',
  },
  {
    title: 'Bamboo Cutting Board',
    description: 'Eco-friendly bamboo cutting board. Durable, antibacterial, and sustainably sourced.',
    price: 39.99,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500',
    seller: new mongoose.Types.ObjectId(),
    status: 'active',
  },
  {
    title: 'Recycled Glass Vase',
    description: 'Beautiful handcrafted vase made from 100% recycled glass. Each piece is unique.',
    price: 45.00,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500',
    seller: new mongoose.Types.ObjectId(),
    status: 'active',
  },
  {
    title: 'Solar Power Bank',
    description: '10000mAh solar-powered portable charger. Perfect for outdoor adventures and reducing carbon footprint.',
    price: 59.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    seller: new mongoose.Types.ObjectId(),
    status: 'active',
  },
  {
    title: 'Upcycled Denim Bag',
    description: 'Stylish tote bag made from upcycled denim jeans. Spacious and eco-conscious.',
    price: 34.99,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500',
    seller: new mongoose.Types.ObjectId(),
    status: 'active',
  },
  {
    title: 'Reusable Water Bottle',
    description: 'Stainless steel insulated water bottle. Keeps drinks cold for 24 hours, hot for 12 hours.',
    price: 29.99,
    category: 'outdoor',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    seller: new mongoose.Types.ObjectId(),
    status: 'active',
  },
  {
    title: 'Second-Hand Laptop',
    description: 'Dell XPS 13 (2020) - Refurbished in excellent condition. i5 processor, 8GB RAM, 256GB SSD.',
    price: 449.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    seller: new mongoose.Types.ObjectId(),
    status: 'active',
  },
  {
    title: 'Plant-Based Cookbook',
    description: 'Comprehensive guide to sustainable plant-based cooking. 200+ delicious recipes.',
    price: 19.99,
    category: 'books',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
    seller: new mongoose.Types.ObjectId(),
    status: 'active',
  },
  {
    title: 'Hemp Yoga Mat',
    description: 'Natural hemp fiber yoga mat. Non-toxic, biodegradable, and provides excellent grip.',
    price: 54.99,
    category: 'outdoor',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    seller: new mongoose.Types.ObjectId(),
    status: 'active',
  },
  {
    title: 'Wooden Phone Stand',
    description: 'Handcrafted phone stand made from reclaimed wood. Adjustable angle and universal fit.',
    price: 22.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    seller: new mongoose.Types.ObjectId(),
    status: 'active',
  },
  {
    title: 'Eco-Friendly Sneakers',
    description: 'Sustainable sneakers made from recycled ocean plastic. Comfortable and stylish.',
    price: 89.99,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    seller: new mongoose.Types.ObjectId(),
    status: 'active',
  },
];

// Seed function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products (optional - comment out if you want to keep existing data)
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${insertedProducts.length} products`);

    // Display inserted products
    console.log('\n📦 Inserted Products:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - $${product.price}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();