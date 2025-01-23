'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IconCopy, 
  IconDownload, 
  IconShare, 
  IconRefresh,
  IconMicrophone,
  IconBrandYoutube,
  IconBrandTiktok,
  IconBrandInstagram 
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { NavigationBar } from '@/components/NavigationBar';
import { Script, GeneratedScript } from '@/lib/types';
import { ScriptHistorySidebar } from '@/components/ScriptHistorySidebar';

export default function GeneratedScriptsPage() {
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get the generated script from localStorage
    const savedScript = localStorage.getItem('generatedScript');
    if (savedScript) {
      try {
        setGeneratedScript(JSON.parse(savedScript));
      } catch (error) {
        console.error('Error parsing saved script:', error);
      }
    }
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      const response = await fetch('/api/scripts');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch scripts');
      }

      setScripts(data.scripts);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load scripts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Script copied to clipboard!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to copy script');
    }
  };

  const handleShare = async (script: Script) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: script.topic,
          text: script.content,
          url: window.location.href
        });
      } else {
        await handleCopy(script.content);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to share script');
    }
  };

  const handleGenerateNew = () => {
    router.push('/generate-script');
  };

  const formatScriptContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // Camera directions [in brackets]
      if (line.match(/\[.*?\]/)) {
        return (
          <div key={index} className="text-blue-400 italic my-2 text-sm">
            {line}
          </div>
        );
      }
      // Emphasis points *in asterisks*
      else if (line.match(/\*.*?\*/)) {
        return (
          <div key={index} className="text-yellow-400 font-medium my-2">
            {line.replace(/\*(.*?)\*/, '$1')}
          </div>
        );
      }
      // Section headers (numbered or with colons)
      else if (line.match(/^\d+\.|\w+:/)) {
        return (
          <div key={index} className="text-[#00E599] font-semibold text-lg mt-6 mb-3">
            {line}
          </div>
        );
      }
      // Regular text
      else if (line.trim()) {
        return (
          <div key={index} className="text-gray-300 my-2">
            {line}
          </div>
        );
      }
      // Empty lines
      return <div key={index} className="h-2" />;
    });
  };

  return (
    <div className="flex min-h-screen bg-[#0C1117]">
      <ScriptHistorySidebar onSelectScript={(script) => {
        setGeneratedScript({
          content: script.content,
          metadata: {
            topic: script.topic,
            description: script.description,
            keywords: script.keywords,
            tone: script.tone,
            duration: script.duration
          }
        });
      }} />
      
      <div className="flex-1">
        <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Display Generated Script */}
            {generatedScript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#151921] rounded-xl border border-white/10 overflow-hidden"
              >
                {/* Script Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {generatedScript.metadata.topic}
                      </h3>
                      <p className="text-gray-400">
                        {generatedScript.metadata.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(generatedScript.content)}
                        className="p-2.5 text-gray-400 hover:text-white bg-[#0C1117] rounded-lg 
                        hover:bg-[#0C1117]/80 transition-all hover:shadow-lg hover:shadow-[#00E599]/10"
                        title="Copy to clipboard"
                      >
                        <IconCopy size={20} />
                      </button>
                      <button
                        onClick={() => handleShare(generatedScript as any)}
                        className="p-2.5 text-gray-400 hover:text-white bg-[#0C1117] rounded-lg 
                        hover:bg-[#0C1117]/80 transition-all hover:shadow-lg hover:shadow-[#00E599]/10"
                        title="Share script"
                      >
                        <IconShare size={20} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <IconMicrophone size={16} />
                      <span>{generatedScript.metadata.tone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <IconBrandYoutube size={16} />
                      <span>{generatedScript.metadata.duration}</span>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {generatedScript.metadata.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-[#0C1117] text-gray-400 text-sm rounded-full
                        border border-white/5 hover:border-[#00E599]/20 transition-colors"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Script Content */}
                <div className="p-6 bg-[#0C1117]/50">
                  <div className="prose prose-invert max-w-none">
                    {formatScriptContent(generatedScript.content)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t border-white/10 bg-[#151921]">
                  <div className="flex gap-4">
                    <button
                      onClick={() => router.push('/generate-audio')}
                      className="flex-1 py-3 px-4 bg-[#00E599] text-black font-medium rounded-lg 
                      hover:bg-[#00E599]/90 transition-all flex items-center justify-center gap-2"
                    >
                      <IconMicrophone size={20} />
                      Generate Audio
                    </button>
                    <button
                      onClick={handleGenerateNew}
                      className="flex-1 py-3 px-4 bg-[#0C1117] text-white rounded-lg 
                      hover:bg-[#0C1117]/80 transition-all flex items-center justify-center gap-2"
                    >
                      <IconRefresh size={20} />
                      Generate Another
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Scripts History */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E599]" />
                </div>
              ) : scripts.length > 0 ? (
                scripts.map((script) => (
                  <motion.div
                    key={script._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#151921] p-6 rounded-xl border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-medium text-white mb-2">
                          {script.topic}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {script.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(script.content)}
                          className="p-2 text-gray-400 hover:text-white bg-[#0C1117] rounded-lg 
                          hover:bg-[#0C1117]/80 transition-all"
                          title="Copy to clipboard"
                        >
                          <IconCopy size={20} />
                        </button>
                        <button
                          onClick={() => handleShare(script)}
                          className="p-2 text-gray-400 hover:text-white bg-[#0C1117] rounded-lg 
                          hover:bg-[#0C1117]/80 transition-all"
                          title="Share script"
                        >
                          <IconShare size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {script.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#0C1117] text-gray-400 text-sm rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex gap-4">
                        <span>{script.tone}</span>
                        <span>{script.duration}</span>
                      </div>
                      <span>
                        {new Date(script.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No scripts found</p>
                  <button
                    onClick={handleGenerateNew}
                    className="px-6 py-3 bg-[#00E599] text-black rounded-xl hover:bg-[#00E599]/90 
                    transition-all font-medium"
                  >
                    Generate Your First Script
                  </button>
                </div>
              )}
            </div>

            {scripts.length > 0 && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleGenerateNew}
                  className="px-6 py-3 bg-[#0C1117]/80 backdrop-blur-sm text-white rounded-xl 
                  hover:bg-[#0C1117] transition-all flex items-center gap-2 group"
                >
                  <IconRefresh 
                    size={20} 
                    className="group-hover:rotate-180 transition-transform duration-500" 
                  />
                  Generate Another
                </button>
              </div>
            )}
          </motion.div>
        </div>
        <NavigationBar />
      </div>
    </div>
  );
} 