
import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'NutriGenius AI - Smart Recipe Discovery',
  description: 'Elevate your health with AI-powered recipe discovery and smart cooking assistance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&family=Alegreya:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="py-8 bg-muted text-center text-muted-foreground border-t border-border">
          <p className="font-headline text-lg text-primary mb-2">NutriGenius AI</p>
          <p className="text-sm">Powered by AI for your health & taste buds.</p>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
