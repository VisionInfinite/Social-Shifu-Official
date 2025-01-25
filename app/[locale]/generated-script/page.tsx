'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  IconCopy, 
  IconDownload, 
  IconShare, 
  IconRefresh,
  IconHistory,
  IconScript,
  IconPhoto,
  IconZip,
  IconLoader2,
  IconMicrophone
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { ClientLayout } from '@/components/ClientLayout';
import { Script } from '@/lib/types';

interface GeneratedScript {
  detailedScript: string;
  cleanScript: string;
  assetSuggestions: string;
  metadata: {
    topic: string;
    description: string;
    keywords: string[];
    tone: string;
    duration: string;
  };
}

export default function GeneratedScriptPage() {
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [scriptHistory, setScriptHistory] = useState<Script[]>([]);
  const [activeTab, setActiveTab] = useState<'script' | 'history' | 'assets'>('script');
  const [scriptView, setScriptView] = useState<'detailed' | 'clean'>('detailed');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isGeneratingAssets, setIsGeneratingAssets] = useState(false);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadScript();
    fetchScriptHistory();
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchScriptHistory();
    }
  }, [activeTab]);

  const loadScript = () => {
    const savedScript = localStorage.getItem('generatedScript');
    if (!savedScript) {
      router.push('/generate-script');
      return;
    }

    try {
      const parsedScript = JSON.parse(savedScript);
      if (!parsedScript?.generatedContent?.detailedScript) {
        toast.error('Invalid script format');
        return;
      }
      setScript(parsedScript.generatedContent);
    } catch (error) {
      console.error('Error parsing script:', error);
      toast.error('Failed to load script');
    }
  };

  const fetchScriptHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch('/api/scripts');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch scripts');
      }
      
      setScriptHistory(data.scripts);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load script history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleLoadHistoryScript = (historyItem: Script) => {
    try {
      const scriptData = {
        generatedContent: {
          detailedScript: historyItem.content,
          cleanScript: historyItem.content,
          assetSuggestions: historyItem.assetSuggestions || '',
          metadata: {
            topic: historyItem.topic,
            description: historyItem.description,
            keywords: historyItem.keywords,
            tone: historyItem.tone,
            duration: historyItem.duration
          }
        }
      };

      setScript(scriptData.generatedContent);
      setActiveTab('script');
      toast.success('Script loaded from history');
    } catch (error) {
      console.error('Error loading script:', error);
      toast.error('Failed to load script from history');
    }
  };

  const formatScriptContent = (content: string) => {
    if (!content) return null;
    
    return (
      <div className="text-gray-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
        {content.split('\n').map((line, i) => (
          <div key={i} className="mb-2">
            {line.startsWith('-') ? (
              <span className="text-[#00E599] font-medium">{line}</span>
            ) : line.match(/\[.*?\]/) ? (
              <span className="text-blue-400 font-semibold">{line}</span>
            ) : line.match(/\*.*?\*/) ? (
              <span className="text-yellow-400 font-medium">{line}</span>
            ) : (
              line
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatAssetContent = (content: string) => {
    if (!content) return null;

    try {
      // Try to parse if it's JSON
      const parsedContent = JSON.parse(content);
      return (
        <div className="space-y-8">
          {/* PNG Images */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              1️⃣ PNG Images
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(parsedContent.pngImages) && parsedContent.pngImages.map((image: string, index: number) => (
                <div key={index} className="bg-[#0C1117] p-4 rounded-lg border border-gray-800">
                  <p className="text-gray-300">{image}</p>
                </div>
              ))}
            </div>
          </div>

          {/* General Images */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              2️⃣ General Images
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(parsedContent.generalImages) && parsedContent.generalImages.map((image: string, index: number) => (
                <div key={index} className="bg-[#0C1117] p-4 rounded-lg border border-gray-800">
                  <p className="text-gray-300">{image}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Video Clips */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              3️⃣ Video Clips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(parsedContent.videoClips) && parsedContent.videoClips.map((clip: string, index: number) => (
                <div key={index} className="bg-[#0C1117] p-4 rounded-lg border border-gray-800">
                  <p className="text-gray-300">{clip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Backgrounds */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              4️⃣ Backgrounds
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(parsedContent.backgrounds) && parsedContent.backgrounds.map((bg: string, index: number) => (
                <div key={index} className="bg-[#0C1117] p-4 rounded-lg border border-gray-800">
                  <p className="text-gray-300">{bg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      // If not JSON, format as regular text with line breaks
      return (
        <div className="text-gray-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
          {content.split('\n').map((line, i) => (
            <div key={i} className="mb-2">
              {line.startsWith('1️⃣') || line.startsWith('2️⃣') || 
               line.startsWith('3️⃣') || line.startsWith('4️⃣') ? (
                <h3 className="text-xl font-semibold text-white my-4">{line}</h3>
              ) : line.startsWith('[') && line.endsWith(']') ? (
                <div className="bg-[#0C1117] p-4 rounded-lg border border-gray-800 my-2">
                  {line}
                </div>
              ) : line.startsWith('-') ? (
                <p className="text-gray-400 ml-4">{line}</p>
              ) : (
                line
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  const handleGenerateAssets = async () => {
    if (!script?.assetSuggestions) return;

    setIsGeneratingAssets(true);
    try {
      // Clean and parse asset suggestions
      const cleanedJson = script.assetSuggestions
        .replace(/[\u0000-\u0019]+/g, '') // Remove control characters
        .trim();
      
      let assetData;
      try {
        assetData = JSON.parse(cleanedJson);
      } catch (parseError) {
        // If JSON parsing fails, try to extract keywords using regex
        const keywords = cleanedJson.match(/["']([^"']+)["']/g)
          ?.map(match => match.replace(/["']/g, '')) || [];
          
        assetData = {
          pngImages: [],
          generalImages: keywords,
          videoClips: [],
          backgrounds: []
        };
      }

      // Collect all keywords
      const keywords = [
        ...(assetData.pngImages || []),
        ...(assetData.generalImages || []),
        ...(assetData.videoClips || []),
        ...(assetData.backgrounds || [])
      ].filter(Boolean); // Remove empty/null values

      if (keywords.length === 0) {
        throw new Error('No valid keywords found in asset suggestions');
      }

      // Generate assets
      const response = await fetch('/api/generate-assets-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptId: Date.now().toString(), // or actual script ID
          keywords,
          metadata: script.metadata
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate assets');
      }

      const data = await response.json();
      setZipUrl(data.zipUrl);
      toast.success('Assets generated successfully!');
    } catch (error) {
      console.error('Error generating assets:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate assets');
    } finally {
      setIsGeneratingAssets(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!script?.cleanScript) return;

    setIsGeneratingAudio(true);
    try {
      // Clean the text - remove special characters and limit length
      const cleanText = script.cleanScript
        .replace(/[^\w\s.,!?-]/g, '')
        .slice(0, 5000); // ElevenLabs has a 5000 character limit

      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          voiceSettings: {
            voice_id: "21m00Tcm4TlvDq8ikWAM", // Rachel voice
            stability: 0.5,
            similarity_boost: 0.75,
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate audio');
      }

      setAudioUrl(data.audioUrl);
      toast.success('Audio generated successfully!');
    } catch (error) {
      console.error('Error generating audio:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate audio');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#0C1117] p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">
                Generated <span className="text-[#00E599]">Script</span>
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push('/generate-script')}
                  className="px-4 py-2 bg-[#151921] text-gray-300 rounded-lg hover:bg-[#1a1f29] 
                  transition-all flex items-center gap-2"
                >
                  <IconRefresh size={20} />
                  New Script
                </button>
              </div>
            </div>

            {/* Main Tabs */}
            <div className="flex border-b border-gray-800">
              <button
                onClick={() => setActiveTab('script')}
                className={`px-6 py-3 font-medium transition-colors relative
                  ${activeTab === 'script' ? 'text-[#00E599]' : 'text-gray-400 hover:text-white'}`}
              >
                <div className="flex items-center gap-2">
                  <IconScript size={20} />
                  Script
                </div>
                {activeTab === 'script' && (
                  <motion.div 
                    layoutId="activeMainTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00E599]" 
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('assets')}
                className={`px-6 py-3 font-medium transition-colors relative
                  ${activeTab === 'assets' ? 'text-[#00E599]' : 'text-gray-400 hover:text-white'}`}
              >
                <div className="flex items-center gap-2">
                  <IconPhoto size={20} />
                  Assets
                </div>
                {activeTab === 'assets' && (
                  <motion.div 
                    layoutId="activeMainTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00E599]" 
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 font-medium transition-colors relative
                  ${activeTab === 'history' ? 'text-[#00E599]' : 'text-gray-400 hover:text-white'}`}
              >
                <div className="flex items-center gap-2">
                  <IconHistory size={20} />
                  History
                </div>
                {activeTab === 'history' && (
                  <motion.div 
                    layoutId="activeMainTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00E599]" 
                  />
                )}
              </button>
            </div>

            {/* Content Area */}
            <div className="mt-6">
              <AnimatePresence mode="wait">
                {activeTab === 'script' && script && (
                  <motion.div
                    key="script"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Script View Tabs */}
                    <div className="flex gap-4 border-b border-gray-800">
                      <button
                        onClick={() => setScriptView('detailed')}
                        className={`px-4 py-2 font-medium transition-colors relative
                          ${scriptView === 'detailed' ? 'text-[#00E599]' : 'text-gray-400 hover:text-white'}`}
                      >
                        Detailed Script
                        {scriptView === 'detailed' && (
                          <motion.div 
                            layoutId="activeScriptView"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00E599]" 
                          />
                        )}
                      </button>
                      <button
                        onClick={() => setScriptView('clean')}
                        className={`px-4 py-2 font-medium transition-colors relative
                          ${scriptView === 'clean' ? 'text-[#00E599]' : 'text-gray-400 hover:text-white'}`}
                      >
                        Clean Script
                        {scriptView === 'clean' && (
                          <motion.div 
                            layoutId="activeScriptView"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00E599]" 
                          />
                        )}
                      </button>
                    </div>

                    {/* Script Content */}
                    <div className="bg-[#151921] rounded-xl border border-gray-800 p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-xl font-semibold text-white mb-1">
                            {script.metadata.topic}
                          </h2>
                          <p className="text-gray-400 text-sm">
                            {script.metadata.duration} • {script.metadata.tone}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopy(scriptView === 'detailed' ? script.detailedScript : script.cleanScript)}
                            className="p-2 text-gray-400 hover:text-white bg-[#0C1117] rounded-lg"
                            title="Copy to clipboard"
                          >
                            <IconCopy size={20} />
                          </button>
                          <button
                            onClick={() => handleDownload(
                              scriptView === 'detailed' ? script.detailedScript : script.cleanScript,
                              `${scriptView}-script.txt`
                            )}
                            className="p-2 text-gray-400 hover:text-white bg-[#0C1117] rounded-lg"
                            title="Download"
                          >
                            <IconDownload size={20} />
                          </button>
                          {scriptView === 'clean' && (
                            <button
                              onClick={handleGenerateAudio}
                              disabled={isGeneratingAudio}
                              className="px-4 py-2 bg-[#00E599] text-black font-medium rounded-lg 
                              hover:bg-[#00E599]/90 transition-all disabled:opacity-50 
                              disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {isGeneratingAudio ? (
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
                          )}
                          {audioUrl && scriptView === 'clean' && (
                            <button
                              onClick={() => window.open(audioUrl, '_blank')}
                              className="px-4 py-2 bg-[#0C1117] text-white font-medium rounded-lg 
                              hover:bg-[#0C1117]/80 transition-all flex items-center gap-2"
                            >
                              <IconDownload size={20} />
                              Download Audio
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        {formatScriptContent(scriptView === 'detailed' ? script.detailedScript : script.cleanScript)}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'assets' && script && (
                  <motion.div
                    key="assets"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#151921] rounded-xl border border-gray-800 p-6"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-white">
                        Asset Requirements
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={handleGenerateAssets}
                          disabled={isGeneratingAssets}
                          className="px-4 py-2 bg-[#00E599] text-black font-medium rounded-lg 
                          hover:bg-[#00E599]/90 transition-all disabled:opacity-50 
                          disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isGeneratingAssets ? (
                            <>
                              <IconLoader2 className="animate-spin" size={20} />
                              Generating...
                            </>
                          ) : (
                            <>
                              <IconRefresh size={20} />
                              Generate Assets
                            </>
                          )}
                        </button>
                        {zipUrl && (
                          <button
                            onClick={() => window.open(zipUrl, '_blank')}
                            className="px-4 py-2 bg-[#0C1117] text-white font-medium rounded-lg 
                            hover:bg-[#0C1117]/80 transition-all flex items-center gap-2"
                          >
                            <IconZip size={20} />
                            Download ZIP
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      {formatAssetContent(script.assetSuggestions)}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {isLoadingHistory ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E599]" />
                      </div>
                    ) : scriptHistory.length > 0 ? (
                      scriptHistory.map((historyItem) => (
                        <div
                          key={historyItem._id}
                          className="bg-[#151921] rounded-xl border border-gray-800 p-6 hover:border-gray-700 
                          transition-all cursor-pointer"
                          onClick={() => handleLoadHistoryScript(historyItem)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-medium text-white">
                                {historyItem.topic}
                              </h3>
                              <div className="flex items-center gap-4 mt-1">
                                <p className="text-gray-400 text-sm">
                                  {new Date(historyItem.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  {historyItem.duration}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  {historyItem.tone}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(historyItem.content);
                                }}
                                className="p-2 text-gray-400 hover:text-white bg-[#0C1117] rounded-lg"
                                title="Copy to clipboard"
                              >
                                <IconCopy size={20} />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-300 line-clamp-2 mt-2">
                            {historyItem.description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        <p className="mb-4">No scripts in history</p>
                        <button
                          onClick={() => router.push('/generate-script')}
                          className="px-6 py-3 bg-[#00E599] text-black rounded-xl hover:bg-[#00E599]/90 
                          transition-all font-medium"
                        >
                          Generate Your First Script
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </ClientLayout>
  );
} 