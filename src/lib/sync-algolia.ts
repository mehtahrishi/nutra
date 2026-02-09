// Load environment variables FIRST before any imports
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local from the project root
config({ path: resolve(process.cwd(), '.env.local') });

import { connectDB } from './mongodb';
import { Recipe } from '@/models/Recipe';
import { getAdminClient, configureAlgoliaIndex, ALGOLIA_INDEX_NAME } from './algolia';

/**
 * Transform MongoDB recipe document to Algolia-compatible object
 */
function transformRecipeForAlgolia(recipe: any) {
  return {
    objectID: recipe._id.toString(),
    title: recipe.title,
    description: recipe.description || '',
    imageUrl: recipe.imageUrl,
    imageHint: recipe.imageHint,
    category: recipe.category,
    dietaryTags: recipe.dietaryTags || [],
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    totalTime: recipe.totalTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    calories: recipe.calories,
    protein: recipe.protein,
    carbs: recipe.carbs,
    fat: recipe.fat,
    fiber: recipe.fiber,
    mainIngredients: recipe.mainIngredients || [],
    searchKeywords: recipe.searchKeywords || [],
    healthBenefits: recipe.healthBenefits || [],
    source: recipe.source,
    views: recipe.views || 0,
    likes: recipe.likes || 0,
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
    // Flatten ingredients for better searchability
    ingredients: recipe.ingredients.map((ing: any) => ({
      item: ing.item,
      quantity: ing.quantity,
      unit: ing.unit
    }))
  };
}

/**
 * Sync all recipes from MongoDB to Algolia
 */
export async function syncRecipesToAlgolia() {
  try {
    console.log('🔄 Starting Algolia sync...');
    
    // Connect to MongoDB
    await connectDB();
    
    // Get all recipes
    const recipes = await Recipe.find({}).lean();
    
    if (recipes.length === 0) {
      console.log('⚠️  No recipes found in database. Run seed script first.');
      return;
    }
    
    console.log(`📊 Found ${recipes.length} recipes to sync`);
    
    // Transform recipes for Algolia
    const algoliaRecords = recipes.map(transformRecipeForAlgolia);
    
    // Configure index settings
    await configureAlgoliaIndex();
    
    // Save objects to Algolia (batch operation)
    const adminClient = getAdminClient();
    await adminClient.saveObjects({
      indexName: ALGOLIA_INDEX_NAME,
      objects: algoliaRecords
    });
    
    console.log(`✅ Successfully synced ${algoliaRecords.length} recipes to Algolia`);
    console.log(`📍 Index: ${ALGOLIA_INDEX_NAME}`);
    
    return {
      success: true,
      count: algoliaRecords.length,
      recipes: algoliaRecords
    };
  } catch (error: any) {
    console.error('❌ Algolia sync failed:', error.message);
    throw error;
  }
}

/**
 * Sync a single recipe to Algolia
 */
export async function syncSingleRecipe(recipeId: string) {
  try {
    await connectDB();
    
    const recipe = await Recipe.findById(recipeId).lean();
    
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    
    const algoliaRecord = transformRecipeForAlgolia(recipe);
    
    const adminClient = getAdminClient();
    await adminClient.saveObject({
      indexName: ALGOLIA_INDEX_NAME,
      body: algoliaRecord
    });
    
    console.log(`✅ Synced recipe: ${recipe.title}`);
    
    return { success: true, recipe: algoliaRecord };
  } catch (error: any) {
    console.error('❌ Failed to sync recipe:', error.message);
    throw error;
  }
}

/**
 * Delete a recipe from Algolia
 */
export async function deleteRecipeFromAlgolia(recipeId: string) {
  try {
    const adminClient = getAdminClient();
    await adminClient.deleteObject({
      indexName: ALGOLIA_INDEX_NAME,
      objectID: recipeId
    });
    console.log(`✅ Deleted recipe from Algolia: ${recipeId}`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Failed to delete recipe from Algolia:', error.message);
    throw error;
  }
}

/**
 * Clear all records from Algolia index
 */
export async function clearAlgoliaIndex() {
  try {
    const adminClient = getAdminClient();
    await adminClient.clearObjects({
      indexName: ALGOLIA_INDEX_NAME
    });
    console.log('✅ Algolia index cleared');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Failed to clear Algolia index:', error.message);
    throw error;
  }
}

// Run sync if called directly
if (require.main === module) {
  syncRecipesToAlgolia()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
