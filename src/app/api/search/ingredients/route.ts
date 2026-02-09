import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Recipe } from '@/models/Recipe';

// POST /api/search/ingredients - Search by available ingredients
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { ingredients, dietaryRestrictions, maxTime, maxCalories } = await request.json();
    
    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please provide ingredients' },
        { status: 400 }
      );
    }
    
    // Convert ingredients to array if string
    const ingredientList = Array.isArray(ingredients) 
      ? ingredients 
      : ingredients.split(',').map((i: string) => i.trim());
    
    // Build query
    const filter: any = {
      // Match recipes that contain ANY of the provided ingredients
      mainIngredients: { $in: ingredientList.map((i: string) => new RegExp(i, 'i')) }
    };
    
    // Add dietary restrictions
    if (dietaryRestrictions && dietaryRestrictions.length > 0) {
      const dietList = Array.isArray(dietaryRestrictions)
        ? dietaryRestrictions
        : dietaryRestrictions.split(',').map((d: string) => d.trim().toLowerCase());
      filter.dietaryTags = { $in: dietList };
    }
    
    // Add time limit
    if (maxTime) {
      filter.totalTime = { $lte: parseInt(maxTime) };
    }
    
    // Add calorie limit
    if (maxCalories) {
      filter.calories = { $lte: parseInt(maxCalories) };
    }
    
    // Find recipes and score by ingredient matches
    const recipes = await Recipe.find(filter)
      .select('-__v')
      .limit(20)
      .lean();
    
    // Score recipes by how many ingredients they match
    const scoredRecipes = recipes.map(recipe => {
      const matchCount = ingredientList.filter((ing: string) =>
        recipe.mainIngredients.some(main =>
          main.toLowerCase().includes(ing.toLowerCase())
        )
      ).length;
      
      return {
        ...recipe,
        matchScore: matchCount,
        matchPercentage: Math.round((matchCount / ingredientList.length) * 100)
      };
    });
    
    // Sort by match score
    scoredRecipes.sort((a, b) => b.matchScore - a.matchScore);
    
    return NextResponse.json({
      success: true,
      data: scoredRecipes,
      searchedIngredients: ingredientList
    });
  } catch (error: any) {
    console.error('Error searching by ingredients:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
