import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');

async function getUserId(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch (error) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    
    // Explicitly add userId to the task body
    const taskData = { ...body, userId };
    
    console.log('Creating task with data:', JSON.stringify(taskData, null, 2));
    
    const task = await Task.create(taskData);
    
    console.log('Task created successfully in DB:', task._id);
    
    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
