import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-pro' });

export async function POST(request: Request) {
  try {
    const { topic, description, keywords, tone, duration } = await request.json();

    // First prompt for detailed script with scene directions
    const detailedPrompt = `Create a ${duration} video script about "${topic}". 
    Description: ${description}
    Keywords: ${keywords}
    Tone: ${tone}

    Format the script with:
    1. Hook
    2. Intro
    3. Main Content
    4. Call to Action
    Include [Camera Angles and Directions] and *Emphasis Points*`;

    // Second prompt for clean script
    const cleanPrompt = `Write a clean, narration-only script for a ${duration} video about "${topic}".
    Description: ${description}
    Keywords: ${keywords}
    Tone: ${tone}
    
    Write only the narration text without any scene directions, headings, or formatting.`;

    // Updated asset suggestions prompt with new format
    const assetPrompt = `Based on the video topic "${topic}" and description "${description}", provide asset suggestions in the following format:

    1️⃣ PNG Images
    Provide an array of PNG images required:
    ["image1", "image2", "image3", "image4"]
    - These will be overlaid on videos or used as supporting visuals
    - Source Priority: Unsplash, Pexels, Pixabay

    2️⃣ General Images
    Provide an array of general images required:
    ["image1", "image2", "image3"]
    - For backgrounds, scene transitions, or B-roll
    - Source Priority: Unsplash, Pexels, Pixabay
    - Will be stored in Google Cloud Storage

    3️⃣ Video Clips
    Provide an array of short video clips required:
    ["clip1", "clip2", "clip3"]
    - For B-roll and enhancing video content
    - Source Priority: Pexels for free stock videos
    - Will be stored in Google Cloud Storage

    4️⃣ Backgrounds
    Provide an array of background images required:
    ["background1", "background2", "background3"]
    - For layering behind text or AI avatars
    - Source Priority: Unsplash, Pexels, Pixabay
    - Will be stored in Google Cloud Storage

    Please provide specific, detailed descriptions for each asset that match the ${tone} tone and ${duration} duration of the video.`;

    // Generate all content in parallel
    const [detailedResponse, cleanResponse, assetResponse] = await Promise.all([
      model.generateContent(detailedPrompt),
      model.generateContent(cleanPrompt),
      model.generateContent(assetPrompt)
    ]);

    const [detailedResult, cleanResult, assetResult] = await Promise.all([
      detailedResponse.response.text(),
      cleanResponse.response.text(),
      assetResponse.response.text()
    ]);

    const generatedContent = {
      detailedScript: detailedResult,
      cleanScript: cleanResult,
      assetSuggestions: assetResult,
      metadata: {
        topic,
        description,
        keywords: Array.isArray(keywords) ? keywords : keywords.split(',').map((k: string) => k.trim()),
        tone,
        duration
      }
    };

    return NextResponse.json({ generatedContent });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    );
  }
} 