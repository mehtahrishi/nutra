"use client"

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Share2, 
  Clock, 
  Flame, 
  Sparkles, 
  ChevronRight, 
  BrainCircuit, 
  Scale,
  ChefHat,
  Loader2,
  ShoppingBasket,
  Check,
  Info
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { aiCookingAssistant, AiCookingAssistantOutput } from '@/ai/flows/ai-cooking-assistant';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Helper function to parse ingredients into separate items
function parseIngredients(ingredients: any[] | string): Array<{item: string, quantity: string, unit?: string}> {
  // If already a proper array of objects, check if it needs re-parsing
  if (Array.isArray(ingredients) && ingredients.length > 0 && typeof ingredients[0] === 'object' && ingredients[0].item) {
    // Check if it's a single long ingredient that needs splitting (legacy format)
    if (ingredients.length === 1 && ingredients[0].item.includes(',')) {
      // Re-parse this as a comma-separated string
      ingredients = ingredients[0].item;
    } else if (ingredients.length > 1) {
      // Multiple ingredients already parsed, return as-is
      return ingredients;
    }
  }
  
  let items: string[] = [];
  
  // Handle string input
  if (typeof ingredients === 'string') {
    // Split by comma - most aggressive approach
    items = ingredients.split(',').map(s => s.trim()).filter(s => s.length > 0);
  } 
  // Handle array of strings
  else if (Array.isArray(ingredients)) {
    // If array items are strings, join and split by comma
    const text = ingredients.join(', ');
    items = text.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
  
  if (items.length === 0) return [];
  
  return items.map(item => {
    item = item.trim();
    
    // Pattern 1: "2 cups flour" or "1/2 tsp salt"
    const pattern1 = /^([\d\/-]+(?:\.\d+)?(?:\s+\d+\/\d+)?)\s+(large|medium|small|cup|cups|tbsp|tsp|teaspoons?|tablespoons?|g|grams?|kg|ml|l|liter|lb|pounds?|oz|ounces?|packet|packets|slice|slices|inch|inches|cloves?)\s+(.+)$/i;
    let match = item.match(pattern1);
    
    if (match) {
      return {
        quantity: match[1].trim(),
        unit: match[2].trim(),
        item: match[3].trim()
      };
    }
    
    // Pattern 2: "2 cups" at start without requiring item
    const pattern2 = /^([\d\/-]+(?:\.\d+)?(?:\s+\d+\/\d+)?)\s+(.+)$/i;
    match = item.match(pattern2);
    
    if (match) {
      // Check if second group might be a unit
      const possibleUnit = match[2].split(/\s+/)[0];
      const units = /^(large|medium|small|cup|cups|tbsp|tsp|teaspoons?|tablespoons?|g|grams?|kg|ml|l|liter|lb|pounds?|oz|ounces?|packet|packets|slice|slices|inch|inches|cloves?)$/i;
      
      if (units.test(possibleUnit)) {
        const remainingText = match[2].substring(possibleUnit.length).trim();
        return {
          quantity: match[1].trim(),
          unit: possibleUnit,
          item: remainingText || possibleUnit
        };
      }
    }
    
    // Fallback: no quantity/unit pattern found, return as-is
    return {
      quantity: '',
      unit: '',
      item: item.trim()
    };
  }).filter(ing => ing.item.length > 0);
}

// Helper function to parse instructions into separate steps
function parseInstructions(instructions: string[] | string): string[] {
  // If already an array with multiple items, return as is
  if (Array.isArray(instructions) && instructions.length > 1) {
    // Check if any single item contains multiple numbered steps
    const allSteps: string[] = [];
    instructions.forEach(instruction => {
      const steps = parseInstructionString(instruction);
      allSteps.push(...steps);
    });
    return allSteps.length > instructions.length ? allSteps : instructions;
  }
  
  // If single string or array with one long string, parse it
  const text = Array.isArray(instructions) ? instructions[0] : instructions;
  return parseInstructionString(text);
}

function parseInstructionString(text: string): string[] {
  if (!text) return [];
  
  // Try to split by numbered patterns like "1.", "2.", etc.
  const numberedSteps = text.split(/\d+\.\s+/).filter(s => s.trim());
  if (numberedSteps.length > 1) {
    return numberedSteps.map(s => s.trim());
  }
  
  // Try to split by sentence boundaries for long paragraphs
  const sentences = text.split(/\.\s+(?=[A-Z])/);
  if (sentences.length > 3) {
    return sentences.map(s => s.trim() + (s.endsWith('.') ? '' : '.'));
  }
  
  // Return as single step if no clear separation
  return [text.trim()];
}

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nutritionOpen, setNutritionOpen] = useState(false);
  
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiCookingAssistantOutput | null>(null);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRecipe(data.data);
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [id]);

  async function handleAiAssistant() {
    if (!recipe) return;
    setAiLoading(true);
    try {
      const parsedIngredients = parseIngredients(recipe.ingredients);
      const ingredientsText = parsedIngredients
        .map((ing: any) => `${ing.quantity} ${ing.unit} ${ing.item}`.trim())
        .join(', ');
      
      const parsedInstructions = parseInstructions(recipe.instructions);
      const instructionsText = parsedInstructions.join('\n');
      
      const output = await aiCookingAssistant({
        recipeName: recipe.title,
        ingredients: ingredientsText,
        instructions: instructionsText,
        dietaryPreferences: recipe.dietaryTags?.join(', ')
      });
      setAiResult(output);
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-headline font-bold mb-4">Recipe not found</h1>
        <p className="text-muted-foreground">This recipe doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Row 1: Title & Actions */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-4xl font-headline font-bold text-foreground leading-tight flex-1">{recipe.title}</h1>
          
          <div className="flex items-center gap-2">
            <Sheet open={nutritionOpen} onOpenChange={setNutritionOpen}>
              <SheetTrigger asChild>
                <Button className="rounded-full px-4 py-2 bg-primary hover:bg-primary/90 text-white font-headline text-sm">
                  <Info className="w-4 h-4 mr-2" />
                  Know Nutrition
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[350px] sm:w-[450px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-xl font-headline">Nutrition Information</SheetTitle>
                  <SheetDescription className="text-sm">
                    Detailed nutritional facts and dietary information
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-4 space-y-4">
                  {/* Dietary Tags */}
                  {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
                    <div>
                      <h3 className="font-headline font-semibold mb-2 text-base">Dietary Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {recipe.dietaryTags.map((tag: string) => (
                          <Badge 
                            key={tag} 
                            className="bg-accent/20 text-accent border-accent/30 border font-headline px-3 py-1 text-xs capitalize"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Quick Stats */}
                  <div>
                    <h3 className="font-headline font-semibold mb-2 text-base">Quick Stats</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Time</p>
                          <p className="font-headline font-semibold text-sm">{recipe.totalTime} min</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/5">
                        <div className="p-1.5 rounded-lg bg-accent/10">
                          <Flame className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Calories</p>
                          <p className="font-headline font-semibold text-sm">{recipe.calories} kcal</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <ChefHat className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Difficulty</p>
                          <p className="font-headline font-semibold text-sm capitalize">{recipe.difficulty || 'Medium'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Nutrition Details */}
                  <div>
                    <h3 className="font-headline font-semibold mb-2 text-base flex items-center gap-2">
                      <Scale className="w-4 h-4 text-primary" />
                      Nutritional Breakdown
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                        <p className="text-xs text-muted-foreground mb-0.5">Calories</p>
                        <p className="text-xl font-headline font-bold">{recipe.calories}<span className="text-xs ml-1">kcal</span></p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                        <p className="text-xs text-muted-foreground mb-0.5">Servings</p>
                        <p className="text-xl font-headline font-bold">{recipe.servings || 1}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                        <p className="text-xs text-muted-foreground mb-0.5">Carbs</p>
                        <p className="text-xl font-headline font-bold">{recipe.carbs}<span className="text-xs ml-1">g</span></p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                        <p className="text-xs text-muted-foreground mb-0.5">Protein</p>
                        <p className="text-xl font-headline font-bold">{recipe.protein}<span className="text-xs ml-1">g</span></p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                        <p className="text-xs text-muted-foreground mb-0.5">Fat</p>
                        <p className="text-xl font-headline font-bold">{recipe.fat}<span className="text-xs ml-1">g</span></p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                        <p className="text-xs text-muted-foreground mb-0.5">Fiber</p>
                        <p className="text-xl font-headline font-bold">{recipe.fiber || 0}<span className="text-xs ml-1">g</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Row 2: Image & Ingredients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left: Image */}
        <div className="animate-fade-in">
          <div className="relative h-[350px] rounded-2xl overflow-hidden shadow-lg">
            {recipe.imageUrl && (
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                fill
                className="object-cover"
                data-ai-hint={recipe.imageHint}
              />
            )}
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/90 text-primary font-headline text-base py-1.5 px-4 border-none backdrop-blur-md shadow-lg">
                {recipe.category}
              </Badge>
            </div>
          </div>

          {/* Nutrition Info - Commented out */}
          {/* <Card className="mt-6 rounded-3xl border-none shadow-lg bg-gradient-to-br from-primary/10 to-accent/10 p-6">
            <h3 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
              <Scale className="w-6 h-6 text-primary" />
              Nutritional Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <NutriItem label="Calories" value={`${recipe.calories}`} unit="kcal" />
              <NutriItem label="Servings" value={`${recipe.servings || 1}`} unit="" />
              <NutriItem label="Carbs" value={`${recipe.carbs}`} unit="g" />
              <NutriItem label="Protein" value={`${recipe.protein}`} unit="g" />
              <NutriItem label="Fat" value={`${recipe.fat}`} unit="g" />
              <NutriItem label="Fiber" value={`${recipe.fiber || 0}`} unit="g" />
            </div>
          </Card> */}

          {/* AI Assistant */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                onClick={handleAiAssistant}
                className="w-full mt-4 py-3 rounded-2xl bg-primary text-white font-headline text-base shadow-lg hover:bg-primary/90 hover:scale-[1.02] transition-all animate-fade-in"
              >
                <BrainCircuit className="mr-2 w-5 h-5" />
                Open AI Kitchen Assistant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-2xl border-none shadow-xl p-0 overflow-hidden">
              <div className="bg-primary p-6 text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    AI Kitchen Genius
                  </DialogTitle>
                  <DialogDescription className="text-white/80 text-base">
                    Ingredient substitutions, health tips, and chef hacks for this recipe.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-base font-headline text-muted-foreground">The AI is analyzing the flavors...</p>
                  </div>
                ) : aiResult ? (
                  <div className="prose prose-orange max-w-none">
                    <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground/80">
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

        {/* Right: Ingredients */}
        <div className="animate-fade-in">
          <Card className="rounded-2xl border-none shadow-lg overflow-hidden h-full">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
              <h2 className="text-2xl font-headline font-bold text-white flex items-center gap-2">
                <ShoppingBasket className="w-6 h-6" />
                Ingredients
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                {(() => {
                  const parsed = parseIngredients(recipe.ingredients);
                  console.log('Raw ingredients:', recipe.ingredients);
                  console.log('Parsed ingredients:', parsed);
                  return parsed;
                })().map((ing: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 py-1.5">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <div className="flex-1 text-base leading-relaxed">
                      {ing.quantity && (
                        <span className="font-bold text-primary mr-2">
                          {ing.quantity}
                          {ing.unit && ` ${ing.unit}`}
                        </span>
                      )}
                      <span className="text-foreground/90">{ing.item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 3: Step-by-Step Instructions */}
      <div className="animate-fade-in">
        <Card className="rounded-2xl border-none shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-accent to-accent/80 p-4">
            <h2 className="text-2xl font-headline font-bold text-white flex items-center gap-2">
              <ChefHat className="w-6 h-6" />
              Step-by-Step Instructions
            </h2>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              {parseInstructions(recipe.instructions).map((step: string, i: number) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/80 text-white flex items-center justify-center font-bold font-headline text-lg shadow-md group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                  </div>
                  <div className="flex-1 pt-1.5">
                    <p className="text-base leading-relaxed text-foreground/90">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NutriItem({ label, value, unit }: { label: string, value: string, unit?: string }) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md border border-primary/10 hover:shadow-lg hover:border-primary/30 transition-all">
      <div className="text-xs font-headline text-muted-foreground uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl font-bold text-primary font-headline">
        {value}<span className="text-sm text-muted-foreground ml-1">{unit}</span>
      </div>
    </div>
  );
}
