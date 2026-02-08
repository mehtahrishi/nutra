"use client"

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Share2, 
  Clock, 
  Flame, 
  Sparkles, 
  ChevronRight, 
  BrainCircuit, 
  Scale,
  ChefHat,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import { aiCookingAssistant, AiCookingAssistantOutput } from '@/ai/flows/ai-cooking-assistant';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data for individual recipe
const MOCK_RECIPES: Record<string, any> = {
  '1': {
    title: 'Mediterranean Salmon Salad',
    image: PlaceHolderImages.find(img => img.id === 'recipe-salmon'),
    time: '20 min',
    calories: '450 kcal',
    category: 'Keto',
    ingredients: 'Fresh Salmon fillets, mixed baby greens, cherry tomatoes, cucumbers, kalamata olives, feta cheese, lemon-oregano vinaigrette.',
    instructions: '1. Season salmon with salt and pepper.\n2. Sear salmon in a pan for 4 minutes per side.\n3. Toss mixed greens with veggies and dressing.\n4. Flake salmon over the salad and top with feta.',
    nutrition: { carbs: '12g', protein: '34g', fat: '28g' }
  },
  '2': {
    title: 'Zesty Avocado Pasta',
    image: PlaceHolderImages.find(img => img.id === 'recipe-pasta'),
    time: '15 min',
    calories: '380 kcal',
    category: 'Vegan',
    ingredients: 'Whole wheat pasta, ripe avocado, fresh basil, lemon juice, garlic, nutritional yeast, cherry tomatoes.',
    instructions: '1. Boil pasta until al dente.\n2. Blend avocado, basil, lemon, garlic, and nutritional yeast into a creamy sauce.\n3. Toss pasta with sauce and halved cherry tomatoes.',
    nutrition: { carbs: '55g', protein: '14g', fat: '18g' }
  }
};

export default function RecipeDetailPage() {
  const { id } = useParams();
  const recipe = MOCK_RECIPES[id as string] || MOCK_RECIPES['1'];
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiCookingAssistantOutput | null>(null);

  async function handleAiAssistant() {
    setAiLoading(true);
    try {
      const output = await aiCookingAssistant({
        recipeName: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        dietaryPreferences: "healthy, low carb preferred"
      });
      setAiResult(output);
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Image and Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
            {recipe.image && (
              <Image
                src={recipe.image.imageUrl}
                alt={recipe.image.description}
                fill
                className="object-cover"
                data-ai-hint={recipe.image.imageHint}
              />
            )}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
              <Badge className="bg-white/90 text-primary font-headline text-lg py-2 px-6 border-none backdrop-blur-md shadow-lg">
                {recipe.category}
              </Badge>
              <div className="flex gap-2">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className={`rounded-full shadow-lg ${isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>

          <Card className="rounded-3xl border-none shadow-lg bg-secondary/20 p-6 animate-fade-in">
            <h3 className="text-xl font-headline font-bold mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Nutritional Snapshot
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <NutriItem label="Carbs" value={recipe.nutrition.carbs} />
              <NutriItem label="Protein" value={recipe.nutrition.protein} />
              <NutriItem label="Fat" value={recipe.nutrition.fat} />
            </div>
          </Card>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                onClick={handleAiAssistant}
                className="w-full py-8 rounded-3xl bg-primary text-white font-headline text-xl shadow-xl hover:bg-primary/90 hover:scale-[1.02] transition-all animate-fade-in"
              >
                <BrainCircuit className="mr-3 w-8 h-8" />
                Open AI Kitchen Assistant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-primary p-8 text-white">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-headline flex items-center gap-3">
                    <Sparkles className="w-8 h-8" />
                    AI Kitchen Genius
                  </DialogTitle>
                  <DialogDescription className="text-white/80 text-lg">
                    Ingredient substitutions, health tips, and chef hacks for this recipe.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-lg font-headline text-muted-foreground">The AI is analyzing the flavors...</p>
                  </div>
                ) : aiResult ? (
                  <div className="prose prose-orange max-w-none">
                    <div className="whitespace-pre-wrap text-lg leading-relaxed text-foreground/80">
                      {aiResult.suggestions}
                    </div>
                  </div>
                ) : (
                  <p>Ready to help!</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl font-headline font-bold text-foreground">{recipe.title}</h1>
            <div className="flex flex-wrap gap-6 text-lg text-muted-foreground">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {recipe.time} Cook Time
              </span>
              <span className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-accent" />
                {recipe.calories} per serving
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <section className="animate-fade-in">
              <h2 className="text-2xl font-headline font-bold text-primary mb-4 flex items-center gap-2">
                <ChevronRight className="w-6 h-6" />
                Ingredients
              </h2>
              <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                <ul className="space-y-3 text-lg">
                  {recipe.ingredients.split(',').map((ing: string, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      {ing.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="animate-fade-in">
              <h2 className="text-2xl font-headline font-bold text-accent mb-4 flex items-center gap-2">
                <ChefHat className="w-6 h-6" />
                Preparation
              </h2>
              <div className="space-y-6">
                {recipe.instructions.split('\n').map((step: string, i: number) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-muted group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center font-bold font-headline text-lg">
                      {i + 1}
                    </div>
                    <p className="text-lg leading-relaxed pt-1.5">{step}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function NutriItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-3 bg-white rounded-2xl shadow-sm">
      <div className="text-xs font-headline text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="text-lg font-bold text-foreground">{value}</div>
    </div>
  );
}
