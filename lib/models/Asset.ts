import mongoose, { Document, Schema } from 'mongoose';
import { Asset } from '@/lib/types';

interface AssetDocument extends Omit<Asset, '_id' | 'createdAt' | 'updatedAt'>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema = new Schema<AssetDocument>({
  scriptId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  type: { type: String, required: true, enum: ['image', 'video'] },
  url: { type: String, required: true },
  metadata: {
    source: { type: String, required: true, enum: ['unsplash', 'pexels', 'pixabay'] },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    duration: { type: Number },
    relevanceScore: { type: Number, required: true },
    title: String,
    alt: String
  },
  keywords: [{ type: String }],
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'active', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure indexes are created
AssetSchema.index({ scriptId: 1, createdAt: -1 });
AssetSchema.index({ userId: 1, createdAt: -1 });
AssetSchema.index({ keywords: 1 });

const AssetModel = mongoose.models.Asset || mongoose.model<AssetDocument>('Asset', AssetSchema);

export default AssetModel; 