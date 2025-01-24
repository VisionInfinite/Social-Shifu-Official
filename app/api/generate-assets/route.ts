import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import AssetModel from '@/lib/models/Asset';
import ScriptModel from '@/lib/models/Script';

const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';
const PIXABAY_API_URL = 'https://pixabay.com/api/';

async function searchUnsplashImages(query: string) {
  const headers: HeadersInit = {
    'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_KEY || ''}`
  };

  const response = await fetch(
    `${UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&per_page=10`,
    { headers }
  );
  const data = await response.json();
  return data.results.map((img: any) => ({
    type: 'image',
    url: img.urls.regular,
    metadata: {
      source: 'unsplash',
      width: img.width,
      height: img.height,
      relevanceScore: 1,
      title: img.description || img.alt_description,
      alt: img.alt_description
    }
  }));
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
    const { scriptId, type, keywords, query } = await request.json();

    await connectMongoDB();

    // Skip script verification for unsaved scripts
    let userId = 'user123';
    if (scriptId !== 'unsaved-script') {
      const script = await ScriptModel.findById(scriptId);
      if (!script) {
        return NextResponse.json(
          { error: 'Script not found' },
          { status: 404 }
        );
      }
      userId = script.userId;
    }

    // Search for assets across different platforms
    const searchQuery = query || keywords.join(' ');
    let assets = [];

    if (type === 'image') {
      const [unsplashResults, pexelsResults, pixabayResults] = await Promise.all([
        searchUnsplashImages(searchQuery),
        searchPexelsMedia(searchQuery, 'image'),
        searchPixabayMedia(searchQuery, 'image')
      ]);
      assets = [...unsplashResults, ...pexelsResults, ...pixabayResults];
    } else {
      const [pexelsResults, pixabayResults] = await Promise.all([
        searchPexelsMedia(searchQuery, 'video'),
        searchPixabayMedia(searchQuery, 'video')
      ]);
      assets = [...pexelsResults, ...pixabayResults];
    }

    // Save assets to database
    const savedAssets = await Promise.all(
      assets.map(async (asset) => {
        const newAsset = new AssetModel({
          scriptId: scriptId === 'unsaved-script' ? null : scriptId,
          userId,
          type: asset.type,
          url: asset.url,
          metadata: asset.metadata,
          keywords: keywords,
          status: 'active'
        });
        return await newAsset.save();
      })
    );

    // Only update script if it exists
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