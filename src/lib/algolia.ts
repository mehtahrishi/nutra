import { algoliasearch } from 'algoliasearch';

// Client-side search client (uses public search key) - lazy initialization
let _searchClient: ReturnType<typeof algoliasearch> | null = null;
export const searchClient = new Proxy({} as ReturnType<typeof algoliasearch>, {
  get(target, prop) {
    if (!_searchClient) {
      const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
      const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || '';
      if (!appId || !searchKey) {
        throw new Error('Algolia credentials missing. Check NEXT_PUBLIC_ALGOLIA_APP_ID and NEXT_PUBLIC_ALGOLIA_SEARCH_KEY');
      }
      _searchClient = algoliasearch(appId, searchKey);
    }
    return Reflect.get(_searchClient, prop);
  }
});

// Server-side admin client (uses admin key) - lazy initialization
let _adminClient: ReturnType<typeof algoliasearch> | null = null;
export function getAdminClient() {
  if (!_adminClient) {
    const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
    const adminKey = process.env.ALGOLIA_ADMIN_KEY || '';
    if (!appId || !adminKey) {
      throw new Error('Algolia admin credentials missing. Check NEXT_PUBLIC_ALGOLIA_APP_ID and ALGOLIA_ADMIN_KEY');
    }
    _adminClient = algoliasearch(appId, adminKey);
  }
  return _adminClient;
}

export const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME || 'recipes';

// Configure index settings
export async function configureAlgoliaIndex() {
  try {
    const adminClient = getAdminClient();
    await adminClient.setSettings({
      indexName: ALGOLIA_INDEX_NAME,
      indexSettings: {
        // Searchable attributes (in order of importance)
        searchableAttributes: [
          'title',
          'description',
          'mainIngredients',
          'unordered(ingredients.item)',
          'unordered(searchKeywords)',
          'category'
        ],
        
        // Attributes for filtering
        attributesForFaceting: [
          'searchable(category)',
          'afterDistinct(searchable(dietaryTags))',
          'afterDistinct(searchable(difficulty))',
          'searchable(mainIngredients)',
          'totalTime',
          'calories'
        ],
        
        // Custom ranking (secondary sort)
        customRanking: [
          'desc(views)'
        ],
        
        // Attributes to retrieve
        attributesToRetrieve: [
          'objectID',
          'title',
          'description',
          'imageUrl',
          'imageHint',
          'category',
          'dietaryTags',
          'totalTime',
          'calories',
          'mainIngredients',
          'difficulty',
          'views'
        ],
        
        // Highlighting
        attributesToHighlight: ['title', 'description', 'mainIngredients'],
        
        // Pagination
        hitsPerPage: 20,
        
        // Ranking
        ranking: [
          'typo',
          'geo',
          'words',
          'filters',
          'proximity',
          'attribute',
          'exact',
          'custom'
        ]
      }
    });
    
    console.log('✅ Algolia index configured successfully');
  } catch (error) {
    console.error('❌ Algolia configuration error:', error);
    throw error;
  }
}
