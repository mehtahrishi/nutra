"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Flame, Heart, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Recipe {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  category: string;
  totalTime: number;
  calories: number;
  dietaryTags?: string[];
}

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        // For now, fetch all recipes. In a real app, you'd fetch user's favorites
        const res = await fetch('/api/recipes');
        if (res.ok) {
          const data = await res.json();
          setRecipes(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
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
            <Badge className="bg-accent/20 text-accent border-accent/20 font-headline px-6 py-2 text-sm uppercase tracking-widest backdrop-blur-sm">
              ❤️ Your Collection
            </Badge>
          </div>
          
          <div>
            <h1 className="text-5xl md:text-6xl font-headline font-bold mb-4 bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_auto] animate-gradient-text bg-clip-text text-transparent">
              Saved Recipes
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your favorite recipes, all in one place
            </p>
          </div>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 rounded-full bg-muted/50 mb-6">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-3xl font-headline font-bold mb-3 text-foreground">No saved recipes yet</h3>
            <p className="text-muted-foreground text-lg mb-8">Start exploring and save your favorites!</p>
            <Link href="/search">
              <Button className="rounded-xl px-8 py-6 text-lg font-headline">
                Discover Recipes
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <p className="text-muted-foreground">
                <span className="font-bold text-primary text-xl">{recipes.length}</span> saved recipes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <Card
                  key={recipe._id}
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
                    <button className="absolute bottom-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors">
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </button>
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
                    <Link href={`/recipes/${recipe._id}`} className="w-full">
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
        )}
      </div>
    </div>
  );
}
