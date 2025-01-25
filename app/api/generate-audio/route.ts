import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import AudioModel from '@/lib/models/AudioModel';

// Initialize ElevenLabs API configuration
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '');

export async function POST(request: Request) {
  try {
    const { text, voiceSettings } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key is not configured');
    }

    // Generate audio using ElevenLabs API
    const response = await fetch(`${ELEVENLABS_API_URL}/${voiceSettings.voice_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text.slice(0, 5000), // ElevenLabs has a 5000 character limit
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: voiceSettings.stability || 0.5,
          similarity_boost: voiceSettings.similarity_boost || 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ElevenLabs API Error:', errorData);
      throw new Error(errorData.detail || 'Failed to generate audio from ElevenLabs');
    }

    // Get audio buffer
    const audioBuffer = await response.arrayBuffer();

    if (!audioBuffer || audioBuffer.byteLength === 0) {
      throw new Error('Received empty audio buffer from ElevenLabs');
    }

    // Generate unique filename
    const fileName = `audio_${Date.now()}_${uuidv4()}.mp3`;

    // Upload to Google Cloud Storage
    const file = bucket.file(`audio/${fileName}`);
    
    await file.save(Buffer.from(audioBuffer), {
      metadata: {
        contentType: 'audio/mpeg',
      },
    });

    // Generate signed URL for download
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    // Save to database
    const audioRecord = await AudioModel.create({
      userId: 'user123', // Replace with actual user ID when auth is implemented
      scriptId: 'script123', // Replace with actual script ID
      fileName, // Add the fileName field
      audioUrl: url,
      voiceSettings,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      audioUrl: url,
      audioId: audioRecord._id,
      fileName
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate audio' },
      { status: 500 }
    );
  }
} 