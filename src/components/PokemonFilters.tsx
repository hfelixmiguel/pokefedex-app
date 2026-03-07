'use client';

import { useState } from 'react';
import type { PokemonTypeName } from '@/types/pokemon';

const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-400',
  fighting: 'bg-red-600',
  poison: 'bg-purple-500',
  ground: 'bg-amber-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-orange-700',
  ghost: 'bg-violet-600',
  dragon: 'bg-indigo-600',
  steel: 'bg-gray-500',
  dark: 'bg-gray-700',
  fairy: 'bg-pink-400',
};

const TYPE_NAMES: PokemonTypeName[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy'
];

interface PokemonFiltersProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export default function PokemonFilters({ selectedType, onTypeChange }: PokemonFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-3">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <label htmlFor="type-filter" className="text-sm font-semibold text-gray-700">
          Filter by Type
        </label>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-expanded={isExpanded}
          aria-controls="type-filter-options"
        >
          {isExpanded ? (
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Type Filter Chips */}
      <div
        id="type-filter-options"
        className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 transition-all duration-300 ${
          isExpanded ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
        }`}
      >
        <button
          type="button"
          onClick={() => onTypeChange('')}
          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            selectedType === ''
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
              : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          All Types
        </button>

        {TYPE_NAMES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onTypeChange(type)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedType === type
                ? `${TYPE_COLORS[type]} text-white shadow-lg scale-105`
                : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Active Filter Indicator */}
      {selectedType && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100 animate-fade-in">
          <span className="text-sm font-medium text-blue-800">
            Showing: <span className="font-bold">{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</span> type
          </span>
          <button
            type="button"
            onClick={() => onTypeChange('')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
