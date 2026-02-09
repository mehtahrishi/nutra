
import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import { FaAlgolia } from "react-icons/fa6";
import { RiGeminiFill } from "react-icons/ri";

export const metadata: Metadata = {
  title: 'Auto-Yum - Smart Recipe Discovery',
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
        <footer className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-t border-primary/10">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center space-y-4">
              {/* Main Brand */}
              <div className="space-y-1">
                <h3 className="font-headline text-2xl font-bold">
                  <span className="text-primary">Auto</span>
                  <span className="text-accent">Yum</span>
                </h3>
                <p className="text-muted-foreground text-sm">
                  Powered by AI for your health & taste buds
                </p>
              </div>

              {/* Technology Stack */}
              <div className="flex justify-center items-center gap-6 py-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-primary/20 hover:border-primary/40 transition-colors">
                  <RiGeminiFill className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">Gemini AI</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-accent/20 hover:border-accent/40 transition-colors">
                  <FaAlgolia className="w-4 h-4 text-accent" />
                  <span className="text-xs font-medium text-foreground">Algolia Search</span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto"></div>

              {/* Creator Credit */}
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">
                  Crafted with passion by
                </p>
                <p className="font-headline text-base font-semibold text-primary flex items-center justify-center gap-1.5">
                  Hrishi Mehta
                  <span className="text-lg">⚡</span>
                </p>
              </div>

              {/* Copyright */}
              <div className="pt-3 border-t border-primary/10">
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} AutoYum. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
