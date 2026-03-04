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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const body = await req.json();

    // Verify ownership before update
    const existingTask = await Task.findOne({ _id: id, userId });
    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });
    }

    // Restrict updates to only 'status' field as per requirement
    const allowedUpdates = { status: body.status };
    
    const task = await Task.findByIdAndUpdate(id, allowedUpdates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only developer can delete from backend. Disabling for API.
  return NextResponse.json(
    { error: 'Only developer can delete tasks from backend MongoDB' }, 
    { status: 403 }
  );
}
