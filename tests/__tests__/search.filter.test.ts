/**
 * Search and Filter Integration Tests
 */

import { describe, it, expect } from 'vitest';
import PokemonCard from '@/components/PokemonCard';
import type { Pokemon } from '@/types/pokemon';

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
  abilities: [],
  stats: []
};

describe('Search and Filter Tests', () => {
  it('should render PokemonCard without crashing', () => {
    expect(() => {
      render(<PokemonCard pokemon={MOCK_POKEMON} />);
    }).not.toThrow();
  });

  it('should handle multiple Pokemon cards in grid', () => {
    const { container } = render(
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <PokemonCard key={i} pokemon={{ ...MOCK_POKEMON, id: i + 1 }} />
        ))}
      </div>
    );

    expect(container.querySelectorAll('.rounded-2xl')).toHaveLength(6);
  });
});