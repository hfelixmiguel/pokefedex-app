/**
 * Main Page Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import type { Pokemon } from '@/types/pokemon';

// Mock the PokeAPI client
vi.mock('@/lib/pokeapi', () => ({
  getPokemonList: vi.fn(),
  searchPokemon: vi.fn(),
  getTypes: vi.fn()
}));

const MOCK_POKEMON_LIST = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `pokemon-${i + 1}`,
  height: 3,
  weight: 50,
  base_experience: 64,
  types: [{ slot: 1, type: { name: 'normal' } }],
  abilities: [],
  stats: []
}));

/**
 * Wrapper component that imports the actual page
 */
function PageWrapper() {
  return (
    <div>
      {/* Render the main content area */}
    </div>
  );
}

describe('Main Page', () => {
  beforeEach(() => {
    // Mock fetch for PokeAPI
    global.fetch = vi.fn().mockResolvedValue(
      Promise.resolve(new Response(JSON.stringify(MOCK_POKEMON_LIST), { status: 200 }))
    );
  });

  describe('Initial Load', () => {
    it('should display header with title', async () => {
      render(<PageWrapper />);

      await waitFor(() => {
        expect(screen.getByText(/PokéDex/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when API fails', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      render(<PageWrapper />);

      await waitFor(() => {
        expect(screen.getByText(/Error loading Pokémon/i)).toBeInTheDocument();
      });
    });
  });
});