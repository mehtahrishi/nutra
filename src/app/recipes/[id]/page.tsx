"use client"

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { 
  Clock, 
  Flame, 
  Sparkles, 
  BrainCircuit, 
  Scale,
  ChefHat,
  Loader2,
  ShoppingBasket,
  Check,
  Timer,
  Users,
  TrendingUp,
  Leaf,
  Lightbulb,
  Repeat
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

// Helper function to clean markdown formatting from text
function cleanMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove **bold**
    .replace(/\*(.*?)\*/g, '$1')      // Remove *italic*
    .replace(/__(.*?)__/g, '$1')      // Remove __bold__
    .replace(/_(.*?)_/g, '$1')        // Remove _italic_
    .trim();
}

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
  // If already an array with multiple items, clean each one
  if (Array.isArray(instructions) && instructions.length > 0) {
    const cleanedSteps = instructions.map(instruction => {
      let cleaned = cleanMarkdown(instruction);
      // Remove leading numbers like "1. " or "1) "
      cleaned = cleaned.replace(/^\d+[\.\)]\s+/, '').trim();
      return cleaned;
    }).filter(s => s.length > 0);
    
    if (cleanedSteps.length > 0) return cleanedSteps;
    
    // If cleaning resulted in empty, try parsing the first item
    if (instructions.length === 1) {
      return parseInstructionString(instructions[0]);
    }
  }
  
  // If single string, parse it
  const text = Array.isArray(instructions) ? instructions[0] : instructions;
  return parseInstructionString(text);
}

