import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Flame, Clock, ChefHat, UtensilsCrossed, ArrowRight, Search, Filter, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { TypewriterText } from '@/components/TypewriterText';
import { FoodParticles } from '@/components/FoodParticles';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { FaAlgolia } from 'react-icons/fa6';

async function getFeaturedRecipes() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002'}/api/recipes/featured`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching featured recipes:', error);
    return [];
  }
}

export default async function Home() {
  const featuredRecipes = await getFeaturedRecipes();

  return (
    <div className="flex flex-col gap-16 pb-20 relative">
      {/* Animated Gradient Mesh Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="gradient-mesh-blob w-[600px] h-[600px] bg-primary top-[-10%] left-[-10%]" style={{ animationDelay: '0s' }} />
        <div className="gradient-mesh-blob w-[500px] h-[500px] bg-accent bottom-[-10%] right-[-10%]" style={{ animationDelay: '-5s' }} />
        <div className="gradient-mesh-blob w-[400px] h-[400px] bg-primary top-[40%] right-[10%]" style={{ animationDelay: '-10s' }} />
        <div className="gradient-mesh-blob w-[450px] h-[450px] bg-accent top-[60%] left-[15%]" style={{ animationDelay: '-15s' }} />
      </div>

      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <FoodParticles count={20} />
        <div className="container px-4 text-center z-10 space-y-8 animate-fade-in">
          <div className="animate-float">
            <Badge className="bg-primary/20 text-primary border-primary/20 font-headline px-6 py-2 text-xs uppercase tracking-widest mb-4 backdrop-blur-sm hover:bg-primary/30 transition-all duration-300 cursor-default">
              ✨ AI-Powered Nutrition
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold text-foreground leading-[1.05] tracking-tight">
            Elevate Your <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-text bg-clip-text text-transparent italic relative">
              <TypewriterText text="AutoYum" speed={100} />
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl -z-10 animate-pulse-glow"></div>
            </span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto font-body leading-relaxed opacity-90">
            Auto-Yum crafts professional-grade recipes tailored to your pantry, dietary needs, and schedule using state-of-the-art Generative AI.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <Link href="/discover">
              <Button size="lg" className="rounded-full bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-accent text-base px-8 py-4 font-headline shadow-2xl hover:shadow-accent/25 hover:scale-105 transition-all duration-300 animate-pulse-glow">
                <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                Start AI Discovery
              </Button>
            </Link>
            <Link href="/recipes">
              <Button variant="outline" size="lg" className="rounded-full border-2 border-primary/30 text-primary hover:bg-primary/10 text-base px-8 py-4 font-headline shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                <ChefHat className="mr-2 h-5 w-5" />
                Browse Recipes
              </Button>
            </Link>
          </div>

          {/* Floating Stats */}
          <div className="flex justify-center gap-10 mt-14 opacity-80">
            <div className="text-center animate-float" style={{ animationDelay: '0s' }}>
              <div className="text-2xl font-headline font-bold text-primary">10+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Recipes Generated</div>
            </div>
            <div className="text-center animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-2xl font-headline font-bold text-accent">98%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Satisfaction Rate</div>
            </div>
            <div className="text-center animate-float" style={{ animationDelay: '2s' }}>
              <div className="text-2xl font-headline font-bold text-primary">5min</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Average Generation</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4">
        <div className="flex items-end justify-between mb-12 border-b border-border/50 pb-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-headline font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Chef's AI Selection
            </h2>
            <p className="text-base text-muted-foreground font-body">Personalized picks based on nutritional density and flavor profiles.</p>
          </div>
          <Link href="/recipes" className="text-primary hover:text-accent font-headline text-base font-bold transition-all duration-300 hover:scale-105 flex items-center gap-2 group">
            Browse All Recipes
            <Sparkles className="w-4 h-4 group-hover:animate-spin" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRecipes.length > 0 ? (
            featuredRecipes.slice(0, 6).map((recipe: any, index: number) => (
              <ScrollAnimation key={recipe._id} delay={index * 100}>
                <Card className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-700 rounded-3xl bg-card/60 backdrop-blur-md hover:bg-card/80 h-full">
                  <div className="relative h-48 overflow-hidden">
                  {recipe.imageUrl && (
                    <Image
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      data-ai-hint={recipe.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  <Badge className="absolute top-4 left-4 bg-white/95 text-primary font-headline border-none backdrop-blur-md px-4 py-1.5 text-sm shadow-lg hover:bg-primary hover:text-white transition-all duration-300 cursor-default">
                    {recipe.category}
                  </Badge>
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <p className="text-xs font-body line-clamp-2">{recipe.description || "Discover the perfect blend of flavors and nutrition."}</p>
                  </div>
                </div>
                <CardContent className="pt-5 px-5 pb-3">
                  <h3 className="text-lg md:text-xl font-headline font-bold mb-3 leading-tight group-hover:text-primary transition-colors duration-300">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-2 text-sm font-medium bg-muted/50 px-3 py-2 rounded-full">
                      <Clock className="w-4 h-4 text-primary" />
                      {recipe.totalTime} min
                    </span>
                    <span className="flex items-center gap-2 text-sm font-medium bg-muted/50 px-3 py-2 rounded-full">
                      <Flame className="w-4 h-4 text-accent" />
                      {recipe.calories} kcal
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pb-5 px-5">
                  <Link href={`/recipes/${recipe._id}`} className="w-full">
                    <Button variant="outline" className="w-full h-10 rounded-xl border-2 border-primary/30 text-primary hover:bg-primary hover:text-white font-headline text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group">
                      <ChefHat className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                      View Kitchen Guide
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </ScrollAnimation>
            ))
          ) : (
            <div className="col-span-3 text-center py-20">
              <div className="animate-pulse">
                <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl text-muted-foreground font-body">No recipes found. Run `npm run seed` to add sample recipes.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container px-4">
          <ScrollAnimation>
            <div className="text-center mb-16 space-y-4">
              <Badge className="bg-primary/20 text-primary border-primary/20 font-headline px-6 py-2 text-sm uppercase tracking-widest">
                How It Works
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold text-foreground leading-tight">
                From Idea to Plate in 3 Steps
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed">
                Our AI-powered platform transforms your ingredient list into culinary masterpieces
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-20 -translate-y-1/2" style={{ zIndex: 0 }} />
            
            <ScrollAnimation delay={0}>
              <div className="relative bg-card/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-primary/20 text-center space-y-4 group hover:-translate-y-2 transition-all duration-500" style={{ zIndex: 1 }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ChefHat className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-4 -right-4 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold font-headline text-lg">
                    1
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-3 text-foreground">Input Your Ingredients</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Tell us what's in your pantry, your dietary preferences, and how much time you have
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={150}>
              <div className="relative bg-card/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-accent/20 text-center space-y-4 group hover:-translate-y-2 transition-all duration-500" style={{ zIndex: 1 }}>
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <Sparkles className="w-10 h-10 text-accent animate-pulse" />
                  </div>
                  <div className="absolute -top-4 -right-4 bg-accent text-white w-10 h-10 rounded-full flex items-center justify-center font-bold font-headline text-lg">
                    2
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-3 text-foreground">AI Magic Happens</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our Gemini AI analyzes millions of recipes and nutritional data to create your perfect meal
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={300}>
              <div className="relative bg-card/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-primary/20 text-center space-y-4 group hover:-translate-y-2 transition-all duration-500" style={{ zIndex: 1 }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <UtensilsCrossed className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-4 -right-4 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold font-headline text-lg">
                    3
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-3 text-foreground">Get Your Perfect Recipe</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Receive step-by-step instructions, nutrition facts, and cooking tips tailored just for you
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          <ScrollAnimation delay={400}>
            <div className="text-center mt-12">
              <Link href="/discover">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white text-base px-10 py-6 font-headline shadow-2xl hover:shadow-accent/25 hover:scale-105 transition-all duration-300">
                  Try It Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5468ff]/5 via-background to-[#5468ff]/10" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#5468ff]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container px-4 relative z-10">
          <ScrollAnimation>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-[#5468ff]/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-[#5468ff]/20">
                <div className="w-2 h-2 bg-[#5468ff] rounded-full animate-pulse" />
                <span className="text-[#5468ff] font-headline text-sm font-bold uppercase tracking-widest">Technology Partner</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-6">
                <span className="text-foreground">Powered by </span>
                <span className="bg-gradient-to-r from-[#5468ff] via-[#00d4ff] to-[#5468ff] bg-[length:200%_auto] animate-gradient-text bg-clip-text text-transparent">
                  Algolia
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Experience blazing-fast search powered by the world's most advanced search API, trusted by 10,000+ companies worldwide
              </p>
            </div>
          </ScrollAnimation>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-20">
            {/* Feature Cards - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              <ScrollAnimation delay={100}>
                <div className="group relative bg-gradient-to-br from-card to-card/50 backdrop-blur-xl rounded-3xl p-6 border border-[#5468ff]/20 hover:border-[#5468ff]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#5468ff]/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5468ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5468ff] to-[#00d4ff] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-headline font-bold text-foreground">Lightning Speed</h3>
                      <Badge className="bg-[#5468ff]/20 text-[#5468ff] border-none text-xs">{'<50ms'}</Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Sub-50 millisecond response times from a globally distributed network of data centers
                    </p>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={200}>
                <div className="group relative bg-gradient-to-br from-card to-card/50 backdrop-blur-xl rounded-3xl p-6 border border-accent/20 hover:border-accent/40 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-headline font-bold text-foreground">AI-Powered Relevance</h3>
                      <Badge className="bg-accent/20 text-accent border-none text-xs">Smart</Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Machine learning algorithms rank results by relevance, understanding typos and synonyms
                    </p>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={300}>
                <div className="group relative bg-gradient-to-br from-card to-card/50 backdrop-blur-xl rounded-3xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <Filter className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-headline font-bold text-foreground">Advanced Faceting</h3>
                      <Badge className="bg-primary/20 text-primary border-none text-xs">Real-time</Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Filter by multiple criteria simultaneously with instant updates as you refine your search
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
            </div>

            {/* Interactive Demo - Right Side */}
            <div className="lg:col-span-3">
              <ScrollAnimation delay={400}>
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#5468ff]/20 via-accent/20 to-primary/20 rounded-[2rem] blur-2xl opacity-50" />
                  
                  {/* Main Card */}
                  <div className="relative bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-[#5468ff]/30 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#5468ff] via-[#00d4ff] to-[#5468ff] bg-[length:200%_auto] animate-gradient-text p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                            <FaAlgolia className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-headline font-bold text-2xl">Algolia InstantSearch</h4>
                            <p className="text-white/80 text-sm">Real-time search analytics</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-white font-medium text-sm">Live</span>
                        </div>
                      </div>
                    </div>

                    {/* Search Bar Demo */}
                    <div className="p-8 space-y-6">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#5468ff]/20 to-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-center gap-3 bg-muted/30 backdrop-blur-sm p-5 rounded-2xl border-2 border-border hover:border-[#5468ff]/50 transition-all">
                          <FaAlgolia className="w-6 h-6 text-[#5468ff]" />
                          <div className="flex-1">
                            <div className="h-3 bg-gradient-to-r from-[#5468ff]/30 to-transparent rounded-full w-48 animate-pulse" />
                          </div>
                          <Badge className="bg-[#5468ff]/10 text-[#5468ff] border-none">14 results</Badge>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-[#5468ff]/10 to-[#5468ff]/5 backdrop-blur-sm p-5 rounded-2xl border border-[#5468ff]/20 hover:scale-105 transition-transform">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-muted-foreground">Query Time</span>
                            <div className="w-2 h-2 bg-[#5468ff] rounded-full animate-pulse" />
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-headline font-bold text-[#5468ff]">12</span>
                            <span className="text-lg text-muted-foreground">ms</span>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-sm p-5 rounded-2xl border border-accent/20 hover:scale-105 transition-transform">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-muted-foreground">Hits Found</span>
                            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-headline font-bold text-accent">14</span>
                            <span className="text-lg text-muted-foreground">recipes</span>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm p-5 rounded-2xl border border-primary/20 hover:scale-105 transition-transform">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-muted-foreground">Facets</span>
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-headline font-bold text-primary">3</span>
                            <span className="text-lg text-muted-foreground">active</span>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#00d4ff]/10 to-[#00d4ff]/5 backdrop-blur-sm p-5 rounded-2xl border border-[#00d4ff]/20 hover:scale-105 transition-transform">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-muted-foreground">Uptime</span>
                            <div className="w-2 h-2 bg-[#00d4ff] rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-headline font-bold text-[#00d4ff]">99.99</span>
                            <span className="text-lg text-muted-foreground">%</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="pt-6 border-t border-border">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-[#5468ff]">90+</span> data centers • <span className="font-semibold text-[#5468ff]">10,000+</span> companies
                          </p>
                          <Link href="/search">
                            <Button className="rounded-full bg-gradient-to-r from-[#5468ff] to-[#00d4ff] hover:from-[#00d4ff] hover:to-[#5468ff] text-white border-none shadow-lg hover:shadow-[#5468ff]/50 transition-all duration-300">
                              Try It Live
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="container px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold text-foreground leading-tight">
              Next-Gen Home Cooking
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed">
              We've combined professional nutritional data with intuitive AI to revolutionize how you eat.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ScrollAnimation delay={0}>
              <FeatureCard
                icon={<Zap className="w-10 h-10 text-primary" />}
                title="Instant Inspiration"
                description="Our engine analyzes millions of culinary combinations in real-time."
                delay="0s"
              />
            </ScrollAnimation>
            <ScrollAnimation delay={100}>
              <FeatureCard
                icon={<Sparkles className="w-10 h-10 text-accent" />}
                title="Adaptive Flavors"
                description="Got random leftovers? Our AI turns chaos into a gourmet experience."
                delay="0.1s"
              />
            </ScrollAnimation>
            <ScrollAnimation delay={200}>
              <FeatureCard
                icon={<Flame className="w-10 h-10 text-primary" />}
                title="Macro Precision"
                description="Get exact nutritional breakdowns for every modified ingredient."
                delay="0.2s"
              />
            </ScrollAnimation>
            <ScrollAnimation delay={300}>
              <FeatureCard
                icon={<ChefHat className="w-10 h-10 text-accent" />}
                title="Virtual Sous-Chef"
                description="Receive step-by-step guidance and substitution hacks on the fly."
                delay="0.3s"
              />
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: string }) {
  return (
    <div
      className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-white/10 text-center space-y-4 group hover:-translate-y-3 duration-500 animate-fade-in relative overflow-hidden"
      style={{ animationDelay: delay }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

      <div className="relative z-10">
        <div className="flex justify-center group-hover:scale-110 transition-transform duration-300 mb-2">{icon}</div>
        <h3 className="text-lg md:text-xl font-headline font-bold group-hover:text-primary transition-colors duration-300">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed font-body">{description}</p>
      </div>
    </div>
  );
}
