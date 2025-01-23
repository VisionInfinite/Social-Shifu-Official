import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import ScriptModel from '@/lib/models/Script';
import { generateContent } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    const { topic, description, keywords, tone, duration, scriptId } = body;

    // Validate required fields
    if (!topic || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectMongoDB();

    // Generate the script content using Gemini
    const prompt = `Create a ${duration} video script about ${topic}. 
    Description: ${description}
    Keywords: ${keywords.join(', ')}
    Tone: ${tone}
    
    Format the script with:
    1. Hook/Intro
    2. Main Content
    3. Call to Action
    4. Camera Angles and Directions in [brackets]
    5. Emphasis Points in *asterisks*
    
    Make it engaging and optimized for social media.`;

    const generatedContent = await generateContent(prompt);
    console.log('Generated content:', generatedContent);

    // Process keywords to ensure it's an array
    const processedKeywords = Array.isArray(keywords) ? keywords : keywords.split(',').map((k: string) => k.trim());

    if (scriptId) {
      // Update existing script
      const updatedScript = await ScriptModel.findByIdAndUpdate(
        scriptId,
        {
          topic,
          description,
          keywords: processedKeywords,
          tone,
          duration,
          content: generatedContent,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!updatedScript) {
        return NextResponse.json({ error: 'Script not found' }, { status: 404 });
      }

      return NextResponse.json({ 
        script: updatedScript,
        generatedContent: {
          content: generatedContent,
          metadata: {
            topic,
            description,
            keywords: processedKeywords,
            tone,
            duration
          }
        }
      });
    } else {
      // Create new script
      const newScript = await ScriptModel.create({
        userId: 'user123', // Replace with actual user ID
        topic,
        description,
        keywords: processedKeywords,
        tone,
        duration,
        content: generatedContent,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const response = {
        script: newScript,
        generatedContent: {
          content: generatedContent,
          metadata: {
            topic,
            description,
            keywords: processedKeywords,
            tone,
            duration
          }
        }
      };

      console.log('Response:', response);
      return NextResponse.json(response);
    }
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    );
  }
} 