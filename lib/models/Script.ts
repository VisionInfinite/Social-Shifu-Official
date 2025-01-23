import mongoose, { Document, Schema } from 'mongoose';
import { Script } from '@/lib/types';

// Extend Document and use Omit to remove _id and modify date types
export interface ScriptDocument extends Omit<Script, '_id' | 'createdAt' | 'updatedAt'>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const ScriptSchema = new Schema<ScriptDocument>({
  userId: { type: String, required: true, index: true },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  keywords: [{ type: String }],
  tone: { type: String, required: true },
  duration: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Schema.Types.Date, default: Date.now },
  updatedAt: { type: Schema.Types.Date, default: Date.now }
});

// Ensure indexes are created
ScriptSchema.index({ userId: 1, createdAt: -1 });

const ScriptModel = mongoose.models.Script || mongoose.model<ScriptDocument>('Script', ScriptSchema);

export default ScriptModel;
