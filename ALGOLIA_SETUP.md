# Algolia Setup Guide

## Step 1: Create Free Algolia Account

1. Go to [https://www.algolia.com/users/sign_up](https://www.algolia.com/users/sign_up)
2. Sign up for a **FREE account** (14-day trial, then free tier with 10K records)
3. Create a new application

## Step 2: Get Your API Keys

1. After creating your app, go to **Settings** → **API Keys**
2. You'll need THREE keys:

   - **Application ID** (e.g., `ABC123XYZ`)
   - **Search-Only API Key** (public, safe for frontend)
   - **Admin API Key** (private, for backend only)

## Step 3: Update `.env.local`

Replace the placeholder values in your `.env.local` file:

```env
# Algolia Search
NEXT_PUBLIC_ALGOLIA_APP_ID=YOUR_APP_ID_HERE
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=YOUR_SEARCH_ONLY_KEY_HERE
ALGOLIA_ADMIN_KEY=YOUR_ADMIN_KEY_HERE
ALGOLIA_INDEX_NAME=recipes
```

**⚠️ Important:**
- Never commit `ALGOLIA_ADMIN_KEY` to git
- Only `NEXT_PUBLIC_*` variables are exposed to the browser

## Step 4: Seed Your Database

If you haven't already, add sample recipes:

```bash
npm run seed
```

This adds 5 sample recipes to MongoDB.

## Step 5: Sync MongoDB to Algolia

Run the sync script to push all recipes from MongoDB to Algolia:

```bash
npm run sync-algolia
```

You should see output like:
```
🔄 Starting Algolia sync...
📊 Found 5 recipes to sync
✅ Successfully synced 5 recipes to Algolia
```

## Step 6: Test Search

1. Start your dev server: `npm run dev`
2. Go to: http://localhost:9002/search
3. Try searching for ingredients or recipe names
4. Use filters to refine results

## Features Enabled

✅ **Instant Search**: Sub-millisecond response times  
✅ **Typo Tolerance**: "spinnach" → "spinach"  
✅ **Faceted Filters**: Category, diet, difficulty  
✅ **Range Filters**: Time and calorie sliders  
✅ **Auto-complete**: Search as you type  
✅ **Highlighting**: Matched terms in results  
✅ **Auto-Sync**: New recipes sync automatically  

## Algolia Dashboard

View your search analytics at: https://www.algolia.com/dashboard

You can see:
- Popular searches
- Search performance
- No-result queries
- Click-through rates

## Troubleshooting

**"Application ID is invalid"**
- Check that you copied the App ID correctly
- Make sure there are no extra spaces

**"No results found"**
- Run `npm run sync-algolia` to sync recipes
- Check Algolia dashboard to verify records exist

**"Search client is not configured"**
- Verify all three env variables are set
- Restart dev server after updating .env.local

## Need More Help?

- Algolia Docs: https://www.algolia.com/doc/
- Community Forum: https://discourse.algolia.com/
