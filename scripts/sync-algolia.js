#!/usr/bin/env node

/**
 * Script to sync all recipes from MongoDB to Algolia
 * Run with: node scripts/sync-algolia.js
 */

const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function main() {
  console.log('🚀 Starting Algolia sync script...\n');
  
  // Dynamic import of the sync function (ESM)
  const { syncRecipesToAlgolia } = await import('../src/lib/sync-algolia.ts');
  
  try {
    const result = await syncRecipesToAlgolia();
    
    console.log('\n✅ Sync completed successfully!');
    console.log(`📊 Total recipes synced: ${result.count}`);
    console.log('\n💡 Your search page should now show recipe counts in filters.');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

main();
