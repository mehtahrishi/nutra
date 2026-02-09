"use client"

import { InstantSearch, Configure, useClearRefinements } from 'react-instantsearch';
import { searchClient, ALGOLIA_INDEX_NAME } from '@/lib/algolia';
import { SearchBox } from '@/components/search/SearchBox';
import { FilterSelect } from '@/components/search/FilterSelect';
import { Hits } from '@/components/search/Hits';
import { Pagination } from '@/components/search/Pagination';
import { Stats } from '@/components/search/Stats';
import { Badge } from '@/components/ui/badge';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';


function ResetButton() {
  const { refine, canRefine } = useClearRefinements();

  return (
    <Button
      onClick={refine}
      disabled={!canRefine}
      variant="outline"
      className="h-12 px-6 rounded-xl bg-background/80 backdrop-blur-sm border-2 hover:border-primary hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <RotateCcw className="w-4 h-4 mr-2" />
      Reset Filters
    </Button>
  );
}

export default function SearchPage() {
  return (
    <div className="relative min-h-screen pb-20">
      {/* Flowing Aura Background */}
      <div className="aura-bg">
        <div className="aura-blob top-[5%] right-[10%] opacity-30" />
        <div className="aura-blob-2 bottom-[20%] left-[5%] opacity-40" />
      </div>

      <InstantSearch
        searchClient={searchClient}
        indexName={ALGOLIA_INDEX_NAME}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <Configure 
          hitsPerPage={16} 
          maxValuesPerFacet={100}
          facetingAfterDistinct={true}
        />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header Section */}
          <div className="mb-12 space-y-6 text-center">
            <div className="inline-block">
              <Badge className="bg-primary/20 text-primary border-primary/20 font-headline px-6 py-2 text-sm uppercase tracking-widest backdrop-blur-sm">
                ⚡ Powered by Algolia AI Search
              </Badge>
            </div>
            
            <div>
              <h1 className="text-5xl md:text-6xl font-headline font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-text bg-clip-text text-transparent">
                Discover Your Next Meal
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Search through our collection of nutritious recipes with intelligent filters
              </p>
            </div>

            {/* Search Box */}
            <div className="max-w-5xl mx-auto space-y-6">
              <SearchBox />
              
              {/* Horizontal Filters */}
              <div className="flex flex-wrap gap-4 items-center justify-center">
                <FilterSelect attribute="dietaryTags" title="Dietary Tags" />
                <FilterSelect attribute="difficulty" title="Difficulty" />
                <ResetButton />
              </div>
              
              {/* Stats */}
              <div className="mt-4">
                <Stats />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <Hits />
            </div>
            <div className="flex justify-center">
              <Pagination />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}
