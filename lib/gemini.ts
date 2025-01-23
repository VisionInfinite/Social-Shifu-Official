import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure environment variables are set
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in .env.local');
}

if (!process.env.GEMINI_MODEL) {
  throw new Error('GEMINI_MODEL is not defined in .env.local');
}

// Initialize Gemini AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Get the model
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-pro" });

export async function generateContent(prompt: string): Promise<string> {
  try {
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw new Error('Failed to generate content');
  }
}
