import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Recipe } from '@/models/Recipe';

// GET /api/recipes/featured - Get featured recipes for homepage
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get recent recipes (newest first)
    const recipes = await Recipe.find()
      .select('-__v')
      .sort({ createdAt: -1, views: -1 })
      .limit(12)
      .lean();
    
    return NextResponse.json({
      success: true,
      data: recipes
    });
  } catch (error: any) {
    console.error('Error fetching featured recipes:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
