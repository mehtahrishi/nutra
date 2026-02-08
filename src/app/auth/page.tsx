
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ChefHat, Chrome, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-background to-secondary/10">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <ChefHat className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-headline font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Save recipes and track your health goals.</p>
        </div>

        <Card className="rounded-3xl border-none shadow-2xl overflow-hidden">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-headline">Sign In</CardTitle>
            <CardDescription>Enter your credentials or use social sign-on.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="chef@nutrigenius.ai" className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input id="password" type="password" className="h-12 rounded-xl" />
            </div>
            <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-headline text-lg mt-2">
              Sign In
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 rounded-xl">
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" className="h-12 rounded-xl">
                <Mail className="mr-2 h-4 w-4" />
                Apple
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t bg-muted/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="#" className="text-primary font-bold hover:underline">Sign Up</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
