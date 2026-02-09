"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

export default function AlgoliaSyncPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/sync-algolia', {
        method: 'POST',
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Failed to sync with Algolia',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Algolia Sync</CardTitle>
            <CardDescription>
              Synchronize all recipes from MongoDB to Algolia search index
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This will:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-2 ml-4">
                <li>Fetch all recipes from MongoDB</li>
                <li>Transform them for Algolia</li>
                <li>Configure index settings</li>
                <li>Upload all records to Algolia</li>
              </ul>
            </div>

            <Button 
              onClick={handleSync} 
              disabled={loading}
              className="w-full h-12"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Sync Now
                </>
              )}
            </Button>

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                  )}
                  <div className="flex-1">
                    <AlertDescription>
                      <div className="font-semibold mb-1">
                        {result.success ? 'Success!' : 'Error'}
                      </div>
                      <div>{result.message}</div>
                      {result.count !== undefined && (
                        <div className="mt-2 text-sm">
                          Recipes synced: <strong>{result.count}</strong>
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                💡 After syncing, visit the search page to verify that filters show recipe counts.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
