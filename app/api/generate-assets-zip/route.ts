import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import JSZip from 'jszip';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { Asset } from '@/lib/types';

// Define types for API responses
interface UnsplashImage {
  urls: { regular: string; };
}

interface UnsplashResponse {
  results: UnsplashImage[];
}

interface PexelsPhoto {
  src: { large: string; };
}

interface PexelsVideo {
  video_files: Array<{
    link: string;
    quality: string;
    width: number;
    height: number;
  }>;
}

interface PexelsPhotoResponse {
  photos: PexelsPhoto[];
}

interface PexelsVideoResponse {
  videos: PexelsVideo[];
}

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '');

async function downloadFile(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function searchImages(keyword: string): Promise<string | null> {
  try {
    // Search Unsplash
    const unsplashResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=1`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_KEY}`
        }
      }
    );
    const unsplashData = await unsplashResponse.json() as UnsplashResponse;
    if (unsplashData.results?.[0]) {
      return unsplashData.results[0].urls.regular;
    }

    // Fallback to Pexels if Unsplash fails
    const pexelsResponse = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=1`,
      {
        headers: {
          'Authorization': process.env.NEXT_PUBLIC_PEXELS_KEY || ''
        }
      }
    );
    const pexelsData = await pexelsResponse.json() as PexelsPhotoResponse;
    if (pexelsData.photos?.[0]) {
      return pexelsData.photos[0].src.large;
    }

    return null;
  } catch (error) {
    console.error(`Error searching images for keyword "${keyword}":`, error);
    return null;
  }
}

async function searchVideos(keyword: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(keyword)}&per_page=1`,
      {
        headers: {
          'Authorization': process.env.NEXT_PUBLIC_PEXELS_KEY || ''
        }
      }
    );
    const data = await response.json() as PexelsVideoResponse;
    
    // Get the HD quality video if available
    const video = data.videos?.[0]?.video_files.find(
      file => file.quality === 'hd' && file.width <= 1920
    ) || data.videos?.[0]?.video_files[0];

    return video?.link || null;
  } catch (error) {
    console.error(`Error searching videos for keyword "${keyword}":`, error);
    return null;
  }
}

async function searchBackgrounds(keyword: string): Promise<string | null> {
  try {
    // Search for background/wallpaper images on Unsplash
    const unsplashResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword + ' background wallpaper')}&orientation=landscape&per_page=1`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_KEY}`
        }
      }
    );
    const unsplashData = await unsplashResponse.json() as UnsplashResponse;
    if (unsplashData.results?.[0]) {
      return unsplashData.results[0].urls.regular;
    }

    // Fallback to Pexels
    const pexelsResponse = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword + ' background')}&orientation=landscape&per_page=1`,
      {
        headers: {
          'Authorization': process.env.NEXT_PUBLIC_PEXELS_KEY || ''
        }
      }
    );
    const pexelsData = await pexelsResponse.json() as PexelsPhotoResponse;
    if (pexelsData.photos?.[0]) {
      return pexelsData.photos[0].src.large;
    }

    return null;
  } catch (error) {
    console.error(`Error searching backgrounds for keyword "${keyword}":`, error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { keywords, scriptId, metadata } = await request.json();

    if (!keywords || !Array.isArray(keywords)) {
      return NextResponse.json(
        { error: 'Invalid keywords' },
        { status: 400 }
      );
    }

    // Create a new ZIP file with separate folders
    const zip = new JSZip();
    const imagesFolder = zip.folder('images');
    const videosFolder = zip.folder('videos');
    const backgroundsFolder = zip.folder('backgrounds');

    if (!imagesFolder || !videosFolder || !backgroundsFolder) {
      throw new Error('Failed to create folders in ZIP');
    }

    // Process images, videos, and backgrounds
    const downloadPromises = keywords.map(async (keyword, index) => {
      try {
        // Try to get all asset types for each keyword
        const [imageUrl, videoUrl, backgroundUrl] = await Promise.all([
          searchImages(keyword),
          searchVideos(keyword),
          searchBackgrounds(keyword)
        ]);

        // Download and add image if found
        if (imageUrl) {
          const imageBuffer = await downloadFile(imageUrl);
          const imageName = `${index + 1}_${keyword.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
          imagesFolder.file(imageName, imageBuffer);
        }

        // Download and add video if found
        if (videoUrl) {
          const videoBuffer = await downloadFile(videoUrl);
          const videoName = `${index + 1}_${keyword.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
          videosFolder.file(videoName, videoBuffer);
        }

        // Download and add background if found
        if (backgroundUrl) {
          const backgroundBuffer = await downloadFile(backgroundUrl);
          const backgroundName = `${index + 1}_${keyword.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_bg.jpg`;
          backgroundsFolder.file(backgroundName, backgroundBuffer);
        }

      } catch (error) {
        console.error(`Error processing keyword "${keyword}":`, error);
      }
    });

    await Promise.all(downloadPromises);

    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Upload ZIP to Google Cloud Storage
    const zipFileName = `assets_${scriptId}_${uuidv4()}.zip`;
    const file = bucket.file(`zips/${zipFileName}`);
    
    await file.save(zipBuffer, {
      metadata: {
        contentType: 'application/zip',
        metadata: {
          scriptId,
          ...metadata
        }
      }
    });

    // Generate signed URL for download
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    return NextResponse.json({ zipUrl: url });
  } catch (error) {
    console.error('Error generating assets ZIP:', error);
    return NextResponse.json(
      { error: 'Failed to generate assets ZIP' },
      { status: 500 }
    );
  }
} 