'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IconPlayerPlay, IconDownload, IconTrash } from '@tabler/icons-react';
import { NavigationBar } from '@/components/NavigationBar';
import { toast } from 'sonner';

interface AudioRecord {
  _id: string;
  userId: string;
  scriptId: string;
  audioUrl: string;
  createdAt: string;
  voiceSettings: {
    voice_id: string;
    stability: number;
    similarity_boost: number;
  };
}

export default function AudioHistoryPage() {
  const [audioRecords, setAudioRecords] = useState<AudioRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useEffect(() => {
    fetchAudioHistory();
  }, []);

  const fetchAudioHistory = async () => {
    try {
      const response = await fetch('/api/audio-history');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch audio history');
      }

      setAudioRecords(data.records);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load audio history');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (audioUrl: string, id: string) => {
    if (currentlyPlaying === id) {
      // Stop playing
      setCurrentlyPlaying(null);
      return;
    }

    const audio = new Audio(audioUrl);
    audio.play();
    setCurrentlyPlaying(id);
    
    audio.onended = () => {
      setCurrentlyPlaying(null);
    };
  };

  const handleDownload = async (audioUrl: string) => {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audio.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to download audio');
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
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Audio <span className="text-[#00E599]">History</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Your generated audio files
            </p>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E599] mx-auto" />
              </div>
            ) : audioRecords.length > 0 ? (
              audioRecords.map((record) => (
                <motion.div
                  key={record._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#151921] p-6 rounded-xl border border-white/10 hover:border-white/20 
                  transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-gray-300 font-medium">
                        Generated on {new Date(record.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-400">
                        Voice ID: {record.voiceSettings.voice_id}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePlay(record.audioUrl, record._id)}
                        className="p-2 text-gray-400 hover:text-white bg-[#0C1117] rounded-lg 
                        hover:bg-[#0C1117]/80 transition-all"
                      >
                        <IconPlayerPlay 
                          size={20}
                          className={currentlyPlaying === record._id ? 'text-[#00E599]' : ''} 
                        />
                      </button>
                      <button
                        onClick={() => handleDownload(record.audioUrl)}
                        className="p-2 text-gray-400 hover:text-white bg-[#0C1117] rounded-lg 
                        hover:bg-[#0C1117]/80 transition-all"
                      >
                        <IconDownload size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                No audio files found
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <NavigationBar />
    </div>
  );
} 