
"use client"

import Link from 'next/link';
import { ChefHat, Search, Sparkles, Heart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = () => (
    <>
      <Link href="/discover" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors py-2 md:py-0">
        <Sparkles className="w-4 h-4" />
        <span className="font-headline">Discover AI</span>
      </Link>
      <Link href="/recipes" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors py-2 md:py-0">
        <Search className="w-4 h-4" />
        <span className="font-headline">Search</span>
      </Link>
      <Link href="/favorites" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors py-2 md:py-0">
        <Heart className="w-4 h-4" />
        <span className="font-headline">Saved</span>
      </Link>
      <Link href="/auth">
        <Button variant="default" className="w-full md:w-auto font-headline bg-primary hover:bg-primary/90">
          <User className="w-4 h-4 mr-2" />
          Join Us
        </Button>
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <ChefHat className="w-8 h-8" />
          </div>
          <span className="text-2xl font-headline font-bold tracking-tight">
            Nutri<span className="text-accent">Genius</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavItems />
        </div>

        {/* Mobile nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col pt-12">
              <NavItems />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
