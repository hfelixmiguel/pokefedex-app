/**
 * Pokemon Grid Component
 * 
 * Responsive grid layout for displaying Pokémon cards with loading states.
 */

'use client';

import { useState } from 'react';
import PokemonCard from './PokemonCard';
import SkeletonCard from './SkeletonCard';
import type { Pokemon } from '@/types/pokemon';

interface PokemonGridProps {
  pokemon: Pokemon[];
  isLoading: boolean;
  hasError?: boolean;
  errorDetails?: string;
  onPokemonClick?: (pokemon: Pokemon) => void;
}

export function PokemonGrid({
  pokemon,
  isLoading,
  hasError = false,
  errorDetails = '',
  onPokemonClick,
}: PokemonGridProps) {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (hasError && errorDetails) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 text-lg font-medium mb-2">⚠️ Error loading Pokémon</p>
        <p className="text-gray-600 mb-4">{errorDetails}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (pokemon.length === 0 && !isLoading) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No Pokémon found matching your criteria.</p>
      </div>
    );
  }

  // Render Pokemon cards with pagination
  const totalPages = Math.ceil(pokemon.length / ITEMS_PER_PAGE);
  const currentPagePokemon = pokemon.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentPagePokemon.map(pokemon => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={onPokemonClick}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg transition-colors ${
              page === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            ← Previous
          </button>

          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg transition-colors ${
              page === totalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default PokemonGrid;