import mongoose, { Document, Schema } from 'mongoose';

// Define the schema for audio metadata
interface AudioDocument extends Document {
  userId: string;
  scriptId: string;
  fileName: string;
  audioUrl: string;
  voiceSettings: {
    voice_id: string;
    stability: number;
    similarity_boost: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AudioSchema = new Schema<AudioDocument>({
  userId: { type: String, required: true },
  scriptId: { type: String, required: true },
  fileName: { type: String, required: true },
  audioUrl: { type: String, required: true },
  voiceSettings: {
    voice_id: { type: String, required: true },
    stability: { type: Number, required: true },
    similarity_boost: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure indexes are created
AudioSchema.index({ userId: 1, scriptId: 1 });

const AudioModel = mongoose.models.Audio || mongoose.model<AudioDocument>('Audio', AudioSchema);

export default AudioModel;
