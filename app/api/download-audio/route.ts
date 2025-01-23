import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

// Parse the private key properly
const privateKey = process.env.GCS_PRIVATE_KEY 
  ? process.env.GCS_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/\n/g, '\n')
  : undefined;

if (!process.env.GCS_PROJECT_ID || !process.env.GCS_CLIENT_EMAIL || !privateKey || !process.env.GCS_BUCKET_NAME) {
  throw new Error('Missing required GCS environment variables');
}

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: privateKey,
  },
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

export async function POST(request: Request) {
  try {
    const { audioUrl } = await request.json();
    
    // Extract the file path from the URL
    const urlParts = audioUrl.split('/');
    const fileName = urlParts[urlParts.length - 1].split('?')[0];
    const filePath = `audio/${fileName}`;

    // Get the file from GCS
    const file = bucket.file(filePath);
    const [exists] = await file.exists();

    if (!exists) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Get the file content
    const [content] = await file.download();

    // Return the file content with appropriate headers
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
} 