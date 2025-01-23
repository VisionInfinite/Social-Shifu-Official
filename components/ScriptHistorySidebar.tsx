'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconChevronRight, 
  IconChevronLeft, 
  IconEdit, 
  IconTrash, 
  IconClock 
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { Script } from '@/lib/types';

interface ScriptHistorySidebarProps {
  onSelectScript: (script: Script) => void;
}

export function ScriptHistorySidebar({ onSelectScript }: ScriptHistorySidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);

  useEffect(() => {
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
      toast.error('Failed to load script history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteScript = async (scriptId: string) => {
    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete script');
      }

      setScripts(scripts.filter(script => script._id !== scriptId));
      toast.success('Script deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete script');
    }
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-4 top-8 bg-[#151921] p-2 rounded-full border border-white/10
        hover:bg-[#1a1f29] transition-all z-10"
      >
        {isOpen ? (
          <IconChevronRight className="w-4 h-4 text-gray-400" />
        ) : (
          <IconChevronLeft className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Sidebar Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-[calc(100vh-6rem)] bg-[#151921] border-r border-white/10 overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Script History</h2>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E599]" />
                </div>
              ) : scripts.length > 0 ? (
                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
                  {scripts.map((script) => (
                    <motion.div
                      key={script._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer
                      ${selectedScriptId === script._id 
                        ? 'border-[#00E599] bg-[#0C1117]' 
                        : 'border-white/10 hover:border-white/20 bg-[#0C1117]/50'
                      }`}
                      onClick={() => {
                        setSelectedScriptId(script._id);
                        onSelectScript(script);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 mr-4">
                          <p className="text-gray-300 line-clamp-2">
                            {script.content}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectScript(script);
                            }}
                            className="p-1.5 text-gray-400 hover:text-white bg-[#0C1117] rounded-lg 
                            hover:bg-[#0C1117]/80 transition-all"
                            title="Edit"
                          >
                            <IconEdit size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteScript(script._id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 bg-[#0C1117] rounded-lg 
                            hover:bg-[#0C1117]/80 transition-all"
                            title="Delete"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <IconClock size={12} className="mr-1" />
                        {new Date(script.createdAt).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No scripts found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 