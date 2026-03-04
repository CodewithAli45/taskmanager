import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    await dbConnect('MONGODB_URI_USERS');
    
    const user = await User.findById(payload.userId).select('name email');
    
    if (!user) {
      console.warn('User not found in DB even with valid token:', payload.userId);
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    if (error.code !== 'ERR_JWT_EXPIRED') {
      console.error('Auth verification error:', error.message);
    }
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
