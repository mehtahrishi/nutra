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

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
    .describe(
      'The maximum amount of time the user has available to prepare the recipe (e.g., 30 minutes, 1 hour).'
    ),
});
export type AIRecipeDiscoveryInput = z.infer<typeof AIRecipeDiscoveryInputSchema>;

const AIRecipeDiscoveryOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  ingredients: z.string().describe('A list of ingredients required for the recipe.'),
  instructions: z.string().describe('Step-by-step instructions for preparing the recipe.'),
  reasoning: z.string().describe('Reasoning behind the recipe generation'),
});
export type AIRecipeDiscoveryOutput = z.infer<typeof AIRecipeDiscoveryOutputSchema>;

export async function aiRecipeDiscovery(input: AIRecipeDiscoveryInput): Promise<AIRecipeDiscoveryOutput> {
  return aiRecipeDiscoveryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiRecipeDiscoveryPrompt',
  input: {schema: AIRecipeDiscoveryInputSchema},
  output: {schema: AIRecipeDiscoveryOutputSchema},
  prompt: `You are an AI recipe generator. A user will provide you with a list of ingredients they have on hand, their dietary restrictions, and the amount of time they have available.

  Based on this information, you will generate a recipe that meets their specific needs.  Explain your reasoning in choosing the recipe.

  Ingredients: {{{ingredients}}}
  Dietary Restrictions: {{{dietaryRestrictions}}}
  Time Limit: {{{timeLimit}}}
  `,
});

const aiRecipeDiscoveryFlow = ai.defineFlow(
  {
    name: 'aiRecipeDiscoveryFlow',
    inputSchema: AIRecipeDiscoveryInputSchema,
    outputSchema: AIRecipeDiscoveryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
