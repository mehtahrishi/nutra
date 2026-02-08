import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, Zap, Flame, Clock, ChefHat } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-food');
  const featuredRecipes = [
    {
      id: '1',
      title: 'Mediterranean Salmon Salad',
      image: PlaceHolderImages.find(img => img.id === 'recipe-salmon'),
      time: '20 min',
      calories: '450 kcal',
      category: 'Keto'
    },
    {
      id: '2',
      title: 'Zesty Avocado Pasta',
      image: PlaceHolderImages.find(img => img.id === 'recipe-pasta'),
      time: '15 min',
      calories: '380 kcal',
      category: 'Vegan'
    },
    {
      id: '3',
      title: 'Berry Power Smoothie',
      image: PlaceHolderImages.find(img => img.id === 'recipe-smoothie'),
      time: '5 min',
      calories: '220 kcal',
      category: 'Gluten-Free'
    }
  ];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover opacity-20"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="container px-4 text-center z-10 space-y-8 animate-fade-in">
          <Badge className="bg-accent text-white font-headline px-4 py-1.5 text-sm uppercase tracking-wider mb-4">
            AI-Powered Nutrition
          </Badge>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-foreground leading-tight">
            Discover Recipes <br /> 
            <span className="text-primary italic">Tailored To You</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            NutriGenius uses advanced AI to craft recipes based on your specific ingredients, dietary goals, and time limits.
          </p>
          
          <div className="max-w-xl mx-auto relative mt-10">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input 
              type="text" 
              placeholder="Search ingredients or dishes (e.g. 'high protein quinoa')"
              className="h-14 pl-12 pr-32 rounded-full border-2 border-primary/20 focus:border-primary shadow-xl bg-background text-lg"
            />
            <Button className="absolute right-2 top-2 h-10 rounded-full font-headline px-6 bg-primary hover:bg-primary/90">
              Search
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/discover">
              <Button size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-lg px-8 py-6 font-headline">
                <Sparkles className="mr-2 h-5 w-5" />
                AI Magic Discovery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Recipes Grid */}
      <section className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-headline font-bold">Trending Healthy Delights</h2>
          <Link href="/recipes" className="text-primary hover:underline font-headline">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredRecipes.map((recipe) => (
            <Card key={recipe.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all rounded-2xl bg-card">
              <div className="relative h-64 overflow-hidden">
                {recipe.image && (
                  <Image
                    src={recipe.image.imageUrl}
                    alt={recipe.image.description}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    data-ai-hint={recipe.image.imageHint}
                  />
                )}
                <Badge className="absolute top-4 right-4 bg-white/90 text-primary font-headline border-none backdrop-blur-sm">
                  {recipe.category}
                </Badge>
              </div>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-headline font-semibold mb-2 group-hover:text-primary transition-colors">
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    {recipe.time}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Flame className="w-4 h-4 text-accent" />
                    {recipe.calories}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pb-6">
                <Link href={`/recipes/${recipe.id}`} className="w-full">
                  <Button variant="outline" className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-white font-headline">
                    View Recipe
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories / Benefits */}
      <section className="bg-secondary/30 py-20 border-y border-secondary">
        <div className="container px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-headline font-bold text-foreground">Why NutriGenius?</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              We combine the precision of Algolia search with the intelligence of GenAI to make healthy eating effortless.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Zap className="w-10 h-10 text-primary" />} 
              title="Instant Search" 
              description="Find recipes in milliseconds with our Algolia-powered engine."
            />
            <FeatureCard 
              icon={<Sparkles className="w-10 h-10 text-accent" />} 
              title="AI Discovery" 
              description="Got leftovers? Tell our AI what's in your fridge and get a personalized recipe."
            />
            <FeatureCard 
              icon={<Flame className="w-10 h-10 text-orange-600" />} 
              title="Nutrition First" 
              description="Detailed macros and caloric information for every single dish."
            />
            <FeatureCard 
              icon={<ChefHat className="w-10 h-10 text-yellow-600" />} 
              title="Cooking Tips" 
              description="AI Assistant guides you through substitutions and healthy tweaks."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-background p-8 rounded-3xl shadow-sm hover:shadow-md transition-all border border-secondary text-center space-y-4">
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-xl font-headline font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
