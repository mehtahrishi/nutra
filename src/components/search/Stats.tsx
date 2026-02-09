"use client"

import { useStats } from 'react-instantsearch';
import { Badge } from '@/components/ui/badge';

export function Stats() {
  const { nbHits, processingTimeMS } = useStats();

  return (
    <div className="flex items-center gap-3 justify-center flex-wrap">
      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-2 font-headline backdrop-blur-sm">
        <span className="font-bold">{nbHits.toLocaleString()}</span> recipes
      </Badge>
      <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 px-4 py-2 font-headline backdrop-blur-sm">
        ⚡ {processingTimeMS}ms
      </Badge>
    </div>
  );
}
