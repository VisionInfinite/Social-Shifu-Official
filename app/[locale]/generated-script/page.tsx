'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { IconCopy, IconDownload, IconShare, IconRefresh } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function GeneratedScriptPage() {
  const [script, setScript] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const savedScript = localStorage.getItem('generatedScript');
    if (!savedScript) {
      router.push('/generate-script');
      return;
    }
    setScript(savedScript);
  }, [router]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(script);
    toast.success('Script copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([script], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-script.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen relative bg-[#0C1117] p-4 md:p-8 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-[#0C1117]">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0C1117] via-[#1a1f29] to-[#2d3748] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,153,0.1),transparent_70%)]" />
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] 
          bg-[size:24px_24px]"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#151921]/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white">Generated Script</h1>
              <p className="text-gray-400 text-sm">Your AI-generated video script is ready</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2.5 text-gray-400 hover:text-white bg-[#0C1117]/80 backdrop-blur-sm rounded-lg 
                hover:bg-[#0C1117] transition-all hover:shadow-lg hover:shadow-[#00E599]/10"
                title="Copy to clipboard"
              >
                <IconCopy size={20} />
              </button>
              <button
                onClick={handleDownload}
                className="p-2.5 text-gray-400 hover:text-white bg-[#0C1117]/80 backdrop-blur-sm rounded-lg 
                hover:bg-[#0C1117] transition-all hover:shadow-lg hover:shadow-[#00E599]/10"
                title="Download script"
              >
                <IconDownload size={20} />
              </button>
              <button
                className="p-2.5 text-gray-400 hover:text-white bg-[#0C1117]/80 backdrop-blur-sm rounded-lg 
                hover:bg-[#0C1117] transition-all hover:shadow-lg hover:shadow-[#00E599]/10"
                title="Share script"
              >
                <IconShare size={20} />
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0C1117]/80 backdrop-blur-sm p-6 rounded-xl border border-white/10 
            hover:border-[#00E599]/20 transition-all hover:shadow-lg hover:shadow-[#00E599]/5"
          >
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {script.split('\n').map((line, i) => (
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
            </div>
          </motion.div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push('/generate-script')}
              className="px-6 py-3 bg-[#0C1117]/80 backdrop-blur-sm text-white rounded-xl 
              hover:bg-[#0C1117] transition-all flex items-center gap-2 group 
              hover:shadow-lg hover:shadow-[#00E599]/10"
            >
              <IconRefresh size={20} className="group-hover:rotate-180 transition-transform duration-500" />
              Generate Another
            </button>
            <button
              className="px-6 py-3 bg-[#00E599] text-black rounded-xl hover:bg-[#00E599]/90 
              transition-all font-medium hover:shadow-lg hover:shadow-[#00E599]/20"
            >
              Save Script
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 