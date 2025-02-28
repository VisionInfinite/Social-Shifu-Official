import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import ScriptModel from '@/lib/models/Script';

export async function GET() {
  try {
    await connectMongoDB();

    const scripts = await ScriptModel.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ scripts });
  } catch (error) {
    console.error('Error fetching scripts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scripts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const scriptData = await request.json();
    
    await connectMongoDB();
    
    const script = await ScriptModel.create({
      ...scriptData,
      userId: 'user123', // Replace with actual user ID when auth is implemented
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ script });
  } catch (error) {
    console.error('Error saving script:', error);
    return NextResponse.json(
      { error: 'Failed to save script' },
      { status: 500 }
    );
  }
} 