"use client"

import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FaAlgolia } from 'react-icons/fa6';

export function SearchBox(props: UseSearchBoxProps) {
  const { query, refine, clear } = useSearchBox(props);

  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
        <Search className="h-7 w-7 text-foreground font-bold stroke-[2.5] group-focus-within:text-primary transition-colors" />
      </div>
      <Input
        type="search"
        value={query}
        onChange={(e) => refine(e.target.value)}
        placeholder="Search recipes, ingredients, cuisines..."
        className="pl-14 pr-44 h-14 text-lg rounded-2xl border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-lg backdrop-blur-sm bg-background/80 transition-all placeholder:text-muted-foreground/60"
      />
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-3">
        {query && (
          <button
            onClick={clear}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground pointer-events-none">
          <span className="font-medium">Powered by</span>
          <FaAlgolia className="h-5 w-5 text-[#5468ff]" />
        </div>
      </div>
    </div>
  );
}
