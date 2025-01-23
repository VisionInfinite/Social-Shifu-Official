import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';

export async function GET() {
  try {
    // Attempt to connect to MongoDB
    await connectMongoDB();

    // Respond with a success message
    return NextResponse.json({ message: '✅ Successfully connected to MongoDB' });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return NextResponse.json(
      { message: '❌ Failed to connect to MongoDB', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
