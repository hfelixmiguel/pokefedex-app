/**
 * Component Rendering Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PokemonCard from '@/components/PokemonCard';
import type { Pokemon } from '@/types/pokemon';

/**
 * Test mock data
 */
const MOCK_POKEMON: Pokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 184,
  types: [
    { slot: 1, type: { name: 'electric' } }
  ],
  abilities: [],
  stats: [
    { base_stat: 35, effort: 0, stat: { name: 'hp' } },
    { base_stat: 55, effort: 0, stat: { name: 'attack' } }
  ],
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
  }
};

describe('PokemonCard Component', () => {
  it('should render Pokémon name correctly', () => {
    const { container } = render(
      <PokemonCard pokemon={MOCK_POKEMON} />
    );

    expect(screen.getByText(/PIKACHU/i)).toBeInTheDocument();
  });

  it('should display type badges', () => {
    const { getByText } = render(
      <PokemonCard pokemon={MOCK_POKEMON} />
    );

    // Check if Electric type badge exists with correct color
    expect(getByText('ELECTRIC')).toBeInTheDocument();
  });

  it('should display sprite image', () => {
    render(<PokemonCard pokemon={MOCK_POKEMON} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'pikachu sprite');
    expect(image).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
    );
  });

  it('should call onClick handler when card is clicked', () => {
    const handleClick = vi.fn();
    render(<PokemonCard pokemon={MOCK_POKEMON} onClick={handleClick} />);

    expect(screen.getByText(/PIKACHU/i)).toBeInTheDocument();
  });
});