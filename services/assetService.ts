// services/assetService.ts
import { Script, Asset } from '@/lib/types';

export class AssetService {
  private apiKeys = {
    unsplash: process.env.NEXT_PUBLIC_UNSPLASH_KEY!,
    pexels: process.env.NEXT_PUBLIC_PEXELS_KEY!,
    pixabay: process.env.NEXT_PUBLIC_PIXABAY_KEY!
  };

  async generateAssets(script: Script): Promise<Asset[]> {
    try {
      const assets = await Promise.all(
        script.keywords.slice(0, 5).map(keyword => 
          this.fetchAsset(keyword, script)
        )
      );
      return assets.filter(Boolean) as Asset[];
    } catch (error) {
      console.error('Asset generation failed:', error);
      throw error;
    }
  }

  private async fetchAsset(keyword: string, script: Script): Promise<Asset | null> {
    const apis = ['unsplash', 'pexels', 'pixabay'] as const;
    
    for (const api of apis) {
      try {
        const asset = await this.fetchFromAPI(api, keyword, script);
        if (asset) return this.saveAsset(asset);
      } catch (error) {
        continue;
      }
    }
    return null;
  }

  private async fetchFromAPI(api: 'unsplash' | 'pexels' | 'pixabay', keyword: string, script: Script): Promise<Partial<Asset>> {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${keyword}&client_id=${this.apiKeys[api]}`
    );
    const data = await response.json();
    const photo = data.results[0];

    return {
      scriptId: script._id,
      userId: script.userId,
      type: 'image',
      url: photo.urls.regular,
      metadata: {
        source: api,
        width: photo.width,
        height: photo.height,
        relevanceScore: 1,
        title: photo.description || keyword,
        alt: `Image for ${keyword}`
      },
      keywords: [keyword],
      status: 'active'
    };
  }

  private async saveAsset(asset: Partial<Asset>): Promise<Asset> {
    const response = await fetch('/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asset)
    });

    if (!response.ok) throw new Error('Failed to save asset');
    return response.json();
  }
}
