"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Flame, Heart, Loader2, ChefHat, Filter, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { InstantSearch, Configure, useSearchBox, useHits } from 'react-instantsearch';
import { searchClient, ALGOLIA_INDEX_NAME } from '@/lib/algolia';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { FaAlgolia } from 'react-icons/fa6';

interface Recipe {
  _id: string;
  objectID?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  category: string;
  totalTime: number;
  calories: number;
  dietaryTags?: string[];
}

function PreferenceModal() {
  const { refine, clear } = useSearchBox();
  const [preference, setPreference] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (preference.trim()) {
      refine(preference);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-headline px-6">
          <Filter className="w-4 h-4 mr-2" />
          Set Preferences
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            Save Your Preferences
            <FaAlgolia className="w-5 h-5 text-[#5468ff]" />
          </DialogTitle>
          <DialogDescription className="text-base">
            Enter keywords to find recipes matching your taste. Try "masala", "spicy", "vegan", etc.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Input
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              placeholder="e.g., masala, spicy, healthy..."
              className="h-12 text-base rounded-xl border-2 focus:border-primary"
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="flex-1 rounded-xl h-11 font-headline">
              Apply Filter
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="rounded-xl h-11"
            >
              Cancel
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center pt-2">
            <span>Powered by</span>
            <FaAlgolia className="w-4 h-4 text-[#5468ff]" />
            <span className="font-semibold text-[#5468ff]">Algolia</span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RecipeResults() {
  const { hits } = useHits<Recipe>();
  const { query, clear } = useSearchBox();
  const recipes = hits.length > 0 ? hits : [];

  if (recipes.length === 0 && query) {
    return (
      <div className="text-center py-20">
        <div className="inline-block p-8 rounded-full bg-muted/50 mb-6">
          <ChefHat className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-3xl font-headline font-bold mb-3 text-foreground">No recipes match your preference</h3>
        <p className="text-muted-foreground text-lg mb-8">
          Try different keywords or reset your search
        </p>
        <Button onClick={clear} className="rounded-xl px-8 py-6 text-lg font-headline">
          <X className="w-5 h-5 mr-2" />
          Clear Preference
        </Button>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-block p-8 rounded-full bg-muted/50 mb-6">
          <ChefHat className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-3xl font-headline font-bold mb-3 text-foreground">No recipes yet</h3>
        <p className="text-muted-foreground text-lg mb-8">Start creating recipes with AI!</p>
        <Link href="/discover">
          <Button className="rounded-xl px-8 py-6 text-lg font-headline">
            Start AI Discovery
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">
            <span className="font-bold text-primary text-xl">{recipes.length}</span> recipe{recipes.length !== 1 ? 's' : ''} {query ? 'found' : 'available'}
          </p>
          {query && (
            <Badge className="bg-primary/20 text-primary border-none font-headline px-4 py-2">
              Filtering: "{query}"
            </Badge>
          )}
        </div>
        {query && (
          <Button 
            onClick={clear}
            variant="outline"
            className="rounded-xl border-2 hover:border-primary hover:bg-primary hover:text-white transition-all"
          >
            <X className="w-4 h-4 mr-2" />
            Reset to All Recipes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <Card
            key={recipe._id || recipe.objectID}
            className="group overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-500 rounded-3xl bg-card backdrop-blur-sm hover:scale-[1.02]"
          >
            <div className="relative h-56 overflow-hidden">
              {recipe.imageUrl ? (
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 flex items-center justify-center">
                  <span className="text-7xl">🍽️</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              <Badge className="absolute top-4 right-4 bg-white/95 text-primary border-none shadow-lg font-headline px-3 py-1.5 backdrop-blur-sm">
                {recipe.category}
              </Badge>
              {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {recipe.dietaryTags.slice(0, 2).map((tag) => (
                    <Badge key={tag} className="bg-accent/95 text-white border-none text-xs capitalize backdrop-blur-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-headline font-bold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                {recipe.title}
              </h3>
              
              {recipe.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>
              )}

              <div className="flex items-center gap-6 text-sm font-medium">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-headline">{recipe.totalTime} min</span>
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <div className="p-1.5 rounded-lg bg-accent/10">
                    <Flame className="w-4 h-4 text-accent" />
                  </div>
                  <span className="font-headline">{recipe.calories} kcal</span>
                </span>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
              <Link href={`/recipes/${recipe._id || recipe.objectID}`} className="w-full">
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-2 border-primary/30 hover:bg-primary hover:text-white hover:border-primary font-headline transition-all hover:shadow-lg group-hover:border-primary"
                >
                  View Recipe
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

export default function RecipesPage() {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={ALGOLIA_INDEX_NAME}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={100} />
      
      <div className="relative min-h-screen pb-20">
        {/* Flowing Aura Background */}
        <div className="aura-bg">
          <div className="aura-blob top-[5%] right-[10%] opacity-30" />
          <div className="aura-blob-2 bottom-[20%] left-[5%] opacity-40" />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header Section */}
          <div className="mb-12 text-center space-y-6">
            <div className="inline-block">
              <Badge className="bg-primary/20 text-primary border-primary/20 font-headline px-6 py-2 text-sm uppercase tracking-widest backdrop-blur-sm">
                🍳 Recipe Collection
              </Badge>
            </div>
            
            <div>
              <h1 className="text-5xl md:text-6xl font-headline font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-text bg-clip-text text-transparent">
                Browse Recipes
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Discover delicious recipes crafted with AI precision
              </p>
              <PreferenceModal />
            </div>
          </div>

          <RecipeResults />
        </div>
      </div>
    </InstantSearch>
  );
}
