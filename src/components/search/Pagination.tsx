"use client"

import { usePagination, UsePaginationProps } from 'react-instantsearch';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination(props: UsePaginationProps) {
  const { pages, currentRefinement, nbPages, refine } = usePagination(props);

  if (nbPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => refine(currentRefinement - 1)}
        disabled={currentRefinement === 0}
        className="rounded-xl border-2 h-10 w-10 backdrop-blur-sm hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {pages.map((page) => {
        const isActive = page === currentRefinement;
        return (
          <Button
            key={page}
            variant={isActive ? 'default' : 'outline'}
            onClick={() => refine(page)}
            className={`rounded-xl min-w-[40px] h-10 font-headline border-2 transition-all ${ 
              isActive 
                ? 'bg-primary text-white border-primary shadow-lg scale-110' 
                : 'backdrop-blur-sm hover:bg-primary hover:text-white hover:border-primary hover:scale-105'
            }`}
          >
            {page + 1}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => refine(currentRefinement + 1)}
        disabled={currentRefinement === nbPages - 1}
        className="rounded-xl border-2 h-10 w-10 backdrop-blur-sm hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
