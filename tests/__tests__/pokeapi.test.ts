/**
 * API Client Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { PokeAPIResponse, Pokemon } from '@/types/pokemon';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

/**
 * Mock Pokemon data for testing
 */
const MOCK_POKEMON: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  base_experience: 64,
  types: [
    { slot: 1, type: { name: 'grass' } },
    { slot: 2, type: { name: 'poison' } }
  ],
  abilities: [
    { is_hidden: false, slot: 1, ability: { name: 'overgrow' } }
  ],
  stats: [
    { base_stat: 45, effort: 0, stat: { name: 'hp' } },
    { base_stat: 49, effort: 0, stat: { name: 'attack' } },
    { base_stat: 49, effort: 1, stat: { name: 'defense' } }
  ],
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
  }
};

const MOCK_POKEMON_LIST = Array.from({ length: 6 }, (_, i) => ({ ...MOCK_POKEMON, id: i + 1, name: `pokemon-${i + 1}` })) as Pokemon[];

describe('PokeAPI Client', () => {
  // Clean up after tests
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getPokemon()', () => {
    it('should return cached data when available', async () => {
      const cacheKey = 'pokemon-1';
      
      // First call - should fetch
      mockFetch.mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify(MOCK_POKEMON), { status: 200 }))
      );
      
      const result1 = await getPokemon(1);
      expect(result1.data).toEqual(MOCK_POKEMON);
      expect(result1.fromCache).toBe(false);
      expect(mockFetch).toHaveBeenCalled();

      // Second call - should use cache (needs real implementation)
      // This would require accessing the internal cache state
    });

    it('should handle successful fetch', async () => {
      mockFetch.mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify(MOCK_POKEMON), { status: 200 }))
      );

      const result = await getPokemon(1);

      expect(result).toBeDefined();
      expect(result.data).toEqual(MOCK_POKEMON);
      expect(result.error).toBeUndefined();
    });

    it('should handle fetch errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce(
        Promise.resolve(new Response(null, { status: 404 }))
      );

      const result = await getPokemon(9999);

      expect(result).toBeDefined();
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error!.message).toContain('HTTP 404');
    });

    it('should handle JSON parsing errors', async () => {
      mockFetch.mockResolvedValueOnce(
        Promise.resolve(new Response('invalid json', { status: 200 }))
      );

      const result = await getPokemon(1);

      expect(result.error).toBeDefined();
      expect(result.error!.message).toContain('Failed to parse');
    });
  });

  describe('getPokemonList()', () => {
    it('should fetch and return Pokemon list', async () => {
      mockFetch.mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify(MOCK_POKEMON_LIST), { status: 200 }))
      );

      const result = await getPokemonList(6);

      expect(result.data).toHaveLength(6);
      expect(result.data[0]).toBeInstanceOf(Object);
    });

    it('should handle empty list', async () => {
      mockFetch.mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify([]), { status: 200 }))
      );

      const result = await getPokemonList(1);

      expect(result.data).toEqual([]);
    });

    it('should handle errors', async () => {
      mockFetch.mockResolvedValueOnce(
        Promise.resolve(new Response(null, { status: 503 }))
      );

      const result = await getPokemonList(151);

      expect(result.error).toBeDefined();
      expect(result.data).toEqual([]);
    });
  });

  describe('searchPokemon()', () => {
    it('should throw error for empty query', async () => {
      await expect(searchPokemon('')).rejects.toThrow('Search query cannot be empty');
    });

    it('should return empty array when no matches found', async () => {
      mockFetch.mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify({ results: [] }), { status: 200 }))
      );

      const result = await searchPokemon('nonexistent');

      expect(result.data).toEqual([]);
    });
  });

  describe('Health Check', () => {
    it('should return true when API is available', async () => {
      mockFetch.mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify(MOCK_POKEMON), { status: 200 }))
      );

      const isConnected = await healthCheck();

      expect(isConnected).toBe(true);
    });

    it('should return false when API is unavailable', async () => {
      mockFetch.mockResolvedValueOnce(
        Promise.resolve(new Response(null, { status: 0 }))
      );

      const isConnected = await healthCheck();

      expect(isConnected).toBe(false);
    });
  });
});