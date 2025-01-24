// components/AssetGenerator.tsx
'use client';

import { useState } from 'react';
import { Asset, Script } from '@/lib/types';
import { AssetService } from '@/services/assetService';
import { toast } from 'sonner';

interface AssetGeneratorProps {
  script: Script;
}

export function AssetGenerator({ script }: AssetGeneratorProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const assetService = new AssetService();

  const handleGenerateAssets = async () => {
    setIsLoading(true);
    try {
      const generatedAssets = await assetService.generateAssets(script);
      setAssets(generatedAssets);
      toast.success('Assets generated successfully!');
    } catch (error) {
      toast.error('Failed to generate assets');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleGenerateAssets}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-[#00E599] text-black font-medium rounded-lg 
        hover:bg-[#00E599]/90 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Assets'
        )}
      </button>

      {assets.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {assets.map((asset) => (
            <div 
              key={asset._id} 
              className="relative aspect-video rounded-lg overflow-hidden bg-gray-800 group"
            >
              <img 
                src={asset.url}
                alt={asset.metadata.alt || asset.keywords.join(', ')}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-4 text-white">
                  <p className="text-sm font-medium">{asset.metadata.title}</p>
                  <p className="text-xs opacity-75">{asset.keywords.join(', ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
