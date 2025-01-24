// app/api/assets/route.ts
import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import { Asset } from '@/lib/types';
import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
  scriptId: { type: String, required: true },
  userId: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], required: true },
  url: { type: String, required: true },
  metadata: {
    source: { type: String, required: true },
    width: Number,
    height: Number,
    duration: Number,
    relevanceScore: Number,
    title: String,
    alt: String
  },
  keywords: [String],
  status: { 
    type: String, 
    enum: ['pending', 'active', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AssetModel = mongoose.models.Asset || mongoose.model('Asset', AssetSchema);

export async function POST(request: Request) {
  try {
    await connectMongoDB();
    const asset = await request.json();
    const savedAsset = await AssetModel.create(asset);
    return NextResponse.json(savedAsset);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to store asset' },
      { status: 500 }
    );
  }
}
