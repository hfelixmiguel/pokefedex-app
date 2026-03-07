/**
 * PokéAPI Client with Retry Logic, Caching, and Error Handling
 * 
 * Features:
 * - Exponential backoff retry mechanism
 * - Request caching layer
 * - Comprehensive error handling
 * - Type-safe API responses
 */

import type { Pokemon, PokemonStat, PokemonType, PokemonAbility } from '../types/pokemon';

// Cache configuration
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache
let cache: Map<string, { data: unknown; timestamp: number }> = new Map();

/**
 * Fetch with retry logic using exponential backoff
 */
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
  baseDelay = 1000
): Promise<Response> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      lastError = error as Error;

      // Last attempt - don't wait for backoff on final try
      if (attempt === maxRetries) break;

      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Request failed (${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Unknown fetch error');
}

/**
 * Get cached response if within TTL
 */
function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  
  if (!cached) return null;

  const age = Date.now() - cached.timestamp;
  if (age > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

/**
 * Set item in cache with timestamp
 */
function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Clear all cached entries
 */
function clearCache(): void {
  cache.clear();
}

export interface PokeAPIResponse<T> {
  data: T;
  error?: Error;
  fromCache?: boolean;
}

/**
 * Fetch Pokemon by ID with caching and retry
 */
export async function getPokemon(id: number): Promise<PokeAPIResponse<Pokemon>> {
  const cacheKey = `pokemon-${id}`;
  
  // Check cache first
  const cached = getCached<Pokemon>(cacheKey);
  if (cached) {
    console.log(`[CACHE HIT] Pokemon #${id}`);
    return { data: cached, fromCache: true };
  }

  try {
    const response = await fetchWithRetry(
      `https://pokeapi.co/api/v2/pokemon/${id}`, {}
    );
    
    // Parse JSON - handle potential parsing errors
    let data: Pokemon;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`Failed to parse Pokemon #${id} response: ${parseError}`);
    }

    setCache(cacheKey, data);
    console.log(`[FETCH] Pokemon #${id} - Response size: ${(JSON.stringify(data).length / 1024).toFixed(2)}KB`);
    
    return { data, fromCache: false };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[ERROR] Failed to fetch Pokemon #${id}:`, errorMessage);
    return { data: undefined as unknown as Pokemon, error: new Error(errorMessage) };
  }
}

/**
 * Fetch all Pokemon (1-151 for original Kanto generation)
 */
export async function getPokemonList(limit = 151): Promise<PokeAPIResponse<Pokemon[]>> {
  const cacheKey = `pokemon-list-${limit}`;
  
  // Check cache
  const cached = getCached<Pokemon[]>(cacheKey);
  if (cached) {
    console.log(`[CACHE HIT] Pokemon list (${limit})`);
    return { data: cached, fromCache: true };
  }

  try {
    const response = await fetchWithRetry(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
      {}
    );

    let data: Pokemon[];
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`Failed to parse Pokemon list response: ${parseError}`);
    }

    setCache(cacheKey, data);
    console.log(`[FETCH] Pokemon list (${limit}) - Count: ${data.length}`);
    
    return { data, fromCache: false };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[ERROR] Failed to fetch Pokemon list:`, errorMessage);
    return { data: [], error: new Error(errorMessage) };
  }
}

/**
 * Search Pokemon by name with partial matching
 */
export async function searchPokemon(query: string): Promise<PokeAPIResponse<Pokemon[]>> {
  if (!query.trim()) {
    throw new Error('Search query cannot be empty');
  }

  const cacheKey = `search-${encodeURIComponent(query)}`;
  const cached = getCached<Pokemon[]>(cacheKey);
  
  if (cached) {
    return { data: cached, fromCache: true };
  }

  try {
    // PokeAPI search endpoint - returns matching Pokemon names and IDs
    const response = await fetchWithRetry(
      `https://pokeapi.co/api/v2/pokemon?name=${encodeURIComponent(query)}&limit=50`,
      {}
    );

    let data: any;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`Failed to parse search results: ${parseError}`);
    }

    // Extract matching Pokemon names and fetch their full details
    const matches = data.results?.filter((result: any) => 
      result.name.toLowerCase().includes(query.toLowerCase())
    );

    if (!matches || matches.length === 0) {
      return { data: [], fromCache: false };
    }

    // Fetch full details for each match
    const pokemonList = await Promise.all(
      matches.map(async (match: any) => {
        try {
          const cachedDetail = getCached(match.url);
          if (cachedDetail) return cachedDetail;
          
          const detailResponse = await fetchWithRetry(match.url, {});
          let detail: Pokemon;
          try {
            detail = await detailResponse.json();
          } catch (e) {
            console.error(`Failed to parse details for ${match.name}:`, e);
            return null;
          }
          
          setCache(match.url, detail);
          return detail;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`Failed to fetch details for ${match.name}:`, errorMessage);
          return null;
        }
      })
    );

    // Filter out null results and sort by relevance
    const validPokemon = pokemonList.filter((p: Pokemon) => p !== null) as Pokemon[];
    
    setCache(cacheKey, validPokemon);
    console.log(`[SEARCH] Found ${validPokemon.length} matches for "${query}"`);
    
    return { data: validPokemon, fromCache: false };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[ERROR] Pokemon search failed:`, errorMessage);
    return { data: [], error: new Error(errorMessage) };
  }
}

/**
 * Fetch all Pokémon types with their relationships
 */
export async function getTypes(): Promise<PokeAPIResponse<PokemonType[]>> {
  const cacheKey = 'all-types';
  
  const cached = getCached<PokemonType[]>(cacheKey);
  if (cached) {
    return { data: cached, fromCache: true };
  }

  try {
    const response = await fetchWithRetry(
      `https://pokeapi.co/api/v2/type`,
      {}
    );

    let data: PokemonType[];
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`Failed to parse types list: ${parseError}`);
    }

    setCache(cacheKey, data);
    console.log(`[FETCH] Loaded ${data.length} Pokémon types`);
    
    return { data, fromCache: false };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[ERROR] Failed to fetch types:`, errorMessage);
    return { data: [], error: new Error(errorMessage) };
  }
}

/**
 * Fetch Pokémon species details (including evolution chain)
 */
export async function getPokemonSpecies(id: number): Promise<PokeAPIResponse<any>> {
  const cacheKey = `species-${id}`;
  
  const cached = getCached(cacheKey);
  if (cached) {
    return { data: cached, fromCache: true };
  }

  try {
    const response = await fetchWithRetry(
      `https://pokeapi.co/api/v2/pokemon-species/${id}`,
      {}
    );

    let data: any;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`Failed to parse species details for #${id}: ${parseError}`);
    }

    setCache(cacheKey, data);
    console.log(`[FETCH] Species details for Pokemon #${id}`);
    
    return { data, fromCache: false };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[ERROR] Failed to fetch species for #${id}:`, errorMessage);
    return { data: undefined as unknown as any, error: new Error(errorMessage) };
  }
}

