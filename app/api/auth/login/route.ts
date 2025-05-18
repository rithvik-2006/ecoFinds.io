import mongoose from 'mongoose';
import User from '@/models/User';
import { generateToken } from '@/lib/auth-utils';
import { connectDB } from '@/lib/db';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    if (!email || !password) {
      console.log('Missing credentials:', { email: !!email, password: !!password });
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Email and password are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    try {
      const user = await User.findByCredentials(email, password);
      
      // Generate JWT token
      const token = generateToken(user._id.toString());
      
      return new Response(JSON.stringify({ 
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Authentication error:', error);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid email or password'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Login failed'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
