import { Suspense } from 'react';
import { GenerateAssets } from '@/components/GenerateAssets';

export default function GenerateAssetsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenerateAssets />
    </Suspense>
  );
} 