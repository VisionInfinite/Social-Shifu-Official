import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import AssetModel from '@/lib/models/Asset';
import ScriptModel from '@/lib/models/Script';
import { Asset } from '@/lib/types';

const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';
const PIXABAY_API_URL = 'https://pixabay.com/api/';

interface AssetSearchResult {
  url: string;
  metadata: {
    source: 'unsplash' | 'pexels' | 'pixabay';
    width: number;
    height: number;
    title?: string;
    alt?: string;
    relevanceScore: number;
  };
}

async function searchUnsplashImages(query: string): Promise<AssetSearchResult[]> {
  try {
    const headers: HeadersInit = {
      'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_KEY || ''}`
    };

    const response = await fetch(
      `${UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&per_page=10`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.results.map((result: any) => ({
      url: result.urls.regular,
      metadata: {
        source: 'unsplash' as const,
        width: result.width,
        height: result.height,
        title: result.description || result.alt_description,
        alt: result.alt_description,
        relevanceScore: 1
      }
    }));
  } catch (error) {
    console.error('Error searching Unsplash:', error);
    return [];
  }
}

async function searchPexelsMedia(query: string, type: 'image' | 'video') {
  const endpoint = type === 'video' ? 
    'https://api.pexels.com/videos/search' : 
    'https://api.pexels.com/v1/search';

  const headers: HeadersInit = {
    'Authorization': process.env.NEXT_PUBLIC_PEXELS_KEY || ''
  };

  const response = await fetch(
    `${endpoint}?query=${encodeURIComponent(query)}&per_page=10`,
    { headers }
  );
  const data = await response.json();
  
  if (type === 'video') {
    return data.videos.map((video: any) => ({
      type: 'video',
      url: video.video_files[0].link,
      metadata: {
        source: 'pexels',
        width: video.width,
        height: video.height,
        duration: video.duration,
        relevanceScore: 1,
        title: video.url.split('/').pop()
      }
    }));
  }

  return data.photos.map((photo: any) => ({
    type: 'image',
    url: photo.src.large,
    metadata: {
      source: 'pexels',
      width: photo.width,
      height: photo.height,
      relevanceScore: 1,
      title: photo.alt || photo.photographer,
      alt: photo.alt
    }
  }));
}

async function searchPixabayMedia(query: string, type: 'image' | 'video') {
  const headers: HeadersInit = {
    'Accept': 'application/json'
  };

  const response = await fetch(
    `${PIXABAY_API_URL}?key=${process.env.NEXT_PUBLIC_PIXABAY_KEY}&q=${encodeURIComponent(query)}&per_page=10${type === 'video' ? '&video_type=all' : ''}`,
    { headers }
  );
  const data = await response.json();

  if (type === 'video') {
    return data.hits.map((video: any) => ({
      type: 'video',
      url: video.videos.large.url,
      metadata: {
        source: 'pixabay',
        width: video.videos.large.width,
        height: video.videos.large.height,
        duration: video.duration,
        relevanceScore: 1,
        title: video.tags
      }
    }));
  }

  return data.hits.map((img: any) => ({
    type: 'image',
    url: img.largeImageURL,
    metadata: {
      source: 'pixabay',
      width: img.imageWidth,
      height: img.imageHeight,
      relevanceScore: 1,
      title: img.tags,
      alt: img.tags
    }
  }));
}

export async function POST(request: Request) {
  try {
    const { scriptId, keywords } = await request.json();
    
    if (!scriptId || !keywords || !Array.isArray(keywords)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Search for assets across different services
    const searchPromises = keywords.map(keyword => 
      Promise.all([
        searchUnsplashImages(keyword),
        // Add other services here
      ])
    );

    const searchResults = await Promise.all(searchPromises);
    const flattenedResults = searchResults.flat(2);

    // Create and save assets
    const assetsToCreate = flattenedResults.map(result => ({
      scriptId,
      userId: 'user123', // Replace with actual user ID from auth
      type: 'image',
      url: result.url,
      metadata: result.metadata,
      keywords,
      status: 'active'
    }));

    const savedAssets = await AssetModel.insertMany(assetsToCreate);

    // Update script with asset references if scriptId is provided
    if (scriptId !== 'unsaved-script') {
      await ScriptModel.findByIdAndUpdate(
        scriptId,
        { $push: { assets: { $each: savedAssets.map(asset => asset._id) } } }
      );
    }

    return NextResponse.json({ assets: savedAssets });
  } catch (error) {
    console.error('Error generating assets:', error);
    return NextResponse.json(
      { error: 'Failed to generate assets' },
      { status: 500 }
    );
  }
} 