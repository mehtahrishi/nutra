/**
 * Pexels API integration for fetching high-quality food images
 */

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
}

export class PexelsService {
  private apiKey: string;
  private baseUrl = 'https://api.pexels.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Search for food images on Pexels
   * @param query - Search query (e.g., "pizza", "pasta", "salad")
   * @param perPage - Number of results to return (default: 5)
   * @returns Promise with array of image URLs
   */
  async searchFoodImages(query: string, perPage: number = 5): Promise<string[]> {
    try {
      const searchQuery = `food ${query}`.trim();
      const response = await fetch(
        `${this.baseUrl}/search?query=${encodeURIComponent(searchQuery)}&per_page=${perPage}&orientation=landscape`,
        {
          headers: {
            'Authorization': this.apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`);
      }

      const data: PexelsResponse = await response.json();
      
      // Return medium-sized images (good balance of quality and loading speed)
      return data.photos.map(photo => photo.src.medium);
    } catch (error) {
      console.error('Error fetching images from Pexels:', error);
      // Return fallback image URLs if Pexels fails
      return [
        `https://source.unsplash.com/800x600/?food,${encodeURIComponent(query)}`,
        `https://picsum.photos/seed/${encodeURIComponent(query)}/800/600`
      ];
    }
  }

  /**
   * Get a single random food image for a recipe
   * @param recipeKeywords - Keywords related to the recipe (e.g., "chicken curry", "chocolate cake")
   * @returns Promise with a single image URL
   */
  async getRecipeImage(recipeKeywords: string): Promise<string> {
    const images = await this.searchFoodImages(recipeKeywords, 1);
    return images[0] || `https://source.unsplash.com/800x600/?food,${encodeURIComponent(recipeKeywords)}`;
  }
}

/**
 * Get Pexels service instance
 * Requires PEXELS_API_KEY environment variable
 */
export function getPexelsService(): PexelsService | null {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.warn('PEXELS_API_KEY not found in environment variables');
    return null;
  }
  return new PexelsService(apiKey);
}