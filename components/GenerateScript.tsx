'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import { IconRefresh, IconCopy, IconLoader2 } from '@tabler/icons-react';
import { ScriptHistorySidebar } from './ScriptHistorySidebar';
import { Script } from '@/lib/types';
import { NavigationBar } from '@/components/NavigationBar';

interface FormData {
  topic: string;
  description: string;
  keywords: string;
  tone: string;
  duration: string;
}

export const GenerateScript = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>();
  const [prompt, setPrompt] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingScript, setEditingScript] = useState<Script | null>(null);

  const description = watch('description', '');
  const maxLength = 280;

  // Load script data into form when editing
  useEffect(() => {
    if (editingScript) {
      setValue('topic', editingScript.topic);
      setValue('description', editingScript.description);
      setValue('keywords', editingScript.keywords.join(', '));
      setValue('tone', editingScript.tone);
      setValue('duration', editingScript.duration);
      setCharCount(editingScript.description.length);
    }
  }, [editingScript, setValue]);

  const handleSelectScript = (script: Script) => {
    setEditingScript(script);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          keywords: data.keywords.split(',').map(k => k.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate script');
      }

      const result = await response.json();
      
      // Save to localStorage
      localStorage.setItem('generatedScript', JSON.stringify(result));
      
      // Redirect to generated script page
      router.push(`/${locale}/generated-script`);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate script');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          scriptId: editingScript?._id // Include if editing existing script
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate script');
      }

      setGeneratedScript(data.script);
      setEditingScript(null); // Clear editing state after successful generation
      toast.success('Script generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate script. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C1117] p-4 md:p-8">
      <div className="max-w-4xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Form header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Generate Your <span className="text-[#00E599]">Script</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Create engaging video scripts with AI
            </p>
          </div>

          {/* Add editing indicator */}
          {editingScript && (
            <div className="text-sm text-[#00E599] mb-4">
              Editing script from {new Date(editingScript.createdAt).toLocaleDateString()}
            </div>
          )}

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 bg-[#151921] p-8 rounded-2xl border border-white/10 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 md:col-span-2">
                <label className="block text-sm font-medium text-gray-200">
                  Topic <span className="text-[#00E599]">*</span>
                </label>
                <input
                  {...register('topic', { required: 'Topic is required' })}
                  className="w-full px-4 py-3 bg-[#0C1117] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#00E599] focus:border-transparent transition-all"
                  placeholder="What's your video about?"
                />
                {errors.topic && (
                  <p className="text-red-500 text-sm">{errors.topic.message}</p>
                )}
              </div>

              <div className="space-y-4 md:col-span-2">
                <label className="block text-sm font-medium text-gray-200">
                  Description <span className="text-[#00E599]">*</span>
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  className="w-full px-4 py-3 bg-[#0C1117] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#00E599] focus:border-transparent h-40 transition-all resize-none"
                  placeholder="Describe your video content in detail..."
                  onChange={(e) => setCharCount(e.target.value.length)}
                />
                <div className="flex justify-between items-center text-sm">
                  {errors.description ? (
                    <p className="text-red-500">{errors.description.message}</p>
                  ) : (
                    <span className="text-gray-400">Be descriptive for better results</span>
                  )}
                  <span className="text-gray-400">{charCount}/{maxLength}</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-200">
                  Keywords
                </label>
                <input
                  {...register('keywords')}
                  className="w-full px-4 py-3 bg-[#0C1117] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#00E599] focus:border-transparent transition-all"
                  placeholder="Separate with commas"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-200">
                  Tone
                </label>
                <select
                  {...register('tone')}
                  className="w-full px-4 py-3 bg-[#0C1117] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#00E599] focus:border-transparent transition-all"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="humorous">Humorous</option>
                  <option value="formal">Formal</option>
                  <option value="friendly">Friendly</option>
                  <option value="enthusiastic">Enthusiastic</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-200">
                  Duration
                </label>
                <select
                  {...register('duration')}
                  className="w-full px-4 py-3 bg-[#0C1117] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#00E599] focus:border-transparent transition-all"
                >
                  <option value="short">Short (1-2 minutes)</option>
                  <option value="medium">Medium (2-5 minutes)</option>
                  <option value="long">Long (5+ minutes)</option>
                </select>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-[#00E599] text-black font-semibold rounded-xl 
              hover:bg-[#00E599]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed 
              transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <IconLoader2 className="animate-spin" size={20} />
                  Generating...
                </>
              ) : (
                'Generate Script'
              )}
            </button>
          </motion.form>
        </motion.div>
      </div>
      <NavigationBar />
    </div>
  );
}; 