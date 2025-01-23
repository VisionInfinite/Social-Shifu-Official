import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import AudioModel from '@/lib/models/AudioModel';

export async function GET() {
  try {
    await connectMongoDB();

    const records = await AudioModel.find({ userId: 'user123' }) // Replace with actual user ID
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error fetching audio history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audio history' },
      { status: 500 }
    );
  }
} 