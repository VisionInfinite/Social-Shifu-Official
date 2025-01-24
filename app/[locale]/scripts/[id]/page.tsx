// app/[locale]/scripts/[id]/page.tsx
import { Script } from '@/lib/types';
import { AssetGenerator } from '@/components/AssetGenerator';

interface ScriptPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default async function ScriptPage({ params }: ScriptPageProps) {
  // Fetch script data using the ID
  const response = await fetch(`/api/scripts/${params.id}`);
  const script: Script = await response.json();

  return (
    <div>
      {/* Your existing script content */}
      <AssetGenerator script={script} />
    </div>
  );
}
