import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    await dbConnect('MONGODB_URI_USERS');
    const { name, email, password } = await req.json();

    // 1. Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json({ error: 'User already registered' }, { status: 400 });
      }
      // If user exists but not verified, we can update them
    }

    // 3. Generate OTP (Kept for schema compatibility, but not sent)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    if (existingUser) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      existingUser.isVerified = true; // Auto-verify
      await existingUser.save();
    } else {
      await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpires,
        isVerified: true, // Auto-verify
      });
    }

    /* 
    // 5. Email disabled as requested
    try {
      await transporter.sendMail({
        from: `"TaskManager" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Registration OTP',
        text: `Your OTP for registration is: ${otp}. It expires in 10 minutes.`,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 });
    }
    */

    return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
