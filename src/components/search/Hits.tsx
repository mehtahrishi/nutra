"use client"

import { useHits, UseHitsProps } from 'react-instantsearch';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Flame } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Hit {
  objectID: string;
  title: string;
  description?: string;
  imageUrl?: string;
  category: string;
  totalTime: number;
  calories: number;
  dietaryTags?: string[];
  mainIngredients?: string[];
  _highlightResult?: any;
}

export function Hits(props: UseHitsProps<Hit>) {
  const { hits } = useHits<Hit>(props);

  if (hits.length === 0) {
    return (
      <div className="col-span-full text-center py-20">
        <div className="inline-block p-8 rounded-full bg-muted/50 mb-6">
          <div className="text-6xl">🔍</div>
        </div>
        <h3 className="text-3xl font-headline font-bold mb-3 text-foreground">No recipes found</h3>
        <p className="text-muted-foreground text-lg">Try adjusting your filters or search with different keywords</p>
      </div>
    );
  }

  return (
    <>
      {hits.map((hit) => (
        <Card
          key={hit.objectID}
          className="group overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-500 rounded-3xl bg-card backdrop-blur-sm hover:scale-[1.02]"
        >
          <div className="relative h-56 overflow-hidden">
            {hit.imageUrl ? (
              <Image
                src={hit.imageUrl}
                alt={hit.title}
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
              {hit.category}
            </Badge>
            {hit.dietaryTags && hit.dietaryTags.length > 0 && (
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {hit.dietaryTags.slice(0, 2).map((tag) => (
                  <Badge key={tag} className="bg-accent/95 text-white border-none text-xs capitalize backdrop-blur-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-headline font-bold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {hit.title}
            </h3>
            
            {hit.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {hit.description}
              </p>
            )}

            <div className="flex items-center gap-6 text-sm font-medium">
              <span className="flex items-center gap-2 text-muted-foreground">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span className="font-headline">{hit.totalTime} min</span>
              </span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <div className="p-1.5 rounded-lg bg-accent/10">
                  <Flame className="w-4 h-4 text-accent" />
                </div>
                <span className="font-headline">{hit.calories} kcal</span>
              </span>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            <Link href={`/recipes/${hit.objectID}`} className="w-full">
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
    </>
  );
}
