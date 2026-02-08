
"use client"

import { useState } from 'react';
import { aiRecipeDiscovery, AIRecipeDiscoveryOutput } from '@/ai/flows/ai-recipe-discovery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, Utensils, Clock, ShieldCheck, ArrowRight, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DiscoverPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIRecipeDiscoveryOutput | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    ingredients: '',
    dietaryRestrictions: '',
    timeLimit: '30 minutes'
  });

  async function handleDiscovery() {
    if (!formData.ingredients.trim()) {
      toast({
        title: "Missing ingredients",
        description: "Please tell us what you have in your kitchen!",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const output = await aiRecipeDiscovery(formData);
      setResult(output);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "The AI chef is currently busy. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12 space-y-4 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">AI Recipe Discovery</h1>
        <p className="text-xl text-muted-foreground">Empty fridge? Picky eater? Short on time? <br className="hidden md:block"/> Let our AI genius find the perfect dish for you.</p>
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
                What ingredients do you have?
              </Label>
              <Textarea 
                placeholder="e.g. Chicken breast, spinach, heavy cream, garlic, pasta..." 
                className="min-h-[120px] text-lg bg-background rounded-2xl p-4"
                value={formData.ingredients}
                onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-lg font-headline flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  Dietary Restrictions
                </Label>
                <Input 
                  placeholder="e.g. Vegan, Keto, Nut-free..." 
                  className="h-12 bg-background rounded-xl"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-lg font-headline flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Time Limit
                </Label>
                <Input 
                  placeholder="e.g. 15 minutes, 1 hour..." 
                  className="h-12 bg-background rounded-xl"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({...formData, timeLimit: e.target.value})}
                />
              </div>
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
                  Consulting the Chef...
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
            <Badge variant="outline" className="text-primary font-headline py-1.5 px-4">AI GENERATED</Badge>
          </div>

          <Card className="shadow-xl rounded-3xl border-none overflow-hidden">
            <CardHeader className="bg-primary text-white p-8">
              <CardTitle className="text-4xl font-headline mb-2">{result.recipeName}</CardTitle>
              <CardDescription className="text-white/80 text-lg">
                <Sparkles className="inline-block w-5 h-5 mr-2" />
                AI Reasoning: {result.reasoning}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-1 space-y-4">
                  <h3 className="text-2xl font-headline font-bold text-primary flex items-center gap-2">
                    <Utensils className="w-6 h-6" />
                    Ingredients
                  </h3>
                  <ul className="space-y-3 text-lg leading-relaxed">
                    {result.ingredients.split('\n').map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-1">•</span>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-2xl font-headline font-bold text-accent flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    Step-by-Step Instructions
                  </h3>
                  <div className="space-y-6">
                    {result.instructions.split('\n').filter(s => s.trim()).map((step, idx) => (
                      <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-muted/30">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold font-headline">
                          {idx + 1}
                        </span>
                        <p className="text-lg leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
