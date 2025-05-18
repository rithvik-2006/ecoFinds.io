import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { email, password, username } = await request.json();
    
    // Validate input
    if (!email || !password || !username) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email, password, and username are required' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Password must be at least 6 characters long' 
        },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email already in use' 
        },
        { status: 400 }
      );
    }
    
    // Create new user (password will be hashed by the User model's pre-save middleware)
    const user = new User({
      email,
      password,
      username,
    });
    
    await user.save();
    
    // Generate JWT token
    const token = generateToken(user._id.toString());
    
    // Return user data (excluding password) and token
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Error creating user'
      },
      { status: 500 }
    );
  }
}
