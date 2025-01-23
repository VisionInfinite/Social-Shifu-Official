'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  IconMicrophone, 
  IconPlayerPlay, 
  IconLoader2,
  IconDownload,
  IconPlayerStop
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { NavigationBar } from '@/components/NavigationBar';

interface VoiceOption {
  id: string;
  name: string;
  description: string;
  preview_url: string;
}

const voiceOptions: VoiceOption[] = [
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    description: "Calm and professional female voice",
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/6edb9076-c3e4-420c-b6ab-11d43fe341c8.mp3"
  },
  {
    id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi",
    description: "Energetic male voice",
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/AZnzlk1XvdvUeBnXmlld/69c5373f-0dc2-4efd-9232-a0140182c0a9.mp3"
  },
  // Add more voice options as needed
];

export default function GenerateAudioPage() {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<string>(voiceOptions[0].id);
  const [stability, setStability] = useState(0.5);
  const [similarityBoost, setSimilarityBoost] = useState(0.75);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const router = useRouter();

  const handlePreviewVoice = (previewUrl: string) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    const audio = new Audio(previewUrl);
    audio.play();
    setCurrentAudio(audio);
  };

  const handlePlayGenerated = () => {
    if (!generatedAudioUrl) return;

    if (isPlaying && currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    const audio = new Audio(generatedAudioUrl);
    audio.play();
    setCurrentAudio(audio);
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
    };
  };

  const handleDownload = async () => {
    if (!generatedAudioUrl) return;

    try {
      const response = await fetch('/api/download-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl: generatedAudioUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-audio-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Audio downloaded successfully!');
    } catch (error) {
      console.error('Error downloading audio:', error);
      toast.error('Failed to download audio');
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user123', // Replace with actual user ID
          scriptId: Date.now().toString(),
          text,
          voiceSettings: {
            voice_id: selectedVoice,
            stability,
            similarity_boost: similarityBoost
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate audio');
      }

      setGeneratedAudioUrl(data.audioUrl);
      toast.success('Audio generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate audio. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C1117]">
      <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Text to <span className="text-[#00E599]">Speech</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Transform your text into natural-sounding speech
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-[#151921] p-6 md:p-8 rounded-2xl border border-white/10 space-y-6">
            {/* Text Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Text to Convert
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-40 px-4 py-3 bg-[#0C1117] border border-white/10 rounded-xl 
                text-white focus:ring-2 focus:ring-[#00E599] focus:border-transparent transition-all 
                resize-none"
                placeholder="Enter your text here..."
              />
            </div>

            {/* Voice Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-200">
                Select Voice
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {voiceOptions.map((voice) => (
                  <div
                    key={voice.id}
                    className={`p-4 rounded-xl border transition-all cursor-pointer
                    ${selectedVoice === voice.id 
                      ? 'border-[#00E599] bg-[#0C1117]' 
                      : 'border-white/10 bg-[#0C1117]/50 hover:border-white/20'
                    }`}
                    onClick={() => setSelectedVoice(voice.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-white">{voice.name}</h3>
                        <p className="text-sm text-gray-400">{voice.description}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewVoice(voice.preview_url);
                        }}
                        className="p-2 text-gray-400 hover:text-white bg-[#0C1117] rounded-lg 
                        hover:bg-[#0C1117]/80 transition-all"
                      >
                        <IconPlayerPlay size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voice Settings */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-200">
                Voice Settings
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Stability</span>
                    <span className="text-gray-300">{stability}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={stability}
                    onChange={(e) => setStability(parseFloat(e.target.value))}
                    className="w-full accent-[#00E599]"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Similarity Boost</span>
                    <span className="text-gray-300">{similarityBoost}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={similarityBoost}
                    onChange={(e) => setSimilarityBoost(parseFloat(e.target.value))}
                    className="w-full accent-[#00E599]"
                  />
                </div>
              </div>
            </div>

            {/* Generated Audio Controls */}
            {generatedAudioUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#151921] p-6 rounded-xl border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">Generated Audio</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePlayGenerated}
                      className="p-3 text-gray-400 hover:text-white bg-[#0C1117] rounded-lg 
                      hover:bg-[#0C1117]/80 transition-all"
                      title={isPlaying ? "Stop" : "Play"}
                    >
                      {isPlaying ? (
                        <IconPlayerStop size={20} />
                      ) : (
                        <IconPlayerPlay size={20} />
                      )}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-3 text-gray-400 hover:text-white bg-[#0C1117] rounded-lg 
                      hover:bg-[#0C1117]/80 transition-all"
                      title="Download"
                    >
                      <IconDownload size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !text.trim()}
              className="w-full py-4 px-6 bg-[#00E599] text-black font-semibold rounded-xl 
              hover:bg-[#00E599]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed 
              transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <IconLoader2 className="animate-spin" size={20} />
                  Generating Audio...
                </>
              ) : (
                <>
                  <IconMicrophone size={20} />
                  Generate Audio
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
      <NavigationBar />
    </div>
  );
} 