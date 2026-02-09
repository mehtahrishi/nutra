import mongoose, { Schema, Model } from 'mongoose';

export interface IRecipe {
  _id?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  imageHint?: string;
  category: string;
  dietaryTags: string[]; // 'vegan', 'keto', 'gluten-free', etc.
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  totalTime: number; // in minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Nutritional Info
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
  
  // Recipe content
  ingredients: Array<{
    item: string;
    quantity: string;
    unit?: string;
  }>;
  instructions: string[];
  
  // Health & AI Features
  healthBenefits?: string[];
  tips?: string[];
  substitutions?: Array<{
    original: string;
    replacement: string;
    reason?: string;
  }>;
  
  // Search & Discovery
  searchKeywords: string[];
  mainIngredients: string[]; // Top 3-5 key ingredients
  
  // Metadata
  source?: 'ai-generated' | 'curated' | 'user-submitted';
  aiReasoning?: string; // Why this recipe was generated
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
}

const RecipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true, index: true },
    description: String,
    imageUrl: String,
    imageHint: String,
    category: { type: String, required: true, index: true },
    dietaryTags: [{ type: String, index: true }],
    prepTime: { type: Number, required: true },
    cookTime: { type: Number, required: true },
    totalTime: { type: Number, required: true, index: true },
    servings: { type: Number, default: 4 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    
    calories: { type: Number, required: true, index: true },
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    
    ingredients: [{
      item: String,
      quantity: String,
      unit: String
    }],
    instructions: [String],
    
    healthBenefits: [String],
    tips: [String],
    substitutions: [{
      original: String,
      replacement: String,
      reason: String
    }],
    
    searchKeywords: [{ type: String, index: true }],
    mainIngredients: [{ type: String, index: true }],
    
    source: { type: String, enum: ['ai-generated', 'curated', 'user-submitted'], default: 'curated' },
    aiReasoning: String,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

// Text search index for full-text search
RecipeSchema.index({ 
  title: 'text', 
  description: 'text', 
  searchKeywords: 'text',
  mainIngredients: 'text'
});

export const Recipe: Model<IRecipe> = mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);
