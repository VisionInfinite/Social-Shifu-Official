// lib/types.ts

// Base metadata interface for reuse
interface BaseMetadata {
  topic: string;
  description: string;
  keywords: string[];
  tone: string;
  duration: string;
}

// Script interface with proper typing
export interface Script {
  _id: string;
  userId: string;
  topic: string;
  description: string;
  keywords: string[];
  tone: string;
  duration: string;
  content: string;
  assets?: Asset[];  // Reference to associated assets
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Generated script with metadata
export interface GeneratedScript {
  content: string;
  metadata: BaseMetadata;
}

// Asset interface with enhanced typing
export interface Asset {
  _id: string;
  scriptId: string;
  userId: string;
  type: 'image' | 'video';
  url: string;
  metadata: {
    source: 'unsplash' | 'pexels' | 'pixabay';  // Specific sources
    width: number;
    height: number;
    duration?: number;  // Optional for videos
    relevanceScore: number;
    title?: string;     // Optional asset title
    alt?: string;       // Optional alt text
  };
  keywords: string[];
  status: 'pending' | 'active' | 'failed';  // Asset status
  createdAt: Date | string;
  updatedAt: Date | string;
}
