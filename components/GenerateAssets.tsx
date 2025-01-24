'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IconPhoto, 
  IconVideo, 
  IconLoader2, 
  IconRefresh,
  IconDownload,
  IconX,
  IconCheck,
  IconSearch,
  IconArrowLeft
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { NavigationBar } from '@/components/NavigationBar';
import { Script, Asset } from '@/lib/types';
import Image from 'next/image';

export function GenerateAssets() {
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [generatedAssets, setGeneratedAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [assetType, setAssetType] = useState<'image' | 'video'>('image');
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    const savedScript = localStorage.getItem('generatedScript');
    if (savedScript) {
      try {
        const parsedScript = JSON.parse(savedScript);
        // First try to get the script from localStorage
        const savedScriptId = localStorage.getItem('lastGeneratedScriptId');
        
        setSelectedScript({
          _id: savedScriptId || 'unsaved-script', // Use saved ID or mark as unsaved
          userId: 'user123',
          topic: parsedScript.metadata.topic,
          description: parsedScript.metadata.description,
          keywords: parsedScript.metadata.keywords,
          tone: parsedScript.metadata.tone,
          duration: parsedScript.metadata.duration,
          content: parsedScript.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error parsing script:', error);
        toast.error('Failed to load script');
      }
    } else {
      toast.error('No script found. Please generate a script first.');
      router.push('/generate-script');
    }
  }, [router]);

  const handleGenerateAssets = async () => {
    if (!selectedScript) {
      toast.error('Please select a script first');
      return;
    }

    setIsLoading(true);
    try {
      // If script is unsaved, save it first
      if (selectedScript._id === 'unsaved-script') {
        const saveResponse = await fetch('/api/scripts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: selectedScript.userId,
            topic: selectedScript.topic,
            description: selectedScript.description,
            keywords: selectedScript.keywords,
            tone: selectedScript.tone,
            duration: selectedScript.duration,
            content: selectedScript.content,
          }),
        });

        const saveData = await saveResponse.json();
        if (!saveResponse.ok) {
          throw new Error(saveData.error || 'Failed to save script');
        }

        setSelectedScript({ ...selectedScript, _id: saveData._id });
        localStorage.setItem('lastGeneratedScriptId', saveData._id);
      }

      // Now generate assets with the saved script ID
      const response = await fetch('/api/generate-assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scriptId: selectedScript._id,
          type: assetType,
          keywords: selectedScript.keywords,
          query: searchQuery || selectedScript.topic,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate assets');
      }

      setGeneratedAssets(data.assets);
      toast.success(`${data.assets.length} assets generated successfully!`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate assets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssetSelect = (assetId: string) => {
    const newSelected = new Set(selectedAssets);
    if (newSelected.has(assetId)) {
      newSelected.delete(assetId);
    } else {
      newSelected.add(assetId);
    }
    setSelectedAssets(newSelected);
  };

  const handleDownloadSelected = async () => {
    if (selectedAssets.size === 0) {
      toast.error('Please select assets to download');
      return;
    }

    try {
      const selectedAssetsList = generatedAssets.filter(asset => 
        selectedAssets.has(asset._id)
      );

      for (const asset of selectedAssetsList) {
        const response = await fetch('/api/download-asset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ assetUrl: asset.url }),
        });

        if (!response.ok) throw new Error('Failed to download asset');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${asset.metadata.title || 'asset'}.${asset.type === 'video' ? 'mp4' : 'jpg'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }

      toast.success('Assets downloaded successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to download assets');
    }
  };

  return (
    <div className="min-h-screen bg-[#0C1117]">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-white bg-[#151921] rounded-lg 
            hover:bg-[#151921]/80 transition-all"
          >
            <IconArrowLeft size={20} />
          </button>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-white">
              Generate <span className="text-[#00E599]">Assets</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Create stunning visuals for your script using AI-powered image and video generation
            </p>
          </div>
          <div className="w-8" /> {/* Spacer for centering */}
        </motion.div>

        {/* Script Info */}
        {selectedScript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#151921] rounded-2xl border border-white/10 p-6"
          >
            <h2 className="text-lg font-medium text-white mb-2">
              Selected Script
            </h2>
            <p className="text-gray-400 mb-4 line-clamp-2">
              {selectedScript.topic}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedScript.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-[#0C1117] text-gray-400 text-sm rounded-full
                  border border-white/10"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#151921] rounded-2xl border border-white/10 p-6 space-y-6"
        >
          {/* Asset Type Selection */}
          <div className="flex gap-4">
            <button
              onClick={() => setAssetType('image')}
              className={`flex-1 p-4 rounded-xl flex items-center justify-center gap-2 transition-all
              ${assetType === 'image' 
                ? 'bg-[#00E599] text-black' 
                : 'bg-[#0C1117] text-gray-400 hover:text-white'}`}
            >
              <IconPhoto size={20} />
              <span className="font-medium">Images</span>
            </button>
            <button
              onClick={() => setAssetType('video')}
              className={`flex-1 p-4 rounded-xl flex items-center justify-center gap-2 transition-all
              ${assetType === 'video' 
                ? 'bg-[#00E599] text-black' 
                : 'bg-[#0C1117] text-gray-400 hover:text-white'}`}
            >
              <IconVideo size={20} />
              <span className="font-medium">Videos</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <IconSearch 
              size={20} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for specific assets or use script keywords..."
              className="w-full bg-[#0C1117] text-white rounded-xl py-3 pl-12 pr-4 
              border border-white/10 focus:border-[#00E599] outline-none transition-colors"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateAssets}
            disabled={isLoading || !selectedScript}
            className="w-full py-4 bg-[#00E599] text-black font-medium rounded-xl
            hover:bg-[#00E599]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <IconLoader2 className="animate-spin" size={20} />
                Generating Assets...
              </>
            ) : (
              <>
                <IconRefresh size={20} />
                Generate Assets
              </>
            )}
          </button>
        </motion.div>

        {/* Generated Assets Grid */}
        {generatedAssets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                Generated Assets
              </h2>
              <button
                onClick={handleDownloadSelected}
                disabled={selectedAssets.size === 0}
                className="px-4 py-2 bg-[#00E599] text-black rounded-lg
                hover:bg-[#00E599]/90 transition-all disabled:opacity-50
                disabled:cursor-not-allowed flex items-center gap-2"
              >
                <IconDownload size={18} />
                Download Selected ({selectedAssets.size})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedAssets.map((asset) => (
                <motion.div
                  key={asset._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <div
                    className={`absolute inset-0 rounded-xl border-2 transition-colors
                    ${selectedAssets.has(asset._id) 
                      ? 'border-[#00E599]' 
                      : 'border-transparent group-hover:border-white/20'}`}
                  />
                  <button
                    onClick={() => handleAssetSelect(asset._id)}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10
                    ${selectedAssets.has(asset._id)
                      ? 'bg-[#00E599] text-black'
                      : 'bg-black/50 text-white hover:bg-[#00E599]/20'}`}
                  >
                    {selectedAssets.has(asset._id) ? (
                      <IconCheck size={16} />
                    ) : (
                      <IconX size={16} />
                    )}
                  </button>
                  <div className="aspect-video rounded-xl overflow-hidden bg-[#0C1117] relative">
                    {asset.type === 'video' ? (
                      <video
                        src={asset.url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <Image
                        src={asset.url}
                        alt={asset.metadata.alt || 'Generated asset'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    {asset.metadata.title || 'Untitled Asset'}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <NavigationBar />
    </div>
  );
} 