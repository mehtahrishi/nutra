'use server';

/**
 * @fileOverview Provides an AI cooking assistant for recipe suggestions.
 *
 * - aiCookingAssistant - A function that suggests ingredient substitutions, cooking tips, and health insights for a given recipe.
 * - AiCookingAssistantInput - The input type for the aiCookingAssistant function.
 * - AiCookingAssistantOutput - The return type for the aiCookingAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiCookingAssistantInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.string().describe('A comma separated list of ingredients in the recipe.'),
  instructions: z.string().describe('The cooking instructions for the recipe.'),
  dietaryPreferences: z.string().optional().describe('The dietary preferences of the user.'),
});
export type AiCookingAssistantInput = z.infer<typeof AiCookingAssistantInputSchema>;

const AiCookingAssistantOutputSchema = z.object({
  suggestions: z.string().describe('AI-generated suggestions for ingredient substitutions, cooking tips, and health insights.'),
});
export type AiCookingAssistantOutput = z.infer<typeof AiCookingAssistantOutputSchema>;

export async function aiCookingAssistant(input: AiCookingAssistantInput): Promise<AiCookingAssistantOutput> {
  return aiCookingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCookingAssistantPrompt',
  input: {schema: AiCookingAssistantInputSchema},
  output: {schema: AiCookingAssistantOutputSchema},
  prompt: `You are a helpful AI cooking assistant. A user is viewing the following recipe and wants suggestions for ingredient substitutions, cooking tips, and health insights.

Recipe Name: {{{recipeName}}}
Ingredients: {{{ingredients}}}
Instructions: {{{instructions}}}

{% if dietaryPreferences %}The user has the following dietary preferences: {{{dietaryPreferences}}}.{% endif %}

Provide suggestions that are relevant to the recipe and user's dietary preferences. Consider ingredient substitutions, cooking tips to improve the dish, and any health insights related to the ingredients or cooking method.`,
});

const aiCookingAssistantFlow = ai.defineFlow(
  {
    name: 'aiCookingAssistantFlow',
    inputSchema: AiCookingAssistantInputSchema,
    outputSchema: AiCookingAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
