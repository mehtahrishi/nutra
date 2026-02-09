
"use client"

import { useState } from 'react';
import { aiRecipeDiscovery, AIRecipeDiscoveryOutput } from '@/ai/flows/ai-recipe-discovery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Loader2,
  Utensils,
  Clock,
  ShieldCheck,
  ArrowRight,
  RefreshCcw,
  ChefHat,
  Flame,
  Users,
  AlertTriangle,
  Lightbulb,
  Refrigerator,
  Star,
  Target,
  Wrench,
  // Kitchen equipment icons
  Soup,
  Coffee,
  Scissors,
  Thermometer,
  Timer,
  Scale
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function DiscoverPage() {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [result, setResult] = useState<AIRecipeDiscoveryOutput | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    ingredients: '',
    dietaryRestrictions: '',
    timeLimit: '30 minutes' // Default value for the AI
  });

  async function handleDiscovery() {
    console.log('Button clicked!'); // Debug log

    if (!formData.ingredients.trim()) {
      toast({
        title: "Missing ingredients",
        description: "Please tell us what you have in your kitchen!",
        variant: "destructive"
      });
      return;
    }

    console.log('Starting recipe discovery...'); // Debug log
    setLoading(true);

    // Fun loading messages sequence
    const messages = [
      "Evaluating your ingredients...",
      "Wait bro, digging up ingredients...",
      "Mixing flavors in my brain...",
      "Consulting the recipe database...",
      "Adding some chef magic...",
      "Almost there, finalizing...",
      "Okay done man! 🎉"
    ];

    let messageIndex = 0;
    setLoadingMessage(messages[0]);

    const messageInterval = setInterval(() => {
      messageIndex++;
      if (messageIndex < messages.length - 1) {
        setLoadingMessage(messages[messageIndex]);
      }
    }, 1500);

    try {
      console.log('Calling AI with data:', formData); // Debug log
      const output = await aiRecipeDiscovery(formData);
      console.log('AI response received:', output); // Debug log

      // Show final message
      setLoadingMessage(messages[messages.length - 1]);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save AI-generated recipe to database
      try {
        const ingredientsList = output.ingredients.split(',').filter(i => i.trim()).map(ing => {
          const trimmed = ing.trim().replace(/^[-•*]\s*/, '');
          // Parse quantity, unit, and item
          const pattern = /^([\d\/-]+(?:\.\d+)?(?:\s+\d+\/\d+)?)\s+(large|medium|small|cup|cups|tbsp|tsp|teaspoons?|tablespoons?|g|grams?|kg|ml|l|liter|lb|pounds?|oz|ounces?|packet|packets|slice|slices|inch|inches|cloves?)\s+(.+)$/i;
          const match = trimmed.match(pattern);

          if (match) {
            return {
              quantity: match[1].trim(),
              unit: match[2].trim(),
              item: match[3].trim()
            };
          }

          // Fallback for items without clear pattern
          const parts = trimmed.split(' ');
          return {
            quantity: parts[0] || '1',
            unit: parts[1] || '',
            item: parts.slice(2).join(' ') || trimmed
          };
        });

        const savedRecipe = await fetch('/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: output.recipeName,
            description: output.flavorProfile || output.reasoning,
            category: 'Main Course',
            dietaryTags: formData.dietaryRestrictions.split(',').map(d => d.trim().toLowerCase()).filter(Boolean),
            prepTime: output.cookingDetails?.prepTime || 15,
            cookTime: output.cookingDetails?.cookTime || 15,
            totalTime: output.cookingDetails?.totalTime || 30,
            servings: output.cookingDetails?.servings || 4,
            difficulty: output.cookingDetails?.difficulty || 'medium',
            calories: output.nutritionalInfo?.calories || 400,
            protein: output.nutritionalInfo?.protein || 20,
            carbs: output.nutritionalInfo?.carbs || 30,
            fat: output.nutritionalInfo?.fat || 15,
            fiber: output.nutritionalInfo?.fiber || 5,
            sodium: output.nutritionalInfo?.sodium || 0,
            ingredients: ingredientsList,
            instructions: output.instructions
              .split('\n')
              .map(s => s.trim())
              .filter(s => s.length > 0)
              .map(s => {
                // Remove markdown formatting
                let cleaned = s
                  .replace(/\*\*(.*?)\*\*/g, '$1')
                  .replace(/\*(.*?)\*/g, '$1')
                  .replace(/__(.*?)__/g, '$1')
                  .replace(/_(.*?)_/g, '$1')
                  .trim();
                return cleaned;
              })
              .filter(s => s.length > 0),
            searchKeywords: formData.ingredients.split(',').map(i => i.trim().toLowerCase()),
            mainIngredients: formData.ingredients.split(',').slice(0, 5).map(i => i.trim()),
            source: 'ai-generated',
            aiReasoning: output.reasoning,
            cookingTips: output.cookingTips || [],
            warnings: output.warnings || [],
            variations: output.variations || [],
            equipment: output.equipment || [],
            storageInfo: output.storageInfo || '',
            imageUrl: output.imageUrl || ''
          })
        });

        if (savedRecipe.ok) {
          const savedData = await savedRecipe.json();
          setResult({ ...output, savedId: savedData.data._id } as any);
        } else {
          setResult(output);
        }
      } catch (saveError) {
        console.error('Error saving recipe:', saveError);
        setResult(output); // Still show result even if save fails
      }
    } catch (error) {
      console.error('Error in recipe discovery:', error); // Debug log
      toast({
        title: "Something went wrong",
        description: "The AI chef is currently busy. Please try again.",
        variant: "destructive"
      });
    } finally {
      clearInterval(messageInterval);
      setLoading(false);
      setLoadingMessage('');
      console.log('Recipe discovery completed'); // Debug log
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12 space-y-4 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">AI Recipe Discovery</h1>
        <p className="text-xl text-muted-foreground">Empty fridge? Picky eater? Short on time? <br className="hidden md:block" /> Let our AI genius find the perfect dish for you.</p>
      </div>

      {!result ? (
        <Card className="shadow-2xl border-primary/20 bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden animate-fade-in">
          <CardHeader className="bg-primary/10 border-b border-primary/10">
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Sparkles className="text-primary" />
              Your Cooking Profile
            </CardTitle>
            <CardDescription>Tell the AI about your situation and it will generate a recipe.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="space-y-3">
              <Label className="text-lg font-headline flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" />
                What ingredients do you have / What do you want to make or prepare?
              </Label>
              <Textarea
                placeholder="e.g. Chicken breast, spinach, heavy cream, garlic, pasta... or I want to make pasta carbonara..."
                className="min-h-[120px] text-lg bg-background rounded-2xl p-4"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-headline flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                Dietary Restrictions
              </Label>
              <Input
                placeholder="e.g. Vegan, Keto, Nut-free..."
                className="h-12 bg-background rounded-xl"
                value={formData.dietaryRestrictions}
                onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 p-8 border-t">
            <Button
              size="lg"
              className="w-full h-14 text-xl font-headline bg-primary hover:bg-primary/90 shadow-lg rounded-full"
              disabled={loading}
              onClick={handleDiscovery}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  {loadingMessage}
                </>
              ) : (
                <>
                  Generate My Perfect Recipe
                  <ArrowRight className="ml-2 h-6 w-6" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setResult(null)}
              className="rounded-full border-primary text-primary font-headline"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Another Combo
            </Button>
            {(result as any).savedId && (
              <Badge variant="outline" className="text-green-600 font-headline py-1.5 px-4">SAVED TO DATABASE</Badge>
            )}
          </div>

          <Card className="shadow-xl rounded-3xl border-none overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary to-accent text-white p-8">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-4xl font-headline mb-2">{result.recipeName}</CardTitle>
                  <CardDescription className="text-white/90 text-lg">
                    <Sparkles className="inline-block w-5 h-5 mr-2" />
                    {result.reasoning}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <Badge className="bg-white/20 text-white border-white/30 mb-2">
                    {result.cookingDetails?.difficulty?.toUpperCase() || 'MEDIUM'}
                  </Badge>
                  <div className="text-white/80 text-sm">
                    <Users className="inline w-4 h-4 mr-1" />
                    {result.cookingDetails?.servings || 4} servings
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Row 2: Image */}
              {result.imageUrl && (
                <div className="px-8 pb-6 pt-8">
                  <div className="relative h-64 md:h-80 overflow-hidden rounded-2xl bg-muted/20">
                    <Image
                      src={result.imageUrl}
                      alt={result.recipeName}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('source.unsplash.com')) {
                          target.src = 'https://source.unsplash.com/800x600/?food,recipe';
                        }
                      }}
                    />

                  </div>
                </div>
              )}

              {/* Row 3: Total Time Section */}
              <div className="px-8 pb-6">
                <div className="bg-muted/30 p-6 rounded-2xl border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="font-headline font-bold text-lg">{result.cookingDetails?.totalTime || 30}min</div>
                      <div className="text-sm text-muted-foreground">Total Time</div>
                    </div>
                    <div className="text-center">
                      <ChefHat className="w-6 h-6 text-accent mx-auto mb-2" />
                      <div className="font-headline font-bold text-lg">{result.cookingDetails?.prepTime || 15}min</div>
                      <div className="text-sm text-muted-foreground">Prep Time</div>
                    </div>
                    <div className="text-center">
                      <Flame className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="font-headline font-bold text-lg">{result.cookingDetails?.cookTime || 15}min</div>
                      <div className="text-sm text-muted-foreground">Cook Time</div>
                    </div>
                    <div className="text-center">
                      <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                      <div className="font-headline font-bold text-lg">{result.cookingDetails?.servings || 4}</div>
                      <div className="text-sm text-muted-foreground">Servings</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Flavor Experience */}
              {result.flavorProfile && (
                <div className="px-8 pb-6">
                  <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-6 rounded-2xl">
                    <h3 className="text-2xl font-headline font-bold text-accent mb-3 flex items-center gap-2">
                      <Star className="w-6 h-6" />
                      Flavor Experience
                    </h3>
                    <p className="text-lg leading-relaxed text-foreground">{result.flavorProfile.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                  </div>
                </div>
              )}

              {/* Row 5: Ingredients */}
              <div className="px-8 pb-6">
                <div className="bg-muted/20 p-6 rounded-2xl">
                  <h3 className="text-2xl font-headline font-bold text-primary mb-6 flex items-center gap-2">
                    <Utensils className="w-6 h-6" />
                    Ingredients
                  </h3>
                  <div className="p-4 rounded-xl bg-background">
                    <p className="text-base leading-relaxed">
                      {result.ingredients
                        .replace(/\*\*(.*?)\*\*/g, '$1')
                        .replace(/^[-•*]\s*/gm, '')
                        .replace(/For the [^:]*:\s*/gi, '')
                        .replace(/\n+/g, ', ')
                        .replace(/,\s*,/g, ',')
                        .replace(/^,\s*/, '')
                        .replace(/,\s*$/, '')
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 6: Step-by-Step Collapsible */}
              <div className="px-8 pb-6">
                <details className="group bg-accent/10 rounded-2xl overflow-hidden">
                  <summary className="cursor-pointer p-6 hover:bg-accent/20 transition-colors">
                    <h3 className="text-2xl font-headline font-bold text-accent inline-flex items-center gap-2">
                      <ChefHat className="w-6 h-6" />
                      Step-by-Step Instructions
                      <ArrowRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                    </h3>
                  </summary>
                  <div className="px-6 pb-6 space-y-4">
                    {(() => {
                      const cleanInstructions = result.instructions.replace(/\*\*(.*?)\*\*/g, '$1');

                      // Try to match complete numbered steps with their content
                      const stepMatches = cleanInstructions.match(/\d+\.\s[^]*?(?=\d+\.\s|$)/g);

                      if (stepMatches && stepMatches.length > 0) {
                        return stepMatches.map((step, idx) => {
                          // Extract the number and content
                          const match = step.match(/^(\d+)\.\s([\s\S]*)$/);
                          if (match) {
                            const [, stepNumber, stepContent] = match;
                            return (
                              <div key={idx} className="flex gap-4 p-6 rounded-2xl bg-gradient-to-r from-background to-muted/20 border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg">
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg font-headline">{stepNumber}</span>
                                  </div>
                                </div>
                                <div className="flex-1 pt-2">
                                  <p className="text-base leading-relaxed text-foreground">{stepContent.trim()}</p>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div key={idx} className="p-6 rounded-2xl bg-gradient-to-r from-background to-muted/20 border border-accent/20">
                              <p className="text-base leading-relaxed">{step.trim()}</p>
                            </div>
                          );
                        });
                      }

                      // Fallback: split by lines and filter numbered steps
                      return cleanInstructions
                        .split('\n')
                        .filter(step => step.trim() && /^\d+\./.test(step.trim()))
                        .map((step, idx) => {
                          const match = step.match(/^(\d+)\.\s(.*)$/);
                          if (match) {
                            const [, stepNumber, stepContent] = match;
                            return (
                              <div key={idx} className="flex gap-4 p-6 rounded-2xl bg-gradient-to-r from-background to-muted/20 border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg">
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg font-headline">{stepNumber}</span>
                                  </div>
                                </div>
                                <div className="flex-1 pt-2">
                                  <p className="text-base leading-relaxed text-foreground">{stepContent.trim()}</p>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div key={idx} className="p-6 rounded-2xl bg-gradient-to-r from-background to-muted/20 border border-accent/20">
                              <p className="text-base leading-relaxed">{step.trim()}</p>
                            </div>
                          );
                        });
                    })()}
                  </div>
                </details>
              </div>

              {/* Row 7: Equipment Needed */}
              {result.equipment && result.equipment.length > 0 && (
                <div className="px-8 pb-6">
                  <div className="bg-primary/10 p-6 rounded-2xl">
                    <h3 className="text-2xl font-headline font-bold text-primary mb-4 flex items-center gap-2">
                      <Wrench className="w-6 h-6" />
                      Equipment Needed
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {result.equipment.map((item, idx) => {
                        // Kitchen equipment icons array
                        const kitchenIcons = [
                          ChefHat, Utensils, Soup, Coffee, Scissors,
                          Thermometer, Timer, Scale, Wrench
                        ];
                        // Randomly select an icon based on the item index
                        const IconComponent = kitchenIcons[idx % kitchenIcons.length];

                        return (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-background rounded-xl">
                            <IconComponent className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm">{item.replace(/\*\*(.*?)\*\*/g, '$1')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Row 8: Nutritional Breakdown */}
              {result.nutritionalInfo && (
                <div className="px-8 pb-6">
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-2xl">
                    <h3 className="text-2xl font-headline font-bold text-primary mb-6 flex items-center gap-2">
                      <Target className="w-6 h-6" />
                      Nutritional Breakdown (Per Serving)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="bg-background p-4 rounded-xl text-center border border-primary/20">
                        <div className="text-2xl font-headline font-bold text-primary">{result.nutritionalInfo.calories}</div>
                        <div className="text-sm text-muted-foreground">Calories</div>
                      </div>
                      <div className="bg-background p-4 rounded-xl text-center border border-accent/20">
                        <div className="text-2xl font-headline font-bold text-accent">{result.nutritionalInfo.protein}g</div>
                        <div className="text-sm text-muted-foreground">Protein</div>
                      </div>
                      <div className="bg-background p-4 rounded-xl text-center border border-primary/20">
                        <div className="text-2xl font-headline font-bold text-primary">{result.nutritionalInfo.carbs}g</div>
                        <div className="text-sm text-muted-foreground">Carbs</div>
                      </div>
                      <div className="bg-background p-4 rounded-xl text-center border border-accent/20">
                        <div className="text-2xl font-headline font-bold text-accent">{result.nutritionalInfo.fat}g</div>
                        <div className="text-sm text-muted-foreground">Fat</div>
                      </div>
                      <div className="bg-background p-4 rounded-xl text-center border border-primary/20">
                        <div className="text-2xl font-headline font-bold text-primary">{result.nutritionalInfo.fiber}g</div>
                        <div className="text-sm text-muted-foreground">Fiber</div>
                      </div>
                      <div className="bg-background p-4 rounded-xl text-center border border-accent/20">
                        <div className="text-2xl font-headline font-bold text-accent">{result.nutritionalInfo.sodium}mg</div>
                        <div className="text-sm text-muted-foreground">Sodium</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Row 9: Pro Chef Tips & Important Warnings (2 cells) */}
              <div className="px-8 pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pro Chef Tips */}
                  {result.cookingTips && result.cookingTips.length > 0 && (
                    <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20">
                      <h3 className="text-xl font-headline font-bold text-accent mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Pro Chef Tips
                      </h3>
                      <ul className="space-y-3">
                        {result.cookingTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-background">
                            <Lightbulb className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                            <span className="text-sm leading-relaxed">{tip.replace(/\*\*(.*?)\*\*/g, '$1')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Important Warnings */}
                  {result.warnings && result.warnings.length > 0 && (
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
                      <h3 className="text-xl font-headline font-bold text-red-600 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Important Warnings
                      </h3>
                      <ul className="space-y-3">
                        {result.warnings.map((warning, idx) => (
                          <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white">
                            <AlertTriangle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                            <span className="text-sm leading-relaxed text-red-800">{warning.replace(/\*\*(.*?)\*\*/g, '$1')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 10: Recipe Variations Carousel */}
              {result.variations && result.variations.length > 0 && (
                <div className="px-8 pb-6">
                  <div className="bg-primary/10 p-6 rounded-2xl">
                    <h3 className="text-2xl font-headline font-bold text-primary mb-6 flex items-center gap-2">
                      <Sparkles className="w-6 h-6" />
                      Recipe Variations
                    </h3>
                    <div className="relative overflow-hidden">
                      <div className="flex gap-4 animate-scroll-x">
                        {result.variations.concat(result.variations).map((variation, idx) => (
                          <div key={idx} className="flex-shrink-0 w-80 p-4 bg-background rounded-xl border border-primary/20">
                            <div className="flex items-start gap-3">
                              <Sparkles className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                              <span className="text-sm leading-relaxed">{variation.replace(/\*\*(.*?)\*\*/g, '$1')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Row 11: Storage Instructions */}
              {result.storageInfo && (
                <div className="px-8 pb-8">
                  <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20">
                    <h3 className="text-2xl font-headline font-bold text-accent mb-4 flex items-center gap-2">
                      <Refrigerator className="w-6 h-6" />
                      Storage Instructions
                    </h3>
                    <div className="p-4 rounded-xl bg-background">
                      <p className="text-base leading-relaxed">{result.storageInfo.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
