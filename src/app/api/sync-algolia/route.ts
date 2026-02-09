import { NextResponse } from 'next/server';
import { syncRecipesToAlgolia } from '@/lib/sync-algolia';

export async function POST() {
  try {
    const result = await syncRecipesToAlgolia();
    
    return NextResponse.json({
      success: true,
      message: `Successfully synced ${result.count} recipes to Algolia`,
      count: result.count
    });
  } catch (error: any) {
    console.error('Sync failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to trigger Algolia sync',
    endpoint: '/api/sync-algolia'
  });
}