/**
 * Get type effectiveness info (for battle features)
 */
export async function getTypeEffectiveness(): Promise<PokeAPIResponse<Record<string, Record<string, number>>>> {
  const cacheKey = 'type-effectiveness';
  
  // Use unknown type for cache to avoid type mismatch
  const cached = getCached<unknown>(cacheKey);
  if (cached) {
    return { data: cached as Record<string, Record<string, number>>, fromCache: true };
  }

  try {
    // Get type matchups data
    const response = await fetchWithRetry(
      'https://pokeapi.co/api/v2/type-effectiveness',
      {}
    );

    let data: Record<string, Record<string, number>>;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`Failed to parse type effectiveness data: ${parseError}`);
    }

    setCache(cacheKey, data);
    console.log('[FETCH] Type effectiveness matrix loaded');
    
    return { data, fromCache: false };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[ERROR] Failed to fetch type effectiveness:`, errorMessage);
    return { data: {}, error: new Error(errorMessage) };
  }
}

/**
 * Batch fetch multiple Pokemon (optimizes network requests)
 */
export async function batchGetPokemon(ids: number[]): Promise<PokeAPIResponse<Pokemon[]>> {
  if (ids.length === 0) {
    return { data: [] };
  }

  const cacheKeys = ids.map(id => `pokemon-${id}`);
  
  // Check individual caches first
  const partiallyCached = ids.map(id => {
    const cached = getCached<Pokemon>(`pokemon-${id}`);
    return cached ? { data: cached, fromCache: true } : null;
  });

  // Remove already cached Pokemon and fetch the rest
  const uncachedIds = ids.filter((_, index) => partiallyCached[index] === null);
  
  if (uncachedIds.length > 0) {
    try {
      const response = await fetchWithRetry(
        `https://pokeapi.co/api/v2/pokemon?limit=${uncachedIds.length}`,
        { params: { url: uncachedIds.join(',') } }
      );

      let data: any;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(`Failed to parse batch Pokemon data: ${parseError}`);
      }

      // Extract and cache results for uncached IDs
      const batchResults = data.results.filter((result: any) => 
        uncachedIds.includes(result.url.split('/').pop()!)
      );

      uncachedIds.forEach((id, index) => {
        if (batchResults[index]) {
          setCache(`pokemon-${id}`, batchResults[index]);
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[ERROR] Batch fetch failed:`, errorMessage);
      return { data: [], error: new Error(errorMessage) };
    }
  }

  // Combine cached and uncached results
  const allPokemon = ids.map(id => {
    const cached = getCached<Pokemon>(`pokemon-${id}`);
    if (cached) return cached;
    
    // Fetch individual if still missing
    return getPokemon(id).data;
  });

  return { data: allPokemon as Pokemon[] };
}

/**
 * Health check - verify API connectivity
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const cached = getCached<string>('health-check');
    if (cached) return true; // Use cache to reduce load

    const response = await fetchWithRetry('https://pokeapi.co/api/v2/pokemon/bulbasaur', {}, 1, 100);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    setCache('health-check', 'ok');
    return true;
  } catch (error) {
    console.error('[HEALTH] API connectivity issue:', error);
    return false;
  }
}

// Export cache utilities for testing and advanced use cases
export { getCached, setCache, clearCache };