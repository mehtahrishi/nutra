# Auto-Yum - Setup & Development Guide

## 🚀 What's Been Built

### ✅ Phase 1: Foundation & Core (COMPLETED)
- **MongoDB Integration**: Full database setup with Mongoose models
- **Recipe Schema**: Comprehensive recipe data structure with nutritional info
- **API Routes**: Complete CRUD operations for recipes
- **Search API**: Ingredient-based search with dietary filters
- **AI Integration**: Gemini-powered recipe generation
- **Database Persistence**: AI-generated recipes automatically saved

## 📦 Tech Stack
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS + Radix UI Components
- **Database**: MongoDB (with Mongoose)
- **AI**: Google Gemini (via Genkit)
- **Deployment Ready**: Next.js optimized build

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup MongoDB
Choose one option:

**Option A: Local MongoDB**
```bash
# Install MongoDB locally (Windows)
winget install MongoDB.Server

# MongoDB will run on: mongodb://localhost:27017
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace in `.env.local`

### 3. Configure Environment Variables
Edit `.env.local`:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/auto-yum
# Or for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auto-yum

# Google Gemini API Key
GOOGLE_GENAI_API_KEY=your_actual_gemini_api_key_here
```

**Get your Gemini API Key:**
1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy and paste into `.env.local`

### 4. Seed the Database
```bash
npm run seed
```
This adds 5 sample recipes (smoothies, juices, salads, pasta).

### 5. Start Development Server
```bash
npm run dev
```
Visit: [http://localhost:9002](http://localhost:9002)

## 🎯 Features Implemented

### Database & API
- ✅ MongoDB connection with connection pooling
- ✅ Recipe model with nutritional data
- ✅ CRUD API endpoints (`/api/recipes`)
- ✅ Featured recipes endpoint (`/api/recipes/featured`)
- ✅ Ingredient search API (`/api/search/ingredients`)
- ✅ Text search with MongoDB indexes

### AI Features
- ✅ AI recipe discovery (Gemini)
- ✅ AI cooking assistant with substitutions & tips
- ✅ Auto-save AI-generated recipes to database
- ✅ Health benefits & reasoning display

### UI Pages
- ✅ Homepage with dynamic featured recipes
- ✅ AI Discovery page (generate recipes from ingredients)
- ✅ Recipe detail page (from database)
- ✅ Interactive AI assistant modal
- ✅ Beautiful animations & gradients

## 📁 Project Structure

```
src/
├── ai/                      # AI flows (Gemini integration)
│   ├── genkit.ts           # AI configuration
│   └── flows/
│       ├── ai-recipe-discovery.ts
│       └── ai-cooking-assistant.ts
├── app/                     # Next.js pages
│   ├── page.tsx            # Homepage (now uses DB)
│   ├── discover/page.tsx   # AI recipe generator
│   ├── recipes/[id]/page.tsx
│   └── api/                # API routes
│       ├── recipes/
│       │   ├── route.ts    # GET all, POST new
│       │   ├── [id]/route.ts  # GET, PUT, DELETE by ID
│       │   └── featured/route.ts
│       └── search/
│           └── ingredients/route.ts
├── models/                  # Database models
│   └── Recipe.ts
├── lib/
│   ├── mongodb.ts          # DB connection
│   └── seed.ts             # Sample data
└── components/             # UI components (Radix UI)
```

## 🔥 Usage Examples

### 1. Homepage
- Displays featured recipes from MongoDB
- Click any recipe to view details
- Click "Start AI Discovery" to generate recipes

### 2. AI Discovery
1. Enter ingredients: "chicken, spinach, garlic"
2. Add dietary restrictions: "keto, low-carb"
3. Set time limit: "30 minutes"
4. Click "Generate My Perfect Recipe"
5. Recipe is generated AND saved to database

### 3. Recipe Detail Page
- Click "Open AI Kitchen Assistant" for:
  - Ingredient substitutions
  - Cooking tips
  - Health insights
- All powered by Gemini AI

### 4. Search by Ingredients (API)
```bash
curl -X POST http://localhost:9002/api/search/ingredients \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["chicken", "spinach"], "maxTime": 30}'
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | Get all recipes (with filters) |
| POST | `/api/recipes` | Create new recipe |
| GET | `/api/recipes/[id]` | Get recipe by ID |
| PUT | `/api/recipes/[id]` | Update recipe |
| DELETE | `/api/recipes/[id]` | Delete recipe |
| GET | `/api/recipes/featured` | Get featured recipes |
| POST | `/api/search/ingredients` | Search by ingredients |

## Query Parameters for `/api/recipes`:
- `q` - Text search
- `category` - Filter by category
- `diet` - Dietary tag (vegan, keto, etc.)
- `maxTime` - Max cooking time in minutes
- `maxCalories` - Max calories
- `page` - Page number
- `limit` - Results per page

## 🎨 Customization

### Add More Recipes
Edit `src/lib/seed.ts` and add objects to the `sampleRecipes` array, then run `npm run seed`.

### Change AI Model
Edit `src/ai/genkit.ts`:
```typescript
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash', // Change model here
});
```

### Modify Recipe Schema
Edit `src/models/Recipe.ts` to add/remove fields.

## 🚧 What's Next (Future Phases)

### Phase 2: Smart Search (Algolia) - ✅ COMPLETED
- ✅ Lightning-fast search with Algolia
- ✅ Advanced filtering UI (diet, time, calories)
- ✅ Real-time search suggestions
- ✅ Auto-sync MongoDB → Algolia
- ✅ Typo tolerance and highlighting
- ✅ Mobile-responsive filters

### Phase 3: Enhanced AI
- Voice input integration
- Image recognition for ingredients
- Meal planning suggestions

### Phase 4: User Accounts
- Firebase Authentication
- Save favorite recipes
- Personal dietary profiles
- Recipe collections

### Phase 5: Mobile & PWA
- Progressive Web App
- Offline recipe access
- Push notifications for meal reminders

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env.local`
- For Atlas, whitelist your IP address

**Gemini API Error:**
- Verify `GOOGLE_GENAI_API_KEY` is set correctly
- Check API quota at Google AI Studio
- Make sure you have an active API key

**No Recipes Showing:**
- Run `npm run seed` to add sample data
- Check browser console for API errors
- Ensure MongoDB connection is successful

## 📝 Scripts

```bash
npm run dev          # Start development server (port 9002)
npm run build        # Production build
npm run start        # Start production server
npm run seed         # Populate database with sample recipes
npm run sync-algolia # Sync MongoDB recipes to Algolia
npm run genkit:dev   # Start Genkit AI development server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

## 🌟 Key Features Highlights

1. **AI Recipe Generation**: Uses Gemini to create custom recipes
2. **Smart Ingredient Search**: Find recipes by what you have
3. **Nutritional Tracking**: Calories, macros, and health benefits
4. **Dietary Filters**: Vegan, keto, gluten-free, etc.
5. **Interactive AI Assistant**: Real-time cooking help
6. **Auto-Save**: AI recipes persist to database
7. **Beautiful UI**: Modern design with animations

## 💡 Tips

- Use the AI discovery page to experiment with different ingredients
- All AI-generated recipes are automatically saved
- Click the AI assistant button on recipe pages for personalized tips
- The seed script can be run multiple times (clears old data first)

---

**Built with ❤️ using Next.js, MongoDB, and Google Gemini AI**
