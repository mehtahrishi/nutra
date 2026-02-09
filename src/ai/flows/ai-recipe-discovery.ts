'use server';

/**
 * @fileOverview This file defines a Genkit flow for AI-powered recipe discovery.
 *
 * The flow takes user inputs regarding available ingredients, dietary restrictions,
 * and time constraints, and generates a recipe tailored to those specific needs.
 *
 * @interface AIRecipeDiscoveryInput - The input type for the aiRecipeDiscovery function.
 * @interface AIRecipeDiscoveryOutput - The output type for the aiRecipeDiscovery function.
 * @function aiRecipeDiscovery - The main function to trigger the recipe discovery flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getPexelsService } from '@/lib/pexels';

const AIRecipeDiscoveryInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients the user has on hand.'),
  dietaryRestrictions: z
    .string()
    .describe(
      'A comma-separated list of dietary restrictions or preferences (e.g., vegetarian, gluten-free, low-carb).'
    ),
  timeLimit: z
    .string()
    .optional()
    .describe(
      'The maximum amount of time the user has available to prepare the recipe (e.g., 30 minutes, 1 hour). Optional.'
    ),
});
export type AIRecipeDiscoveryInput = z.infer<typeof AIRecipeDiscoveryInputSchema>;

const AIRecipeDiscoveryOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  ingredients: z.string().describe('A detailed list of ingredients with quantities and measurements.'),
  instructions: z.string().describe('Step-by-step instructions for preparing the recipe.'),
  reasoning: z.string().describe('Reasoning behind the recipe generation'),
  imageUrl: z.string().describe('A high-quality food image URL from Pexels API that matches the recipe'),
  nutritionalInfo: z.object({
    calories: z.number().describe('Total calories per serving'),
    protein: z.number().describe('Protein in grams per serving'),
    carbs: z.number().describe('Carbohydrates in grams per serving'),
    fat: z.number().describe('Fat in grams per serving'),
    fiber: z.number().describe('Fiber in grams per serving'),
    sodium: z.number().describe('Sodium in milligrams per serving'),
  }).describe('Nutritional breakdown per serving'),
  cookingDetails: z.object({
    prepTime: z.number().describe('Preparation time in minutes'),
    cookTime: z.number().describe('Cooking time in minutes'),
    totalTime: z.number().describe('Total time in minutes'),
    servings: z.number().describe('Number of servings'),
    difficulty: z.enum(['easy', 'medium', 'hard']).describe('Difficulty level'),
  }).describe('Cooking time and difficulty information'),
  cookingTips: z.array(z.string()).describe('Professional cooking tips and techniques for this recipe'),
  warnings: z.array(z.string()).describe('Important warnings about overcooking, food safety, or common mistakes'),
  variations: z.array(z.string()).describe('Possible variations or substitutions for the recipe'),
  equipment: z.array(z.string()).describe('Required cooking equipment and tools'),
  storageInfo: z.string().describe('How to store leftovers and for how long'),
  flavorProfile: z.string().describe('Description of the taste, texture, and overall flavor experience'),
});
export type AIRecipeDiscoveryOutput = z.infer<typeof AIRecipeDiscoveryOutputSchema>;

export async function aiRecipeDiscovery(input: AIRecipeDiscoveryInput): Promise<AIRecipeDiscoveryOutput> {
  return aiRecipeDiscoveryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiRecipeDiscoveryPrompt',
  input: { schema: AIRecipeDiscoveryInputSchema },
  output: { schema: AIRecipeDiscoveryOutputSchema },
  prompt: `You are a professional chef and nutritionist AI. A user will provide you with ingredients, dietary restrictions, and time constraints. Generate a comprehensive recipe with detailed information that food enthusiasts would love to know.

  Create a recipe that includes:
  - Precise ingredient measurements
  - Detailed step-by-step instructions with cooking techniques
  - Accurate nutritional information per serving
  - Professional cooking tips and techniques
  - Important warnings about overcooking, food safety, or common mistakes
  - Flavor profile description
  - Equipment needed
  - Storage instructions
  - Possible variations
  - A high-quality food image that matches the recipe (will be fetched automatically)

  For the imageUrl field, provide keywords that describe the dish (e.g., "chicken curry", "chocolate cake", "fresh salad", "grilled salmon"). The system will automatically fetch a high-quality food image from Pexels API that matches your recipe.

  **Image Keywords Guidelines:**
  - Use 2-3 descriptive words about the main dish
  - Include the primary protein or main ingredient
  - Add cooking method if relevant (grilled, baked, fried)
  - Examples: "grilled chicken", "pasta carbonara", "chocolate dessert", "fresh vegetables"
  
  **Important:** Just provide the keywords in the imageUrl field - the actual image URL will be fetched automatically using the Pexels API.

  Be specific about cooking temperatures, timing, and techniques. Include warnings about things like overcooking proteins, proper food safety temperatures, and common pitfalls.

  Ingredients Available: {{{ingredients}}}
  Dietary Restrictions: {{{dietaryRestrictions}}}
  Time Limit: {{{timeLimit}}}
  
  Make this recipe restaurant-quality with professional insights that home cooks would find valuable.`,
});

const aiRecipeDiscoveryFlow = ai.defineFlow(
  {
    name: 'aiRecipeDiscoveryFlow',
    inputSchema: AIRecipeDiscoveryInputSchema,
    outputSchema: AIRecipeDiscoveryOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    
    if (output) {
      // Fetch high-quality image from Pexels API
      const pexelsService = getPexelsService();
      if (pexelsService) {
        try {
          // Use the imageUrl field as keywords to search for images
          const imageKeywords = output.imageUrl;
          const actualImageUrl = await pexelsService.getRecipeImage(imageKeywords);
          output.imageUrl = actualImageUrl;
        } catch (error) {
          console.error('Error fetching image from Pexels:', error);
          // Keep the original keywords as fallback
        }
      } else {
        // Fallback to Unsplash if Pexels API key is not available
        const keywords = output.imageUrl;
        output.imageUrl = `https://source.unsplash.com/800x600/?food,${encodeURIComponent(keywords)}`;
      }
    }
    
    return output!;
  }
);
