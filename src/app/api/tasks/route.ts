import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';

export async function GET() {
  try {
    await dbConnect();
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const task = await Task.create(body);
    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
