import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Recipe } from '@/models/Recipe';
import { syncSingleRecipe } from '@/lib/sync-algolia';

// GET /api/recipes - Fetch recipes with search and filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const diet = searchParams.get('diet');
    const maxTime = searchParams.get('maxTime');
    const maxCalories = searchParams.get('maxCalories');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    
    // Build MongoDB query
    const filter: any = {};
    
    // Text search
    if (query) {
      filter.$text = { $search: query };
    }
    
    // Category filter
    if (category) {
      filter.category = category;
    }
    
    // Dietary tags filter
    if (diet) {
      filter.dietaryTags = { $in: [diet] };
    }
    
    // Time filter
    if (maxTime) {
      filter.totalTime = { $lte: parseInt(maxTime) };
    }
    
    // Calorie filter
    if (maxCalories) {
      filter.calories = { $lte: parseInt(maxCalories) };
    }
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    const recipes = await Recipe.find(filter)
      .select('-__v')
      .sort(query ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Recipe.countDocuments(filter);
    
    return NextResponse.json({
      success: true,
      data: recipes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/recipes - Create a new recipe
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Create recipe
    const recipe = await Recipe.create(body);
    
    // Sync to Algolia (non-blocking)
    syncSingleRecipe(recipe._id.toString()).catch(err => 
      console.error('Algolia sync failed:', err)
    );
    
    return NextResponse.json({
      success: true,
      data: recipe
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
