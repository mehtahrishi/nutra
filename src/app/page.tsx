import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, Zap, Flame, Clock, ChefHat } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function Home() {
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
    <div className="flex flex-col gap-16 pb-20 relative">
      {/* Flowing Aura Background */}
      <div className="aura-bg">
        <div className="aura-blob top-[-10%] left-[-10%]" />
        <div className="aura-blob-2 bottom-[-10%] right-[-10%]" />
        <div className="aura-blob top-[40%] right-[10%] opacity-50" />
      </div>

      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
        <div className="container px-4 text-center z-10 space-y-8 animate-fade-in">
          <Badge className="bg-primary/20 text-primary border-primary/20 font-headline px-6 py-2 text-sm uppercase tracking-widest mb-4 backdrop-blur-sm">
            AI-Powered Nutrition
          </Badge>
          <h1 className="text-6xl md:text-8xl font-headline font-bold text-foreground leading-[1.1] tracking-tight">
            Elevate Your <br /> 
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-text bg-clip-text text-transparent italic">Culinary Intelligence</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed">
            NutriGenius crafts professional-grade recipes tailored to your pantry, dietary needs, and schedule using state-of-the-art Generative AI.
          </p>
          
          <div className="max-w-2xl mx-auto relative mt-12 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <Input 
                type="text" 
                placeholder="What's in your fridge today?"
                className="h-16 pl-16 pr-40 rounded-full border-none shadow-2xl bg-background/80 backdrop-blur-xl text-xl placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/50"
              />
              <Button className="absolute right-2 top-2 h-12 rounded-full font-headline px-8 bg-primary hover:bg-primary/90 text-lg shadow-lg">
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <Link href="/discover">
              <Button size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-xl px-10 py-8 font-headline shadow-2xl hover:scale-105 transition-all">
                <Sparkles className="mr-3 h-6 w-6" />
                Start AI Discovery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Recipes Grid */}
      <section className="container px-4">
        <div className="flex items-end justify-between mb-12 border-b border-border pb-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-headline font-bold">Chef's AI Selection</h2>
            <p className="text-muted-foreground">Personalized picks based on nutritional density.</p>
          </div>
          <Link href="/recipes" className="text-primary hover:text-accent font-headline text-lg font-bold transition-colors">
            Browse All Recipes
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featuredRecipes.map((recipe) => (
            <Card key={recipe.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2rem] bg-card/50 backdrop-blur-md">
              <div className="relative h-72 overflow-hidden">
                {recipe.image && (
                  <Image
                    src={recipe.image.imageUrl}
                    alt={recipe.image.description}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    data-ai-hint={recipe.image.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge className="absolute top-6 left-6 bg-white/90 text-primary font-headline border-none backdrop-blur-md px-4 py-1.5 shadow-sm">
                  {recipe.category}
                </Badge>
              </div>
              <CardContent className="pt-8 px-8">
                <h3 className="text-3xl font-headline font-bold mb-4 leading-tight group-hover:text-primary transition-colors">
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="w-5 h-5 text-primary" />
                    {recipe.time}
                  </span>
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Flame className="w-5 h-5 text-accent" />
                    {recipe.calories}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pb-8 px-8">
                <Link href={`/recipes/${recipe.id}`} className="w-full">
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-primary/20 text-primary hover:bg-primary hover:text-white font-headline text-lg transition-all">
                    View Kitchen Guide
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl font-headline font-bold text-foreground">Next-Gen Home Cooking</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've combined professional nutritional data with intuitive AI to revolutionize how you eat.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Zap className="w-12 h-12 text-primary" />} 
              title="Instant Inspiration" 
              description="Our engine analyzes millions of culinary combinations in real-time."
            />
            <FeatureCard 
              icon={<Sparkles className="w-12 h-12 text-accent" />} 
              title="Adaptive Flavors" 
              description="Got random leftovers? Our AI turns chaos into a gourmet experience."
            />
            <FeatureCard 
              icon={<Flame className="w-12 h-12 text-primary" />} 
              title="Macro Precision" 
              description="Get exact nutritional breakdowns for every modified ingredient."
            />
            <FeatureCard 
              icon={<ChefHat className="w-12 h-12 text-accent" />} 
              title="Virtual Sous-Chef" 
              description="Receive step-by-step guidance and substitution hacks on the fly."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card/40 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-white/20 text-center space-y-6 group hover:-translate-y-2 duration-300">
      <div className="flex justify-center group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-2xl font-headline font-bold">{title}</h3>
      <p className="text-muted-foreground text-lg leading-relaxed">{description}</p>
    </div>
  );
}