function parseInstructionString(text: string): string[] {
  if (!text) return [];
  
  // Remove markdown formatting (bold, italic, etc.)
  text = text
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove **bold**
    .replace(/\*(.*?)\*/g, '$1')      // Remove *italic*
    .replace(/__(.*?)__/g, '$1')      // Remove __bold__
    .replace(/_(.*?)_/g, '$1');       // Remove _italic_
  
  // First try: Split by newlines (most common in AI responses)
  let steps = text.split(/\n+/).filter(s => s.trim());
  if (steps.length > 1) {
    return steps.map(s => s.replace(/^\d+[\.\)]\s+/, '').trim()).filter(s => s.length > 0);
  }
  
  // Second try: Split by numbered patterns - handle embedded numbers like "heat.2. Add"
  // This pattern matches: ".1. ", ".2. ", " 1. ", " 2. ", etc.
  const embeddedNumberPattern = /[\.\s](\d+)\.\s+/g;
  const matches = [...text.matchAll(embeddedNumberPattern)];
  
  if (matches.length > 0) {
    steps = [];
    let lastIndex = 0;
    
    matches.forEach((match, i) => {
      const matchIndex = match.index!;
      
      // Add text before this number (skip for first match)
      if (i === 0) {
        const firstPart = text.substring(0, matchIndex).trim();
        if (firstPart) {
          // Remove any leading numbers from first part
          steps.push(firstPart.replace(/^\d+[\.\)]\s+/, '').trim());
        }
      }
      
      // Find start of next step (or end of text)
      const nextMatch = matches[i + 1];
      const endIndex = nextMatch ? nextMatch.index! : text.length;
      
      // Extract the step content
      const stepContent = text.substring(matchIndex + match[0].length, endIndex).trim();
      if (stepContent) {
        steps.push(stepContent);
      }
      
      lastIndex = endIndex;
    });
    
    if (steps.length > 0) {
      return steps;
    }
  }
  
  // Third try: Standard numbered pattern at start
  const numberedPattern = /^\d+[\.\)]\s+/;
  steps = text.split(/(?=\d+[\.\)]\s+)/).filter(s => s.trim());
  if (steps.length > 1) {
    return steps.map(s => s.replace(numberedPattern, '').trim()).filter(s => s.length > 0);
  }
  
  // Fourth try: Split by sentence boundaries where sentences start with action verbs
  const actionPattern = /\.\s+(?=(?:Heat|Add|Mix|Stir|Cook|Bake|Pour|Place|Remove|Combine|Whisk|Fold|Serve|Garnish|Season|Chop|Cut|Slice|Preheat|Transfer|Bring|Reduce|Simmer|Boil|Fry|Sauté|Roast|Grill|Blend|Drain|Rinse|Pat|Sprinkle|Drizzle|Toss|Let|Allow|Set|Cover|Uncover)[A-Z\s])/g;
  steps = text.split(actionPattern).filter(s => s.trim());
  if (steps.length > 1) {
    return steps.map(s => {
      s = s.trim();
      return s.endsWith('.') ? s : s + '.';
    });
  }
  
  // Fourth try: Split by general sentence boundaries (capital letter after period)
  steps = text.split(/\.\s+(?=[A-Z])/);
  if (steps.length > 2) {
    return steps.map(s => {
      s = s.trim();
      return s.endsWith('.') ? s : s + '.';
    });
  }
  
  // Return as single step if no clear separation
  return [text.trim()];
}

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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
    <div className="min-h-screen pb-20 bg-gradient-to-b from-primary/5 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950">
      {/* Title Section */}
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-foreground mb-6 leading-tight">
              {recipe.title}
            </h1>
            
            {/* Flavor Experience */}
            {recipe.description && (
              <Card className="mb-6 rounded-2xl border-none shadow-lg overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 dark:from-primary/20 dark:via-accent/20 dark:to-primary/20">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Sparkles className="w-5 h-5 text-primary dark:text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-headline font-semibold mb-2 text-primary dark:text-primary">
                        Flavor Experience
                      </h3>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {recipe.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Labels Row */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-gradient-to-r from-primary to-accent text-white border-none px-4 py-2 text-sm font-semibold shadow-md">
                {recipe.category}
              </Badge>
              {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
                <>
                  {recipe.dietaryTags.map((tag: string) => (
                    <Badge 
                      key={tag} 
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/30 px-4 py-2 text-sm font-medium"
                    >
                      {tag}
                    </Badge>
                  ))}
                </>
              )}
              {recipe.mainIngredients && recipe.mainIngredients.length > 0 && (
                <>
                  {recipe.mainIngredients.slice(0, 3).map((ingredient: string) => (
                    <Badge 
                      key={ingredient} 
                      variant="outline"
                      className="bg-accent/10 text-accent border-accent/30 px-4 py-2 text-sm font-medium"
                    >
                      {ingredient}
                    </Badge>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="rounded-2xl border-none shadow-xl bg-gradient-to-br from-primary to-primary/80 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-5 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    <Timer className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-white/80 mb-1 font-medium uppercase tracking-wide">Prep Time</p>
                <p className="text-2xl font-headline font-bold text-white">{recipe.prepTime || 0}<span className="text-sm ml-1">min</span></p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none shadow-xl bg-gradient-to-br from-accent to-accent/80 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-5 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-white/80 mb-1 font-medium uppercase tracking-wide">Cook Time</p>
                <p className="text-2xl font-headline font-bold text-white">{recipe.cookTime || 0}<span className="text-sm ml-1">min</span></p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none shadow-xl bg-gradient-to-br from-primary to-accent hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-5 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-white/80 mb-1 font-medium uppercase tracking-wide">Servings</p>
                <p className="text-2xl font-headline font-bold text-white">{recipe.servings || 1}</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none shadow-xl bg-gradient-to-br from-accent to-primary hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-5 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-white/80 mb-1 font-medium uppercase tracking-wide">Calories</p>
                <p className="text-2xl font-headline font-bold text-white">{recipe.calories}</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none shadow-xl bg-gradient-to-br from-primary to-accent hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-5 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-white/80 mb-1 font-medium uppercase tracking-wide">Difficulty</p>
                <p className="text-2xl font-headline font-bold text-white capitalize">{recipe.difficulty || 'Medium'}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar + Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Image (smaller version for sidebar) */}
              <Card className="rounded-3xl border-none shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300">
                <div className="relative h-[300px]">
                  {recipe.imageUrl && (
                    <Image
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </Card>

              {/* Ingredients */}
              <Card className="rounded-3xl border-none shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-accent p-5">
                  <h2 className="text-xl font-headline font-bold text-white flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20">
                      <ShoppingBasket className="w-5 h-5" />
                    </div>
                    Ingredients
                  </h2>
                </div>
                <CardContent className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-gray-800 dark:to-gray-900">
                  <p className="text-base leading-relaxed text-foreground">
                    {parseIngredients(recipe.ingredients)
                      .map((ing: any) => {
                        const parts = [ing.quantity, ing.unit, ing.item].filter(Boolean);
                        return parts.join(' ');
                      })
                      .join(', ')}
                  </p>
                </CardContent>
              </Card>

              {/* Nutrition Facts */}
              <Card className="rounded-3xl border-none shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-accent to-primary p-5">
                  <h2 className="text-xl font-headline font-bold text-white flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20">
                      <Scale className="w-5 h-5" />
                    </div>
                    Nutrition Facts
                  </h2>
                </div>
                <CardContent className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 dark:from-gray-800 dark:to-gray-900">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                      <p className="text-xs text-primary mb-1 font-semibold uppercase tracking-wide">Calories</p>
                      <p className="text-2xl font-headline font-bold text-foreground">{recipe.calories}<span className="text-sm ml-1">kcal</span></p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                      <p className="text-xs text-primary mb-1 font-semibold uppercase tracking-wide">Protein</p>
                      <p className="text-2xl font-headline font-bold text-foreground">{recipe.protein}<span className="text-sm ml-1">g</span></p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                      <p className="text-xs text-primary mb-1 font-semibold uppercase tracking-wide">Carbs</p>
                      <p className="text-2xl font-headline font-bold text-foreground">{recipe.carbs}<span className="text-sm ml-1">g</span></p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                      <p className="text-xs text-primary mb-1 font-semibold uppercase tracking-wide">Fat</p>
                      <p className="text-2xl font-headline font-bold text-foreground">{recipe.fat}<span className="text-sm ml-1">g</span></p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 col-span-2">
                      <p className="text-xs text-primary mb-1 font-semibold uppercase tracking-wide">Fiber</p>
                      <p className="text-2xl font-headline font-bold text-foreground">{recipe.fiber || 0}<span className="text-sm ml-1">g</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Required Equipment */}
              {recipe.equipment && recipe.equipment.length > 0 && (
                <Card className="rounded-3xl border-none shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-accent p-5">
                    <h2 className="text-xl font-headline font-bold text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/20">
                        <ShoppingBasket className="w-5 h-5" />
                      </div>
                      Equipment
                    </h2>
                  </div>
                  <CardContent className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex flex-wrap gap-2">
                      {recipe.equipment.map((item: string, i: number) => (
                        <Badge key={i} variant="outline" className="bg-primary/10 text-primary border-primary/30 px-3 py-1.5 text-sm font-medium">
                          {cleanMarkdown(item)}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Instructions */}
              <Card className="rounded-3xl border-none shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-accent p-6">
                  <h2 className="text-2xl font-headline font-bold text-white flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/20">
                      <ChefHat className="w-7 h-7" />
                    </div>
                    Step-by-Step Instructions
                  </h2>
                </div>
                <CardContent className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-gray-800 dark:to-gray-900">
                  <div className="space-y-6">
                    {parseInstructions(recipe.instructions).map((step: string, i: number) => (
                      <div key={i} className="flex gap-5 group">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold font-headline text-xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                            {i + 1}
                          </div>
                        </div>
                        <div className="flex-1 pt-2">
                          <p className="text-lg leading-relaxed text-foreground">{step}</p>
                        </div>
                      </div>
                    ))}                  </div>
                </CardContent>
              </Card>

              {/* Cooking Tips */}
              {recipe.cookingTips && recipe.cookingTips.length > 0 && (
                <Card className="rounded-3xl border-none shadow-2xl overflow-hidden bg-gradient-to-br from-primary to-accent">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3 text-white">
                      <div className="p-2 rounded-xl bg-white/20">
                        <ChefHat className="w-7 h-7" />
                      </div>
                      Pro Cooking Tips
                    </h3>
                    <ul className="space-y-4">
                      {recipe.cookingTips.map((tip: string, i: number) => (
                        <li key={i} className="flex gap-4 items-start">
                          <Check className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                          <span className="text-lg text-white leading-relaxed">{cleanMarkdown(tip)}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Warnings */}
              {recipe.warnings && recipe.warnings.length > 0 && (
                <Card className="rounded-3xl border-none shadow-2xl overflow-hidden bg-gradient-to-br from-accent to-primary">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3 text-white">
                      <div className="p-2 rounded-xl bg-white/20">
                        <Scale className="w-7 h-7" />
                      </div>
                      Important Warnings
                    </h3>
                    <ul className="space-y-4">
                      {recipe.warnings.map((warning: string, i: number) => (
                        <li key={i} className="flex gap-4 items-start">
                          <span className="text-2xl flex-shrink-0">⚠️</span>
                          <span className="text-lg text-white leading-relaxed">{cleanMarkdown(warning)}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Smart Substitutions */}
              {recipe.substitutions && recipe.substitutions.length > 0 && (
                <Card className="rounded-3xl border-none shadow-2xl overflow-hidden bg-gradient-to-br from-primary to-accent">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3 text-white">
                      <div className="p-2 rounded-xl bg-white/20">
                        <Repeat className="w-7 h-7" />
                      </div>
                      Smart Substitutions
                    </h3>
                    <div className="space-y-5">
                      {recipe.substitutions.map((sub: any, i: number) => (
                        <div key={i} className="p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <Badge className="bg-white/90 text-primary border-none px-4 py-1.5 text-sm font-semibold">
                              Replace: {sub.original}
                            </Badge>
                            <span className="text-white font-bold text-lg">→</span>
                            <Badge className="bg-white/90 text-accent border-none px-4 py-1.5 text-sm font-semibold">
                              With: {sub.replacement}
                            </Badge>
                          </div>
                          {sub.reason && (
                            <p className="text-base text-white/90 leading-relaxed">{sub.reason}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Variations & Storage - 2 Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Variations */}
            {recipe.variations && recipe.variations.length > 0 && (
              <Card className="rounded-3xl border-none shadow-2xl overflow-hidden bg-gradient-to-br from-accent to-primary">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3 text-white">
                    <div className="p-2 rounded-xl bg-white/20">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    Recipe Variations
                  </h3>
                  <Carousel 
                    className="w-full max-w-full"
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 5000,
                      }),
                    ]}
                  >
                    <CarouselContent>
                      {recipe.variations.map((variation: string, i: number) => (
                        <CarouselItem key={i}>
                          <Card className="border-none bg-white/10 backdrop-blur-sm">
                            <CardContent className="p-6">
                              <h4 className="text-lg font-semibold text-white mb-3">Variation {i + 1}</h4>
                              <p className="text-base text-white/90 leading-relaxed">{cleanMarkdown(variation)}</p>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </CardContent>
              </Card>
            )}

            {/* Storage Instructions */}
            {recipe.storageInfo && (
              <Card className="rounded-3xl border-none shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-accent to-primary p-6">
                  <h2 className="text-2xl font-headline font-bold text-white flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/20">
                      <Clock className="w-7 h-7" />
                    </div>
                    Storage Instructions
                  </h2>
                </div>
                <CardContent className="p-8 bg-gradient-to-br from-accent/5 to-primary/5 dark:from-gray-800 dark:to-gray-900">
                  <p className="text-lg text-foreground leading-relaxed">
                    {cleanMarkdown(recipe.storageInfo)}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Floating AI Assistant Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            onClick={handleAiAssistant}
            className="fixed right-8 bottom-8 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
            title="AI Kitchen Assistant"
          >
            <BrainCircuit className="w-8 h-8 group-hover:animate-pulse" />
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
                Get personalized cooking tips, substitutions, and expert advice for this recipe.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {aiLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-base font-headline text-muted-foreground">The AI is analyzing the recipe...</p>
              </div>
            ) : aiResult ? (
              <div className="prose prose-orange max-w-none">
                <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground/80">
                  {aiResult.suggestions}
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Click the button to get AI-powered suggestions!</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
