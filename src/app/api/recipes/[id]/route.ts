import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Recipe } from '@/models/Recipe';
import { syncSingleRecipe, deleteRecipeFromAlgolia } from '@/lib/sync-algolia';

// GET /api/recipes/[id] - Get single recipe by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const recipe = await Recipe.findByIdAndUpdate(
      params.id,
      { $inc: { views: 1 } }, // Increment view count
      { new: true }
    ).select('-__v').lean();
    
    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: recipe
    });
  } catch (error: any) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/recipes/[id] - Update a recipe
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    const recipe = await Recipe.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).select('-__v').lean();
    
    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }
    
    // Sync to Algolia (non-blocking)
    syncSingleRecipe(params.id).catch(err => 
      console.error('Algolia sync failed:', err)
    );
    
    return NextResponse.json({
      success: true,
      data: recipe
    });
  } catch (error: any) {
    console.error('Error updating recipe:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/recipes/[id] - Delete a recipe
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const recipe = await Recipe.findByIdAndDelete(params.id);
    
    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }
    
    // Delete from Algolia (non-blocking)
    deleteRecipeFromAlgolia(params.id).catch((err: any) => 
      console.error('Algolia delete failed:', err)
    );
    
    return NextResponse.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
