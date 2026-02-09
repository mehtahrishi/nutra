// Seed script to populate MongoDB with sample juice and smoothie recipes
// Load environment variables FIRST before any imports
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { connectDB } from '@/lib/mongodb';
import { Recipe } from '@/models/Recipe';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const sampleRecipes = [
  {
    title: 'Green Detox Smoothie',
    description: 'A refreshing blend of spinach, cucumber, and apple for a healthy start to your day.',
    imageUrl: PlaceHolderImages.find(img => img.id === 'recipe-smoothie')?.imageUrl,
    imageHint: PlaceHolderImages.find(img => img.id === 'recipe-smoothie')?.imageHint,
    category: 'Smoothie',
    dietaryTags: ['vegan', 'gluten-free', 'low-calorie', 'paleo'],
    prepTime: 5,
    cookTime: 0,
    totalTime: 5,
    servings: 2,
    difficulty: 'easy' as const,
    calories: 120,
    protein: 3,
    carbs: 28,
    fat: 1,
    fiber: 5,
    ingredients: [
      { item: 'Fresh spinach', quantity: '2', unit: 'cups' },
      { item: 'Cucumber', quantity: '1', unit: 'medium' },
      { item: 'Green apple', quantity: '1', unit: 'medium' },
      { item: 'Lemon juice', quantity: '2', unit: 'tbsp' },
      { item: 'Water', quantity: '1', unit: 'cup' },
      { item: 'Ice cubes', quantity: '1', unit: 'cup' }
    ],
    instructions: [
      'Wash all fresh produce thoroughly.',
      'Chop cucumber and apple into chunks (leave skin on for extra nutrients).',
      'Add spinach, cucumber, apple, and lemon juice to blender.',
      'Pour in water and add ice cubes.',
      'Blend on high speed for 60-90 seconds until smooth.',
      'Taste and adjust - add more lemon for tang or apple for sweetness.',
      'Serve immediately for best nutrient retention.'
    ],
    healthBenefits: [
      'High in vitamin K and iron from spinach',
      'Cucumber provides hydration and anti-inflammatory properties',
      'Apple adds natural sweetness and soluble fiber',
      'Lemon boosts vitamin C and aids digestion'
    ],
    tips: [
      'Use frozen spinach to make it colder without watering it down',
      'Add a handful of fresh mint for extra freshness',
      'For a creamier texture, add half an avocado'
    ],
    substitutions: [
      { original: 'Spinach', replacement: 'Kale or Swiss chard', reason: 'Similar nutritional profile' },
      { original: 'Cucumber', replacement: 'Celery', reason: 'Equally hydrating with a different flavor' },
      { original: 'Water', replacement: 'Coconut water', reason: 'Adds electrolytes and subtle sweetness' }
    ],
    searchKeywords: ['green', 'detox', 'healthy', 'spinach', 'cucumber', 'morning', 'cleanse'],
    mainIngredients: ['spinach', 'cucumber', 'apple'],
    source: 'curated' as const
  },
  {
    title: 'Berry Blast Protein Smoothie',
    description: 'Packed with antioxidants and protein for post-workout recovery.',
    imageUrl: PlaceHolderImages.find(img => img.id === 'recipe-smoothie')?.imageUrl,
    imageHint: PlaceHolderImages.find(img => img.id === 'recipe-smoothie')?.imageHint,
    category: 'Smoothie',
    dietaryTags: ['vegetarian', 'gluten-free', 'high-protein'],
    prepTime: 5,
    cookTime: 0,
    totalTime: 5,
    servings: 1,
    difficulty: 'easy' as const,
    calories: 280,
    protein: 25,
    carbs: 35,
    fat: 6,
    fiber: 8,
    ingredients: [
      { item: 'Mixed berries (frozen)', quantity: '1.5', unit: 'cups' },
      { item: 'Banana', quantity: '1', unit: 'medium' },
      { item: 'Greek yogurt', quantity: '0.5', unit: 'cup' },
      { item: 'Protein powder (vanilla)', quantity: '1', unit: 'scoop' },
      { item: 'Almond milk', quantity: '1', unit: 'cup' },
      { item: 'Honey', quantity: '1', unit: 'tbsp' },
      { item: 'Chia seeds', quantity: '1', unit: 'tbsp' }
    ],
    instructions: [
      'Add almond milk to blender first for easier blending.',
      'Add Greek yogurt and protein powder.',
      'Top with frozen berries and banana.',
      'Sprinkle chia seeds and drizzle honey.',
      'Blend on high for 45-60 seconds until creamy.',
      'If too thick, add more almond milk. If too thin, add more frozen berries.',
      'Pour into glass and enjoy immediately.'
    ],
    healthBenefits: [
      'High protein content supports muscle recovery',
      'Berries provide powerful antioxidants',
      'Chia seeds offer omega-3 fatty acids',
      'Greek yogurt adds probiotics for gut health'
    ],
    tips: [
      'Freeze banana chunks ahead for a creamier texture',
      'Use frozen berries to eliminate need for ice',
      'Prep ingredients in mason jars for grab-and-go smoothies'
    ],
    substitutions: [
      { original: 'Greek yogurt', replacement: 'Silken tofu or coconut yogurt', reason: 'Vegan alternative with similar texture' },
      { original: 'Almond milk', replacement: 'Oat milk or soy milk', reason: 'Different flavor profiles' },
      { original: 'Honey', replacement: 'Maple syrup or dates', reason: 'For vegan option' }
    ],
    searchKeywords: ['berry', 'protein', 'post-workout', 'muscle', 'recovery', 'breakfast'],
    mainIngredients: ['berries', 'banana', 'protein powder'],
    source: 'curated' as const
  },
  {
    title: 'Tropical Mango Sunrise Juice',
    description: 'A vibrant immune-boosting juice with tropical flavors.',
    imageUrl: PlaceHolderImages.find(img => img.id === 'recipe-smoothie')?.imageUrl,
    imageHint: PlaceHolderImages.find(img => img.id === 'recipe-smoothie')?.imageHint,
    category: 'Juice',
    dietaryTags: ['vegan', 'gluten-free', 'paleo', 'raw'],
    prepTime: 10,
    cookTime: 0,
    totalTime: 10,
    servings: 2,
    difficulty: 'easy' as const,
    calories: 180,
    protein: 2,
    carbs: 44,
    fat: 0.5,
    fiber: 4,
    ingredients: [
      { item: 'Ripe mango', quantity: '2', unit: 'medium' },
      { item: 'Fresh orange', quantity: '3', unit: 'medium' },
      { item: 'Carrot', quantity: '2', unit: 'large' },
      { item: 'Fresh ginger', quantity: '1', unit: 'inch' },
      { item: 'Turmeric powder', quantity: '0.5', unit: 'tsp' }
    ],
    instructions: [
      'Peel and chop mangoes into chunks.',
      'Juice oranges using a citrus juicer or blender.',
      'Peel and chop carrots.',
      'Peel fresh ginger.',
      'Add all ingredients to a high-speed blender.',
      'Blend until completely smooth.',
      'Strain through fine mesh sieve for juice consistency (optional).',
      'Serve over ice and garnish with mint if desired.'
    ],
    healthBenefits: [
      'Mango provides vitamin A for eye health',
      'Oranges boost immune system with vitamin C',
      'Carrots support skin health and vision',
      'Ginger aids digestion and reduces inflammation',
      'Turmeric has powerful anti-inflammatory properties'
    ],
    tips: [
      'Use frozen mango for a chilled juice without dilution',
      'Juice is best consumed within 24 hours for maximum nutrients',
      'Save the pulp for baking muffins or adding to oatmeal'
    ],
    substitutions: [
      { original: 'Mango', replacement: 'Papaya or peach', reason: 'Similar tropical sweetness' },
      { original: 'Orange', replacement: 'Pineapple juice', reason: 'Different tropical profile' },
      { original: 'Fresh turmeric', replacement: 'Turmeric powder', reason: 'More convenient, same benefits' }
    ],
    searchKeywords: ['tropical', 'mango', 'orange', 'immune', 'vitamin c', 'bright', 'energizing'],
    mainIngredients: ['mango', 'orange', 'carrot'],
    source: 'curated' as const
  },
  {
    title: 'Mediterranean Salmon Salad',
    description: 'Heart-healthy salmon with fresh Mediterranean vegetables.',
    imageUrl: PlaceHolderImages.find(img => img.id === 'recipe-salmon')?.imageUrl,
    imageHint: PlaceHolderImages.find(img => img.id === 'recipe-salmon')?.imageHint,
    category: 'Keto',
    dietaryTags: ['keto', 'low-carb', 'gluten-free', 'high-protein', 'pescatarian'],
    prepTime: 10,
    cookTime: 10,
    totalTime: 20,
    servings: 2,
    difficulty: 'easy' as const,
    calories: 450,
    protein: 34,
    carbs: 12,
    fat: 28,
    fiber: 4,
    ingredients: [
      { item: 'Salmon fillets', quantity: '2', unit: '6oz each' },
      { item: 'Mixed baby greens', quantity: '4', unit: 'cups' },
      { item: 'Cherry tomatoes', quantity: '1', unit: 'cup' },
      { item: 'Cucumber', quantity: '1', unit: 'medium' },
      { item: 'Kalamata olives', quantity: '0.25', unit: 'cup' },
      { item: 'Feta cheese', quantity: '0.5', unit: 'cup' },
      { item: 'Extra virgin olive oil', quantity: '3', unit: 'tbsp' },
      { item: 'Fresh lemon juice', quantity: '2', unit: 'tbsp' },
      { item: 'Dried oregano', quantity: '1', unit: 'tsp' },
      { item: 'Salt and pepper', quantity: 'to taste', unit: '' }
    ],
    instructions: [
      'Pat salmon fillets dry and season both sides with salt, pepper, and half the oregano.',
      'Heat 1 tablespoon olive oil in a skillet over medium-high heat.',
      'Place salmon skin-side down and cook for 4-5 minutes without moving.',
      'Flip salmon and cook another 3-4 minutes until cooked through (145°F internal temp).',
      'Remove salmon and let rest for 2 minutes.',
      'While salmon cooks, halve cherry tomatoes and dice cucumber.',
      'In a large bowl, combine greens, tomatoes, cucumber, and olives.',
      'Whisk remaining olive oil, lemon juice, and oregano for dressing.',
      'Toss salad with dressing.',
      'Divide salad between plates, top with flaked salmon and crumbled feta.',
      'Serve immediately.'
    ],
    healthBenefits: [
      'Salmon provides omega-3 fatty acids for heart and brain health',
      'High protein content supports muscle maintenance',
      'Low in carbs, perfect for keto diet',
      'Olive oil offers healthy monounsaturated fats',
      'Vegetables provide antioxidants and vitamins'
    ],
    tips: [
      'Let salmon come to room temperature before cooking for even cooking',
      'Don\'t move salmon while cooking skin-side down for crispy skin',
      'Check doneness with a fork - salmon should flake easily',
      'Make extra salmon for meal prep throughout the week'
    ],
    substitutions: [
      { original: 'Salmon', replacement: 'Tuna or mackerel', reason: 'Other omega-3 rich fish' },
      { original: 'Feta cheese', replacement: 'Goat cheese or parmesan', reason: 'Different tangy profile' },
      { original: 'Kalamata olives', replacement: 'Green olives or capers', reason: 'Similar briny flavor' }
    ],
    searchKeywords: ['salmon', 'keto', 'low-carb', 'mediterranean', 'healthy', 'protein', 'omega-3'],
    mainIngredients: ['salmon', 'greens', 'feta'],
    source: 'curated' as const
  },
  {
    title: 'Zesty Avocado Pasta',
    description: 'Creamy vegan pasta with avocado sauce ready in 15 minutes.',
    imageUrl: PlaceHolderImages.find(img => img.id === 'recipe-pasta')?.imageUrl,
    imageHint: PlaceHolderImages.find(img => img.id === 'recipe-pasta')?.imageHint,
    category: 'Vegan',
    dietaryTags: ['vegan', 'dairy-free', 'quick-meal'],
    prepTime: 5,
    cookTime: 10,
    totalTime: 15,
    servings: 4,
    difficulty: 'easy' as const,
    calories: 380,
    protein: 14,
    carbs: 55,
    fat: 18,
    fiber: 12,
    ingredients: [
      { item: 'Whole wheat pasta', quantity: '12', unit: 'oz' },
      { item: 'Ripe avocado', quantity: '2', unit: 'large' },
      { item: 'Fresh basil leaves', quantity: '1', unit: 'cup' },
      { item: 'Garlic cloves', quantity: '3', unit: 'cloves' },
      { item: 'Fresh lemon juice', quantity: '3', unit: 'tbsp' },
      { item: 'Nutritional yeast', quantity: '0.25', unit: 'cup' },
      { item: 'Cherry tomatoes', quantity: '2', unit: 'cups' },
      { item: 'Pine nuts (optional)', quantity: '0.25', unit: 'cup' },
      { item: 'Salt and black pepper', quantity: 'to taste', unit: '' }
    ],
    instructions: [
      'Bring a large pot of salted water to boil.',
      'Cook pasta according to package directions until al dente.',
      'Reserve 1 cup pasta water before draining.',
      'While pasta cooks, scoop avocado flesh into a food processor.',
      'Add basil, garlic, lemon juice, nutritional yeast, and a splash of pasta water.',
      'Blend until smooth and creamy. Season with salt and pepper.',
      'Halve cherry tomatoes.',
      'Toss hot drained pasta with avocado sauce, adding reserved pasta water to reach desired consistency.',
      'Fold in cherry tomatoes.',
      'Serve immediately topped with pine nuts and extra basil if desired.'
    ],
    healthBenefits: [
      'Avocados provide heart-healthy monounsaturated fats',
      'Whole wheat pasta offers complex carbohydrates and fiber',
      'Nutritional yeast adds B vitamins and cheesy flavor',
      'Garlic supports immune system',
      'Lemon provides vitamin C and brightens flavors'
    ],
    tips: [
      'Sauce is best served immediately as avocado can brown',
      'For a warmer dish, toss pasta while still hot',
      'Add red pepper flakes for a spicy kick',
      'This sauce also works great on zucchini noodles'
    ],
    substitutions: [
      { original: 'Whole wheat pasta', replacement: 'Chickpea pasta or gluten-free pasta', reason: 'For gluten-free option' },
      { original: 'Pine nuts', replacement: 'Walnuts or sunflower seeds', reason: 'More affordable alternatives' },
      { original: 'Nutritional yeast', replacement: 'Miso paste', reason: 'Different umami flavor' }
    ],
    searchKeywords: ['avocado', 'pasta', 'vegan', 'quick', 'easy', 'creamy', 'dairy-free', '15 minute'],
    mainIngredients: ['avocado', 'pasta', 'basil'],
    source: 'curated' as const
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await connectDB();
    
    console.log('🗑️  Clearing existing recipes...');
    await Recipe.deleteMany({});
    
    console.log('📝 Inserting sample recipes...');
    const inserted = await Recipe.insertMany(sampleRecipes);
    
    console.log(`✅ Successfully seeded ${inserted.length} recipes!`);
    console.log('\nSample recipes:');
    inserted.forEach(recipe => {
      console.log(`  - ${recipe.title} (${recipe.category})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase, sampleRecipes };
