import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import ScriptModel from '@/lib/models/Script';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongoDB();

    const script = await ScriptModel.findByIdAndDelete(params.id);

    if (!script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Script deleted successfully' });
  } catch (error) {
    console.error('Error deleting script:', error);
    return NextResponse.json(
      { error: 'Failed to delete script' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { topic, description, keywords, tone, duration } = body;

    await connectMongoDB();

    const updatedScript = await ScriptModel.findByIdAndUpdate(
      params.id,
      {
        topic,
        description,
        keywords,
        tone,
        duration,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedScript) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ script: updatedScript });
  } catch (error) {
    console.error('Error updating script:', error);
    return NextResponse.json(
      { error: 'Failed to update script' },
      { status: 500 }
    );
  }
} 